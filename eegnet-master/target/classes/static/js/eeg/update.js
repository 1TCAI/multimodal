/**
 * eeg Update
 */
var newFlg = false, formUrl, patientId, l, v;
$(document).ready(function() {
    $('#div_gatherDate').datepicker({
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
    $('.chosen-select').chosen({width: "100%"});
    $("#patientNumber").val("").trigger("chosen:updated");
    $('#patientNumber').on('change', function(evt, params) {
        if ($("#patientNumber").val()) {
            $("#pInfo").show();
            $.post('patientRecord/selectById', {id: $("#patientNumber").val()},
                function (result) {
                    if (result.data) {
                        var data = result.data;
                        $("#update_patientName").val(data.patientName);
                        $("#update_diseaseType").val(data.diseaseType).trigger("chosen:updated");
                        $('#update_diagnose').val(data.diagnose);
                    }
                });
        } else  {
            $("#pInfo").hide();
        }
    });
    // 数据验证设定
    setValidateCheck();

    // param = $.urlGet();
    // if (param.id) {
    //     formUrl = "edit";
    // } else {
    //     newFlg = true;
    //     formUrl = "add";
    // }

    // if (newFlg == false) {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("编辑EEG");
    //
    //     $.post('selectById', { id : param.id },
    //         function(result) {
    //             if (result.data) {
    //
    //                 var data = result.data;
    //
    //                 $("#patientNumber").val(data.patientNumber).trigger("chosen:updated");
    //                 $("#eegRecord").val(data.eegRecord);
    //                 $('#eegDetail').val(data.eegDetail);
    //                 $("#eegType").val(data.eegType);
    //                 $('#haveSleep').find("option[value=" + data.haveSleep+ "]").attr("selected", true).trigger("chosen:updated");
    //                 $('#applyDoctor').val(data.applyDoctor);
    //                 $('#gatherDate').val(data.gatherDate);
    //             }
    //         });
    // } else {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("新建EEG");
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
        formUrl = "eeg/edit";
        $.post('eeg/selectById', {id: dataId},
            function (result) {
                if (result.data) {
                    var data = result.data;
                    $("#patientNumber").val(data.patientNumber).trigger("chosen:updated");
                    $("#eegRecord").val(data.eegRecord);
                    $('#eegDetail').val(data.eegDetail);
                    $("#eegType").val(data.eegType).trigger("chosen:updated");
                    $('#haveSleep').val(data.haveSleep).trigger("chosen:updated");
                    $('#applyDoctor').val(data.applyDoctor);
                    $('#gatherDate').val(data.gatherDate);
                }
            });
    } else {
        newFlg = true;
        formUrl = "eeg/add";
        $("#patientNumber").val("");
        $("#patientNumber").trigger("chosen:updated");
    }
}

function save () {
    l = $("#btn_save").ladda();
    l.ladda('start');
    if ($("#mainForm").valid() == false){
        l.ladda('stop');
        return;
    }
    var eeg = {//类型
        patientNumber : $("#patientNumber").val(),
        eegRecord : $("#eegRecord").val(),
        eegDetail : $('#eegDetail').val(),
        eegType : $("#eegType").val(),
        haveSleep : $('#haveSleep').val(),
        applyDoctor : $('#applyDoctor').val(),
        gatherDate : $('#gatherDate').val()
    };

    if (newFlg == false) {
        eeg.id = patientId;
    }

    $.ajax({
        type : "POST",
        url : formUrl,
        dataType : "json",
        contentType : "application/json;charset=UTF-8",
        data : JSON.stringify(eeg),
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
    $.validator.setDefaults({
        ignore: ":hidden:not(select)"
    });
        v = $("#mainForm").validate({
        rules: {
            patientNumber: {
                required: true
            },
            eegRecord: {
                required: true,
                checkInput: true
            },
            gatherDate: {
                required: true,
                checkInput: true
            }
            // sequence: {
            //     required: true,
            //     digits: true
            // }
        },
        messages: {
            patientNumber: {
                required: "这个必须填写"
            },
            eegRecord: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            gatherDate: {
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
