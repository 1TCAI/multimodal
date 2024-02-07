$(document).ready(function() {

    var widthR = $('#text_remark').width() + 26;

    $('.chosen-select').chosen({width: widthR+'px'});
    // 数据验证设定
    setValidateCheck();

    $("#jstree1").jstree({
        "core": {
            'data': function (obj, callback) {
                var jsonarray = [];//eval('(' + jsonstr + ')');
                $.ajax({
                    type: "POST",
                    url: '/system/role/getAllMenu',
                    dataType: "json",
                    async: false,
                    data: {roleId: ''},
                    success: function (data) {
                            for (var i = 0; i < data.length; i++) {
                                var arr = {
                                    "id": data[i].id,
                                    "parent": data[i].parent,
                                    "text": data[i].text,
                                    "icon": data[i].icon,
                                }
                                jsonarray.push(arr);
                            }
                    }
                });
                callback.call(this, jsonarray);
            }
        },
        'plugins': ['checkbox',"wholerow"]
    });


    // 保存
    $("#btn_save").click(function() {

        var l = $("#btn_save").ladda();
        l.ladda('start');

        var ref = $('#jstree1').jstree(true);//获得整个树
        var idArray = ref.get_selected(false);//获得所有选中节点，返回值为数组
        //由于jstree本身方法问题，其在获取所有选中节点时获取不到灰色方框复选框的选中状态，所以通过灰色方框的class属性jstree-undetermined获取其对应的节点id
        $(".jstree-undetermined").each(function () {
            idArray.push($(this).parent().parent().attr('id'));
        });

        if(!$('#text_roleName').val() || !$('#text_remark').val()){
            l.ladda('stop');
            Alert("", '请添加角色名和权限描述', "error");
            return false
        }

        var sysRole = {
            roleName: $('#text_roleName').val(),
            remark:$('#text_remark').val(),
            status:$('#text_status').val(),
            menuIds: idArray
        };

        $.ajax({
            type : "POST",
            url : "add",
            dataType : "json",
            contentType : "application/json;charset=UTF-8",
            data : JSON.stringify(sysRole),
            success : function(result) {
                if (result.code ) {
                    l.ladda('stop');
                    Alert("", "保存成功!", "success");
                    goBack();
                } else {
                    l.ladda('stop');
                    Alert("", '添加失败', "error");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                Alert("", textStatus, "error");
                l.ladda('stop');
            }
        })
    });

    // 取消
    $("#btn_cancle").click(function() {
        Confirm("确定要取消编辑？", function() {
            goBack();
        });
    });

});

// 设定数据验证
function setValidateCheck() {
    $("#mainForm").validate({
        rules: {
            roleName: "required",
            remark: "required",
            status:"required",
        },
        messages: {
            roleName: "这个必须填写",
            remark: "这个必须填写",
            status:"这个必须填写",
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parents("div .form-group"));
        },
    });
}



