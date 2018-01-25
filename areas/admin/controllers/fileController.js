/**
 * Created by chang on 2017/2/17.
 */
var ufileUtil = require('../../../utils/ufileUtil');
var sessionFilter = require('../../../filters/adminSessionFilter');
var multipart = require('connect-multiparty');
var app_config = require('../../../config/app.json');

module.exports = {
    post_upload : [sessionFilter,multipart({uploadDir: uploadPath + "/imgCloud"}),function (req, res) {
        var file = req.files.file;
        //ufileUtil.upload(file, res);
        var contentType = file.headers["content-type"];
        var filePath = file.path;
        var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1).substring(filePath.lastIndexOf("\/") + 1);
        var isCan = _escapeImgType(contentType, fileName);
        if(!isCan){
            res.json({code: 1, msg:"上传失败",data:""});
        }
        var ret = {
            code:0,
            data:{
                src: "http://" + app_config.default_host + "/imgCloud/" + fileName,
                title: fileName
            },
            msg:'上传成功'
        };
        console.log(contentType);
        console.log(fileName);
        res.json(ret);
    }],

    post_custom: [sessionFilter, multipart(), function (req, res) {
        var file = req.files.file;
        if(!file){
            res.json({code: 300, msg: '上传失败'});
        }
        var filename = file.path;
        console.log(file);
        console.log(filename);
        res.json({code:200,msg:'上传成功',data: {originalFilename: file.originalFilename, filename: file.path}});
    }]
};

function _escapeImgType(contentType, fileName){
    var defaultImgType = "jpg|png|gif|bmp|jpeg";
    var imgType = contentType.substring(contentType.lastIndexOf("\/") + 1, contentType.length);
    var fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
    if(defaultImgType.indexOf(imgType) < 0){
        return false;
    }
    if(defaultImgType.indexOf(fileType) < 0){
        return false;
    }
    return true;
}