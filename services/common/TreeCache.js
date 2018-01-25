/**
 * cache for department
 *
 * @author raigor@forke.cn
 */

var TreeArray = [];

var initTreeCache = async(() => {
    if(!TreeArray || TreeArray.length == 0){
        var args = {};
        args["IsDelete"] = 0;
        TreeArray = await(db.treeTypes.findAll({
            where: args
        }));
        return;
    }
    return "";
});

/**
 * 获取所在tree名称
 * @param dId dId
 */
var getTreeName = function(dId){
    if(!dId){
        return "";
    }
    if(!TreeArray || TreeArray.length == 0){
        return "";
    }
    var idList = dId.split("|");
    if(idList.length == 0){
        return "";
    }
    var lastId = idList[idList.length - 1];
    for(var i=0; i<TreeArray.length;i++){
        if(TreeArray[i]["Id"] == lastId){
            return TreeArray[i]["Name"];
        }
    }
    return "";
}

/**
 * 根据名称和父id获取节点
 * @param parentId
 * @param name
 * @returns {*}
 */
var getTreePositionByName = function(parentId, name){
    if(!name){
        return "";
    }
    if(!TreeArray || TreeArray.length == 0){
        return "";
    }
    for(var i=0; i<TreeArray.length;i++){
        if(TreeArray[i]["Name"] != name){
            continue;
        }
        if(!parentId){
            return TreeArray[i]["Position"];
        }
        if(TreeArray[i]["ParentId"] != parentId){
            continue;
        }
        return TreeArray[i]["Position"];
    }
    return "";
}

/**
 * 根据名称和父id获取节点
 * @param parentId
 * @param name
 * @returns {*}
 */
var getTreeIdByName = function(parentId, name){
    if(!name){
        return "";
    }
    if(!TreeArray || TreeArray.length == 0){
        return "";
    }
    for(var i=0; i<TreeArray.length;i++){
        if(TreeArray[i]["Name"] != name){
            continue;
        }
        if(!parentId){
            return TreeArray[i]["Id"];
        }
        if(TreeArray[i]["ParentId"] != parentId){
            continue;
        }
        return TreeArray[i]["Id"];
    }
    return "";
}

exports.initTreeCache = initTreeCache;
exports.getTreeName = getTreeName;
exports.getTreePositionByName = getTreePositionByName;
exports.getTreeIdByName = getTreeIdByName;