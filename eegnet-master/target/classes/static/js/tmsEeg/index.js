var currentInformation, currentInformationId;
$(document).ready(function () {

    $('#div_birthday_s').datepicker({
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

    $('#div_gatherDate_s').datepicker({
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

    bindData();

    $("#btn_new").click(function () {
        $('.modal-title').text("添加TMS-EEG");
        $("#mainForm")[0].reset();
        if (v) {
            v.resetForm();
            $(".error").removeClass("error");
        }
        initEditData(undefined);
        $('#myModal').modal('show');
        //window.location.href = "tmsEeg/update" ;
    });

    $("#btn_export").click(function () {
        var diseaseType= $("#diseaseType_s").val();
        var patientGender= $("#patientGender_s").val();
        var diagnose= $("#diagnose_s").val();
        var gatherDate= $("#gatherDate_s").val();
        var eegDetail= $("#eegDetail_s").val();
        var birthday = $("#birthday_s").val();
        var dimensions = $("#dimensions_s").val();
        var patientNumber = $("#patientNumber_s").val();
        // var hospitalNumber = $("#hospitalNumber_s").val();
        window.open('tmsEeg/exportExcel?diseaseType=' + diseaseType
            + '&patientGender=' + patientGender
            + '&diagnose=' + diagnose
            + '&gatherDate=' + gatherDate
            + '&eegDetail=' + eegDetail
            + '&birthday=' + birthday
            + '&dimensions=' + dimensions
            + '&patientNumber=' + patientNumber
            // + '&hospitalNumber=' + hospitalNumber
            + '&page=' + 0
            + '&limit=' + 0);
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
            param.diseaseType= $("#diseaseType_s").val();
            param.patientGender= $("#patientGender_s").val();
            param.diagnose= $("#diagnose_s").val();
            param.gatherDate= $("#gatherDate_s").val();
            param.eegDetail= $("#eegDetail_s").val();
            param.birthday= $("#birthday_s").val();
            param.dimensions= $("#dimensions_s").val();
            param.patientNumber= $("#patientNumber_s").val();
            // param.hospitalNumber= $("#hospitalNumber_s").val();
            $.ajax({
                url: "tmsEeg/list",
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
            data: "patientNumber",
            title: '门诊号'
        }, {
            data: "hospitalNumber",
            title: '住院号'
        }, {
            data: "patientName",
            title: '姓名'
        }, {
            data: "diseaseType",
            title: '疾病类型'
        }, {
            data: "diagnose",
            title: '诊断'
        }, {
            data: "eegRecord",
            title: 'TMS-EEG记录名称'
        }, {
            data: "eegDetail",
            title: 'TMS-EEG记录描述'
        }, {
            data: "eegType",
            title: 'TMS-EEG类型'
        }, {
            data: "haveSleep",
            title: '有无睡着',
            "render" : function (s, type, full, meta) {
                var tnStr = '';
                switch (s) {
                    case 1:
                        tnStr = '有';
                        break;
                    case 0:
                        tnStr = '无';
                        break;
                    default:
                        tnStr = '未知';
                        break;
                }
                return tnStr;
            }
        }, {
            data: "applyDoctor",
            title: '申请医生'
        }, {
            data: "gatherDate",
            title: '采集日期'
        }, {
            data: "isThreshold",
            title: '是否测出阈值',
            "render" : function (s, type, full, meta) {
                var tnStr = '';
                switch (s) {
                    case 1:
                        tnStr = '是';
                        break;
                    case 0:
                        tnStr = '否';
                        break;
                    default:
                        tnStr = '未知';
                        break;
                }
                return tnStr;
            }
        }, {
            data: "threshold",
            title: '阈值(%)'
        }, {
            data: "stimulusIntensity",
            title: '刺激强度(%)'
        }, {
            data: "isDeleted",
            title: '删除',
            "render" : function (data, type, full, meta) {
                return statusFmatter(full);
            }
        },{
            data: "id",
            title: "操作",
            sWidth: 80,
            sClass: "table_center",
            visible: false,
            "render" : function (data, type, full, meta) {
                var str = "<button style='display: none' class='btn btn-info btn-xs edit' type='button' onclick=\"editTmsEeg('"+ data + "')\"><i class='fa fa-edit'></i> 编辑</button>  ";
                str = str + "<button style='display: none' class='btn btn-danger btn-xs delete' type='button' onclick=\"deleteTmsEeg('"+ data +"')\"><i class='fa fa-trash'></i> 删除</button>";
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
            var column = table.column(-1);
            column.visible(true, false);
            editShow();
            col = 1;
        }

        if (typeof deleteShow != 'undefined' && deleteShow instanceof Function) {
            var column = table.column(-1);
            column.visible(true, false);
            deleteShow();
            col = 1;
        }

        if (typeof abledShow != 'undefined' && abledShow instanceof Function) {
            var column = table.column(-2);
            column.visible(true, false);
            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
            elems.forEach(function (html) {
                var switchery = new Switchery(html, {color: '#1AB394'});
            });
            col++;
        }

        $('#table_list .dataTables_empty').attr('colspan', 12 + col);
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });

    $("#table_list th:first").removeClass("sorting_asc");
    $(".container-fluid").css("padding", "0px")
}

function reload() {
    $('#table_list').dataTable().fnReloadAjax();
}

function editTmsEeg(id) {
    $('.modal-title').text("编辑TMS-EEG");
    $('#myModal').modal('show');
    if (v) {
        v.resetForm();
        $(".error").removeClass("error");
    }
    initEditData(id);
    //window.location.href = "tmsEeg/update?id=" + id;
}

function deleteTmsEeg(id) {
    Confirm("确定要删除该数据?",
        function () {
            $.ajax({
                type: "POST",
                url: 'tmsEeg/delete',
                dataType: "json",
                data: {id: id},
                success: function (result) {
                    if (result.code) {
                        Alert("", "删除成功!", "success");
                        reload()
                    } else {
                        Alert("", "删除失败!", "error");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Alert("", textStatus);
                }
            });
        });
}

function isDeleted(cellvalue) {
    var tnStr = '';
    switch (cellvalue) {
        case 1:
            tnStr = '<span class="label label-warning">无效</span>';
            break;
        case 0:
            tnStr = '<span class="label label-primary">有效</span>';
            break;
        default:
            tnStr = '<span class="label">未知</span>'
            break;
    }
    return tnStr;
}

function statusFmatter(aData) {
    var tnStr = '';
    switch (aData.isDeleted) {
        case 0:
            tnStr = '<input type="checkbox" class="js-switch" id="sw_' + aData.id + '" onchange="disableVehicel(this,\'' + aData.id + '\')" checked/>';
            break;
        case 1:
            tnStr = '<input type="checkbox" class="js-switch" id="sw_' + aData.id + '" onchange="abledVehicel(\'' + aData.id + '\')" />';
            break;
        default:
            tnStr = '未知';
            break;
    }
    return tnStr;
}

function abledVehicel(id) {
    $.ajax({
        type: "POST",
        url: 'tmsEeg/updateStatus',
        dataType: "json",
        data: {
            id: id,
            status: 0,
        },
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
        }
    })
};

function disableVehicel(ele, id) {
    Confirm("确定要执行该操作?",
        function () {
            $.ajax({
                type: "POST",
                url: 'tmsEeg/updateStatus',
                dataType: "json",
                data: {
                    id: id,
                    status: 1,
                },
                success: function (result) {
                    if (result.code) {
                        Alert("", "删除成功!", "success");
                        reload();
                    } else {
                        $("#sw_" + id).next().remove()
                        var switchery = new Switchery(ele, {color: '#1ab394'});
                        switchery.setPosition(true);
                        Alert("", "删除失败!", "error");
                        return false;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#sw_" + id).next().remove()
                    var switchery = new Switchery(ele, {color: '#1ab394'});
                    switchery.setPosition(true);
                    Alert("", textStatus, "error");
                }
            })
        }, function () {
            $("#sw_" + id).next().remove()
            var switchery = new Switchery(ele, {color: '#1ab394'});
            switchery.setPosition(true);

        });
};