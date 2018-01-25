/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('news', {
		Id: {
			type: DataTypes.STRING(50),
			allowNull: false,
			primaryKey: true
		},
		Title: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		Context: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		ImgPath: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		Type: {
			type: DataTypes.INTEGER(1),
			allowNull: false
		},
		SortBy: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		}
	}, {
		tableName: 'news',
		timestamps: false,
		freezeTableName: true
	});
};
