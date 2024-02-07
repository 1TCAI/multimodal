var newFlg = false, formUrl, patientId, l, v;
$(document).ready(function() {

     $('.chosen-select').chosen({width: "100%"});
    // 数据验证设定
    setValidateCheck();

    // param = $.urlGet();
    // if (param.userId) {
    //     formUrl = "edit";
    //     $('.hidepasswordInput').hide();
    // } else {
    //     newFlg = true;
    //     formUrl = "add";
    // };
    //
    // if (newFlg == false) {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("编辑用户信息");
    //
    //     $("#text_userName").attr("readonly",true);
    //     $.post('selectUserByUserId',  {
    //             userId : param.userId
    //         },
    //         function(result) {
    //             if (result.data) {
    //                 var data = result.data;
    //                 //登入账号
    //                 $('#text_userId').val(data.userId);
    //                 // 用户名
    //                 $('#text_userName').val(data.username);
    //                 //密码
    //                 $('#text_password').val(data.password);
    //                 //密码
    //                 $('#text_password1').val(data.password);
    //                 //
    //                 $('#text_roleId').val(data.roleId);
    //                 //盐
    //                 $('#text_salt').val(data.salt);
    //
    //                 $('#text_status').val(data.status),
    //
    //                 $("#text_company").find("option[value=" + data.companyId+ "]").attr("selected", true).trigger("chosen:updated");
    //
    //                 //角色
    //                 var rN = data.roleName;
    //                 $.ajax({
    //                     type: "POST",
    //                     url: "selectRoleName",
    //                     dataType: "json",
    //                     contentType: "application/json;charset=UTF-8",
    //                     success: function (result) {
    //                         var re =result.data;
    //                         for(var i=0;i<re.length;i++){
    //                             if(re[i].roleName == rN){
    //                                 $("#text_roleName").append(" <option selected value='"+ re[i].roleId+"'>"+ re[i].roleName+"</option>");
    //                             }else{
    //                                 $("#text_roleName").append(" <option value='"+ re[i].roleId+"'>"+ re[i].roleName+"</option>");
    //                             };
    //                         };
    //                         $("#text_roleName").trigger("chosen:updated");
    //                         $("#text_roleName").chosen();
    //                     }
    //                 });
    //             }
    //         });
    // } else {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("创建用户信息");
    //     $.ajax({
    //         type: "POST",
    //         url: "selectRoleName",
    //         dataType: "json",
    //         contentType: "application/json;charset=UTF-8",
    //         success: function (result) {
    //             var re =result.data;
    //             $("#text_roleName").append(" <option value=''selected></option>");
    //             $("#text_roleName").attr("data-placeholder","请选择角色");
    //             for(var i=0;i<re.length;i++){
    //                     $("#text_roleName").append(" <option value='"+ re[i].roleId+"'>"+ re[i].roleName+"</option>");
    //             };
    //             $("#text_roleName").trigger("chosen:updated");
    //             $("#text_roleName").chosen();
    //         }
    //     });
    // }

    // 保存
    $("#btn_save").click(function() {

        // if (!$('#text_userName').val() || $('#text_password').val() ){
        //     Alert("", result.msg, "");
        //     return false;
        // }

        l = $("#btn_save").ladda();
        l.ladda('start');
        if ($("#mainForm").valid() == false){
            l.ladda('stop');
            return;
        }

        if (!$('#text_roleName option:selected').val()){
            Alert('',"请选择角色");
            l.ladda('stop');
            return;
        }

        if (newFlg == true) {
            if ('极弱,弱,一般'.indexOf($('.password-verdict').text()) != -1) {
                Alert("","密码过于简单");
                l.ladda('stop');
                return false;
            }
        }

        var sysUser = {
            //登入账号
            userId: $('#text_userId').val(),
            // 用户名
            username: $('#text_userName').val(),
            //角色
            roleName: $('#text_roleName option:selected').text(),
            //盐
            salt:$('#text_salt').val(),
            //角色ID
            roleId:$('#text_roleName option:selected').val(),
            // 密码
            password: $('#text_password').val(),

            status:$('#text_status').val(),
        };

        if (newFlg == false) {
            sysUser.userId = patientId;
        }

        var a = $("#text_password").val();
        var b = $("#text_password1").val();

        if( a == b ) {
            $.ajax({
                type : "POST",
                url : formUrl,
                dataType : "json",
                contentType : "application/json;charset=UTF-8",
                data : JSON.stringify(sysUser),
                success : function(result) {
                    l.ladda('stop');
                    if (result.code == 1) {
                        $('#myModal').modal('hide');
                        Alert("", "保存成功!", "success");
                        //goBack();
                    } else {
                        Alert("", result.msg, "error");
                        return false;
                    }
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
    $("#btn_cancle").click(function() {
        // Confirm("确定要取消编辑？", function() {
        //     goBack();
        // });
        $('#myModal').modal('hide');
    });
});

function initEditData(dataId) {
    patientId = dataId;
    if (patientId) {
        $('.hidepasswordInput').hide();
        newFlg = false;
        formUrl = "user/edit";
        $("#text_userName").attr("readonly",true);
        $.post('user/selectUserByUserId',  {
                userId : patientId
            },
            function(result) {
                if (result.data) {
                    var data = result.data;
                    //登入账号
                    $('#text_userId').val(data.userId);
                    // 用户名
                    $('#text_userName').val(data.username);
                    //密码
                    $('#text_password').val(data.password);
                    //密码
                    $('#text_password1').val(data.password);
                    //
                    $('#text_roleId').val(data.roleId);
                    //盐
                    $('#text_salt').val(data.salt);

                    $('#text_status').val(data.status);

                    //角色
                    var rN = data.roleName;
                    $.ajax({
                        type: "POST",
                        url: "user/selectRoleName",
                        dataType: "json",
                        contentType: "application/json;charset=UTF-8",
                        success: function (result) {
                            var re =result.data;
                            for(var i=0;i<re.length;i++){
                                if(re[i].roleName == rN){
                                    $("#text_roleName").append(" <option selected value='"+ re[i].roleId+"'>"+ re[i].roleName+"</option>");
                                }else{
                                    $("#text_roleName").append(" <option value='"+ re[i].roleId+"'>"+ re[i].roleName+"</option>");
                                };
                            };
                            $("#text_roleName").trigger("chosen:updated");
                            $("#text_roleName").chosen();
                        }
                    });
                }
            });
    } else {
        $('.hidepasswordInput').show();
        $("#text_userName").attr("readonly",false);
        newFlg = true;
        $.ajax({
            type: "POST",
            url: "user/selectRoleName",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (result) {
                var re =result.data;
                $("#text_roleName").append(" <option value=''selected></option>");
                $("#text_roleName").attr("data-placeholder","请选择角色");
                for(var i=0;i<re.length;i++){
                    $("#text_roleName").append(" <option value='"+ re[i].roleId+"'>"+ re[i].roleName+"</option>");
                };
                $("#text_roleName").trigger("chosen:updated");
                $("#text_roleName").chosen();
            }
        });
        formUrl = "user/add";
    }

}


// 设定数据验证
function setValidateCheck() {
    v = $("#mainForm").validate({
        rules: {
            username: {
                required: true,
                checkInput: true
            },
            password:{
                required: true,
                checkInput: true
            },
            password1:{
                required: true,
                checkInput: true
            },
            roleName:{
                required: true,
                checkInput: true
            },
            status:{
                required: true,
                checkInput: true
            }
        },
        messages: {
            username: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            password:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            password1:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            roleName:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            status:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}


