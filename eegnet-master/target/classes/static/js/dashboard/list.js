var page = 1,rows = 20, param;
$(document).ready(function () {
    $("#subTitleStrongLi").show();
    $("#subTitleStrong").html("资料列表");
    param = $.urlGet();
    $("#searchText").text(param.search);
    $("#diseaseType_hidden6325").val(param.search);
    // $("#search").on("click", function () {
    //     if ($("#diseaseType_hidden6325").val() == "") {
    //         layer.msg("搜索条件不能为空");
    //         return;
    //     }
    //     searchList(true);
    // })
    searchList(true);
})

function searchList (flage) {
    $.ajax({
        url: "/eeg/getAllData",
        type: 'get',
        data: {
            keyset: $("#diseaseType_hidden6325").val(),
            page: page,
            rows: rows
        },
        dataType: "json",
        success: function (data) {
            setList(data,flage);
        }
    })
}

    function setList (data,flage) {
        $("#excuseTime").text("请求时间(" + data.excuseTime / 1000 + "秒)");
        $("#listCount").text(data.count);
        $("#searchText").text($("#diseaseType_hidden6325").val());
        $("#listContent").html("");
        var listHtml = "";
        data.datas.forEach(function (item, index, array) {
            listHtml += "<div class='listBox' data-id='" + item.id + "' data='" + item.patientNumber + "'><div class='listTitle'>" + item.patientName + "</div><div class='listAddress'>编号:" + item.patientNumber + "</div><div class='listDetailed'>" + item.detail.replace("EEG记录描述:","<br/>EEG记录描述:").replace("治疗前评估:","<br/>治疗前评估:").replace("TMS-EEG记录描述:","<br/>TMS-EEG记录描述:") + "</div></div>"
        })
        $("#listContent").append(listHtml);
        $("#listContent").children(".listBox").on("click", function () {
            var patientNumber = $(this).attr("data");
            var id = $(this).attr("data-id");
            window.location.href = "peopleDetailed?id=" + id + "&search=" + param.search+ "&patientNumber=" + patientNumber;
        })
        if (!flage) {
            return;
        }

        $("#pageUl").html("");
        var pageTotal = Math.ceil(data.count / rows);
        // var pageTotal = 25;
        if (data.count == 0) {
            $(".pageContent").css("border-top","none");
            return;
        } else {
            $(".pageContent").css("border-top","1px dashed #ddd");
        }
        var pageHtml = "";
        for (var i = 1; i <= pageTotal; i++) {
            if (i == 1) {
                pageHtml += "<li class='pageActive pageNum firstPage'>" + i + "</li>";
            } else if (pageTotal > 10 && i == 2) {
                pageHtml += "<li class='ellipsis ellipsisPrev' style='display: none'>···</li>";
                pageHtml += "<li class='pageNum ordinary'>" + i + "</li>";
            } else if (pageTotal > 10 && i == 10) {
                pageHtml += "<li class='ellipsis ellipsisNext'>···</li>";
            } else if (pageTotal > 10 && i > 10 && i < pageTotal) {

            } else if (pageTotal == i) {
                pageHtml += "<li class='pageNum lastPage'>" + i + "</li>";
            } else {
                pageHtml += "<li class='pageNum ordinary'>" + i + "</li>";
            }
        }
        $("#pageUl").append(pageHtml);
        $("#pageUl").prepend("<li class='prev'><i class='fa fa-angle-left' aria-hidden='true'></i></li>");
        $("#pageUl").append("<li class='next'><i class='fa fa-angle-right' aria-hidden='true'></i></li>");
        // 点击页码
        $("#pageUl").children(".pageNum").on("click", function () {
            if (!$(this).hasClass("pageActive")) {
                $(this).addClass("pageActive");
                $(this).siblings(".pageActive").removeClass("pageActive");
            }
            var clickPage = parseInt($(this).text());
            if ($(this).next(".ellipsisNext").length != 0 && $(this).next(".ellipsisNext").css("display") != "none") {
                $(".ellipsisPrev").css("display","block");
                if ((pageTotal - clickPage) <= 8) {
                    $(".ellipsisNext").css("display","none");
                    var n = 0;
                    for (var i = (pageTotal - 8); i < pageTotal; i++) {
                        $("#pageUl").children(".ordinary").eq(n).text(i);
                        if (i == clickPage) {
                            $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                            $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                        }
                        n += 1;
                    }
                } else {
                    var n = 0;
                    for (var i = (clickPage - 1); i <= (clickPage + 7); i++) {
                        $("#pageUl").children(".ordinary").eq(n).text(i);
                        if (i == clickPage) {
                            $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                            $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                        }
                        n += 1;
                    }
                }
            } else if ($(this).prev(".ellipsisNext").length != 0) {
                $(".ellipsisPrev").css("display","block");
                $(".ellipsisNext").css("display","none");
                var n = 0;
                for (var i = (pageTotal - 8); i < pageTotal; i++) {
                    $("#pageUl").children(".ordinary").eq(n).text(i);
                    n += 1;
                }
            } else if ($(this).next(".ellipsisPrev").length != 0) {
                $(".ellipsisPrev").css("display","none");
                $(".ellipsisNext").css("display","block");
                var n = 0;
                for (var i = 2; i <= 10; i++) {
                    $("#pageUl").children(".ordinary").eq(n).text(i);
                    if (i == clickPage) {
                        $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                        $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                    }
                    n += 1;
                }
            } else if ($(this).prev(".ellipsisPrev").length != 0) {
                if ((clickPage - 8) < 1) {
                    $(".ellipsisNext").css("display","block");
                    $(".ellipsisPrev").css("display","none");
                    var n = 0;
                    for (var i = 2; i <= 10; i++) {
                        $("#pageUl").children(".ordinary").eq(n).text(i);
                        if (i == clickPage) {
                            $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                            $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                        }
                        n += 1;
                    }
                } else {
                    $(".ellipsisNext").css("display","block");
                    var n = 0;
                    for (var i = (clickPage - 6); i <= (clickPage + 1); i++) {
                        $("#pageUl").children(".ordinary").eq(n).text(i);
                        if (i == clickPage) {
                            $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                            $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                        }
                        n += 1;
                    }
                }
            }
            page = parseInt($(".pageActive").text());
            searchList(false);
        })
        // 点击下一页
        $("#pageUl").children(".next").on("click", function () {
            var currentPage,currentEle;
            $("#pageUl").children(".pageNum").each(function (index, ele) {
                if ($(ele).hasClass("pageActive")) {
                    currentPage = parseInt($(ele).text());
                    currentEle = ele;
                }
            })
            if ($(currentEle).next(".pageNum").next(".ellipsisNext").length == 0 && $(currentEle).next('.pageNum').next(".ellipsisNext").css("display") != "none" && currentPage != pageTotal) {
                $(currentEle).next(".pageNum").addClass("pageActive");
                $(currentEle).next(".ellipsis").next(".pageNum").addClass("pageActive");
                $(currentEle).removeClass("pageActive");
            } else if ($(".ellipsisNext").css("display") == "none" && currentPage != pageTotal) {
                $(currentEle).next(".pageNum").addClass("pageActive");
                $(currentEle).next(".ellipsis").next(".pageNum").addClass("pageActive");
                $(currentEle).removeClass("pageActive");
            } else if (currentPage == pageTotal) {

            } else {
                $("#pageUl").children(".ellipsisPrev").css("display","block");
                if ((pageTotal - currentPage) <= 8){
                    $("#pageUl").children(".ellipsisNext").css("display","none");
                    var n = 0;
                    for (var i = (pageTotal - 8); i < pageTotal; i++) {
                        $("#pageUl").children(".ordinary").eq(n).text(i);
                        if (i == (currentPage + 1)) {
                            $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                            $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                        }
                        n += 1;
                    }
                } else {
                    var n = 0;
                    for (var i = currentPage; i <= (currentPage + 7); i++) {
                        $("#pageUl").children(".ordinary").eq(n).text(i);
                        if (i == (currentPage + 1)) {
                            $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                            $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                        }
                        n += 1;
                    }
                }
            }
            page = parseInt($(".pageActive").text());
            searchList(false);
        })
        // 点击上一页
        $("#pageUl").children(".prev").on("click", function () {
            var currentPage,currentEle;
            $("#pageUl").children(".pageNum").each(function (index, ele) {
                if ($(ele).hasClass("pageActive")) {
                    currentPage = parseInt($(ele).text());
                    currentEle = ele;
                }
            })
            if ($(currentEle).prev(".pageNum").prev(".ellipsisPrev").length == 0 && $(currentEle).prev('.pageNum').prev(".ellipsisPrev").css("display") != "none" && currentPage != 1) {
                $(currentEle).prev(".pageNum").addClass("pageActive");
                $(currentEle).prev(".ellipsis").prev(".pageNum").addClass("pageActive");
                $(currentEle).removeClass("pageActive");
            } else if ($(".ellipsisPrev").css("display") == "none" && currentPage != 1) {
                $(currentEle).prev(".pageNum").addClass("pageActive");
                $(currentEle).prev(".ellipsis").prev(".pageNum").addClass("pageActive");
                $(currentEle).removeClass("pageActive");
            } else if (currentPage == 1) {

            } else {
                $("#pageUl").children(".ellipsisNext").css("display","block");
                if (currentPage <= 9) {
                    $("#pageUl").children(".ellipsisPrev").css("display","none");
                    var n = 0;
                    for (var i = 2; i < 10; i++) {
                        $("#pageUl").children(".ordinary").eq(n).text(i);
                        if (i == (currentPage - 1)) {
                            $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                            $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                        }
                        n += 1;
                    }
                } else {
                    var n = 0;
                    for (var i = (currentPage - 7); i <= currentPage; i++) {
                        $("#pageUl").children(".ordinary").eq(n).text(i);
                        if (i == (currentPage - 1)) {
                            $("#pageUl").children(".ordinary").eq(n).addClass("pageActive");
                            $("#pageUl").children(".ordinary").eq(n).siblings(".pageActive").removeClass("pageActive")
                        }
                        n += 1;
                    }
                }
            }
            page = parseInt($(".pageActive").text());
            searchList(false);
        })
    }
