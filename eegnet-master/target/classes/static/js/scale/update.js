/**
 * scale Update
 */
var newFlg = false, formUrl, patientId, l, v, title;
$(document).ready(function() {
    $('.chosen-select').chosen({width: "100%"});
    // 数据验证设定
    //setValidateCheck();

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
    //     $("#subTitleStrong").html("编辑量表");
    //
    //     $.ajax({
    //         type: "POST",
    //         url: 'getTitle',
    //         dataType: "json",
    //         data: {scaleType: param.scaleType},
    //         success: function (result0) {
    //             title = result0;
    //             var htmlStr = '';
    //             var htmlStr1 = '<div class="form-group row"><label class="col-sm-2 control-label">';
    //             var htmlStr2 = '</label><div class="col-sm-5"><input type="text" class="form-control" id="';
    //             var htmlStr3 = '" value="';
    //             var htmlStr4 = '"></div></div>';
    //
    //             $.post('selectById', { id : param.id },
    //                 function(result) {
    //                     if (result.data) {
    //                         var data = result.data;
    //                         htmlStr += htmlStr1 + '量表类型' + htmlStr2 + 'scaleTypeName' + htmlStr3 + data.scaleTypeName + '" disabled="disabled' + htmlStr4;
    //                         htmlStr += htmlStr1 + result0[0] + htmlStr2 + 'patientNumber' + htmlStr3 + data.patientNumber + htmlStr4;
    //                         htmlStr += htmlStr1 + result0[1] + htmlStr2 + 'hospitalNumber' + htmlStr3 + data.hospitalNumber + htmlStr4;
    //                         for (var i = 3; i < result0.length; i++) {
    //                             htmlStr += htmlStr1 + result0[i] + htmlStr2 + 'filed' + (i - 2) + htmlStr3 + eval('data.filed' + (i - 2)) + htmlStr4;
    //                         }
    //                         $("#midline").prepend(htmlStr);
    //                     }
    //                 });
    //         }
    //     });
    //
    // } else {
    //     $("#subTitleStrongLi").show();
    //     $("#subTitleStrong").html("新建量表");
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
        formUrl = "scale/edit";
        $.ajax({
            type: "POST",
            url: 'scale/getTitle',
            dataType: "json",
            data: {scaleType: $("#scaleType_s").val()},
            success: function (result0) {
                title = result0;
                var htmlStr = '';
                var htmlStr1 = '<div class="form-group row"><div class="col-sm-2"></div><label class="col-sm-3 control-label">';
                var htmlStr2 = '</label><div class="col-sm-5"><input type="text" class="form-control" id="';
                var htmlStr3 = '" value="';
                var htmlStr4 = '"></div><div class="col-sm-2"></div></div>';

                $.post('scale/selectById', { id : patientId },
                    function(result) {
                        if (result.data) {
                            var data = result.data;
                            htmlStr += htmlStr1 + '量表类型' + htmlStr2 + 'scaleTypeName' + htmlStr3 + data.scaleTypeName + '" disabled="disabled' + htmlStr4;
                            htmlStr += htmlStr1 + result0[0] + htmlStr2 + 'patientNumber' + htmlStr3 + data.patientNumber + htmlStr4;
                            htmlStr += htmlStr1 + result0[1] + htmlStr2 + 'hospitalNumber' + htmlStr3 + data.hospitalNumber + htmlStr4;
                            for (var i = 3; i < result0.length; i++) {
                                htmlStr += htmlStr1 + result0[i] + htmlStr2 + 'filed' + (i - 2) + htmlStr3 + eval('data.filed' + (i - 2)) + htmlStr4;
                            }
                            $("#midline").html(htmlStr);
                        }
                    });
            }
        });
    } else {
        newFlg = true;
        formUrl = "scale/add";
    }

}

function save () {
    l = $("#btn_save").ladda();
    l.ladda('start');
    if ($("#mainForm").valid() == false){
        l.ladda('stop');
        return;
    }

    var scale = {//类型
        patientNumber : $("#patientNumber").val(),
        hospitalNumber : $("#hospitalNumber").val()
    };

    for (var i = 3; i < title.length; i++) {
        scale['filed' + (i - 2)] = $("#filed" + (i - 2)).val();
    }

    if (newFlg == false) {
        scale.id = patientId;
        scale.scaleType = $("#scaleType_s").val();
    }

    $.ajax({
        type : "POST",
        url : formUrl,
        dataType : "json",
        contentType : "application/json;charset=UTF-8",
        data : JSON.stringify(scale),
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
