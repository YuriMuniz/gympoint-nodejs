import { startOfWeek, addDays } from 'date-fns';

import Checkin from '../schemas/Checkin';

class CheckinController {
    async index(req, res) {
        const { id } = req.params;
        const checkins = await Checkin.find({
            student_id: id,
        });
        return res.json(checkins);
    }

    async store(req, res) {
        const { id } = req.params;

        const startDate = startOfWeek(new Date());
        const endDate = addDays(startDate, 7);

        /**
         * Listar todos os checkins da semana por usuario
         */

        const checkinsInWeek = await Checkin.find({
            student_id: id,
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        /**
         * Verificar limite de 5 checkins
         */
        if (checkinsInWeek.length >= 5) {
            return res.status(401).json({
                error: 'Week checkin limit has been reached ',
            });
        }
        const numberCheckins = checkinsInWeek.length + 1;

        await Checkin.create({
            student_id: id,
            content: `Esse é o checkin nº ${numberCheckins} dessa semana.`,
        });

        const checkins = await Checkin.find({
            student_id: id,
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        return res.json(checkins);
    }
}

export default new CheckinController();
