$(document).ready(function () {

    bindData();

    $("#btn_new").click(function () {
        $('#myModal .modal-title').text("添加用户");
        initEditData(undefined);
        $("#mainForm")[0].reset();
        if (v) {
            v.resetForm();
            $(".error").removeClass("error");
        }
        $('#myModal').modal('show');
        //window.location.href = "user/update";
    });

});

function editPassword(userId) {
    $('#passwordModal').modal('show');
    if (v) {
        v.resetForm();
        $(".error").removeClass("error");
    }
    initEditPasswordData(userId);
    //window.location.href = "user/updatepassword?userId=" + userId;
}

function editUser(id) {
    $('#myModal .modal-title').text("编辑用户");
    $('#myModal').modal('show');
    if (v) {
        v.resetForm();
        $(".error").removeClass("error");
    }
    initEditData(id);
    //window.location.href = "user/update?userId=" + userId;
}

function bindData() {
    var table = $('#table_list').dataTable({
        destroy: true,    //初始化表格
        language: {
            sLengthMenu: "每页 _MENU_ 项",
            sProcessing: "加载中...",
            sZeroRecords: "无数据",
            oPaginate: {
                sFirst: "首页",
                sPrevious: "上页",
                sNext: "下页",
                sLast: "末页"
            },
        },
        dom: 'rtilp',
        pagingType: "first_last_numbers",   //分页样式
        bInfo: false,  //是否显示页脚信息，DataTables插件左下角显示记录数  
        bSort: false,   //是否排序
        processing: true, //是否显示加载
        serverSide: true,//开启服务器处理模式
        responsive: true,
        scrollX: true, //开启水平滚动条
        searching: false,//搜索框
        aLengthMenu: [10, 20, 50],  //更改显示记录数选项
        iDisplayLength: 10, //默认显示的记录数  
        iDisplayStart: 0,  //当开启分页的时候，定义展示的记录的起始序号，不是页数，因此如果你每个分页有10条记录而且想从第三页开始，需要把该参数指定为20
        ajax: function (data, callback, setting) {
            var param = {};
            param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length) + 1;//当前页码
            param.draw = data.draw;
            param.username = $("#username_s").val();
            $.ajax({
                url: "/system/user/list",
                type: 'get',
                cache: false,
                data: param,
                dataType: "json",
                success: function (res) {
                    callback(res)
                }
            })
        }, //请求资源路径
        columns: [
            // {
            //     "data": null,
            //     "render": function (data, type, full, meta) {
            //     return meta.row + 1 + meta.settings._iDisplayStart;
            // }
            // },
         {
            data: "username",
            title: '用户名',
        }, {
            data: "roleName",
            title: '角色',
        }, {
            data: "status",
            title: '删除',
            sClass: "hide_status"
        }, {
            data: "userId",
            title: "操作",
            sWidth: 200,
            sClass: "hide_id"
        }],
        columnDefs: [{
            targets: 0,
            "orderable": false
        }],
        fnRowCallback: function (nRow, aData, iDataIndex) {
            $("#table_list th:first").removeClass("sorting_asc");//移除checkbox列的排序箭头

            $('td:eq(-1)', nRow).html(columnFormatter(aData));
            $('td:eq(-2)', nRow).html(statusFmatter(aData));
            return nRow;
        },
    }).api();

    table.on('draw', function () {
        $('td').css("vertical-align", "middle");

        var col = 0; // 多余列
        if (typeof editUserShow != 'undefined' && editUserShow instanceof Function) {
            tableFormat("table_list", "hide_id");
            editUserShow();
            col = 1;
        }

        if (typeof editPasswordShow != 'undefined' && editPasswordShow instanceof Function) {
            tableFormat("table_list", "hide_id");
            editPasswordShow();
            col = 1;
        }

        if (typeof editStatusShow != 'undefined' && editStatusShow instanceof Function) {
            tableFormat("table_list", "hide_status");
            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
            elems.forEach(function (html) {
                var switchery = new Switchery(html, {color: '#1AB394'});
            });
            col++;
        }

        $('#table_list .dataTables_empty').attr('colspan', 3 + col);
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();

    });

    $(".container-fluid").css("padding", "0px")
}

function tableFormat(id, classStr) {
    $('#' + id + ' th').removeClass(classStr);
    $('#' + id + ' td').removeClass(classStr);
}


function reload() {
    $('#table_list').dataTable().fnReloadAjax();
}

function statusFmatter(aData) {
    var tnStr = '';
    switch (aData.status) {
        case 1:
            tnStr = '<input type="checkbox" class="js-switch" onchange="disableUser(\'' + aData.userId + '\')" checked/>';
            break;
        case 0:
            tnStr = '<input type="checkbox" class="js-switch" onchange="abledUser(\'' + aData.userId + '\')" />';
            break;
        default:
            tnStr = '未知';
            break;
    }
    return tnStr;
}

function columnFormatter(aData) {
    var str = '<button style="display: none" class="btn btn-info btn-xs editUser" type="button" onclick="editUser(\'' + aData.userId + '\')"><i class="fa fa-edit"></i> 编辑</button>  ';
    str = str + '<button style="display: none" class="btn btn-success btn-xs editPassword" type="button" onclick="editPassword(\'' + aData.userId + '\')"><i class="fa fa-edit" style="width: 12px;height: 12px"></i> 修改密码</button>  ';
    return str;
}

function abledUser(id) {

    var sysUser = {
        userId: id,
        status: 1
    };

    $.ajax({
        type: "POST",
        url: 'user/updateStatus',
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(sysUser),
        success: function (result) {
            if (result.code) {
                Alert("", "启用成功!", "success");
                reload();
            } else {
                Alert("", "启用失败!", "error");
                return false;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Alert("", textStatus, "error");
            l.ladda('stop');
        }
    })
};

function disableUser(id) {

    if (id == 123456) {
        Alert("", "不能禁用超级管理员!", "error");
        return false;
    }

    var sysUser = {
        userId: id,
        status: 0
    };

    $.ajax({
        type: "POST",
        url: 'user/updateStatus',
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(sysUser),
        success: function (result) {
            if (result.code) {
                Alert("", "删除成功!", "success");
                reload();
            } else {
                Alert("", "删除失败!", "error");
                return false;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Alert("", textStatus, "error");
            l.ladda('stop');
        }
    })
};