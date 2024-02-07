var roleId = '';
var selects = {};
//取roleId
//返回当前 URL 的查询部分（问号 ? 之后的部分）。
var urlParameters = location.search.split('?roleId=');
if (!urlParameters[1]) {
    roleId = ''
} else {
    roleId = urlParameters[1];
}
$(document).ready(function () {

    var widthR = $('#text_remark').width() + 26;

    $('.chosen-select').chosen({width: widthR+'px'});

    $("#jstree1").jstree({
        "core": {
            'data': function (obj, callback) {
                var jsonarray = [];//eval('(' + jsonstr + ')');
                $.ajax({

                    type: "POST",
                    url: '/system/role/getAllMenuAndRoleMenu',
                    dataType: "json",
                    async: false,
                    data: {roleId: roleId},
                    success: function (data) {
                        if (data.code === 1) {
                            var allMenu = data.allMenu;
                            var roleMenu = data.roleMenu;

                            $.each(roleMenu, function (index, arg) {
                                if( arg.isparent == '0'){
                                    selects[arg.menuId] = arg;
                                }
                            });

                            for (var i = 0; i < allMenu.length; i++) {
                                var arr = {
                                    "id": allMenu[i].id,
                                    "parent": allMenu[i].parent,
                                    "text": allMenu[i].text,
                                    "icon": allMenu[i].icon,
                                    // "state": {"opened": false}//"selected": true,
                                }
                                jsonarray.push(arr);
                            }
                        }
                    }
                });
                callback.call(this, jsonarray);
            }
        },
        'plugins': ['checkbox',"wholerow"]
    }).bind("ready.jstree", function () {
        $("#jstree1").jstree("deselect_all", true);
        $.each(selects, function (index, arg) {
            $("#jstree1").jstree('select_node',arg.menuId)
        });
    });

    //用户清单
    bindBusData();

    // $('.grid_tab').on('shown.bs.tab',function(){ //bootstrap时间

    // });

    //保存选中权限
    $('#btn_save').click(function () {
        var l = $("#btn_save").ladda();
        l.ladda('start');

        var ref = $('#jstree1').jstree(true);//获得整个树
        var idArray = ref.get_selected(false);//获得所有选中节点，返回值为数组
        //由于jstree本身方法问题，其在获取所有选中节点时获取不到灰色方框复选框的选中状态，所以通过灰色方框的class属性jstree-undetermined获取其对应的节点id
        $(".jstree-undetermined").each(function () {
            idArray.push($(this).parent().parent().attr('id'));
        });

        var roleName = $('#text_roleName').val();
        var remark = $('#text_remark').val();
        var status = $('#text_status').val();

        if (!roleName || !remark || !status) {
            l.ladda('stop');
            Alert("","请填写后再保存");
            return false;
        }
        $.ajax({
            type: "post",
            url: '/system/role/updateRoleMenu',
            dataType: "json",
            data: {roleId:roleId,roleName: roleName,remark:remark,status:status, idArray: idArray},
            success: function (result) {
                if (result.code === 1) {
                    // Alert("成功", "权限分配成功");
                    l.ladda('stop');
                    sessionStorage.setItem('roleName',roleName);
                    goBack();
                } else {
                    l.ladda('stop');
                    Alert("", "权限分配失败");
                    return false;
                }
            },
        });

    })

    //
    getRoleName();

    // 取消
    $("#btn_cancle").click(function() {
        Confirm("确定要取消编辑？", function() {
            goBack();
        });
    });

    var status = $("#sysRolevalue").val();
    $('#text_status').val(status);
    $("#text_status").val(status).trigger("chosen:updated");
});

function getRoleName(){
    $('#rolenameVal').val()
    var roleName = sessionStorage.getItem('roleName');
    $('#rolenameVal').text("当前角色：" + roleName);
}


function bindBusData() {

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
            param.roleId = roleId;
            $.ajax({
                url: "/system/role/roleUserList",
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
            data: "username",
            title: '用户名'
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
        }],
        columnDefs: [{
            targets: 0,
            "orderable": false
        }],
    }).api();

    $("#table_list th:first").removeClass("sorting_asc");
    $(".container-fluid").css("padding", "0px")
}