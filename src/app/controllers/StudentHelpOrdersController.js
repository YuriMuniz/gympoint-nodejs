import HelpOrders from '../models/HelpOrders';

class StudentHelpOrdersController {
    async store(req, res) {
        const { id } = req.params;
        const { question } = req.body;

        const helpOrder = await HelpOrders.create({
            student_id: id,
            question,
        });

        return res.json(helpOrder);
    }

    async index(req, res) {
        const { id } = req.params;
        const helpOrders = await HelpOrders.findAll({
            where: {
                student_id: id,
            },
        });

        return res.json(helpOrders);
    }
}

export default new StudentHelpOrdersController();
