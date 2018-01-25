/**
 * Created by chang on 2017/2/14.
 */
var userService = require('../../../services/admin/userService');
var sessionFilter = require('../../../filters/adminSessionFilter');
var excelParser = require('excel-parser');

module.exports = {
    // 修改密码
    get_resetPassword: [sessionFilter, function (req, res) {
        var old_pwd = req.query.old_pwd;
        var new_pwd = req.query.new_pwd;
        var new_pwd_confirm = req.query.new_pwd_confirm;

        if (!old_pwd || !new_pwd || !new_pwd_confirm) {
            res.jsonWrap(null, 2, '输入项不能为空');
        }

        if (new_pwd !== new_pwd_confirm) {
            res.jsonWrap(null, 2, '两次输入的新密码不一致');
        }

        userService.resetPassword(req.session.admin_login_info.Id, old_pwd, new_pwd).then(function (msg) {
            res.jsonWrap(msg);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(null, 1, msg);
        })
    }],

    // 查询客户
    get_queryAll: [sessionFilter, function (req, res) {
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.rows);
        var data = req.query;

        userService.queryUser(page, limit,data,req.session.admin_login_info).then(function (data) {
            for(var i=0;i<data["rows"].length;i++){
                var buStr = treeCache.getTreeName(data["rows"][i]["MemberBU"]);
                data["rows"][i]["dataValues"]["MemberBUStr"] = buStr;
                var areaStr = treeCache.getTreeName(data["rows"][i]["MemberArea"]);
                data["rows"][i]["dataValues"]["MemberAreaStr"] = areaStr;
            }
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],
    get_enterpriseQuery: [sessionFilter, function (req, res) {
        var data = {};
        data.shopId = req.session.admin_login_info.shop.Id;
        userService.queryEnterprise(data).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],

    // 保存客户
    post_save: [sessionFilter, function (req, res) {
        var data = req.body;
        if(!data.RoleId) {
            res.jsonWrap(null, 1, '角色为必填项');
            return;
        }

        userService.saveUser(data,req.session.admin_login_info).then(function (ret) {
            res.jsonWrap(ret);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, msg );
        })
    }],

    //修改企业信息
    post_enterpriseEdit: [sessionFilter, function (req, res) {
       var data = req.body;
       console.log(helper.parse(data));
       userService.editEnterprise(data).then(function (ret) {
           res.jsonWrap(ret);
       }).catch(function (msg) {
           console.log(msg);
           res.jsonWrap(msg, 1, '服务器错误');
       })
    }],

    // 删除客户
    get_delete: [sessionFilter, function (req, res) {
        var id = req.query.id;

        userService.deleteUser(id).then(function(ret){
            res.jsonWrap(ret);
        }).catch(function(msg) {
            console.log(msg);
            res.jsonWrap(msg,1,'操作失败');
        })
    }],

    // 设置为我的下级
    get_relation : [sessionFilter, function (req, res) {
        var sid = req.query.sid;
        userService.setRelation(req.session.admin_login_info.shop.Id,sid).then(function(data){
            res.jsonWrap(data);
        }).catch(function(msg) {
            console.log(msg);
            res.jsonWrap(msg,1,msg);
        })
    }],

    // 获取我的下级列表
    get_relationList : [sessionFilter, function(req, res){
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.rows);
        var data = req.query;
        //treeInit.updateTree();
        userService.getAllRelation(page,limit,data,req.session.admin_login_info.shop.Id).then(function (data) {
            for(var i=0;i<data["rows"].length;i++){
                var buStr = treeCache.getTreeName(data["rows"][i]["shop"]["MemberBU"]);
                data["rows"][i]["shop"]["dataValues"]["MemberBUStr"] = buStr;
                var areaStr = treeCache.getTreeName(data["rows"][i]["shop"]["MemberArea"]);
                data["rows"][i]["shop"]["dataValues"]["MemberAreaStr"] = areaStr;
            }
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],

    // 删除下级
    get_relationDelete : [sessionFilter, function(req, res){
        var id = req.query.id;

        userService.deleteRelation(id).then(function(ret){
            res.jsonWrap(ret);
        }).catch(function(msg) {
            console.log(msg);
            res.jsonWrap(msg,1,'操作失败');
        })
    }],

    get_setPaymentDays : [sessionFilter, function(req, res){
        var id = req.query.id;
        var days = req.query.days||0;

        userService.setPaymentDays(id,days).then(function(ret){
            res.jsonWrap(ret);
        }).catch(function(msg) {
            console.log(msg);
            res.jsonWrap(msg,1,'操作失败');
        })
    }],

    // 获取我的上级列表
    get_leaderList : [sessionFilter, function(req, res){
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.rows);
        var data = req.query;
        userService.getAllLeader(page,limit,data,req.session.admin_login_info.shop.Id).then(function (data) {
            for(var i=0;i<data["rows"].length;i++){
                var buStr = treeCache.getTreeName(data["rows"][i]["shop"]["MemberBU"]);
                data["rows"][i]["shop"]["dataValues"]["MemberBUStr"] = buStr;
                var areaStr = treeCache.getTreeName(data["rows"][i]["shop"]["MemberArea"]);
                data["rows"][i]["shop"]["dataValues"]["MemberAreaStr"] = areaStr;
            }
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],

    //获取子账号列表
    get_memberQuery : [sessionFilter, function (req, res) {
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.rows);
        var data = {
            type:req.query.type,
            shopid:req.session.admin_login_info.shop.Id
        };
        if(req.query.isdel)
        {
            data.IsDel = req.query.isdel;
        }
        userService.queryMember(page,limit,data).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],
    //删除子账号
    get_memberDelete : [sessionFilter, function (req, res) {
        userService.deleteMember(req.query.Id).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg) {
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],
    //修改子账号
    get_memberSave : [sessionFilter, function(req, res) {
        var data = {};
        if (req.query.Id) {
            data.Id = req.query.Id;
            if (req.query.IsDel) {
                data.IsDel = req.query.IsDel;
            } else {
                data.canAppLogin = req.query.canAppLogin;
                data.Rights = encodeURIComponent(req.query.Rights);
                data.Department = req.query.Department;
            }
        } else
        {
            data.MemberAccount = req.query.MemberAccount;
            data.Rights = encodeURIComponent(req.query.Rights);
            data.canAppLogin = req.query.canAppLogin;
            data.ShopId = req.session.admin_login_info.shop.Id;
            data.Department = req.query.Department;
        }
        userService.saveMember(data).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],

    // 审核商家
    get_checkShop : [sessionFilter, function(req, res) {
        var id = req.query.id;
        var sid = req.query.sid;
        userService.checkShop(id, sid).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],

    // 获取审核列表
    get_checkShopList : [sessionFilter, function(req, res){
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.rows);
        var keyword = req.query.keyword || '';
        var isChecked = parseInt(req.query.isChecked) || 0; // 是否已审核，2:已审核, 1:未审核, 0:全部

        userService.getShopCheckList(page,limit,keyword,isChecked).then(function (data) {
            res.jsonWrap(data);
        }).catch(function (msg) {
            console.log(msg);
            res.jsonWrap(msg, 1, '服务器错误');
        })
    }],

    get_checkUserUpload: [sessionFilter, function (req, res) {
        var filename = req.query.filename;
        if(!filename){
            res.json({code: 300, msg: '请先上传文件！'});
        }
        excelParser.parse({
            inFile: filename,
            worksheet: 1,
            skipEmpty: false
        },function(err, records){
            if(err) console.error(err);
            var buArray = [], areaArray = [], loginNameArray = [], userCodeArray = [];
            var loginNameErrorArray = [],codeErrorArray = [];
            if(!records || records.length <= 1){
                res.json({code:300, msg: '您上传的数据有误'});
                return;
            }
            if(records[0][0] != "BU" || records[0][1] != "司办" || records[0][2] != "经销商编码"){
                res.json({code:300, msg: '模板错误，请重新上传！'});
                return;
            }
            for(var i=1;i<records.length;i++){
                var tempRecord = records[i];
                var isContinue = false;
                if(loginNameArray.includes(tempRecord[4])){
                    loginNameErrorArray.push(tempRecord[4]);
                    isContinue = true;
                }else{
                    loginNameArray.push(tempRecord[4]);
                }
                if(userCodeArray.includes(tempRecord[2])){
                    codeErrorArray.push(tempRecord[2]);
                    isContinue = true;
                }else{
                    userCodeArray.push(tempRecord[2]);
                }
                if(isContinue){
                    continue;
                }
                if(!buArray.includes(tempRecord[0] + "|" + tempRecord[1])){
                    buArray.push(tempRecord[0] + "|" + tempRecord[1]);
                }
                if(!areaArray.includes(tempRecord[5] + "|" + tempRecord[6] + "|" + tempRecord[7])){
                    areaArray.push(tempRecord[5] + "|" + tempRecord[6] + "|" + tempRecord[7]);
                }
            }
            if(loginNameErrorArray.length > 0 || codeErrorArray.length>0){
                res.json({code: 300, msg:"含有重复或者错误数据", data: {loginNameErrorArray: loginNameErrorArray, codeErrorArray: codeErrorArray}});
                return;
            }
            userService.getUploadCheck(loginNameArray, userCodeArray, buArray, areaArray).then((errorArray) => {
                if(errorArray.nameErrorArray.length > 0 || errorArray.codeErrorArray.length > 0 || errorArray.areaErrorArray.length > 0 || errorArray.buErrorArray.length>0){
                    res.json({code: 300, msg: "数据重复，检查不通过", data: errorArray});
                    return;
                }
                userService.getUploadSave(records, req.session.admin_login_info).then((result) => {
                    res.json({code: 200, msg: "导入成功"});
                });
            });


        });
    }],

    get_checkFxsUserUpload: [sessionFilter, function (req, res) {
        var filename = req.query.filename;
        if(!filename){
            res.json({code: 300, msg: '请先上传文件！'});
        }
        excelParser.parse({
            inFile: filename,
            worksheet: 1,
            skipEmpty: false
        },function(err, records){
            if(err) console.error(err);
            var jxsCodeArray = [], fxsCodeArray = [], loginNameArray=[], areaArray = [];
            var fxsCodeErrorArray = [], nameErrorArray=[];
            if(!records || records.length <= 1){
                res.json({code:300, msg: '您上传的数据有误'});
                return;
            }
            if(records[0][0] != "经销商编码"){
                res.json({code:300, msg: '模板错误，请重新上传！'});
                return;
            }
            for(var i=1;i<records.length;i++){
                var tempRecord = records[i], isContinue = false;
                if(tempRecord[5] != "分销" && tempRecord[5] != "门店"){
                    res.json({code: 300, msg:"只允许导入分销商和门店", data: []});
                    return;
                }
                if(fxsCodeArray.includes(tempRecord[2])){
                    fxsCodeErrorArray.push(tempRecord[2]);
                    isContinue = true;
                }else{
                    fxsCodeArray.push(tempRecord[2]);
                }
                if(loginNameArray.includes(tempRecord[4])){
                    nameErrorArray.push(tempRecord[4]);
                    isContinue = true;
                }else{
                    loginNameArray.push(tempRecord[4]);
                }
                if(isContinue){
                    continue;
                }
                if(!jxsCodeArray.includes(tempRecord[0])){
                    jxsCodeArray.push(tempRecord[0]);
                }
                if(!areaArray.includes(tempRecord[6] + "|" + tempRecord[7] + "|" + tempRecord[8])){
                    areaArray.push(tempRecord[6] + "|" + tempRecord[7] + "|" + tempRecord[8]);
                }
            }
            if(fxsCodeErrorArray.length > 0 || nameErrorArray.length > 0){
                res.json({code: 300, msg:"含有重复或者错误数据", data: {fxsCodeErrorArray: fxsCodeErrorArray, nameErrorArray: nameErrorArray}});
                return;
            }
            userService.getUploadFxsCheck(loginNameArray, jxsCodeArray, fxsCodeArray, areaArray).then((errorArray) => {
                if(errorArray.nameErrorArray.length > 0 || errorArray.fxsCodeErrorArray.length > 0
                || errorArray.jxsCodeErrorArray.length > 0 || errorArray.areaErrorArray.length > 0){
                    res.json({code: 300, msg: "数据重复，检查不通过", data: errorArray});
                    return;
                }
                userService.getUploadFxsSave(records, req.session.admin_login_info).then((result) => {
                    res.json({code: 200, msg: "导入成功"});
                });
            });
        });
    }],

    get_checkGoodsUpload: [sessionFilter, function (req, res) {
        var filename = req.query.filename;
        if(!filename){
            res.json({code: 300, msg: '请先上传文件！'});
        }
        excelParser.parse({
            inFile: filename,
            worksheet: 1,
            skipEmpty: false
        },function(err, records){
            if(err) console.error(err);
            var goodsCodeArray = [];
            var goodsCodeErrorArray = [];
            if(!records || records.length <= 1){
                res.json({code:300, msg: '您上传的数据有误'});
                return;
            }
            if(records[0][0] != "商品编码"){
                res.json({code:300, msg: '模板错误，请重新上传！'});
                return;
            }
            for(var i=1;i<records.length;i++){
                var tempRecord = records[i];
                if(goodsCodeArray.includes(tempRecord[0])){
                    goodsCodeErrorArray.push(tempRecord[0]);
                    continue;
                }
                goodsCodeArray.push(tempRecord[0]);
            }
            console.log(goodsCodeErrorArray);
            if(goodsCodeErrorArray.length > 0){
                res.json({code: 300, msg:"含有重复或者错误数据", data: {goodsCodeErrorArray: goodsCodeErrorArray}});
                return;
            }
            userService.getUploadGoodsCheck(goodsCodeArray).then((errorArray) => {
                if(errorArray.goodsCodeErrorArray.length > 0){
                    res.json({code: 300, msg: "数据重复，检查不通过", data: errorArray});
                    return;
                }
                userService.getUploadGoodsSave(records, req.session.admin_login_info).then((result) => {
                    res.json({code: 200, msg: "导入成功"});
                });
            });


        });
    }]
};