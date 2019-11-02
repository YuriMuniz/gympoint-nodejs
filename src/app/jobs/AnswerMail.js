import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
    get key() {
        return 'AnswerMail';
    }

    async handle({ data }) {
        const { helpOrder, student } = data;

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Gympoint: resposta da academia ',
            template: 'answer',
            context: {
                student_name: student.name,
                question: helpOrder.question,
                answer: helpOrder.answer,
                answer_at: format(
                    parseISO(helpOrder.answer_at),
                    'dd/MMMM/yyyy',
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new AnswerMail();
