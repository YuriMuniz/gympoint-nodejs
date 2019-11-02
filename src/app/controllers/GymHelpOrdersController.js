import HelpOrders from '../models/HelpOrders';
import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';
import Student from '../models/Student';

class GymHelpOrdersController {
    async store(req, res) {
        const { answer } = req.body;
        const answer_at = new Date();

        const helpOrder = await HelpOrders.findByPk(req.params.id);
        if (!helpOrder) {
            return res.status(401).json({ error: 'Help order not found' });
        }

        const { id, question, created_at } = await helpOrder.update({
            answer,
            answer_at,
        });

        const student = await Student.findByPk(helpOrder.student_id);

        await Queue.add(AnswerMail.key, {
            helpOrder,
            student,
        });

        return res.json({ id, question, answer, answer_at, created_at });
    }

    async index(req, res) {
        const helpOrders = await HelpOrders.findAll({
            where: {
                answer: null,
            },
        });

        return res.json(helpOrders);
    }
}

export default new GymHelpOrdersController();
