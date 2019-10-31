import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
    init(sequelize) {
        super.init(
            {
                start_date: Sequelize.DATE,
                end_date: Sequelize.Date,
                price: Sequelize.FLOAT,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
        this.belongsTo(models.Student, {
            foreignKey: 'student_id',
            as: 'student',
        });
    }
}
export default Registration;
