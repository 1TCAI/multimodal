$(document).ready(function () {

    $('#startDate').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        // calendarWeeks: true,
        autoclose: true,
        format: "yyyy-mm-dd",
        language: 'cn',
        clearBtn: true,
        endDate: new Date()
    }).on('changeDate', function () {
        checkTime();
    });

    $('#endDate').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        // calendarWeeks: true,
        autoclose: true,
        format: "yyyy-mm-dd",
        language: 'cn',
        clearBtn: true,
        endDate: new Date()

    }).on('changeDate', function () {
        checkTime();
    });

    bindData();
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
            param.userName = $("#userName").val();
            param.startDate = $("#startDate").val();
            param.endDate = $("#endDate").val();
            $.ajax({
                url: "/system/log/selectSysLogList",
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
            data: "userName",
            title: '用户名',
        }, {
            data: "actionName",
            title:  '操作',
        }, {
            data: "clientIp",
            title: 'IP',
        }, {
            data: "params",
            title: '参数',
            width: "20%",
            "render": function (data, type, full, meta) {
                return '<p style="word-wrap:break-word;word-break:break-all;">' + data + '</p>'
            }
        }, {
            data: "createDate",
            title: '时间',
        }, {
            data: "id",
            title: 'id',
            visible : false
        }],
        columnDefs: [{
            targets: 0,
            "orderable": false
        }]
    }).api();
    table.on('draw', function () {
        $('td').css("vertical-align", "middle");
    });
    $(".container-fluid").css("padding", "0px")
}

function reload() {
    $('#table_list').dataTable().fnReloadAjax();
}

function checkTime() {
    var start = $("#startDate").val();
    var end = $("#endDate").val();
    if(start != '' && end != '' && start > end){
        Alert("警告", "开始时间不能大于结束时间");
        $("#startDate").val(end);
        return;
    }
}