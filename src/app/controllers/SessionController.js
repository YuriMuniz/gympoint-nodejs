import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        // Validação com Yup
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string().required(),
        });

        // Verificar resposta validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        // Verificar se usuario existe
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Verificar senha do usuario, metodo de verificação está no model
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name } = user;

        // Retorno com informações pré-definidas
        return res.json({
            user: {
                id,
                name,
                email,
            },
            // Informações referentes ao token. No metodo sign define
            // o payload (informações que estarão dentro do token, nesse caso o id)
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
