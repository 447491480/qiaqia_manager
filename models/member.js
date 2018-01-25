/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('member', {
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
		MemberAccount: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		MemberPass: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		Type: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			defaultValue: "0"
		},
		Rights: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		canAppLogin: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			defaultValue: "0"
		},
		ShopId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		IsDel: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: "0"
		},
		Department: {
			type: DataTypes.STRING(100),
			allowNull: true
		}
	}, {
		tableName: 'member',
		timestamps: false,
		freezeTableName: true
	});
};
