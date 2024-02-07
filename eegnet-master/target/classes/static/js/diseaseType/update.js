/**
 * eeg Update
 */
var newFlg = false, formUrl, patientId, l, v;
$(document).ready(function() {
    $('.chosen-select').chosen({width: "100%"});
    // 数据验证设定
    setValidateCheck();

    // param = $.urlGet();
    // if (param.id) {
    //     formUrl = "edit";
    // } else {
    //     newFlg = true;
    //     formUrl = "add";
    // }
    //
    // if (newFlg == false) {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("编辑疾病类型");
    //
    //     $.post('selectById', { id : param.id },
    //         function(result) {
    //             if (result.data) {
    //
    //                 var data = result.data;
    //
    //                 $("#diseaseType").val(data.diseaseType);
    //             }
    //         });
    // } else {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("新建疾病类型");
    // }

    // 保存
    $("#btn_save").click(function() {
            save();
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
        newFlg = false;
        formUrl = "diseaseType/edit";
        $.post('diseaseType/selectById', {id: dataId},
            function (result) {
                if (result.data) {
                    var data = result.data;
                    $("#diseaseType").val(data.diseaseType);
                }
            });
    } else {
        newFlg = true;
        formUrl = "diseaseType/add";
    }

}

function save () {
    l = $("#btn_save").ladda();
    l.ladda('start');
    if ($("#mainForm").valid() == false){
        l.ladda('stop');
        return;
    }

    var diseaseType = {//类型
        diseaseType : $("#diseaseType").val()
    };

    if (newFlg == false) {
        diseaseType.id = patientId;
    }

    $.ajax({
        type : "POST",
        url : formUrl,
        dataType : "json",
        contentType : "application/json;charset=UTF-8",
        data : JSON.stringify(diseaseType),
        success : function(result) {
            if (result.code) {
                $('#myModal').modal('hide');
                Alert("", "保存成功!", "success");
                //goBack();
            } else {
                var errorMsg;

                if (newFlg == true) {
                    errorMsg = "添加失败!"
                } else {
                    errorMsg = "修改失败!"
                }

                Alert("", errorMsg, "error");
            }
            reload();
            l.ladda('stop');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Alert("", textStatus, "error");
            l.ladda('stop');
        }
    });
}

// 设定数据验证
function setValidateCheck() {
    v = $("#mainForm").validate({
        rules: {
            diseaseType:  {
                required: true,
                checkInput: true
            }
        },
        messages: {
            diseaseType:{
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}
