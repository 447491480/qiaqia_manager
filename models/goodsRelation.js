/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('goodsRelation', {
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
		OriGoodsId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		OriOwnerId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		NowGoodsId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		NowOwnerId: {
			type: DataTypes.STRING(50),
			allowNull: true
		}
	}, {
		tableName: 'goodsRelation',
		timestamps: false,
		freezeTableName: true
	});
};
