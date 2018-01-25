/**
 * Created by chang on 2017/2/15.
 */
module.exports = {
    queryOrder: async(function (page, limit, data, session) {
        var offset = (page - 1) * limit;
        var whereCase = {};
        if(data.status) {
            if (data.status != 0) {
                whereCase.OrderProgressState = data.status;
            }
        }
        if (data.start&&data.end) {
            whereCase.CreateTime = {$between: [new Date(data.start), new Date(data.end)]}
        } else if (data.start) {
            whereCase.CreateTime = {$gte: new Date(data.start)};
        } else if (data.end) {
            whereCase.CreateTime = {$lte: new Date(data.end)};
        }
        whereCase.SellerId = session.shop.Id;

        db.orders.belongsTo(db.shops, {foreignKey: 'PurchaserId'});

        var ret = await(db.orders.findAndCountAll({
            include: [db.shops],
            offset: offset,
            limit: limit,
            where: whereCase,
            order: 'CreateTime DESC'
        }));

        return pager.gridWrap(ret.rows, page, limit, ret.count);
    }),

    queryOrderTurnOver: async(function (data, session) {
        var whereCase = {};
        if(data.status) {
            if (data.status != 0) {
                whereCase.OrderProgressState = data.status;
            }
        }
        if (data.start&&data.end) {
            whereCase.CreateTime = {$between: [new Date(data.start), new Date(data.end)]}
        } else if (data.start) {
            whereCase.CreateTime = {$gte: new Date(data.start)};
        } else {
            whereCase.CreateTime = {$lte: new Date(data.end)};
        }
        whereCase.SellerId = session.shop.Id;
        db.orders.hasMany(db.goods4orders, {foreignKey:'OrderId', targetKey:'Id'});
        return await(db.orders.findAll({
            include: [db.goods4orders],
            where:whereCase
        }));
    }),

    orderStatusChange: async(function (orderId, status) {
        var ret = await(db.orders.update({OrderProgressState: status}, {where: {Id: orderId}}));
        if (ret) {
            return true;
        } else {
            throw '操作失败'
        }

    }),

    paymentList: async(function (page, limit, session) {
        var offset = (page - 1) * limit;

        db.paymentDaysRecord.belongsTo(db.orders, {foreignKey: 'OrderId'});
        db.paymentDaysRecord.belongsTo(db.shops, {foreignKey: 'PurchaserId'});

        var ret = await(db.paymentDaysRecord.findAndCountAll({
            include: [db.orders, db.shops],
            offset: offset,
            limit: limit,
            where: {SellerId: session.shop.Id},
            order: 'CreateTime DESC'
        }));

        return pager.gridWrap(ret.rows, page, limit, ret.count);
    }),

    setPayment: async(function (id, payment) {
        return await(db.paymentDaysRecord.update(
            {Reverse: payment, ReverseTime: helper.getCurrentDate()},
            {where:{Id:id}}
        ));
    }),

    queryGoods4Order: async(function (page, limit, orderid, session) {
        var offset = (page - 1) * limit;
        wherecase = {OrderId: orderid};
        var ret = await(db.goods4orders.findAndCountAll({
            offset: offset,
            limit: limit,
            where: wherecase,
            order: 'CreateTime DESC'
        }));
        return pager.gridWrap(ret.rows, page, limit, ret.count);
    })
};