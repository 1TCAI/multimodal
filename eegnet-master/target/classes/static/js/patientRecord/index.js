var currentInformation, currentInformationId;
$(document).ready(function () {

    $('#div_birthday').datepicker({
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
        $('.modal-title').text("添加被试资料");
        initEditData(undefined);
        $("#mainForm")[0].reset();
        if (v) {
            v.resetForm();
            $(".error").removeClass("error");
        }
        $('#myModal').modal('show');
        // window.location.href = "patientRecord/update" ;
    });

    $("#btn_export").click(function () {
        var diseaseType = $("#diseaseType").val();
        var patientGender = $("#patientGender").val();
        var diagnose = $("#diagnose").val();
        var birthday = $("#birthday").val();
        var dimensions = $("#dimensions").val();
        var patientNumber = $("#patientNumber").val();
        // var hospitalNumber = $("#hospitalNumber").val();
        window.open('patientRecord/exportExcel?diseaseType=' + diseaseType
            + '&patientGender=' + patientGender
            + '&diagnose=' + diagnose
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
        searching: false,//搜索框
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
            param.diseaseType = $("#diseaseType").val();
            param.patientGender = $("#patientGender").val();
            param.diagnose = $("#diagnose").val();
            param.birthday = $("#birthday").val();
            param.dimensions = $("#dimensions").val();
            param.patientNumber = $("#patientNumber").val();
            // param.hospitalNumber = $("#hospitalNumber").val();
            $.ajax({
                url: "patientRecord/list",
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
            data: "patientGender",
            title: '性别',
            "render": function (s, type, full, meta) {
                var tnStr = '';
                switch (s) {
                    case 0:
                        tnStr = '女';
                        break;
                    case 1:
                        tnStr = '男';
                        break;
                    default:
                        tnStr = '未知';
                        break;
                }
                return tnStr;
            }
        }, {
            data: "birthday",
            title: '出生日期'
        }, {
            data: "education",
            title: '文化程度',
            "render": function (s, type, full, meta) {
                var tnStr = '';
                switch (s) {
                    case 1:
                        tnStr = '文盲';
                        break;
                    case 2:
                        tnStr = '小学';
                        break;
                    case 3:
                        tnStr = '初中';
                        break;
                    case 4:
                        tnStr = '中专';
                        break;
                    case 5:
                        tnStr = '高中';
                        break;
                    case 6:
                        tnStr = '大专';
                        break;
                    case 7:
                        tnStr = '本科';
                        break;
                    case 8:
                        tnStr = '硕士';
                        break;
                    case 9:
                        tnStr = '博士';
                        break;
                    default:
                        tnStr = '未知';
                        break;
                }
                return tnStr;
            }
        }, {
            data: "phone",
            title: '联系电话'
        }, {
            data: "from",
            title: '来源'
        }, {
            data: "bedNumber",
            title: '病床号'
        }, {
            data: "diseaseType",
            title: '疾病类型'
        }, {
            data: "diagnose",
            title: '诊断'
        }, {
            data: "dimensions",
            title: '严重程度',
            "render": function (data, type, full, meta) {
                var tnStr;
                switch (data) {
                    case 1:
                        tnStr = '一级';
                        break;
                    case 2:
                        tnStr = '二级';
                        break;
                    case 3:
                        tnStr = '三级';
                        break;
                    case 4:
                        tnStr = '四级';
                        break;
                    case 5:
                        tnStr = '五级';
                        break;
                    default:
                        tnStr = '未知'
                        break;
                }
                return tnStr;
            }
        }, {
            data: "outDiagnose",
            title: '出院诊断'
        }, {
            data: "createDate",
            title: '创建时间'
        }, {
            data: "isDeleted",
            title: '删除',
            "render": function (data, type, full, meta) {
                return statusFmatter(full);
            }
        }, {
            data: "id",
            title: "操作",
            sWidth: 140,
            sClass: "table_center",
            visible: false,
            "render": function (data, type, full, meta) {
                var str = "<button class='btn btn-info btn-xs details' type='button' onclick=\"lookDetail('" + meta.row + "')\"><i class='fa fa-info'></i> 查看详细</button>  ";
                str = str + "<button style='display: none' class='btn btn-info btn-xs edit' type='button' onclick=\"editPatientRecord('" + data + "')\"><i class='fa fa-edit'></i> 编辑</button>  ";
                str = str + "<button style='display: none' class='btn btn-danger btn-xs delete' type='button' onclick=\"deletePatientRecord('" + data + "')\"><i class='fa fa-trash'></i> 删除</button>";
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

        $('#table_list .dataTables_empty').attr('colspan', 14 + col);
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });

    $("#table_list th:first").removeClass("sorting_asc");
    $(".container-fluid").css("padding", "0px")
}

/**
 * 查看病人详细
 * @param data
 */
function lookDetail(row){
    var data= $('#table_list').DataTable().rows(row).data()[0];
    console.log(data)
    console.log(data.id)
    console.log(data.patientNumber)
    window.location.href = "dashboard/peopleDetailed?id=" + data.id + "&patientNumber=" + data.patientNumber;
}

function reload() {
    $('#table_list').dataTable().fnReloadAjax();
}

function editPatientRecord(id) {
    $('.modal-title').text("编辑被试资料");
    $('#myModal').modal('show');
    if (v) {
        v.resetForm();
        $(".error").removeClass("error");
    }
    initEditData(id);
    // window.location.href = "patientRecord/update?id=" + id;
}

function deletePatientRecord(id) {
    Confirm("确定要删除该数据?",
        function () {
            $.ajax({
                type: "POST",
                url: 'patientRecord/delete',
                dataType: "json",
                data: {id: id},
                success: function (result) {
                    if (result.code) {
                        Alert("", "删除成功!", "success");
                        reload();
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

function abledVehicel( id) {

    $.ajax({
        type: "POST",
        url: 'patientRecord/updateStatus',
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
                url: 'patientRecord/updateStatus',
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

/*根据出生日期算出年龄*/
function getAge(strBirthday) {
    var returnAge;
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
        returnAge = 0;//同年 则为0岁
    } else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                var monthDiff = nowMonth - birthMonth;//月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }

    return returnAge;//返回周岁年龄

}
