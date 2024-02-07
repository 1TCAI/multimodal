var newFlg = false, formUrl, param;
$(document).ready(function() {

     $('.chosen-select').chosen({width: "100%"});
    // 数据验证设定
    setValidateCheck();

    param = $.urlGet();
    if (param.id) {
        formUrl = "/system/resource/edit";
    } else {
        newFlg = true;
        formUrl = "/system/resource/add";
    };

    if (newFlg == false) {
        $("#subTitleStrongLi").show();
        $("#subTitleStrong").html("编辑资源");

        $("#text_userName").attr("readonly",true);
        $.post('/system/resource/selectResourceById',  {
                id : param.id
            },
            function(result) {
                if (result.data) {
                    var data = result.data;
                    $('#text_id').val(data.menuId);
                    $('#text_menuType').val(data.menuType).trigger("chosen:updated");
                    changeType();
                    if ($('#text_menuType').val() == 'M') {
                        $("#text_parentId").val(data.parentId).trigger("chosen:updated");
                    } else {
                        $("#text_parentId1").val(data.parentId).trigger("chosen:updated");
                    }
                    $('#text_menuName').val(data.menuName);
                    $('#text_url').val(data.url);
                    $('#text_sequence').val(data.sequence);
                    $('#text_icon').val(data.icon);
                    $('#text_perms').val(data.perms);
                }
            });
    } else {
        $("#subTitleStrongLi").show();
        $("#subTitleStrong").html("创建资源");
    }

    // 保存
    $("#btn_save").click(function() {

        var l = $("#btn_save").ladda();
        l.ladda('start');
        if ($("#mainForm").valid() == false){
            l.ladda('stop');
            return;
        }
console.log(formUrl)
        var menu = {
            menuId: $('#text_id').val(),
            menuType: $('#text_menuType').val(),
            menuName: $('#text_menuName').val(),
            url: $('#text_url').val(),
            sequence: $('#text_sequence').val(),
            icon:$('#text_icon').val(),
            perms:$('#text_perms').val()
        };

        if ($('#text_menuType').val() == 'M') {
            menu.parentId = $("#text_parentId").val();
        } else {
            menu.parentId = $("#text_parentId1").val();
        }

        $.ajax({
            type : "POST",
            url : formUrl,
            dataType : "json",
            contentType : "application/json;charset=UTF-8",
            data : JSON.stringify(menu),
            success : function(result) {
                l.ladda('stop');
                if (result.code == 1) {
                    Alert("", "保存成功!", "success");
                    goBack();
                } else {
                    Alert("", result.msg, "error");
                    return false;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                Alert("", textStatus, "error");
                l.ladda('stop');
            }
        });

    });

    // 取消
    $("#btn_cancle").click(function() {
        Confirm("确定要取消编辑？", function() {
            goBack();
        });
    });
});

function changeType() {
    if ($('#text_menuType').val() == 'M') {
        $('#div_parentId').show();
        $('#div_parentId1').hide();
    } else {
        $('#div_parentId1').show();
        $('#div_parentId').hide();
    }
}

// 设定数据验证
function setValidateCheck() {
    $("#mainForm").validate({
        rules: {
            menuType: {
                required: true,
                checkInput: true
            },
            parentId: {
                required: true,
                checkInput: true
            },
            parentId1:{
                required: true,
                checkInput: true
            },
            menuName:{
                required: true,
                checkInput: true
            },
            url:{
                required: true,
                checkInput: true
            },
            sequence:{
                required: true,
                checkInput: true
            }
        },
        messages: {
            menuType: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            parentId: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            parentId1:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            menuName:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            url:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            sequence:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}




