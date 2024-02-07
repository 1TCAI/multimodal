$(document).ready(function () {
    var eCharts1 = echarts.init(document.getElementById('eCharts1'));
    var eCharts2 = echarts.init(document.getElementById('eCharts2'));
    var eCharts3 = echarts.init(document.getElementById('eCharts3'));
    var eCharts4 = echarts.init(document.getElementById('eCharts4'));
    echartsLoading([eCharts1,eCharts2,eCharts3,eCharts4]);
    $("#tabType").children("li").on("click", function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings(".active").removeClass("active");
        }
    })
    function echartsLoading(arr) {
        arr.forEach(function (item, index, array) {
            item.showLoading({
                text: "加载中，请稍等"
            })
        })
    }
    // $("#search").on("click", function () {
    //     if ($("#diseaseType").val() != "") {
    //         window.location.href = "/eeg/dashboard/list?search=" + $("#diseaseType").val();
    //     } else {
    //         layer.msg("搜索条件不能为空");
    //     }
    // })
    $.ajax({
        url: "/eeg/getAll",
        type: 'get',
        dataType: "json",
        success: function (data) {
            $("#number1").text(data.patientRecord);
            $("#number2").text(data.eeg);
            $("#number3").text(data.tmsEeg);
            $("#number4").text(data.rTms);
        }
    })
    // 被试资料
    $.ajax({
        url: "/eeg/getPatientRecordData",
        type: 'get',
        dataType: "json",
        success: function (data) {
            setPatient(data,eCharts1,"#41b18f","人数");
        }
    })
    // eeg
    $.ajax({
        url: "/eeg/getEegData",
        type: 'get',
        dataType: "json",
        success: function (data) {
            setPatient(data,eCharts2,"#318bff","EEG记录条数");
        }
    })
    // tms
    $.ajax({
        url: "/eeg/getTmsEegData",
        type: 'get',
        dataType: "json",
        success: function (data) {
            setPatient(data,eCharts3,"#f0a800","TMS-EGG记录条数");
        }
    })
    // rtms
    $.ajax({
        url: "/eeg/getRTmsData",
        type: 'get',
        dataType: "json",
        success: function (data) {
            setPatient(data,eCharts4,"#33b3ff","rTMS记录条数");
        }
    })
    function setPatient (data,myChart,color,name_y) {
        var xArr = [],dataArr = [];
        data.forEach(function (item, index, array) {
            xArr.push(item.createDate);
            dataArr.push(item.cnt);
        })

        var option = {
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                x: 50,
                y: 40,
                x2: 50,
                y2: 20,
            },
            xAxis: [{
                name: "",
                type: 'category',
                data: xArr,
                axisPointer: {
                    type: 'shadow'
                },
            }],
            yAxis: [{
                type: 'value',
                name: name_y,
                minInterval:1,
                axisTick: {
                    show:false
                }
            }],
            series: [{
                name: name_y,
                type: 'line',
                data: dataArr,
                itemStyle: {
                    color: color
                },
                barWidth: "50%",
                barGap: '-100%'
            }]
        };
        myChart.setOption(option);
        myChart.hideLoading();
    }



    // 导航宽度改变 echart图表跟着改变
    function menuChangeWidth(i, chartArr) {
        chartArr.forEach(function (item, index, array) {
            item.resize();
        })
        setTimeout(function () {
            if (i < 20) {
                i = i + 1;
                menuChangeWidth(i, chartArr);
            }
        }, 10)
    }
    // 改变窗口大小
    $(window).resize(function(){
        eCharts1.resize();
        eCharts2.resize();
        eCharts3.resize();
        eCharts4.resize();
    });
    $('.navbar-header').children(".navbar-minimalize").click(function () {
        menuChangeWidth(0,[eCharts1,eCharts2,eCharts3,eCharts4]);
    })
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        eCharts1.resize();
        eCharts2.resize();
        eCharts3.resize();
        eCharts4.resize();
    });
})