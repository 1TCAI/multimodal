/**
 * rtms Update
 */
var newFlg = false, formUrl, patientId, l, v;
$(document).ready(function() {
    $('#div_treatmentDate').datepicker({
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
    //
    // if (newFlg == false) {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("编辑rTMS");
    //
    //     $.post('selectById', { id : param.id },
    //         function(result) {
    //             if (result.data) {
    //
    //                 var data = result.data;
    //
    //                 $("#patientNumber").val(data.patientNumber).trigger("chosen:updated");
    //                 $("#restingMotionThreshold").val(data.restingMotionThreshold);
    //                 $('#stimulusSite').val(data.stimulusSite);
    //                 $("#stimulusIntensity").val(data.stimulusIntensity);
    //                 $('#stimulusFrequency').val(data.stimulusFrequency);
    //                 $('#stimulationTimeSeries').val(data.stimulationTimeSeries);
    //                 $('#serialIntervalTime').val(data.serialIntervalTime);
    //                 $('#totalTime').val(data.totalTime);
    //                 $('#pulseCount').val(data.pulseCount);
    //                 $('#pretreatmentEvaluation').val(data.pretreatmentEvaluation);
    //                 $('#treatmentCount').val(data.treatmentCount);
    //                 $('#treatmentDate').val(data.treatmentDate);
    //
    //             }
    //         });
    // } else {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("新建rTMS");
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
        formUrl = "rTms/edit";
        $.post('rTms/selectById', {id: dataId},
            function (result) {
                if (result.data) {
                    var data = result.data;
                    $("#patientNumber").val(data.patientNumber).trigger("chosen:updated");
                    $("#restingMotionThreshold").val(data.restingMotionThreshold);
                    $('#stimulusSite').val(data.stimulusSite);
                    $("#stimulusIntensity").val(data.stimulusIntensity);
                    $('#stimulusFrequency').val(data.stimulusFrequency);
                    $('#stimulationTimeSeries').val(data.stimulationTimeSeries);
                    $('#serialIntervalTime').val(data.serialIntervalTime);
                    $('#totalTime').val(data.totalTime);
                    $('#pulseCount').val(data.pulseCount);
                    $('#pretreatmentEvaluation').val(data.pretreatmentEvaluation);
                    $('#treatmentCount').val(data.treatmentCount);
                    $('#treatmentDate').val(data.treatmentDate);
                }
            });
    } else {
        newFlg = true;
        formUrl = "rTms/add";
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

    var rtms = {//类型
        patientNumber : $("#patientNumber").val(),
        restingMotionThreshold: $("#restingMotionThreshold").val(),
        stimulusSite:$('#stimulusSite').val(),
        stimulusIntensity:$("#stimulusIntensity").val(),
        stimulusFrequency:$('#stimulusFrequency').val(),
        stimulationTimeSeries:$('#stimulationTimeSeries').val(),
        serialIntervalTime:$('#serialIntervalTime').val(),
        totalTime:$('#totalTime').val(),
        pulseCount:$('#pulseCount').val(),
        pretreatmentEvaluation:$('#pretreatmentEvaluation').val(),
        treatmentCount:$('#treatmentCount').val(),
        treatmentDate:$('#treatmentDate').val()
    };

    if (newFlg == false) {
        rtms.id = patientId;
    }

    $.ajax({
        type : "POST",
        url : formUrl,
        dataType : "json",
        contentType : "application/json;charset=UTF-8",
        data : JSON.stringify(rtms),
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
                required:true,
                checkInput: true,
                min:0,
                max:100
            },
            restingMotionThreshold: {
                required:true,
                checkInput: true,
                min:0,
                max:100
            },
            stimulusSite: {
                required: true,
                checkInput: true
            },
            stimulusIntensity: {
                required:true,
                checkInput: true,
                min:0,
                max:200
            },
            stimulusFrequency: {
                required:true,
                checkInput: true,
                min:0,
                max:100
            },
            stimulationTimeSeries: {
                required:true,
                checkInput: true,
                min:1,
                max:1000
            },
            serialIntervalTime: {
                required:true,
                checkInput: true,
                min:1,
                max:100
            },
            totalTime: {
                required:true,
                checkInput: true,
                min:0,
                max:100
            },
            pulseCount: {
                required:true,
                checkInput: true,
                min:0,
                max:5000
            },
            treatmentCount: {
                required: true,
                checkInput: true
            },
            treatmentDate: {
                required: true,
                checkInput: true
            },
            // sequence: {
            //     required: true,
            //     digits: true
            // }
        },
        messages: {
            patientNumber: "这个必须填写",
            restingMotionThreshold: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格",
                min:"不能小于0",
                max:"不能大于100"
            },
            stimulusSite: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            stimulusIntensity: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格",
                min:"不能小于0",
                max:"不能大于200"
            },
            stimulusFrequency: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格",
                min:"不能小于0",
                max:"不能大于100"
            },
            stimulationTimeSeries: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格",
                min:"不能小于1",
                max:"不能大于1000"
            },
            serialIntervalTime: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格",
                min:"不能小于1",
                max:"不能大于100"
            },
            totalTime: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格",
                min:"不能小于0",
                max:"不能大于100"
            },
            pulseCount: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格",
                min:"不能小于0",
                max:"不能大于5000"
            },
            treatmentCount: {
                required: "这个必须填写",
                checkInput: "禁止输入特殊字符及空格"
            },
            treatmentDate: {
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
