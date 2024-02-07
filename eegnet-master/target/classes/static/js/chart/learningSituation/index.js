var companyId;
$(document).ready(function () {

    $('.chosen-select').chosen({width: "100%", placeholdertxt: '请选择', placeholder_text_single: '请选择'});//placeholder_text_multiple:'请选择',

    bindData();

    // 清空表格
    $('#btn_content_cancel').click(function () {
        $('#dialog_table_list tbody tr').remove();
    });

    learnDetialData();
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
            param.courseId = $("#courseId").val();
            $.ajax({
                url: "/chart/learningSituation/list",
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
            data: "companyName",
            title: '公司名称',
        }, {
            data: "unLearningNumber",
            title: '未学习',
        },{
            data: "learningNumber",
            title: '学习中',
        }, {
            data: "passNumber",
            title: '已通过',
        },  {
            data: "companyId",
            title: "操作",
            sWidth: 200,
            visible: false,
            "render" : function (data, type, full, meta) {
                var str = '<button style="display: none" class="btn btn-success btn-xs detailedList" type="button" onclick="detailedListInfo(\'' + data + '\')"><i class="fa fa-search"></i> 查看详情</button>';
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
        if (typeof detailedListShow != 'undefined' && detailedListShow instanceof Function) {
            var column = table.column(4);
            column.visible(true, false);
            detailedListShow();
            col = 1;
        }
        $('#table_list .dataTables_empty').attr('colspan', 4 + col);
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });

    $("#table_list th:first").removeClass("sorting_asc");
    $(".container-fluid").css("padding", "0px");
}

function reload() {
    $('#table_list').dataTable().fnReloadAjax();
}

function learnDetialData() {
    var table = $('#dialog_table_list').dataTable({
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
            }
        },
        dom: 'rtilp',
        pagingType: "first_last_numbers",   //分页样式
        bInfo: false,  //是否显示页脚信息，DataTables插件左下角显示记录数  
        bSort: false,   //是否排序
        processing: true, //是否显示加载
        serverSide: true,//开启服务器处理模式
        responsive: true,
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
            param.companyId = companyId;
            param.courseId = $("#courseId").val();
            param.userName = $("#userName").val();

            var loginId;
            if(!!$("#loginId").val() && !isNaN($("#loginId").val())){
                loginId = parseInt($("#loginId").val());
            }else{
                loginId = '';
            }
            param.loginId = loginId;
            // param.learnStatus = $("#learnStatus").val();
            if (companyId) {
                $.ajax({
                    url: "/chart/learningSituation/detailedList",
                    type: 'get',
                    cache: false,
                    data: param,
                    dataType: "json",
                    success: function (res) {
                        callback(res)
                    }
                })
            } else {
                var ret = {
                    draw : param.draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data : ''
                };
                callback(ret);
            }

        }, //请求资源路径
        columns: [{
            data: "userName",
            title: '司机姓名',
        }, {
            data: "loginId",
            title: '司机电话',
        },{
            data: "learnStatus",
            title: '状态',
        },{
            data: "userId",
            title: "userId",
            sWidth: 200,
            visible: false
        }],
        columnDefs: [{
            targets: 0,
            "orderable": false
        }],
    }).api();

    table.on('draw', function () {
        $('td').css("vertical-align", "middle");
        // $('#table_list .dataTables_empty').attr('colspan', 3);
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });

    $("#dialog_table_list th:first").removeClass("sorting_asc");
    $(".container-fluid").css("padding", "0px");
}

function reloadLearnDetial() {
    $('#dialog_table_list').dataTable().fnReloadAjax();
}

function detailedListInfo(id) {
    companyId = id;
    $("#loginId").val('');
    $("#userName").val('');
    reloadLearnDetial();
    $('#videoDetaileModal').modal('show');
}