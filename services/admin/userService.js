/**
 * Created by chang on 2017/2/13.
 */

var app_config = require('../../config/app.json');
var roleSelectService = require('./roleSelectService');

var userService = {
    checkUserLogin: async(function (account, password, req) {
        db.member.belongsTo(db.shops, {
            foreignKey: 'ShopId',
            constraints: false
        });

        var data = await(db.member.findOne({
            include: [{model: db.shops}],
            where: {MemberAccount: account, MemberPass: helper.md5(account + password)}
        }));

        if (!data) {
            throw '用户名或者密码不正确';
        } else if(data.shop.IsChecked == 0){
           throw '商家未通过审核';
        }  else {
            req.session.admin_login_info = data;
            return true;
        }
    }),

    saveUser: async(function (data, sesison) {
        if (data.id) {
            var id = data.id;
            delete data['id'];
            delete data['MemberAccount'];

            var msg = await(db.shops.update(data, {
                where: {
                    Id: id
                }
            }));

            if (msg > 0) {
                return true;
            } else {
                throw '更新失败';
            }
        } else {
            data.CreateTime = helper.getCurrentDate();
            data.Id = helper.genTimeBaseUUID();
            data.IsChecked = 0;

            var member = {
                Id: helper.genTimeBaseUUID(),
                MemberAccount: data.MemberAccount,
                MemberPass: helper.md5(data.MemberAccount + app_config.default_password),
                ShopId: data.Id,
                Department: '总部'
            };

            data.MemberId = member.Id;

            delete data['MemberAccount'];

            var user = await(db.member.findOne({where: {MemberAccount: member.MemberAccount}}));
            if (user) {
                throw '账号信息不正确';
            }

            var shopRelation = {
                Id: helper.genTimeBaseUUID(),
                PID: sesison.shop.Id,
                SID: data.Id,
                IsChecked: 0
            };
            var tree = {
                Id: helper.genTimeBaseUUID(),
                OwnerId: data.Id,
                Name: '总部',
                Type: '1'
            };
            return await(db.sequelize.transaction(async(function (t) {
                await(db.shops.create(data, {transaction: t}));
                await(db.member.create(member, {transaction: t}));
                await(db.shopRelation.create(shopRelation, {transaction: t}));
                await(db.treeTypes.create(tree, {transaction: t}))
            })));
        }
    }),

    editEnterprise: async(function (data) {
        return await(db.shops.update(data, {
            where: {
                Id: data.Id
            }
        }))
    }),

    deleteUser: async(function (id) {
        return await(db.sequelize.transaction(async(function (t) {
            await(db.shops.update({IsDelete: 1}, {where: {Id: id}}, {transaction: t}));
            await(db.member.destroy({where: {ShopId: id}}, {transaction: t}));
        })));

        //var msg = await(db.shops.update({IsDelete: 1}, {
        //    where: {
        //        Id: id
        //    }
        //}));

        //if (msg > 0) {
        //    return true;
        //} else {
        //    throw '删除失败';
        //}
    }),

    queryEnterprise: async(function (data) {
        return new Promise(function (resolve, reject) {
            db.shops.belongsTo(db.roles, {foreignKey: 'RoleId'});
            db.shops.findOne({
                include: [db.roles],
                where: {Id: data.shopId}
            }).then(function (data) {
                resolve(data);
            }).catch(function (msg) {
                reject(msg);
            })
        });
    }),

    queryUser: async(function (page, limit, data, session) {
        return new Promise(function (resolve, reject) {
            var offset = (page - 1) * limit;

            var type = parseInt(data.type) || 0; // 默认查询方式为0:查询我的客户，1:查询所有客户（用于审核）
            var isChecked = parseInt(data.isChecked) || 0; // 是否已审核，2:已审核, 1:未审核, 0:全部

            db.shops.belongsTo(db.roles, {foreignKey: 'RoleId'});
            db.shops.belongsTo(db.member, {foreignKey: 'MemberId'});

            var whereCase = {};
            if (data.type === 0) {
                var roleIds = roleSelectService.getRoleList(session.shop.RoleId);
                whereCase = {RoleId: {$in: roleIds}, IsDelete: 0}
            } else {
                whereCase = {IsDelete: 0}
            }

            if (isChecked != 0) {
                whereCase.IsChecked = isChecked - 1;
            }

            if (data.name) {
                whereCase.MemberName = {'$like': '%' + data.name + '%'};
            }
            if (data.code) {
                whereCase.ShopCode = {'$like': '%' + data.code + '%'};
            }
            if (data.region) {
                whereCase.MemberArea = {'$like': '%' + data.region + '%'};
            }
            if (data.bu) {
                whereCase.MemberBU = {'$like': '%' + data.bu + '%'};
            }

            console.log(whereCase);

            db.shops.findAndCountAll({
                include: [db.roles, db.member],
                offset: offset,
                limit: limit,
                where: whereCase,
                order: 'CreateTime DESC'
            }).then(function (ret) {
                var data = ret.rows;
                data = pager.gridWrap(data, page, limit, ret.count);

                resolve(data);
            }).catch(function (msg) {
                reject(msg);
            })
        });
    }),

    setRelation: async(function (pid, sid) {
        if (pid == sid) {
            throw '不能把自己设为下级';
        }

        if (await(db.shopRelation.findOne({where: {PID: pid, SID: sid}}))) {
            throw '已经设置为下级，不能重复设置';
        }

        return await(db.shopRelation.create({Id: helper.genTimeBaseUUID(), PID: pid, SID: sid, IsChecked: 0}))
    }),

    setPaymentDays: async(function (id, days) {
        return await(db.shopRelation.update({PaymentDays: days}, {where: {Id: id}}));
    }),

    deleteRelation: function (id) {
        return new Promise(function (resolve, reject) {
            db.shopRelation.destroy({
                where: {Id: id}
            }).then(function (msg) {
                resolve(msg);
            }).catch(function (msg) {
                reject(msg);
            });
        });
    },

    getAllRelation: function (page, limit, data, pid) {
        return new Promise(function (resolve, reject) {
            var offset = (page - 1) * limit;
            var keyword = {};
            if (data.name) {
                keyword.MemberName = {'$like': '%' + data.name + '%'};
            }
            if (data.code) {
                keyword.ShopCode = {'$like': '%' + data.code + '%'};
            }
            if (data.region) {
                keyword.MemberArea = {'$like': '%' + data.region + '%'};
            }
            if (data.bu) {
                keyword.MemberBU = {'$like': '%' + data.bu + '%'};
            }
            db.shopRelation.belongsTo(db.shops, {foreignKey: 'SID'});
            db.shopRelation.belongsTo(db.member, {foreignKey: 'SID', targetKey: 'ShopId'});

            db.shopRelation.findAndCountAll({
                include: [db.member, {
                    'model': db.shops,
                    'where': keyword
                }],
                offset: offset,
                limit: limit,
                where: {PID: pid},
                order: 'CreateTime DESC'
            }).then(function (ret) {
                var data = ret.rows;
                data = pager.gridWrap(data, page, limit, ret.count);
                resolve(data);
            }).catch(function (msg) {
                reject(msg);
            })
        })
    },

    getAllLeader: async(function (page, limit, data, sid) {
        var offset = (page - 1) * limit;
        var keyword = {};
        if (data.name) {
            keyword.MemberName = {'$like': '%' + data.name + '%'};
        }
        if (data.code) {
            keyword.ShopCode = {'$like': '%' + data.code + '%'};
        }
        if (data.area) {
            keyword.MemberArea = {'$like': '%' + data.area + '%'};
        }
        if (data.bu) {
            keyword.MemberBU = {'$like': '%' + data.bu + '%'};
        }
        db.shopRelation.belongsTo(db.shops, {foreignKey: 'PID'});

        var ret = await(db.shopRelation.findAndCountAll({
            include: [{
                'model': db.shops,
                'where': keyword
            }],
            offset: offset,
            limit: limit,
            where: {SID: sid},
            order: 'CreateTime DESC'
        }));

        return pager.gridWrap(ret.rows, page, limit, ret.count);
    }),

    resetPassword: async(function (id, oldpass, newpass) {
        return new Promise(function (resolve, reject) {
            if (oldpass == newpass) {
                reject('新密码不能和原始密码相同');
                return;
            }
            var user = await(db.member.findOne({where: {Id: id}}));

            if (user && user.MemberPass != helper.md5(user.MemberAccount + oldpass)) {
                reject('原始密码不正确');
                return;
            }

            var ret = await(db.member.update({MemberPass: helper.md5(user.MemberAccount + newpass)}, {where: {Id: id}}));

            if (ret > 0) {
                resolve('操作成功');
            } else {
                reject('操作失败');
            }
        });
    }),

    queryMember: async(function (page, limit, data) {
        var offset = (page - 1) * limit;
        var ret = await(db.member.findAndCountAll({
            offset: offset,
            limit: limit,
            where: data,
            order: 'CreateTime DESC'
        }));
        return pager.gridWrap(ret.rows, page, limit, ret.count);
    }),

    deleteMember: async(function (id) {
        return new Promise(function (resolve, reject) {
            db.member.destroy({
                where: {Id: id}
            }).then(function (msg) {
                resolve(msg);
            }).catch(function (msg) {
                reject(msg);
            });
        });
    }),

    saveMember: async(function (data) {
        if (data.Id) {
            var id = data.Id;
            delete data['Id'];
            return await(db.member.update(data, {
                where: {
                    Id: id
                }
            }));
        } else {
            data.CreateTime = helper.getCurrentDate();
            data.Id = helper.genTimeBaseUUID();
            data.MemberPass = helper.md5(data.MemberAccount + app_config.default_password);
            data.Type = 1;
            data.IsDel = 0;

            var user = await(db.member.findOne({where: {MemberAccount: data.MemberAccount}}));
            if (user) {
                throw '账号已存在';
            }
            return await(db.member.create(data));
        }
    }),

    // 用户审核
    checkShop: async(function (id, sid) {
        await(db.shops.update({IsChecked: 1}, {
            where: {
                Id: sid
            }
        }));
        return await(db.shopRelation.update({IsChecked: 1}, {
            where: {
                Id: id
            }
        }));
    }),

    // 审核列表
    getShopCheckList: async(function (page, limit, key,isChecked) {
        var offset = (page - 1) * limit;
        var whereCase = {};
        if (typeof(key) != "undefined" && key != '') {
            whereCase.MemberName = {'$like': '%' + key + '%'};
        }

        var mainCase = {};
        if (isChecked !== 0) {
            mainCase.IsChecked = isChecked - 1;
        }

        db.shops.hasOne(db.shopRelation,{as:'s',foreignKey: 'SID'});
        db.shops.hasOne(db.shopRelation,{as:'p',foreignKey: 'PID'});
        db.shopRelation.belongsTo(db.shops,{as:'s',foreignKey: 'SID'});
        db.shopRelation.belongsTo(db.shops,{as:'p',foreignKey: 'PID'});

        var ret = await(db.shopRelation.findAndCountAll({
            include: [
                {
                    'model': db.shops,
                    'as':'s'
                },
                {
                    'model': db.shops,
                    'where': whereCase,
                    'as':'p'
                }
            ],
            offset: offset,
            limit: limit,
            where: mainCase,
            order: 'CreateTime DESC'
        }));

        return pager.gridWrap(ret.rows, page, limit, ret.count);
    }),

    getUploadCheck: async(function (loginNameArray, codeArray, buArray, areaArray) {
        //0.验证BU是否存在
        var BUErrorArray=[], areaErrorArray = [];
        for (var buKey in buArray){
            var tempBuArray = buArray[buKey].split("|");
            if(tempBuArray.length != 2){
                BUErrorArray.push(buArray[buKey]);
                continue;
            }
            var buAId = treeCache.getTreeIdByName(null, tempBuArray[0]);
            if(!buAId){
                BUErrorArray.push(buArray[buKey]);
            }
            var buB = treeCache.getTreeIdByName(buAId, tempBuArray[1]);
            if(!buB){
                BUErrorArray.push(buArray[buKey]);
            }
        }
        //检查地区是否存在
        for (var areaKey in areaArray){
            var tempAreaArray = areaArray[areaKey].split("|");
            if(tempAreaArray.length != 3){
                areaErrorArray.push(areaArray[areaKey]);
                continue;
            }
            var areaAId = treeCache.getTreeIdByName(null, tempAreaArray[0]);
            if(!areaAId){
                areaErrorArray.push(areaArray[areaKey]);
            }
            var areaBId = treeCache.getTreeIdByName(areaAId, tempAreaArray[1]);
            if(!areaBId){
                areaErrorArray.push(areaArray[areaKey]);
            }
            if(!tempAreaArray[2]){
                continue;
            }
            var areaCId = treeCache.getTreeIdByName(areaBId, tempAreaArray[2]);
            if(!areaCId){
                areaErrorArray.push(areaArray[areaKey]);
            }
        }
        //1.验证账号是否重复，
        var loginNameErrorArray = [], codeErrorArray=[];
        for(var nameKey in loginNameArray){
            var user = await(db.member.findOne({where: {MemberAccount: loginNameArray[nameKey], IsDel: 0}}));
            if (user) {
                loginNameErrorArray.push(loginNameArray[nameKey]);
            }
        }
        //2.验证经销商code是否重复
        for(var codeKey in codeArray){
            var user = await(db.shops.findOne({where: {ShopCode: codeArray[codeKey], IsDelete: 0}}));
            if (user) {
                codeErrorArray.push(codeArray[codeKey]);
            }
        }
        return {nameErrorArray: loginNameErrorArray, codeErrorArray:codeErrorArray, buErrorArray: BUErrorArray, areaErrorArray: areaErrorArray};
    }),

    getUploadSave: async(function (records, session) {
        for(var i=1;i<records.length;i++){
            var tempRecord = records[i];
            var buAId = treeCache.getTreeIdByName(null, tempRecord[0]);
            var BU = treeCache.getTreePositionByName(buAId, tempRecord[1]);

            var areaStr = "";
            var areaAId = treeCache.getTreeIdByName(null, tempRecord[5]);
            var areaBId = treeCache.getTreeIdByName(areaAId, tempRecord[6]);
            if(!tempRecord[7]){
                areaStr = treeCache.getTreePositionByName(areaAId, tempRecord[6]);;
            }else{
                areaStr = treeCache.getTreePositionByName(areaBId, tempRecord[7]);
            }

            var shop = {
                Id: helper.genTimeBaseUUID(),
                MemberName: tempRecord[3],
                MemberArea: areaStr,
                MemberBU: BU,
                Address: tempRecord[11],
                RoleId: 2,
                IsChecked : 1,
                Communication: tempRecord[9],
                MemberOffice: BU,
                Contacter: tempRecord[8],
                Compete: tempRecord[10],
                ShopCode: tempRecord[2]
            }
            var member = {
                Id: helper.genTimeBaseUUID(),
                MemberAccount: tempRecord[4],
                MemberPass: helper.md5(tempRecord[4] + app_config.default_password),
                ShopId: shop.Id,
                Department: '总部',
                CreateTime : helper.getCurrentDate(),
                IsChecked : 1
            };
            shop.MemberId = member.Id;

            var shopRelation = {
                Id: helper.genTimeBaseUUID(),
                PID: session.shop.Id,
                SID: shop.Id,
                IsChecked: 1
            };
            console.log(shop);
            console.log(member);
            console.log(shopRelation);
            await(db.sequelize.transaction(async(function (t) {
                await(db.shops.create(shop, {transaction: t}));
                await(db.member.create(member, {transaction: t}));
                await(db.shopRelation.create(shopRelation, {transaction: t}))
            })));
        }
        return true;
    }),

    getUploadFxsCheck: async(function (loginNameArray, jxsCodeArray, fxsCodeArray, areaArray) {
        var loginNameErrorArray = [], jxsCodeErrorArray=[], fxsCodeErrorArray=[], areaErrorArray = [];
        //检查地区是否存在
        for (var areaKey in areaArray){
            var tempAreaArray = areaArray[areaKey].split("|");
            if(tempAreaArray.length != 3){
                areaErrorArray.push(areaArray[areaKey]);
                continue;
            }
            var areaAId = treeCache.getTreeIdByName(null, tempAreaArray[0]);
            if(!areaAId){
                areaErrorArray.push(areaArray[areaKey]);
            }
            var areaBId = treeCache.getTreeIdByName(areaAId, tempAreaArray[1]);
            if(!areaBId){
                areaErrorArray.push(areaArray[areaKey]);
            }
            if(!tempAreaArray[2]){
                continue;
            }
            var areaCId = treeCache.getTreeIdByName(areaBId, tempAreaArray[2]);
            if(!areaCId){
                areaErrorArray.push(areaArray[areaKey]);
            }
        }
        //0.验证jxs code是否存在
        for(var codeKey in jxsCodeArray){
            var user = await(db.shops.findOne({where: {ShopCode: jxsCodeArray[codeKey], IsDelete: 0}}));
            if (!user) {
                jxsCodeErrorArray.push(jxsCodeArray[codeKey]);
            }
        }
        if(jxsCodeErrorArray.length > 0){
            return {
                nameErrorArray: loginNameErrorArray,
                fxsCodeErrorArray:fxsCodeErrorArray,
                jxsCodeErrorArray: jxsCodeErrorArray
            };
        }
        //1.验证fxs name是否重复，
        for(var nameKey in loginNameArray){
            var user = await(db.member.findOne({where: {MemberAccount: loginNameArray[nameKey], IsDel: 0}}));
            if (user) {
                loginNameErrorArray.push(loginNameArray[nameKey]);
            }
        }
        //2.验证fxs code是否重复
        for(var codeKey in fxsCodeArray){
            var user = await(db.shops.findOne({where: {ShopCode: fxsCodeArray[codeKey], IsDelete: 0}}));
            if (user) {
                fxsCodeErrorArray.push(fxsCodeArray[codeKey]);
            }
        }
        return {
            nameErrorArray: loginNameErrorArray,
            fxsCodeErrorArray:fxsCodeErrorArray,
            jxsCodeErrorArray: jxsCodeErrorArray,
            areaErrorArray: areaErrorArray
        };
    }),

    getUploadFxsSave: async(function (records, session) {
        for(var i=1;i<records.length;i++){
            var tempRecord = records[i];
            var areaStr = "", roleId = "";

            var areaAId = treeCache.getTreeIdByName(null, tempRecord[6]);
            var areaBId = treeCache.getTreeIdByName(areaAId, tempRecord[7]);
            if(!tempRecord[8]){
                areaStr = treeCache.getTreePositionByName(areaAId, tempRecord[7]);;
            }else{
                areaStr = treeCache.getTreePositionByName(areaBId, tempRecord[8]);
            }

            if(tempRecord[5] == "分销"){
                roleId="3";
            }else{
                roleId = "5";
            }
            var pShop = await(db.shops.findOne({where: {ShopCode: tempRecord[0]}}));
            if (!pShop) {
                continue;
            }
            var BU = pShop.MemberBU;
            var shop = {
                Id: helper.genTimeBaseUUID(),
                MemberName: tempRecord[3],
                MemberArea: areaStr,
                MemberBU: BU,
                Address: tempRecord[12],
                RoleId: roleId,
                IsChecked : 1,
                Communication: tempRecord[10],
                Contacter: tempRecord[9],
                MemberOffice: BU,
                Compete: tempRecord[11],
                ShopCode: tempRecord[2]
            }
            var member = {
                Id: helper.genTimeBaseUUID(),
                MemberAccount: tempRecord[4],
                MemberPass: helper.md5(tempRecord[4] + app_config.default_password),
                ShopId: shop.Id,
                Department: '总部',
                CreateTime : helper.getCurrentDate(),
                IsChecked : 1
            };
            shop.MemberId = member.Id;

            var shopRelation = {
                Id: helper.genTimeBaseUUID(),
                // PID: session.shop.Id,
                SID: shop.Id,
                IsChecked: 1
            };
            shopRelation.PID = pShop.Id;
            console.log(shop);
            console.log(member);
            console.log(shopRelation);
            await(db.sequelize.transaction(async(function (t) {
                await(db.shops.create(shop, {transaction: t}));
                await(db.member.create(member, {transaction: t}));
                await(db.shopRelation.create(shopRelation, {transaction: t}))
            })));
        }
        return true;
    }),

    getUploadGoodsCheck: async(function (goodsCodeArray) {
        var goodsCodeErrorArray=[];
        //0.验证goods code是否存在
        for(var codeKey in goodsCodeArray){
            var goods = await(db.goods.findOne({where: {GoodsCode: goodsCodeArray[codeKey], IsDelete: 0}}));
            if (goods) {
                goodsCodeErrorArray.push(goodsCodeArray[codeKey]);
            }
        }
        return {
            goodsCodeErrorArray: goodsCodeErrorArray
        };
    }),

    getUploadGoodsSave: async(function (records, session) {
        for(var i=1;i<records.length;i++){
            var tempRecord = records[i];
            var tempId = helper.genTimeBaseUUID();
            var goods = {
                Id: tempId,
                GoodsTitle: tempRecord[1],
                GoodsShortTitle: tempRecord[2],
                GoodsOriginalPrice: tempRecord[3],
                GoodsSupplyPrice: tempRecord[4],
                MaxCount: tempRecord[6],
                GoodsSalePrice : tempRecord[5],
                OwnerId: session.shop.Id,
                GoodsId: tempId,
                ShopId: session.shop.Id,
                GoodsCode: tempRecord[0]
            }
            console.log(goods);
            await(db.sequelize.transaction(async(function (t) {
                await(db.goods.create(goods, {transaction: t}));
            })));
        }
        return true;
    })
};

module.exports = userService;