/**
 * banner Update
 */
var newFlg = false, formUrl, param;
var imgAtt = ['图片尺寸: 宽750 * 高360', '图片尺寸: 宽750 * 高200', '图片尺寸: 宽750 * 高360', '图片尺寸: 宽750 * 高360', '图片尺寸: 宽750 * 高360', '图片尺寸: 宽750 * 高360', '图片尺寸: 宽750 * 高360'];
$(document).ready(function() {
    $('.chosen-select').chosen({width: "100%"});
    // 数据验证设定
    setValidateCheck();

    $("#select_type").change(function(){
        $("#div_attetion").html(imgAtt[$("#select_type").val()]);
    });

    param = $.urlGet();
    if (param.id) {
        formUrl = "edit";
    } else {
        newFlg = true;
        formUrl = "add";
    }

    if (newFlg == false) {
        $("#subTitleStrongLi").show();
        $("#subTitleStrong").html("编辑横幅");

        $.post('selectById', { id : param.id },
            function(result) {
                if (result.data) {

                    var data = result.data;

                    //类型
                    // $('#select_type').val(data.type).trigger("change");
                    $("#select_type").val(data.type).trigger("chosen:updated");

                    // 标题
                    $("#text_title").val(data.title);
                    // 描述
                    $("#text_description").val(data.description);
                    // 图片url
                    $('#uploadImgUrl').val(data.imgUrl);

                    if (data.imgUrl) {
                        initImg(data.imgUrl);
                    }

                    // 点击url
                    $('#text_clickUrl').val(data.clickUrl);
                    // 序号
                    $('#text_sequence').val(data.sequence);
                    // 宽
                    $('#text_width').val(data.width);
                    // 高
                    $('#text_height').val(data.height);
                }
            });
    } else {
        $("#subTitleStrongLi").show();
        $("#subTitleStrong").html("新建横幅");
    }

    // 保存
    $("#btn_save").click(function() {
        if ($("#uploadImgUrl").val() != "") {
            save();
        } else {
            send();
        }


    });

    // 取消
    $("#btn_cancle").click(function() {
        Confirm("确定要取消编辑？", function() {
            goBack();
        });
    });
});
function save () {
    var l = $("#btn_save").ladda();
    l.ladda('start');
    if ($("#mainForm").valid() == false){
        l.ladda('stop');
        return;
    }

    if (!$("#uploadImgUrl").val()){
        Alert('',"请上传图片");
        l.ladda('stop');
        return;
    }

    var banner = {//类型
        type: $('#select_type').val(),
        // 图片地址
        imgUrl: $('#uploadImgUrl').val(),
        // 点击地址
        clickUrl: $('#text_clickUrl').val(),
        // 序号
        sequence: $('#text_sequence').val(),
        // 宽
        width: $('#text_width').val(),
        // 高
        height: $('#text_height').val(),
        // 描述
        description: $("#text_description").val(),
        // 标题
        title: $("#text_title").val()
    };

    if (newFlg == false) {
        banner.id = param.id;
    }

    $.ajax({
        type : "POST",
        url : formUrl,
        dataType : "json",
        contentType : "application/json;charset=UTF-8",
        data : JSON.stringify(banner),
        success : function(result) {
            if (result.code) {
                Alert("", "保存成功!", "success");
                goBack();
            } else {
                var errorMsg;

                if (newFlg == true) {
                    errorMsg = "添加失败!"
                } else {
                    errorMsg = "修改失败!"
                }

                Alert("", errorMsg, "error");
            }
            l.ladda('stop');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Alert("", textStatus, "error");
            l.ladda('stop');
        }
    });
}

function send() {

    $.ajax({
        url:'/sign/upYun/new',
        ContentType: "application/x-www-form-urlencoded;charset=utf-8",
        success:function (res){
            if(res.code==1){
                $("#imgSignature").val(res.data.signature);
                $("#imgPolicy").val(res.data.policy);
                var option = {
                    url:'https://v0.api.upyun.com/panda-web',
                    type:"post",
                    success:function (result) {
                        var map = eval("("+result+")");
                        uploadSuccess("http://pandaweb.pandabus.cn"+map["url"]);
                        $("#text_width").val(map["image-width"]);
                        $("#text_height").val(map["image-height"]);
                        save();
                        return true;
                    },
                    error:function(){
                        uploadError();
                        Alert("", "上传失败" ,"error");
                        return false;
                    }
                };
                $("#mainForm").ajaxSubmit(option);
            }
        }
    })
}

// 设定数据验证
function setValidateCheck() {
    $("#mainForm").validate({
        rules: {
            title: "required",
            sequence: {
                required: true,
                digits: true
            },
            width: {
                required: true,
                digits: true
            },
            height: {
                required: true,
                digits: true
            }
        },
        messages: {
            title: "这个必须填写",
            sequence: {
                required: "请输入序号",
                digits: "请输入整数"
            },
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}
