import { addMonths, parseISO } from 'date-fns';
import * as Yup from 'yup';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

class RegistrationController {
    async index(req, res) {
        const { page = 1 } = req.query;
        const registrations = await Registration.findAll({
            order: ['created_at'],
            attributes: ['id', 'start_date', 'end_date', 'price'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: [
                        'id',
                        'name',
                        'email',
                        'age',
                        'height',
                        'weight',
                    ],
                },
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['id', 'title', 'duration', 'price'],
                },
            ],
        });
        return res.json(registrations);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            start_date: Yup.date().required(),
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
        });

        // Verificar resposta validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { student_id, plan_id, start_date } = req.body;
        const student = await Student.findByPk(student_id);
        const plan = await Plan.findByPk(plan_id);

        if (!student) {
            return res.status(401).json({ error: 'Student not found' });
        }
        if (!plan) {
            return res.status(401).json({ error: 'Plan not found' });
        }

        const price = plan.price * plan.duration;

        const end_date = addMonths(parseISO(start_date), plan.duration);

        const registration = await Registration.create({
            student_id,
            plan_id,
            price,
            start_date,
            end_date,
        });

        return res.json(registration);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            start_date: Yup.date(),
            student_id: Yup.number(),
            plan_id: Yup.number(),
        });

        // Verificar resposta validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }
        const { id } = req.body;
        let endDate = '';
        let totalPrice = '';

        const registration = await Registration.findByPk(id);

        if (!registration) {
            return res.status(401).json({ error: 'Registration not found' });
        }

        if (req.body.student_id) {
            const student = await Student.findByPk(req.body.student_id);
            if (!student) {
                return res.status(401).json({ error: 'Student not found' });
            }
        }

        if (req.body.plan_id && !req.body.start_date) {
            const plan = await Plan.findByPk(req.body.plan_id);
            if (!plan) {
                return res.status(401).json({ error: 'Plan not found' });
            }
            endDate = addMonths(registration.start_date, plan.duration);
            totalPrice = plan.price * plan.duration;
        }
        if (req.body.plan_id && req.body.start_date) {
            const plan = await Plan.findByPk(req.body.plan_id);
            if (!plan) {
                return res.status(401).json({ error: 'Plan not found' });
            }
            endDate = addMonths(parseISO(req.body.start_date), plan.duration);
            totalPrice = plan.price * plan.duration;
        }

        if (!req.body.plan_id && req.body.start_date) {
            const plan = await Plan.findByPk(registration.plan_id);
            endDate = addMonths(parseISO(req.body.start_date), plan.duration);
        }

        if (totalPrice !== '') {
            await registration.update({ price: totalPrice });
        }

        if (endDate !== '') {
            await registration.update({ end_date: endDate });
        }

        const {
            start_date,
            end_date,
            student_id,
            plan_id,
            price,
        } = await registration.update(req.body);

        return res.json({
            id,
            start_date,
            end_date,
            student_id,
            plan_id,
            price,
        });
    }

    async delete(req, res) {
        const registration = await Registration.findByPk(req.params.id);

        if (!registration) {
            return res.status(401).json({ error: 'Registration not found' });
        }

        await registration.destroy();

        return res.json({ message: 'The registration has been deleted' });
    }
}

export default new RegistrationController();
