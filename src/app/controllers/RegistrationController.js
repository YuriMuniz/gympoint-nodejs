import { addMonths, parseISO } from 'date-fns';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

class RegistrationController {
    async index(req, res) {
        const registrations = await Registration.findAll();
        return res.json(registrations);
    }

    async store(req, res) {
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
        const { id } = req.body;
        let end_date = '';

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
            end_date = addMonths(registration.start_date, plan.duration);
        }
        if (req.body.plan_id && req.body.start_date) {
            const plan = await Plan.findByPk(req.body.plan_id);
            if (!plan) {
                return res.status(401).json({ error: 'Plan not found' });
            }
            end_date = addMonths(parseISO(req.body.start_date), plan.duration);
        }

        if (!req.body.plan_id && req.body.start_date) {
            const plan = await Plan.findByPk(registration.plan_id);
            end_date = addMonths(parseISO(req.body.start_date), plan.duration);
        }

        if (end_date === '') {
            end_date = registration.end_date;
        }

        const { start_date, student_id, plan_id } = await registration.update(
            req.body
        );
        await registration.update({ end_date });

        return res.json({
            id,
            start_date,
            end_date,
            student_id,
            plan_id,
        });
    }
}

export default new RegistrationController();
