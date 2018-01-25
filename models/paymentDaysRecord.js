/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('paymentDaysRecord', {
		Id: {
			type: DataTypes.STRING(50),
			allowNull: false,
			primaryKey: true
		},
		OrderId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		PurchaserId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		SellerId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		Money: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: "0.00"
		},
		Reverse: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: "0.00"
		},
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		ReverseTime: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'paymentDaysRecord',
		timestamps: false,
		freezeTableName: true
	});
};
