/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('consignee4orders', {
		Id: {
			type: DataTypes.STRING(100),
			allowNull: false,
			primaryKey: true
		},
		OrderCode: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		ConsigneeName: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		ConsigneeMobile: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		ExpressTimeType: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		Province: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		City: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		County: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		Address: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'consignee4orders',
		timestamps: false,
		freezeTableName: true
	});
};
