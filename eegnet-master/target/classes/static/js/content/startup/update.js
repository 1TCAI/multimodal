var newFlg = false, formUrl, param;
$(document).ready(function() {

    $('#div_expireDate').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        // calendarWeeks: true,
        autoclose: true,
        format: "yyyy-mm-dd",
        language: 'cn',
        clearBtn: true,
        endDate: new Date()
    });
    $("#select_os").change(function(){
        $("#uploadImgUrl").val('');
        var img = $('#showImge')[0];
        img.src = '';
        if (this.value == 'I') {
            $("#discraption").html('图片尺寸: 高1334 * 宽750');
            $("#div_attetion").html('(图片尺寸: 高1334 * 宽750)');
            $('#imgSize').val("750*1334");//宽*高，多个用，分割
        } else {
            $("#discraption").html('图片尺寸: 高1280 * 宽720');
            $("#div_attetion").html('(图片尺寸: 高1280 * 宽720)');
            $('#imgSize').val("720*1280");
        }
    });

    // 数据验证设定
    setValidateCheck();

    param = $.urlGet();
    if (param.id) {
        formUrl = "edit";
    } else {
        newFlg = true;
        formUrl = "add";
    }

    if (newFlg == false) {
        $("#subTitleStrongLi").show();
        $("#subTitleStrong").html("编辑启动页");

        $.post('selectById',
            {
                id : param.id
            },
            function(result) {
                if (result.data) {

                    var data = result.data;
                    //os
                    $('#select_os').val(data.os).trigger("change");
                    if (data.os == 'I') {
                        $("#discraption").html('图片尺寸: 高1334 * 宽750');
                        $("#div_attetion").html('(图片尺寸: 高1334 * 宽750)');
                        $('#imgSize').val("750*1334");
                    } else {
                        $("#discraption").html('图片尺寸: 高1280 * 宽720');
                        $("#div_attetion").html('(图片尺寸: 高1280 * 宽720)');
                        $('#imgSize').val("720*1280");
                    }
                    // 过期日
                    $("#text_expireDate").val(data.expireDate);
                    // 图片url
                    $('#uploadImgUrl').val(data.imgUrl);

                    if (data.imgUrl) {
                        initImg(data.imgUrl);
                    }
                    // 点击url
                    $('#text_clickUrl').val(data.clickUrl);
                }
            });
    } else {
        $("#subTitleStrongLi").show();
        $("#subTitleStrong").html("新建启动页");
        $("#discraption").html('图片尺寸: 高1334 * 宽750');
        $("#div_attetion").html('(图片尺寸: 高1334 * 宽750)');
        $('#imgSize').val("750*1334");
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

    var startUp = {//os
        os: $('#select_os').val(),
        // 图片地址
        imgUrl: $('#uploadImgUrl').val(),
        // 点击地址
        clickUrl: $('#text_clickUrl').val(),
        // 过期时间
        expireDate: $('#text_expireDate').val(),
    };

    if (newFlg == false) {
        startUp.id = param.id;
    }

    $.ajax({
        type : "POST",
        url : formUrl,
        dataType : "json",
        contentType : "application/json;charset=UTF-8",
        data : JSON.stringify(startUp),
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
                        save();
                        return true;
                    },
                    error:function(){
                        uploadError();
                        Alert("","上传失败", "error");
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
            select_os: "required",
            expireDate: {
                required: true,
                dateISO: true
            },
            uploadImgUrl: {
                required: true
            }
        },
        messages: {
            select_os: "这个必须填写",
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}
