/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('category', {
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
		CategoryName: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		CategoryImg: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		OwnerId: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'category',
		timestamps: false,
		freezeTableName: true
	});
};
