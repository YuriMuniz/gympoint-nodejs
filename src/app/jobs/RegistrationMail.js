import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
    get key() {
        return 'RegistrationMail';
    }

    async handle({ data }) {
        const { registration, student, plan } = data;

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Matrícula realizada ',
            template: 'registration',
            context: {
                title_plan: plan.title,
                duration_plan: plan.duration,
                price_plan: plan.price,
                total_price: registration.price,
                student_name: student.name,
                end_date: format(
                    parseISO(registration.end_date),
                    "'dia' dd 'de' MMMM' de 2019'",
                    { locale: pt }
                ),
            },
        });
    }
}

export default new RegistrationMail();
