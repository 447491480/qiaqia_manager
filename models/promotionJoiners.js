/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('promotionJoiners', {
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
		TargetRoleId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		PromotionId: {
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
		tableName: 'promotionJoiners',
		timestamps: false,
		freezeTableName: true
	});
};
