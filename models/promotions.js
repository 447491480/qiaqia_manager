/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('promotions', {
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
		PromotionTitle: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		PromotionType: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		Funds: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: "0.00"
		},
		PromotionContent: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Priority: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			defaultValue: "0"
		},
		RegionId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		CreatorId: {
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
		TargetRoleId: {
			type: DataTypes.STRING(50),
			allowNull: true
		}
	}, {
		tableName: 'promotions',
		timestamps: false,
		freezeTableName: true
	});
};
