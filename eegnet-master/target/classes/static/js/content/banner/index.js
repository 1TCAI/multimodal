var currentInformation, currentInformationId;
$(document).ready(function () {

    $('.chosen-select').chosen({width: "100%"});

    bindData();

    $("#btn_new").click(function () {
        window.location.href = "banner/update" ;
    });

    $("#btn_check_content").click(function() {
        $(this).attr("data-toggle", "");
        if (!currentInformationId) {
            Alert("", "请选择需要审核的信息！");
        } else {
            if (currentInformation.verify == 0) {
                $('#verifyDetail').html('');
                $.post('banner/selectById',{id : currentInformationId},
                    function(result) {
                        if (result.data) {
                            var data = result.data;
                            $('#verifyDetail').append('<img width="100%" src="' + data.imgUrl + '"/>');
                            $('#verifyDetail').append('<br><br>点击地址:' + verifyUrlFmatter(data.clickUrl));
                        }
                    });
                $(this).attr("data-toggle", "modal");
            } else {
                Alert("", "此条信息已审核");
            }
        }
    });

    $("#btn_verify_save").click(function() {
        // Confirm("确定已审核完成？", function() {
            var l = $("#btn_verify_save").ladda();
            l.ladda('start');
            $.ajax({
                type : "POST",
                url : "banner/setVerify",
                dataType : "json",
                data : {id: currentInformationId, verify: 1},
                success : function(result) {
                    if (result.code) {
                        $("#btn_verify_cancel").click();
                        reload();
                        Alert("", "操作成功!", "success");
                    } else {
                        Alert("", "操作失败!", "error");
                    }
                    l.ladda('stop');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Alert("", textStatus, "error");
                    l.ladda('stop');
                }
            });
        // });
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
        aLengthMenu: [10, 20, 50],  //更改显示记录数选项
        iDisplayLength: 10, //默认显示的记录数  
        iDisplayStart: 0,  //当开启分页的时候，定义展示的记录的起始序号，不是页数，因此如果你每个分页有10条记录而且想从第三页开始，需要把该参数指定为20
        ajax: function (data, callback, setting) {
            var param = {};
            param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length) + 1;//当前页码
            param.draw = data.draw;
            param.type= $("#type").val();
            param.title= $("#title").val();
            $.ajax({
                url: "/content/banner/list",
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
            data: "verify",
            title: '审核状态',
            "render" : function (verify, type, full, meta) {
                return verifyFmatter(verify);
            }
        }, {
            data: "type",
            title: '类型',
            "render" : function (s, type, full, meta) {
                var tnStr = '';
                switch (s) {
                    case 0:
                        tnStr = '主页';
                        break;
                    default:
                        tnStr = '未知';
                        break;
                }
                return tnStr;
            }
        }, {
            data: "title",
            title: '标题',
        }, {
            data: "sequence",
            title: '序号',
        }, {
            data: "description",
            title: '描述',
        }, {
            data: "clickUrl",
            title: '点击链接',
            "render" : function (clickUrl, type, full, meta) {
                return urlFmatter(clickUrl);
            }
        }, {
            data: "imgUrl",
            title:  '图片',
            "render" : function (imgUrl, type, full, meta) {
                return imgUrlFmatter(imgUrl);
            }
        },{
            data: "id",
            title: "操作",
            sWidth: 130,
            sClass: "table_center",
            visible: false,
            "render" : function (data, type, full, meta) {
                var str = "<button style='display: none' class='btn btn-info btn-xs edit' type='button' onclick=\"editBanner('"+ data + "')\"><i class='fa fa-edit'></i> 编辑</button>  ";
                str = str + "<button style='display: none' class='btn btn-danger btn-xs delete' type='button' onclick=\"deleteBanner('"+ data +"')\"><i class='fa fa-trash'></i> 删除</button>";
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

        $('#table_list .dataTables_empty').attr('colspan', 7 + col);
    });

    $('#table_list tbody').on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $(this).removeClass("font-selected");
            currentInformationId = undefined;
        } else {
            table.$('tr.selected').removeClass("font-selected")
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $(this).addClass('font-selected');
            var data = table.row(this).data();
            currentInformation = data;
            if (data.id) {
                currentInformationId = data.id;
            }
        }
    } );

    $("#table_list th:first").removeClass("sorting_asc");
    $(".container-fluid").css("padding", "0px")
}

function reload() {
    $('#table_list').dataTable().fnReloadAjax();
}

function verifyFmatter(cellvalue) {
    var tnStr = '';
    switch (cellvalue) {
        case 0:
            tnStr = '<span class="label label-warning">未审核</span>';
            break;
        case 1:
            tnStr = '<span class="label label-primary">已审核</span>';
            break;
        default:
            tnStr = '<span class="label">未知</span>'
            break;
    }
    return tnStr;
}

function imgUrlFmatter(cellvalue) {
    if (cellvalue != null && cellvalue != "") {
        return '<img style="width: 100px;height: 50px;" data-toggle="modal" href="#bannerImgModal" src=' + cellvalue + ' onclick=setImgUrl(\'' + cellvalue + '\') />';
    } else {
        return '暂无';
    }
    return cellvalue;
}

function urlFmatter(cellvalue) {
    if (cellvalue != null && cellvalue != "") {
        return '<a target="_blank" style="color:blue; text-decoration:underline;"' + 'href="' + cellvalue + '">点击查看</a>';
    }else {
        return '暂无';
    }
}

function setImgUrl(url) {
    $("#bannerImg").attr("src", url);
}

function editBanner(id) {
    window.location.href = "banner/update?id=" + id;
}

function deleteBanner(id) {
    Confirm("确定要删除该数据?",
        function () {
            $.ajax({
                type: "POST",
                url: 'banner/delete',
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

function verifyUrlFmatter(cellvalue) {
    if (cellvalue != null || cellvalue != "") {
        return '<a target="_blank" style="color:blue; text-decoration:underline;" href="' + cellvalue + '">' + cellvalue + '</a>';
    }
    return cellvalue;
}
