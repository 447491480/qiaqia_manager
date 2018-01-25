/**
 * Created by susu on 17-4-10.
 */
var shopService = require('../../../services/admin/shopService');
var sessionFilter = require('../../../filters/adminSessionFilter');
module.exports = {
    get_queryShop:[sessionFilter, function (req, res) {
        data = req.query;
        shopService.getShops(data).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg){
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        });
    }],
    // 获取我的下级列表
    get_getSubshops: [sessionFilter, function(req, res){
        var data = req.query;
        shopService.getAllSubShop(data,req.session.admin_login_info.shop.Id).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],
    /*get_getRegionshops: [sessionFilter, function(req, res){
        var data = req.query;
        shopService.getAllSubShop(data.keyword,req.session.admin_login_info.shop.Id).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }]*/
};