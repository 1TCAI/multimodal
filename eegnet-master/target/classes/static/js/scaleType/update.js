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
    //     $("#subTitleStrong").html("编辑量表类型");
    //
    //     $.post('selectById', { id : param.id },
    //         function(result) {
    //             if (result.data) {
    //
    //                 var data = result.data;
    //
    //                 $("#scaleType").val(data.scaleType);
    //                 $("#topicCount").val(data.topicCount);
    //                 $("#separationCharacter").val(data.separationCharacter);
    //                 $("#formula").val(data.formula);
    //                 $("#judgementStandard").val(data.judgementStandard);
    //                 $("#remark").val(data.remark);
    //                 $("#excelTitle").val(data.excelTitle);
    //             }
    //         });
    // } else {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("新建量表类型");
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
    $('#update_excelTitle').tagsinput({
        tagClass: 'label label-primary'
    });
    if (patientId) {
        newFlg = false;
        formUrl = "scaleType/edit";
        $.post('scaleType/selectById', {id: dataId},
            function (result) {
                if (result.data) {
                    var data = result.data;
                    $("#update_scaleType").val(data.scaleType);
                    // $("#topicCount").val(data.topicCount);
                    // $("#separationCharacter").val(data.separationCharacter);
                    // $("#formula").val(data.formula);
                    // $("#judgementStandard").val(data.judgementStandard);
                    $("#remark").val(data.remark);
                    $('.tagsinput').tagsinput('removeAll');
                    $('.tagsinput').tagsinput('add', data.excelTitle.replace(/;/g,","));
                    // $("#update_excelTitle").val(data.excelTitle.replace(/;/g,","));
                    $('.tagsinput').tagsinput('refresh');

                }
            });
    } else {
        newFlg = true;
        // $('.tagsinput').tagsinput('removeAll');
        $("#update_scaleType").val("");
        $('.tagsinput').tagsinput('removeAll');
        $('.tagsinput').tagsinput('add', "门诊号,住院号,日期");
        $('.tagsinput').tagsinput('refresh');
        $("#remark").val("");
        formUrl = "scaleType/add";

    }

}

function save () {
    l = $("#btn_save").ladda();
    l.ladda('start');
    if ($("#mainForm").valid() == false){
        l.ladda('stop');
        return;
    }

    var excelTitle = $("#update_excelTitle").val().replace(/,/g,";");
    if (excelTitle.charAt(excelTitle.length - 1) == ';') {
        excelTitle = excelTitle.substring(0, excelTitle.length - 1);
    }
    var scaleType = {//类型
        scaleType : $("#update_scaleType").val(),
        // topicCount : $("#topicCount").val(),
        // separationCharacter : $("#separationCharacter").val(),
        // formula : $("#formula").val(),
        // judgementStandard : $("#judgementStandard").val(),
        remark : $("#remark").val(),
        excelTitle : excelTitle
    };

    if (newFlg == false) {
        scaleType.id = patientId;
    }

    $.ajax({
        type : "POST",
        url : formUrl,
        dataType : "json",
        contentType : "application/json;charset=UTF-8",
        data : JSON.stringify(scaleType),
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
            scaleType: {
                required: true,
                checkInput: true
            },
            // topicCount: {
            //     required: true,
            //     checkInput: true
            // },
            // separationCharacter: {
            //     required: true,
            //     checkInput: true
            // },
            // formula: {
            //     required: true,
            //     checkInput: true
            // },
            // judgementStandard: {
            //     required: true,
            //     checkInput: true
            // },
            excelTitle: {
                required: true,
                checkInput: true
            }
        },
        messages: {
            scaleType: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            // topicCount: {
            //     required: "这个必须填写",
            //     checkInput: "禁止输入特殊字符及空格"
            // },
            // separationCharacter: {
            //     required: "这个必须填写",
            //     checkInput: "禁止输入特殊字符及空格"
            // },
            // formula: {
            //     required: "这个必须填写",
            //     checkInput: "禁止输入特殊字符及空格"
            // },
            // judgementStandard: {
            //     required: "这个必须填写",
            //     checkInput: "禁止输入特殊字符及空格"
            // },
            excelTitle: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}
