/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('roles', {
		Id: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Pid: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		RoleName: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		RoleCode: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		Rights: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Type: {
			type: DataTypes.INTEGER(3),
			allowNull: true
		}
	}, {
		tableName: 'roles',
		timestamps: false,
		freezeTableName: true
	});
};
