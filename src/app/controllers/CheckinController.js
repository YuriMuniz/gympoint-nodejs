import { startOfWeek, addDays } from 'date-fns';

import Checkin from '../schemas/Checkin';

class CheckinController {
    async store(req, res) {
        const { id } = req.params;

        const startDate = startOfWeek(new Date());
        const endDate = addDays(startDate, 7);

        /**
         * Get all checkins in week
         */

        const checkinsInWeek = await Checkin.find({
            student_id: id,

            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        /**
         * Verify
         */
        if (checkinsInWeek.length >= 5) {
            return res
                .status(401)
                .json({ error: 'Checkin limit has been reached ' });
        }
        const numberCheckins = checkinsInWeek.length + 1;

        await Checkin.create({
            student_id: id,
            content: ` Esse é o chekin nº ${numberCheckins} dessa semana.`,
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
