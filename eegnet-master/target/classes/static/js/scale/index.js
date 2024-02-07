$(document).ready(function () {
    $('#div_rowDate_s').datepicker({
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
    $('.chosen-select').chosen({width: "100%", placeholdertxt: '请选择', placeholder_text_single: '请选择'});

    $('.custom-file-input').on('change', function () {
        var fileName = $(this).val().split('\\').pop();
        $(this).next('.custom-file-label').addClass("selected").html(fileName);
    });

    //上传模态框弹出
    $("#btn_import").click(function () {
        $('#uploadModal').modal('show');
    });

    // 上传
    $("#btn_upload_excel_file").click(function () {
        $(this).attr("data-dismiss", "");
        var l = $("#btn_upload_excel_file").ladda();
        l.ladda('start');
        var excelFile = $('#excel_file').val();
        var scaleType = $('#import_scaleType').val();

        if (!scaleType) {
            Alert("", "请选择量表类型!");
            l.ladda('stop');
            return;
        }

        if (excelFile == '') {
            l.ladda('stop');
            Alert("", "请选择文件!");
            return;
        } else if (!/\.(xls|xlsx|XLS|XLSX)$/.test(excelFile)) {
            l.ladda('stop');
            Alert("", "文件必须是xls、xlsx中的一种");
            return;
        } else {
            var option = {
                url: "scale/import",
                type: "POST",
                success: function (result) {
                    if (result.code) {
                        Alert("", result.msg, "success");
                        $('#uploadModal').modal('hide');
                    } else {
                        Alert("", result.msg, "error");
                    }
                    l.ladda('stop');
                }
            }
            $("#upload_excel_form").ajaxSubmit(option);
        }
    });

    $("#scaleType_s").on('change', function (e, params) {
        bindData();
    });
});

var table;
function bindData() {
    if ($("#scaleType_s").val()) {
        $.ajax({
            type: "POST",
            url: 'scale/getTitle',
            dataType: "json",
            data: {scaleType: $("#scaleType_s").val()},
            success: function (result) {
                var columns = [{
                    data: "patientNumber",
                    title: '门诊号'
                }, {
                    data: "hospitalNumber",
                    title: '住院号'
                }, {
                    data: "rowDate",
                    title: '日期'
                }];
                for (var i = 3; i < result.length; i++) {
                    columns.push({
                        data: "filed" + (i - 2),
                        title: result[i]
                    });
                }

                columns.push({
                    data: "id",
                    title: "操作",
                    sWidth: 80,
                    sClass: "table_center",
                    visible: false,
                    "render" : function (data, type, full, meta) {
                        var str = "<button style='display: none' class='btn btn-info btn-xs editScale' type='button' onclick=\"edit('"+ data + "')\"><i class='fa fa-edit'></i> 编辑</button>  ";
                        return str;
                    }
                });

                if (table) {
                    table.destroy();    //清空数据
                    table.clear();         //销毁datatable
                    table=null;
                    //删除dom中的标签片段
                    $("#table_list").html("");
                }

                table = $('#table_list').dataTable({
                    destroy: true,    //初始化表格,
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
                    searching: false,//搜索框,
                    scrollX: true, //开启水平滚动条
                    aLengthMenu: [10, 20, 50],  //更改显示记录数选项
                    iDisplayLength: 10, //默认显示的记录数  
                    iDisplayStart: 0,  //当开启分页的时候，定义展示的记录的起始序号，不是页数，因此如果你每个分页有10条记录而且想从第三页开始，需要把该参数指定为20
                    ajax: function (data, callback, setting) {
                        var param = {};
                        param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
                        param.start = data.start;//开始的记录序号
                        param.page = (data.start / data.length) + 1;//当前页码
                        param.draw = data.draw;
                        param.scaleType= $("#scaleType_s").val();
                        param.rowDate= $("#rowDate_s").val();
                        param.patientNumber= $("#patientNumber_s").val();
                        // param.diseaseType= $("#diseaseType_s").val();
                        // param.patientGender= $("#patientGender_s").val();
                        // param.diagnose= $("#diagnose_s").val();
                        // param.birthday= $("#birthday_s").val();
                        // param.dimensions= $("#dimensions_s").val();
                        $.ajax({
                            url: "scale/list",
                            type: 'get',
                            cache: false,
                            data: param,
                            dataType: "json",
                            success: function (res) {
                                callback(res)
                            }
                        })
                    }, //请求资源路径
                    columns: columns,
                    columnDefs: [{
                        targets: 0,
                        "orderable": false
                    }],
                }).api();

                table.on('draw', function () {
                    $('td').css("vertical-align", "middle");

                    var col = 0; // 多余列
                    if (typeof editScaleShow != 'undefined' && editScaleShow instanceof Function) {
                        var column = table.column(-1);
                        column.visible(true, false);
                        editScaleShow();
                        col = 1;
                    }

                    $('#table_list .dataTables_empty').attr('colspan', columns.length + col);
                    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
                });

                //$('#table_list .dataTables_empty').attr('colspan', columns.length);

                $("#table_list th:first").removeClass("sorting_asc");
                $(".container-fluid").css("padding", "0px");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Alert("", textStatus);
            }
        });
    } else {
        Alert("", "请先选择量表类型!");
    }
}

function reload() {
    if ($("#scaleType_s").val()) {
        $('#table_list').dataTable().fnReloadAjax();
    } else {
        Alert("", "请先选择量表类型!");
    }
}

function edit(id) {
    $('.modal-title').text("编辑量表");
    $('#myModal').modal('show');
    if (v) {
        v.resetForm();
        $(".error").removeClass("error");
    }
    initEditData(id);
    //window.location.href = "scale/update?id=" + id + "&scaleType=" + $("#scaleType").val();
}