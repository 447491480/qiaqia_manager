/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('consignee', {
		Id: {
			type: DataTypes.STRING(100),
			allowNull: false,
			primaryKey: true
		},
		ShopId: {
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
		Province: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		County: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		City: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		Address: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		IsDefault: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		}
	}, {
		tableName: 'consignee',
		timestamps: false,
		freezeTableName: true
	});
};
