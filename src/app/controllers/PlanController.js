import Plan from '../models/Plan';

class PlanController {
    async index(req, res) {
        const plans = await Plan.findAll();
        return res.json(plans);
    }

    async store(req, res) {
        const { title, duration, price } = req.body;
        const plan = await Plan.create({
            title,
            duration,
            price,
        });

        return res.json(plan);
    }

    async update(req, res) {
        const plan = await Plan.findByPk(req.params.id);

        const { title, duration, price } = await plan.update(req.body);

        return res.json({ title, duration, price });
    }

    async delete(req, res) {
        const plan = await Plan.findByPk(req.params.id);
        await plan.delete();
        return res.json({ message: 'The plan has been deleted' });
    }
}

export default new PlanController();
