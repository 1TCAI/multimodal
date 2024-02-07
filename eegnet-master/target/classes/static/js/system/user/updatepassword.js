var newFlg = false, patientId;

$(document).ready(function() {

    // 数据验证设定
    setValidateCheck();

    // param = $.urlGet();
    //
    // $("#subTitleStrongLi").show();
    // $("#subTitleStrong").html("修改密码");
    //
    // $.post('selectByUserId', { userId : param.userId }, function(result) {
    //     if (result.data) {
    //         var data = result.data;
    //
    //         $('#text_salt').val(data.salt);
    //         $('#text_userId').val(data.userId);
    //         $('#text_userName').val(data.username);
    //
    //     }
    // });


    $("#btn_save_p").click(function() {
        l = $("#btn_save_p").ladda();
        l.ladda('start');
        if ($("#mainForm").valid() == false){
            l.ladda('stop');
            return;
        }

        if ('极弱,弱,一般'.indexOf($('.password-verdict').text()) != -1) {
            Alert("","密码过于简单");
            l.ladda('stop');
            return false;
        }

        var sysUser = {
            password: $('#text_password_p').val(),
            salt:$('#text_salt_p').val(),
            userId:$('#text_userId_p').val(),
            username:$('#text_userName_p').val()
        };

        var a = $("#text_password_p").val();
        var b = $("#text_password1_p").val();

        if( a == b ) {

            $.ajax({
                type : "POST",
                url : "user/password",
                dataType : "json",
                contentType : "application/json;charset=UTF-8",
                data : JSON.stringify(sysUser),
                success : function(result) {
                    if (result.code ) {
                        Alert("", "保存成功!", "success");
                        //goBack();
                    } else {
                        var errorMsg;
                        errorMsg = "修改失败!"
                        Alert("", errorMsg, "error");
                    }
                    l.ladda('stop');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Alert("", textStatus, "error");
                    l.ladda('stop');
                }
            })
        } else {
            Alert("", "两次密码不一致!", "error");
            l.ladda('stop');
        }
    });

    // 取消
    $("#btn_cancle_p").click(function() {
        // Confirm("确定要取消编辑？", function() {
        //     goBack();
        // });
        $('#passwordModal').modal('hide');
    });
});

function initEditPasswordData(dataId) {
    patientId = dataId;
    $.post('user/selectByUserId', { userId : patientId }, function(result) {
        if (result.data) {
            var data = result.data;

            $('#text_salt_p').val(data.salt);
            $('#text_userId_p').val(data.userId);
            $('#text_userName_p').val(data.username);

        }
    });

}

// 设定数据验证
function setValidateCheck() {
    v = $("#mainForm_p").validate({
        rules: {
            password_p: "required"
        },
        messages: {
            password_p: "这个必须填写",
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}


