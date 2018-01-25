/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('goods', {
		Id: {
			type: DataTypes.STRING(50),
			allowNull: false,
			primaryKey: true
		},
		GoodsTitle: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		GoodsShortTitle: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		GoodsCode: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		GoodsOriginalPrice: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: "0.00"
		},
		GoodsSupplyPrice: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: "0.00"
		},
		GoodsImgPath: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		MaxCount: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: "0"
		},
		GoodsSalePrice: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		LimitCount: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: "0"
		},
		OwnerId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		ImgJson: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		IsDelete: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			defaultValue: "0"
		},
		IsEnable: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			defaultValue: "0"
		},
		CategoryId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		BrandId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		DetailContent: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		GoodsId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		ShopId: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		MyCategoryId: {
			type: DataTypes.STRING(50),
			allowNull: true
		}
	}, {
		tableName: 'goods',
		timestamps: false,
		freezeTableName: true
	});
};
