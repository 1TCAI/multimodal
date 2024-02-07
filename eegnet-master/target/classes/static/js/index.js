var fullScreenState = 0;

function fullScreenChange() {
    fullScreenState++;
    fullScreenState % 2 == 1 ? enterFullScreen() : exitFullScreen();
}

function enterFullScreen() {
    if (document.documentElement.RequestFullScreen) {
        document.documentElement.RequestFullScreen();
    }
    //兼容火狐
    // console.log(document.documentElement.mozRequestFullScreen)
    if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    }
    //兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
    if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
    }
    //兼容IE,只能写msRequestFullscreen
    if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullScreen) {
        document.exitFullscreen();
    }
//     		//兼容火狐
//     		console.log(document.mozExitFullScreen)
    if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
//     		//兼容谷歌等
    if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
//     		//兼容IE
    if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

var loop = null;

function doLoop() {
    clearLoop();
    $(".swiper").show();
    $(".search").hide();
    getNextOne();
    loop = setInterval(function () {
        getNextOne();
    }, 6000);
}

function clearLoop() {
    if (loop != null) {
        clearInterval(loop);
        loop = null;
    }
}

var currentId = -1;

function getNextOne() {
    $.ajax({
        type: 'GET',
        url: 'getNextOne?id=' + (currentId),
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
                var rs = data.data;
                if (rs) {
                    $(".swiper .tips").hide();
                    $(".swiper span").show();
                    $("#col1").text(rs['crnumber']);
                    $("#col2").text(rs['coen']);
                    $("#col3").text(rs['cocn']);
                    currentId = rs["id"];
                } else {
                    currentId = -1;
                    $(".swiper span").hide();
                    $(".swiper .tips").show();
                    clearLoop();
                }
            } else {
                currentId = -1;
                alert(data.msg);
            }
        }
    });
        }

        function search() {
            var keywords = prompt("请输入您要搜索的关键字", "");
            if (keywords) {
                keywords = keywords.trim();
                if (keywords.length > 0) {
            clearLoop();
            $(".swiper").hide();
            $(".search").show();
            $.ajax({
                type: 'post',
                url: 'search',
                data: {keywords: keywords},
                dataType: 'json',
                success: function (data) {
                    if (data.code == 0) {
                        var rs = data.data;
                        if (rs && rs.length > 0) {
                            var html = "";
                            for (var i = 0; i < rs.length; i++) {
                                html += "<tr>";
                                html += "<td>" + rs[i]['id'] + " </td>";
                                html += "<td>" + rs[i]['coen'] + " </td>";
                                html += "<td>" + rs[i]['cocn'] + " </td>";
                                html += "<td>" + rs[i]['crnumber'] + " </td>";
                                html += "<td>" + rs[i]['cono'] + " </td>";
                                html += "</tr>";
                            }
                            $(".search tbody").html(html);
                        } else {
                            $(".search tbody").html("<tr><td colspan='5' style='font-size: 30px;'>没有搜索到结果!</td></tr>");
                        }
                    } else {
                        alert(data.msg);
                    }
                }
            });
        }
    }
}
