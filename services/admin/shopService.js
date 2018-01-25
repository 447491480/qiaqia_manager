/**
 * Created by susu on 17-4-10.
 */
var shopService = {
    getShops: async(function (data) {
        //console.log(data.type + " " +data.key);
        var wherecase = data;
        return await(db.shops.findAll({where:wherecase}));
    }),
    getAllSubShop: function (data, pid) {
        //console.log(data);
        return new Promise(function (resolve, reject) {
            var keyword = {};
            if (data.MemberArea) {
                keyword.MemberArea = {'$like': '%' + data.MemberArea + '%'};
            }
            if (data.MemberBU) {
                keyword.MemberBU = {'$like': '%' + data.MemberBU + '%'};
            }
            db.shopRelation.belongsTo(db.shops, {foreignKey: 'SID'});
            db.shopRelation.belongsTo(db.member, {foreignKey: 'SID', targetKey: 'ShopId'});
            db.shopRelation.findAll({
                include: [db.member,{
                    'model': db.shops,
                    'where': keyword
                }],
                where: {PID:pid}
            }).then(function (data) {
                resolve(data);
            }).catch(function (msg) {
                reject(msg);
            })
        })
    },
    /*getRegionSubShop: function (keyword, pid) {
        return new Promise(function (resolve, reject) {
            whereCase = {MemberArea:keyword};
            db.shopRelation.belongsTo(db.shops, {foreignKey: 'SID'});
            db.shopRelation.belongsTo(db.member, {foreignKey: 'SID', targetKey: 'ShopId'});
            db.shopRelation.findAll({
                include: [db.member,{
                    'model': db.shops,
                    //'where': whereCase
                }],
                where: {PID:pid}
            }).then(function (data) {
                resolve(data);
            }).catch(function (msg) {
                reject(msg);
            })
        })
    },*/
}
module.exports = shopService;