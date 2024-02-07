$(document).ready(function () {
    $("#btn_new").click(function () {
        window.location.href = "resource/update";
    });
    bindData();

    $(window).resize(
        function() {
            $("#table_list").setGridWidth(
                $(".jqGrid_wrapper").width());
        });

});

function bindData() {

    $('#table_list').jqGrid({
        url: 'resource/parentList',
        datatype: "json",
        height: "100%",
        autowidth: true,
        treeGrid: true,
        treeGridModel: 'adjacency',
        colNames : ['id', '资源名称', '类型', '资源链接', '权限标识', '排序', '图标', '操作'],
        colModel : [ {
            name :  'id',
            index : 'id',
            sortable : false,
            hidden : true
        }, {
            name :  'menuName',
            index : 'menuName',
            sortable : false,
            width : 50
        }, {
            name :  'menuType',
            index : 'menuType',
            sortable : false,
            width : 20,
            align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                if (cellvalue == "M") {
                    return '<i class="fa fa-bars" aria-hidden="true">菜单</i>';
                } else {
                    return '<i class="fa fa-dot-circle-o" aria-hidden="true">按钮</i>';
                }
            }
        }, {
            name :  'url',
            index : 'url',
            sortable : false,
            width : 40
        }, {
            name :  'perms',
            index : 'perms',
            sortable : false,
            width : 30
        }, {
            name :  'sequence',
            index : 'sequence',
            sortable : false,
            align: 'center',
            width : 20
        }, {
            name : 'icon',
            index : 'icon',
            sortable : false,
            width : 20,
            align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                return '<i class="' + cellvalue + '" aria-hidden="true"></i>';
            }
        }, {
            name :  '',
            index : '',
            sortable : false,
            width : 20,
            align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                return columnFormatter(rowObject.id);
            }
        }],
        ExpandColClick : true,
        ExpandColumn : "menuName",    //我们显示的节点
        jsonReader: {
            root: "dataRows",       //设定这个参数，有时候也无法正常现实
            repeatitems : false     //不需要再去后台刷新，否则可能有问题，所以最好第一次就加载所有数据
        },
        treeReader : {
            expanded_field : "expanded",
            level_field : "level",
            parent_id_field : "parentId",
            leaf_field : "isLeaf"
        }
    });

}

function editThis(id) {
    window.location.href = "resource/update?id=" + id;
}

function columnFormatter(id) {
    var editThisDisplay = 'none';
    if (editThisFlg) {
        editThisDisplay = '';
    }
    var str = '<button style="display: ' + editThisDisplay + '" class="btn btn-info btn-xs editThis" type="button" onclick="editThis(\'' + id + '\')"><i class="fa fa-edit"></i> 编辑</button>  ';
    //str = str + '<button style="display: ' + editThisDisplay + '" class="btn btn-success btn-xs deleteThis" type="button" onclick="deleteThis(\'' + id + '\')"><i class="fa fa-edit" style="width: 12px;height: 12px"></i> 删除</button>  ';
    return str;
}