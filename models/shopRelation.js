/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('shopRelation', {
		Id: {
			type: DataTypes.STRING(50),
			allowNull: false,
			primaryKey: true
		},
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		PID: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		SID: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		PaymentDays: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: "0"
		},
		IsChecked: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			defaultValue: "1"
		}
	}, {
		tableName: 'shopRelation',
		timestamps: false,
		freezeTableName: true
	});
};
