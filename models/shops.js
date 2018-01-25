/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('shops', {
		Id: {
			type: DataTypes.STRING(100),
			allowNull: false,
			primaryKey: true
		},
		MemberName: {
			type: DataTypes.STRING(120),
			allowNull: true
		},
		MemberArea: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		MemberBU: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		MemberState: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ShopCode: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		Address: {
			type: DataTypes.STRING(250),
			allowNull: true
		},
		HeaderImage: {
			type: DataTypes.STRING(250),
			allowNull: true
		},
		Points: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: "0"
		},
		Asset: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: "0"
		},
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		RoleId: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		MemberId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		IsDelete: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			defaultValue: "0"
		},
		IsChecked: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			defaultValue: "1"
		},
		Communication: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		Email: {
			type: DataTypes.STRING(100),
			allowNull: true
		}
	}, {
		tableName: 'shops',
		timestamps: false,
		freezeTableName: true
	});
};
