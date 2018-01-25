/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('feedback', {
		Id: {
			type: DataTypes.STRING(50),
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
		contact: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'feedback',
		timestamps: false,
		freezeTableName: true
	});
};
