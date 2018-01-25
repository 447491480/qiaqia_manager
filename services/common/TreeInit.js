/**
 * cache for department
 *
 * @author raigor@forke.cn
 */


/**
 * 获取所在tree名称
 * @param dId dId
 */
var updateTree = async(() => {
    var args = {};
    var TreeArray = await(db.treeTypes.findAll({
        where: args
    }));
    if(!TreeArray || TreeArray.length == 0){
        return "";
    }
    for(var i=0;i<TreeArray.length;i++){
        var tempNode = TreeArray[i];
        var pT = tempNode["Position"];
        var pTArray = pT.split("|");
        if(pTArray.length == 0){
            continue;
        }else if(pTArray.length == 1){
            await(db.treeTypes.update({Position: tempNode.Id}, {where: {Id: tempNode.Id}}));
        }else if(pTArray.length == 2){
            await(db.treeTypes.update({Position: tempNode.ParentId+ "|"+tempNode.Id}, {where: {Id: tempNode.Id}}));
        }else if(pTArray.length > 2){
            pTArray[0] = "4ca6a870-2563-11e7-9498-23354e0e82c6";
            for(var n=1;n<pTArray.length;n++){
                pTArray[n] = pTArray[n].substring(3, pTArray[n].length);
            }
            await(db.treeTypes.update({Position: pTArray.join("|")}, {where: {Id: tempNode.Id}}));
        }

        console.log(i+">>" + tempNode.Id);
    }
});

exports.updateTree = updateTree;