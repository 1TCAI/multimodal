$(document).ready(function () {

    bindData();

    $("#btn_new").click(function () {
        window.location.href = "/system/role/addPage" ;
    });

});

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
            param.roleName = $("#roleName").val();
            $.ajax({
                url: "/system/role/list",
                type: 'get',
                cache: false,
                data: param,
                dataType: "json",
                success: function (res) {
                    callback(res)
                }
            })
        }, //请求资源路径
        columns: [{
            data: "roleName",
            title: '角色名',
        }, {
            data: "remark",
            title: '描述',
        }, {
            data: "status",
            title: '状态',
            "render" : function (status, type, full, meta) {
                var stnStr = '';
                switch (status) {
                    case 0:
                        stnStr = '<span class="label label-warning">无效</span>';
                        break;
                    case 1:
                        stnStr = '<span class="label label-primary">有效</span>';
                        break;
                    default:
                        stnStr = '<span class="label">未知</span>';
                        break;
                }
                return stnStr;
            }
        }, {
            data: "roleId",
            title: "操作",
            sWidth: 200,
            visible: false,
            "render" : function (data, type, full, meta) {
                var str = "<button style='display: none' class='btn btn-info btn-xs editShow' type='button' onclick=\"editRole('"+ data +"','" +full.roleName + "')\"><i class='fa fa-edit'></i> 编辑</button>  ";
                str = str + "<button style='display: none' class='btn btn-danger btn-xs deleteShow' type='button' onclick=\"deleteRole('"+ data +"')\"><i class='fa fa-trash'></i> 删除</button>";
                return str;
            }
        }],
        columnDefs: [{
            targets: 0,
            "orderable": false
        }],
    }).api();

    table.on('draw', function () {
        $('td').css("vertical-align", "middle");

        var col = 0; // 多余列
        if (typeof editShow != 'undefined' && editShow instanceof Function) {
            var column = table.column(3);
            column.visible(true, false);
            editShow();
            col = 1;
        }

        if (typeof deleteShow != 'undefined' && deleteShow instanceof Function) {
            var column = table.column(3);
            column.visible(true, false);
            deleteShow();
            col = 1;
        }

        $('#table_list .dataTables_empty').attr('colspan', 3 + col);
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });

    $("#table_list th:first").removeClass("sorting_asc");
    $(".container-fluid").css("padding", "0px")
}

function reload() {
    $('#table_list').dataTable().fnReloadAjax();
}

function editRole(roleId, roleName) {
    window.location.href = "/system/role/update?roleId=" + roleId;
    sessionStorage.setItem('roleName',roleName);
}

function deleteRole(roleId) {
    Confirm("确定要删除该数据?", function () {
        $.ajax({
            type: "POST",
            url: 'role/delete',
            dataType: "json",
            data: {roleId: roleId},
            success: function (result) {
                if (result.code) {
                    Alert("", "删除成功!", "success");
                    reload();
                } else {
                    Alert("", result.msg, "error");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Alert("", textStatus);
            }
        });
    });
}