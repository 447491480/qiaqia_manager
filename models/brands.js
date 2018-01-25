/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('brands', {
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
		BrandName: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		BrandImg: {
			type: DataTypes.STRING(200),
			allowNull: true
		}
	}, {
		tableName: 'brands',
		timestamps: false,
		freezeTableName: true
	});
};
