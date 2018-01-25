/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('goods4promotions', {
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		PromotionId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		GoodsId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		StartTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		EndTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		Id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		}
	}, {
		tableName: 'goods4promotions',
		timestamps: false,
		freezeTableName: true
	});
};
