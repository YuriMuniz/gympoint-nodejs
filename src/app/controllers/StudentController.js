import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            age: Yup.number()
                .positive()
                .integer()
                .required(),
            weight: Yup.number()
                .positive()
                .required(),
            height: Yup.number()
                .positive()
                .required(),
        });

        // Verificar resposta validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const student = await Student.findOne({
            where: { email: req.body.email },
        });

        if (student) {
            return res.status(400).json({ error: 'Student already exists.' });
        }

        const { id, name, email, age, weight, height } = await Student.create(
            req.body
        );

        return res.json({
            id,
            name,
            email,
            age,
            weight,
            height,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number()
                .integer()
                .required(),
            name: Yup.string(),
            email: Yup.string().email(),
            age: Yup.number()
                .positive()
                .integer(),
            weight: Yup.number().positive(),
            height: Yup.number().positive(),
        });

        // Verificar resposta validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.body;
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(401).json({ error: 'Student not found' });
        }
        const { name, email, age, weight, height } = await student.update(
            req.body
        );

        return res.json({
            name,
            email,
            age,
            weight,
            height,
        });
    }
}

export default new StudentController();
