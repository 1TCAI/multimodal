$(document).ready(function () {

    $('.chosen-select').chosen({width: "100%", placeholdertxt: '请选择', placeholder_text_single: '请选择'});

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

    $('#startDate').val(new Date(new Date().getTime() - 6 * 1000 * 60 * 60 * 24).Format("yyyy-MM-dd"));
    $('#endDate').val(new Date().Format("yyyy-MM-dd"));

    initPage();
});

function initPage() {

    $.ajax({
        type: "POST",
        url: " profile/list",
        dataType: "json",
        data: {},
        success: function (result) {
            if (result.code) {
                var data = result.data;

                // 线图
                var lineList = data['lineList'];
                var lineLabels = [], userData = [], courseData = [], videoData = [];
                for (var i = 0; i < lineList.length; i++) {
                    var temp = lineList[i];
                    lineLabels.push(temp.createDate);
                    userData.push(temp.userCount);
                    courseData.push(temp.courseCount);
                    videoData.push(temp.videoCount);
                }

                // 饼图
                var doughnutLabels = [], doughnutData = [];
                var companyUserCount = data['companyUserCount'];
                for (var i = 0; i < companyUserCount.length; i++) {
                    var temp = companyUserCount[i];
                    doughnutLabels.push(temp.companyName);
                    doughnutData.push(temp.userCount);
                }
                var allUserCount = data['allUserCount']; //总人数

                // 柱状图
                var barLabels = [], studyPercentList = [], passPercentList = [];
                var studyAndPassPercent = data['studyAndPassPercent'];
                for (var i = 0; i < studyAndPassPercent.length; i++) {
                    var temp = studyAndPassPercent[i];
                    barLabels.push(temp.companyName);

                    if (isNaN(temp.studyNumber / temp.couserAndUserNumber)) {
                        studyPercentList.push(0);
                    } else {
                        studyPercentList.push(temp.studyNumber / temp.couserAndUserNumber);
                    }
                    if (isNaN(temp.passNumber / temp.unPassandpassCount)) {
                        passPercentList.push(0);
                    } else {
                        passPercentList.push(temp.passNumber / temp.unPassandpassCount);
                    }
                }
                batChart(barLabels, studyPercentList, passPercentList);

                lineChart(lineLabels, userData, courseData, videoData);

                doughnutChart(doughnutLabels, doughnutData, allUserCount);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Alert("", textStatus, "error");
        }
    });

}

function lineChart(labels, userData, courseData, videoData) {

    $('#lineChart').remove();
    $('#lineChartDiv').html('<canvas id="lineChart" height="140"></canvas>');

    var lineData = {
        labels: labels,
        datasets: [

            {
                label: "用户总数",
                backgroundColor: '#9c4153',
                borderColor: "#9c4153",
                fill: false,
                pointBackgroundColor: "#9c4153",
                pointBorderColor: "#fff",
                borderWidth: 2,
                data: userData
            }, {
                label: "课程总数",
                backgroundColor: '#93ddac',
                borderColor: "#93ddac",
                borderWidth: 2,
                fill: false,
                pointBackgroundColor: "#93ddac",
                pointBorderColor: "#fff",
                data: courseData
            }, {
                label: "视频浏览数",
                backgroundColor: '#ff6783',
                borderColor: "#ff6783",
                borderWidth: 2,
                fill: false,//隐藏背景色
                pointBackgroundColor: "#ff6783",
                pointBorderColor: "#fff",
                data: videoData
            }
        ]
    };

    var lineOptions = {
        responsive: true,
        // showScale: true,
        options: {
            elements: {
                line: {
                    tension: 0 // 禁用贝塞尔曲线
                }
            }
        }
    };

    var ctx = document.getElementById("lineChart").getContext("2d");
    new Chart(ctx, {type: 'line', data: lineData, options: lineOptions});
}

function doughnutChart(labels, companyData, allUserCount) {

    $('#doughnutChart').remove(); // this is my <canvas> element
    $('#doughnutChartDiv').html('<canvas id="doughnutChart" height="140"></canvas>');

    var doughnutData = {
        labels: labels,
        datasets: [{
            data: companyData,
            backgroundColor: getColorArr(labels.length, 0.5)
        }]
    };


    var doughnutOptions = {
        responsive: true,
        tooltips: {//转为百分比
            callbacks: {
                label: function (tooltipItem, data) {

                    var label = data.labels[tooltipItem.index] || '';

                    if (label) {
                        label += ': ';
                    }

                    label = label + data.datasets[0].data[tooltipItem.index] + "，";
                    var count = data.datasets[0].data[tooltipItem.index];
                    var persent = '';
                    if (isNaN(count / allUserCount)) {
                        persent = 0 + '%';
                    } else {
                        persent = ((count / allUserCount).toFixed(2) * 100).toFixed(0) + '%';
                    }

                    label += persent;

                    return label;
                }
            }
        },
        // animation: {
        //     // duration: 1,
        //     onComplete: function () {
        //         var chartInstance = this.chart, ctx = chartInstance.ctx;
        //         var i, len;
        //         var x = 0;
        //         var y = 0;
        //         var count = 0;
        //
        //         ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
        //         ctx.textBaseline = 'bottom';
        //
        //         this.data.datasets.forEach(function (dataset, i) {
        //             var meta = chartInstance.controller.getDatasetMeta(i);
        //             var arc = meta.data[i];
        //             var objLt10 = 0;//object less than 5%
        //             var total = eval(dataset.data.join("+"));
        //
        //             meta.data.forEach(function (arc, index) {
        //                 var data = dataset.data[index];
        //                 var textshift = 0;
        //                 if (data != 0) {
        //
        //                     var chartCenterX = arc._model.x;
        //                     var chartCenterY = arc._model.y;
        //                     var arcCenter = calc(arc._model.startAngle, arc._model.endAngle, arc._model.outerRadius * 1.1, arc._model.innerRadius, chartCenterX, chartCenterY);
        //
        //
        //                     if (arc._model.circumference < 0.628) {
        //                         ctx.textBaseline = 'bottom';
        //
        //                         objLt10++;
        //
        //                         ctx.font = "14px Arial";
        //                         ctx.fillStyle = arc._model.backgroundColor;
        //                         if (objLt10 <= 10) {
        //                             ctx.textAlign = 'left';
        //                             blockx = 10;
        //                             cx = 60;
        //                             cy = chartCenterY + arc._model.outerRadius + 20 - objLt10 * 25;
        //                             text = '██ ' + Math.round(data * 100 / total) + '%';
        //
        //                         } else {
        //                             ctx.textAlign = 'right';
        //                             cx = arc._model.x * 2 - 60;
        //                             blockx = arc._model.x * 2 - 10;
        //                             cy = chartCenterY + arc._model.outerRadius + 20 - (objLt10 - 10) * 25;
        //                         }
        //                         ctx.fillText(text, blockx, cy);
        //                         ctx.fillStyle = "#006080";
        //                         ctx.fillText(arc._model.label, cx, cy);// + ' ' + data + '人'
        //
        //                     } else if (arc._model.circumference < 0.628) {
        //
        //                         var textStart = calc(arc._model.startAngle, arc._model.endAngle, arc._model.outerRadius * 1.1, arc._model.outerRadius, chartCenterX, chartCenterY);
        //                         var lineStart = calc(arc._model.startAngle, arc._model.endAngle, arc._model.outerRadius, arc._model.outerRadius * 0.8, chartCenterX, chartCenterY);
        //                         var textCenterX = textStart.x;
        //                         var textCenterY = textStart.y;
        //                         if (textCenterY > arc._model.y + arc._model.outerRadius - 20) {
        //                             textCenterY = arc._model.y + arc._model.outerRadius - 20;
        //                             textCenterX = textStart.x > arcCenter.x ? textStart.x + 50 + textshift : textStart.x - 50 - textshift;
        //                             textshift = 50;
        //
        //                         } else if (textCenterY < arc._model.y - arc._model.outerRadius + 20) {
        //                             textCenterY = arc._model.y - arc._model.outerRadius + 20;
        //                             textCenterX = textStart.x > arcCenter.x ? textStart.x + 50 + textshift : textStart.x - 50 - textshift;
        //                             textshift = 50;
        //
        //                         } else {
        //                             textCenterX = textStart.x > arcCenter.x ? textCenterX + textshift : textCenterX - textshift;
        //                             textshift = 0;
        //                         };
        //
        //                         ctx.strokeStyle = arc._model.backgroundColor;
        //                         ctx.beginPath();
        //                         ctx.moveTo(lineStart.x, lineStart.y);
        //                         ctx.lineTo(textCenterX, textCenterY > chartCenterY ? textCenterY + 13 : textCenterY);
        //                         ctx.lineTo(textCenterX + (textStart.x > arcCenter.x ? 50 : -50), textCenterY > chartCenterY ? textCenterY + 13 : textCenterY);
        //                         ctx.stroke();
        //                         ctx.font = "16px Arial";
        //
        //                         ctx.textAlign = textStart.x > arcCenter.x ? 'left' : 'right';
        //                         ctx.textBaseline = 'bottom';
        //                         ctx.fillStyle = "#006080";
        //                         ctx.fillText(arc._model.label, // + ' ' + data  + '人'
        //                             textCenterX, textCenterY > chartCenterY ? textCenterY + 13 : textCenterY);
        //
        //                         ctx.textAlign = 'center';
        //                         ctx.textBaseline = 'middle';
        //                         ctx.fillStyle = "#006080";
        //                         // ctx.fillStyle = getColorArr(1, 0.5)[0];
        //                         ctx.fillText(Math.round(data * 100 / total) + '%',
        //                             arcCenter.x, arcCenter.y);
        //                     } else if (arc._model.circumference >= 0.628) {
        //                         var arcCenterX = arcCenter.x;
        //                         var arcCenterY = arcCenter.y;
        //                         ctx.font = "20px Arial";
        //                         ctx.textAlign = 'center';
        //                         ctx.textBaseline = 'bottom';
        //
        //                         // ctx.fillStyle = getColorArr(1, 0.5)[0];
        //                         ctx.fillStyle = "#006080";
        //                         ctx.fillText(Math.round(data * 100 / total) + '%', arcCenterX, arcCenterY < chartCenterY ? arcCenterY + 15 : arcCenterY - 5);
        //                         ctx.font = "16px Arial";
        //
        //                         ctx.fillText(arc._model.label,// + ' ' + data + '人'
        //                             arcCenterX, arcCenterY >= chartCenterY ? arcCenterY + 15 : arcCenterY - 5);
        //                     }
        //                 }
        //             });
        //         });
        //     }
        // }
    };
    var ctx4 = document.getElementById("doughnutChart").getContext("2d");
    new Chart(ctx4, {type: 'doughnut', data: doughnutData, options: doughnutOptions});
}

function calc(startAngle, endAngle, outerRadius, innerRadius, x, y) {
    var centreAngle = startAngle + ((endAngle - startAngle) / 2);
    var rangeFromCentre = (outerRadius - innerRadius) / 2 + innerRadius;
    return {
        x: x + (Math.cos(centreAngle) * rangeFromCentre),
        y: y + (Math.sin(centreAngle) * rangeFromCentre)
    }
};

function batChart(labels, studyPercentList, passPercentList) {

    $('#barChart').remove(); // this is my <canvas> element
    $('#barChartDiv').html('<canvas id="barChart" height="140"></canvas>');

    var barData = {
        labels: labels,
        datasets: [
            {
                display: false,
                label: "学习率",
                // backgroundColor: getColorArr(labels.length, 0.5),
                backgroundColor: "#c0b77d",
                borderWidth: 1,
                pointBorderColor: "#c0b77d",
                data: studyPercentList
            },
            {
                display: false,
                label: "通过率",
                // backgroundColor: getColorArr(labels.length, 0.5),
                backgroundColor: "#c04d52",
                borderWidth: 1,
                pointBorderColor: "#c04d52",
                data: passPercentList
            }
        ]
    };

    var barOptions = {
        responsive: true,
        hover: {
            animationDuration: 0  // 防止鼠标移上去，数字闪烁
        },
        title: {                          //图表标题
            display: false,                //是否显示
            position: 'left',            //标题位置
            text: '',                    //标题名
            fontColor: '',                //标题颜色
            fontFamily: '',                //标题字体格式
            fontSize: 10,                  //字体大小
            text: 'hello'
        },
        tooltips: {//x轴转为百分比
            callbacks: {
                label: function (tooltipItem, data) {

                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += (tooltipItem.yLabel.toFixed(2) * 100).toFixed(0) + '%';

                    return label;
                }
            }
        },
        animation: {// 这部分是数值显示的功能实现
            onComplete: function () {
                var chartInstance = this.chart, ctx = chartInstance.ctx;
                // 以下属于canvas的属性（font、fillStyle、textAlign...）
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                ctx.fillStyle = "black";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    meta.data.forEach(function (bar, index) {
                        var data = (dataset.data[index].toFixed(2) * 100).toFixed(0) + "%";
                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                    });
                });
            }
        },
        scales: {

            yAxes: [{
                ticks: {
                    callback: function (label, index, labels) {
                        return label.toFixed(2) * 100 + '%';
                    },
                    beginAtZero: 0,
                    max: 1,
                    min: 0,
                    stepSize: 0.2
                },
                scaleLabel: {
                    display: false,
                    labelString: '视频观看率',
                },
                gridLines: {
                    display: true
                }
            }
            ]
        }
    };

    var ctx2 = document.getElementById("barChart").getContext("2d");
    new Chart(ctx2, {type: 'bar', data: barData, options: barOptions});
}

// 功能 返回随机的颜色值
// @param opacity 透明度
// @return rgba格式颜色值
var dynamicColors = function (opacity) {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var a = opacity;
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};

// 功能 返回rgba格式颜色数组
// @param length 数组的长度
// @param opacity 颜色的透明度
// return 返回rgba数组
var getColorArr = function (length, opacity) {
    var colorArr = new Array();
    for (var i = 0; i < length; i++) {
        colorArr.push(dynamicColors(opacity));
    }
    return colorArr;
};

function checkTime() {
    var start = $("#startDate").val();
    var end = $("#endDate").val();
    if (start != '' && end != '' && start > end) {

        Alert("警告", "开始时间不能大于结束时间");
        $("#startDate").val(new Date((Date.parse(end) - 6 * 1000 * 60 * 60 * 24)).Format("yyyy-MM-dd"));
        return;
    }

    var time = (Date.parse(end) - Date.parse(start)) / 1000 / 60 / 60 / 24;
    if (start != '' && end != '' && (time < 6 || time > 30)) {
        Alert("警告", "查询时间最少七天最多31天");
        $("#startDate").val(new Date((Date.parse(end) - 6 * 1000 * 60 * 60 * 24)).Format("yyyy-MM-dd"));
        return;
    }
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function searchLine() {
    var start = $("#startDate").val();
    var end = $("#endDate").val();

    if (!start || !end) {
        Alert("警告", "请输入日期");
        return false;
    }

    $.ajax({
        type: "POST",
        url: " profile/line",
        dataType: "json",
        data: {startDate: start, endDate: end},
        success: function (result) {
            if (result.code) {
                var data = result.data;
                var lineList = data['lineList'];
                var lineLabels = [], userData = [], courseData = [], videoData = [];
                for (var i = 0; i < lineList.length; i++) {
                    var temp = lineList[i];
                    lineLabels.push(temp.createDate);
                    userData.push(temp.userCount);
                    courseData.push(temp.courseCount);
                    videoData.push(temp.videoCount);
                }
                lineChart(lineLabels, userData, courseData, videoData);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Alert("", textStatus, "error");
        }
    });
}