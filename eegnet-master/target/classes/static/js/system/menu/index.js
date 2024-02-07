var roleName = $("#loginUserName").text();
var removeBtn = roleName == "root" ? true : false;
const setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    check: {
        enable: true,
        chkboxType: {"Y": "ps", "N": "ps"}
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    edit: {
        enable: true,
        editNameSelectAll: true,
        showRemoveBtn: removeBtn,
        showRenameBtn: true,
        renameTitle: "重命名菜单",
        removeTitle: "删除菜单"
    },
    callback: {
        onCheck: zTreeOnCheck,
        onDrop: zTreeOnDrop,
        beforeRemove: beforeRemove,
        onRename: renameTitle,
        onClick: zTreeOnClick
        // onRemove: onRemove
    }

};

function zTreeOnClick(event, treeId, treeNode) {
    // let detail = "ID:" + treeNode.id + "<br/>菜单名：" + treeNode.name + "<br/>URL：" + treeNode.data.url + "<br/>";
    let detail = "<li><i style='margin-right: 8px;' class='fa fa-life-ring'></i>ID: " + treeNode.id + "</li><li><i style='margin-right: 6px;' class='fa fa-picture-o'></i>菜单名: " + treeNode.name + "</li><li><i style='margin-right: 10px;' class='fa fa-share-alt'></i>URL: " + treeNode.data.url + "</li>"
    //添加编辑按钮
    detail = detail + "<div style='margin-top: 20px;text-align: right;padding-right: 25px;'><button id=\"updateMenuBtn\" " +
        "style=\"border:none;padding:5px 8px;background:#3da5fb;color:#fff;border-radius: 5px;\">\n" +
        "保存\n" +
        "</button></div>"
    $("#treedetail").html(detail);
};

function beforeRemove(treeId, treeNode) {
    //console.log("[ " + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.selectNode(treeNode);
    let pid = treeNode.pid;
    let text, title;
    if (pid == 0) {
        title = "确定要删除父菜单[" + treeNode.name + "]?";
        text = "该节点为父节点，删除后子节点也会全部删除，请谨慎操作!";
    } else {
        text = "删除后将不能恢复，请谨慎操作!";
        title = "确定要删除菜单[" + treeNode.name + "]?";
    }
    swal({
        title: title,
        text: text,
        icon: "warning",
        buttons: {
            "取消": true,
            delete: {
                text: "删除",
                value: "delete",
            },
        },
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete === "delete") {
        removeMenu(treeId, treeNode);
    }
});
    //return false  阻止默认删除事件
    return false;
}

function removeMenu(treeId, treeNode) {
    console.log("[ " + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    $.ajax({
        type: "POST",
        url: "manage/deleteMenu.json",
        dataType: "json",
        data: {
            resourceId: treeNode.id
        },
        async: true,
        success: function (data) {
            if (data.success == true) {
                swal("菜单[" + treeNode.name + "]删除成功", {
                    icon: "success",
                });
                let zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.removeNode(treeNode);
                reSetTree();
            }
        }
    });


}


var zNodes = new Array();
var sourceData;

function getNode(isRefresh) {
    zNodes.splice(0, zNodes.length);
    $.ajax({
        type: "GET",
        url: "manage/menuList.json",
        dataType: "json",
        success: function (data) {
            sourceData = data;
            // 排序
            data.data.sort(function (a, b) {
                return a.resorder - b.resorder;
            })
            $.each(data.data, function (index, value) {
                if (value.parentId == null)
                    value.parentId = 0;
                var flage = true;
                if (value.enable == 1) {
                    flage = true;
                } else {
                    flage = false;
                }
                var node = {
                    id: value.id,
                    pId: value.parentId,
                    name: value.name,
                    checked: flage,
                    order: value.resorder,
                    data: value
                }
                zNodes.push(node);
                initzTree();
            });

        }
    });
}

$(document).ready(function () {
    $("#expandAllBtn").click(function () {
        let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        let status = $("#expandAllBtn").attr("expand");
        treeObj.expandAll(status == 'false' ? true : false);
        $("#expandAllBtn").text(status == 'false' ? "关闭所有" : "展开所有")
        $("#expandAllBtn").attr("expand", status == 'false' ? "true" : "false")

    });

    $("#addFirstLevel").click(function () {
        var d = dialog({
            title: '消息',
            content: "<form><label>名称:</label><input class='form-control' type='text' id='newNodeName' name='name'><label>菜单图标:</label><input class='form-control' type='text' id='newNodeIcon' name='icon' value='fa fa-bus'><label>是否显示:</label><input id='newNodeEnable' type='checkbox' name='enable'></form>",
            okValue: '确定',
            ok: function () {
                var checked = 0;
                if ($("#newNodeEnable").is(':checked') == true) {
                    checked = 1;
                } else {
                    checked = 0;
                }
                $.ajax({
                    url: "manage/insertMenu",
                    data: {
                        url: "",
                        level: 0,
                        name: $("#newNodeName").val(),
                        parentId: 0,
                        resorder: 1,
                        enable: checked,
                        icon: $("#newNodeIcon").val()
                    },
                    type: 'post',
                    async: true,
                    success: function (data) {
                        if (data.data == -88) {
                            swal("提醒", "菜单已经存在!!", "error")
                        } else {
                            reSetTree();
                        }
                    },
                    error: function () {
                    }
                })
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                // zTree.addNodes(treeNode, {id: $("#newNodeOrder").val(), pId: treeNode.id, name: $("#newNodeName").val()});
            },
            cancelValue: '取消',
            cancel: function () {

            },
            // statusbar: '<label><input type="checkbox">不再提醒</label>'
        });
        d.show();
        return false;
    });
    getNode(false);
});

function initzTree() {
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
}

function refreshTree() {
    let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    treeObj.reAsyncChildNodes(null, "refresh");
}

// 添加一级菜单


// 鼠标滑入节点
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    // $("#" + treeNode.tId + "_remove").css("display", "none");
    // 新节点排在最后
    var newNodeOrder = 1;
    sourceData.data.forEach(function (item, index, array) {
        if (item.parentId == treeNode.id) {
            newNodeOrder = newNodeOrder + 1;
        }
    })
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        var d = dialog({
            title: '消息',
            content: "<form><label>地址:</label><input class='form-control' type='text' id='newNodeUrl' name='url'><label>名称:</label><input class='form-control' type='text' id='newNodeName' name='name'><label>是否显示:</label><input id='newNodeEnable' type='checkbox' name='enable'></form>",
            okValue: '确定',
            ok: function () {
                var checked = 0;
                if ($("#newNodeEnable").is(':checked') == true) {
                    checked = 1;
                } else {
                    checked = 0;
                }
                $.ajax({
                    url: "manage/insertMenu",
                    data: {
                        url: $("#newNodeUrl").val(),
                        level: treeNode.level + 1,
                        name: $("#newNodeName").val(),
                        parentId: treeNode.id,
                        resorder: newNodeOrder,
                        enable: checked
                    },
                    type: 'post',
                    async: true,
                    success: function (data) {
                        if (data.data == -88) {
                            swal("提醒", "菜单已经存在!!", "error")
                        } else {
                            reSetTree();
                        }
                        reSetTree();
                    },
                    error: function () {

                    }
                })
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.addNodes(treeNode, {
                    id: $("#newNodeOrder").val(),
                    pId: treeNode.id,
                    name: $("#newNodeName").val()
                });
            },
            cancelValue: '取消',
            cancel: function () {

            },
            // statusbar: '<label><input type="checkbox">不再提醒</label>'
        });
        d.show();
        return false;
    });
};

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};

// 勾选树节点
function zTreeOnCheck(event, treeId, treeNode) {
    var flage;
    if (treeNode.checked == false) {
        flage = 0;
    } else {
        flage = 1;
    }
    $.ajax({
        url: "manage/updateMenuEnable",
        data: {
            id: treeNode.id,
            enable: flage
        },
        type: 'post',
        async: true,
        success: function (data) {

        }
    })
}

// 编辑节点名称
function renameTitle(event, treeId, treeNode, isCancel) {
    $.ajax({
        url: "manage/updateMenuName",
        data: {
            id: treeNode.id,
            name: treeNode.name
        },
        type: 'post',
        async: true,
        success: function (data) {

        }
    })
}

// 拖拽后排序
function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
    var liEle = $(event.target).parent("li");
    if (liEle.length == 0) {
        liEle = $(event.target).parent("a").parent("li");
    }
    var pId;
    var str = "";
    var order = 1;
    if (targetNode == null) {
        return;
    }
    if ((treeNodes[0].isParent && targetNode.isParent) || (!treeNodes[0].isParent && !targetNode.isParent)) {
        if (treeNodes[0].pId == null) {
            pId = 0;
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = zTree.getNodes();
            nodes.forEach(function (item, index, array) {
                if (item.isParent) {
                    str = str + item.data.id + "," + item.data.parentId + "," + order++ + "," + item.data.level + ";";
                }
            });
        } else {
            pId = treeNodes[0].pId
            // liEle.parent("ul").children("li").each(function (num, ele) {
            //     // treeNodes[0].data.data.forEach(function (item, index, array) {
            //     //     if (pId == item.parentId) {
            //     //         if (item.name == $(ele).children("a").children(".node_name").text()) {
            //     //             order = order + 1;
            //     //             str = str + item.id + "," + item.parentId + "," + order + "," + item.level + ";";
            //     //         }
            //     //     }
            //     // })
            //     if (pId == treeNodes[0].data.parentId) {
            //         if (treeNodes[0].data.name == $(ele).children("a").children(".node_name").text()) {
            //             // order = order + 1;
            //             str = str + treeNodes[0].data.id + "," + treeNodes[0].data.parentId + "," + order + "," + treeNodes[0].data.level + ";";
            //         }
            //     }
            //
            // })
            var pNode = targetNode.getParentNode();
            pNode.children.forEach(function (item, index, array) {
                str = str + item.data.id + "," + item.data.parentId + "," + order++ + "," + item.data.level + ";";
            });
        }
        $.ajax({
            url: "manage/updateMenuOrder",
            data: {
                orders: str
            },
            type: 'post',
            async: true,
            success: function (data) {
                reSetTree();
            }
        })
    }
}

// 树重新加载数据
function reSetTree() {
    getNode(true);
}
