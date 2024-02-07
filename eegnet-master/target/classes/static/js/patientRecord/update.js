/**
 * patientRecord Update
 */
var newFlg = false, formUrl, patientId, l, v;
$(document).ready(function () {
    $('#update_div_birthday').datepicker({
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
    //$('.chosen-select').chosen({width: "100%"});
    $('#update_numberType_chosen').css("width", "100px");
    // 数据验证设定
    setValidateCheck();


    // 保存
    $("#btn_save").click(function () {
        save();
    });

    // 取消
    $("#btn_cancle").click(function () {
        // Confirm("确定要取消编辑？", function() {
        //     // goBack();
        //     $('#myModal').modal('hide');
        // });
        $('#myModal').modal('hide');
    });
});

function initEditData(dataId) {
    patientId = dataId;
    if (patientId) {
        newFlg = false;
        formUrl = "patientRecord/edit";
        $.post('patientRecord/selectById', {id: dataId},
            function (result) {
                if (result.data) {
                    var data = result.data;
                    if (data.patientNumber) {
                        $("#update_numberType").val(1).trigger("chosen:updated");
                        $("#update_patientNumber").val(data.patientNumber);
                    } else {
                        $("#update_numberType").val(0).trigger("chosen:updated");
                        $("#update_patientNumber").val(data.hospitalNumber);
                    }
                    $("#update_patientName").val(data.patientName);
                    $("#update_patientGender").val(data.patientGender).trigger("chosen:updated");
                    $('#update_birthday').val(data.birthday);
                    $("#update_education").val(data.education).trigger("chosen:updated");
                    $('#update_phone').val(data.phone);
                    $('#update_from').val(data.from);
                    $('#update_bedNumber').val(data.bedNumber);
                    $("#update_diseaseType").val(data.diseaseType).trigger("chosen:updated");
                    $('#update_diagnose').val(data.diagnose);
                    $('#update_outDiagnose').val(data.outDiagnose);
                    $("#update_dimensions").val(data.dimensions).trigger("chosen:updated");
                }
            });
    } else {
        newFlg = true;
        formUrl = "patientRecord/add";
    }

}

function save() {
    if (newFlg) {
        add();
    } else {
        update();
    }
}

/**
 * 编辑
 */
function update() {
    l = $("#btn_save").ladda();
    l.ladda('start');
    if ($("#mainForm").valid() == false) {
        l.ladda('stop');
        return;
    }

    var patientRecord = {//类型
        id: patientId,
        // patientNumber: $("#update_patientNumber").val(),
        patientName: $("#update_patientName").val(),
        patientGender: $("#update_patientGender").val(),
        birthday: $('#update_birthday').val(),
        education: $("#update_education").val(),
        phone: $('#update_phone').val(),
        from: $('#update_from').val(),
        bedNumber: $('#update_bedNumber').val(),
        diseaseType: $('#update_diseaseType').val(),
        diagnose: $('#update_diagnose').val(),
        outDiagnose: $('#update_outDiagnose').val(),
        //hospitalNumber: $("#update_hospitalNumber").val(),
        dimensions: $("#update_dimensions").val()
    };

    if ($("#update_numberType").val() == 1) {
        patientRecord.patientNumber = $("#update_patientNumber").val();
        patientRecord.hospitalNumber = "";
    } else {
        patientRecord.hospitalNumber = $("#update_patientNumber").val();
        patientRecord.patientNumber = "";
    }
    ajax(patientRecord);
}

/**
 * 添加
 */
function add() {
    l = $("#btn_save").ladda();
    l.ladda('start');
    if ($("#mainForm").valid() == false) {
        l.ladda('stop');
        return;
    }

    var patientRecord = {//类型
        //patientNumber: $("#update_patientNumber").val(),
        patientName: $("#update_patientName").val(),
        patientGender: $("#update_patientGender").val(),
        birthday: $('#update_birthday').val(),
        education: $("#update_education").val(),
        phone: $('#update_phone').val(),
        from: $('#update_from').val(),
        bedNumber: $('#update_bedNumber').val(),
        diseaseType: $('#update_diseaseType').val(),
        diagnose: $('#update_diagnose').val(),
        outDiagnose: $('#update_outDiagnose').val(),
        //hospitalNumber: $("#update_hospitalNumber").val(),
        dimensions: $("#update_dimensions").val()
    };

    if ($("#update_numberType").val() == 1) {
        patientRecord.patientNumber = $("#update_patientNumber").val();
        patientRecord.hospitalNumber = "";
    } else {
        patientRecord.hospitalNumber = $("#update_patientNumber").val();
        patientRecord.patientNumber = "";
    }

    ajax(patientRecord);
}

function ajax(patientRecord) {
    $.ajax({
        type: "POST",
        url: formUrl,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(patientRecord),
        success: function (result) {
            if (result.code) {
                $('#myModal').modal('hide');
                Alert("", "保存成功!", "success");
            } else {
                var errorMsg;
                if (result.msg) {
                    errorMsg = result.msg;
                } else if (newFlg == true) {
                    errorMsg = "添加失败!"
                } else {
                    errorMsg = "修改失败!"
                }

                Alert("", errorMsg, "error");
            }
            reload();
            l.ladda('stop');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Alert("", textStatus, "error");
            l.ladda('stop');
        }
    });
}

// 设定数据验证
function setValidateCheck() {
    v = $("#mainForm").validate({
        rules: {
            patientNumber: {
                required: true,
                checkInput: true
            },
            // hospitalNumber: {
            //     required: true,
            //     checkInput: true
            // },
            patientName: {
                required: true,
                checkInput: true
            },
            patientGender: {
                required: true,
                checkInput: true
            },
            birthday: {
                required: true,
                checkInput: true
            },
            phone: {
                required: true,
                checkInput: true
            },
            diseaseType: {
                required: true,
                checkInput: true
            },
            diagnose: {
                required: true,
                checkInput: true
            },
            // sequence: {
            //     required: true,
            //     digits: true
            // }
        },
        messages: {
            patientNumber: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            // hospitalNumber: {
            //     required: "这个必须填写",
            //     checkInput: "禁止输入特殊字符及空格"
            // },
            patientName: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            patientGender: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            birthday: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            phone: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            diseaseType: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            diagnose: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            // sequence: {
            //     required: "请输入序号",
            //     digits: "请输入整数"
            // }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}
