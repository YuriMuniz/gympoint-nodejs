import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
    async index(req, res) {
        const plans = await Plan.findAll();
        return res.json(plans);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required(),
        });

        // Verificar resposta validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { title, duration, price } = req.body;
        const plan = await Plan.create({
            title,
            duration,
            price,
        });

        return res.json(plan);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            title: Yup.string(),
            duration: Yup.number().positive(),
            price: Yup.number().positive(),
        });

        // Verificar resposta validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.body;
        const plan = await Plan.findByPk(id);

        if (!plan) {
            return res.status(401).json({ error: 'Plan not found' });
        }

        const { title, duration, price } = await plan.update(req.body);

        return res.json({ id, title, duration, price });
    }

    async delete(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });
        // Verificar resposta validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        await Plan.destroy({
            where: { id: req.body.id },
        });

        return res.json({ message: 'The plan has been deleted' });
    }
}

export default new PlanController();
