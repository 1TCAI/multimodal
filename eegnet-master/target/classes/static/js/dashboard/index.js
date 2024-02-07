var windowWidth = window.screen.width;
var chartFontSize = 8;
var chartX1 = 50;
var chartX2 = 20;
if (windowWidth >= 1600 && windowWidth < 1920) {
  chartFontSize = 10;
  chartX1 = 60
  chartX2 = 30;
} else if (windowWidth >= 1920) {
  chartFontSize = 12
  chartX1 = 70
  chartX2 = 40;
}
var infoData, chart1, chart2, chart3, chart4, chart5,chart6;
window.thisMoment = new Date().getTime();
$(document).ready(function () {
  var endDate = linkageDate(new Date(todayDate()),0);
  var srartDate = linkageDate(new Date(todayDate()),-9);
  chart1 = echarts.init(document.getElementById('chart1'));
  chart2 = echarts.init(document.getElementById('chart2'));
  chart3 = echarts.init(document.getElementById('chart3'));
  chart4 = echarts.init(document.getElementById('chart4'));
  chart5 = echarts.init(document.getElementById('chart5'));
  chart6 = echarts.init(document.getElementById('chart6'));
  $.ajax({
    url: "/eeg/getPatientChartsData",
    type: 'get',
    data:{startDate: srartDate, endDate: endDate},
    dataType: "json",
    success: function (data) {
      addChart1(data, chart1,"ec0445", srartDate, endDate);
    }
  });
  $.ajax({
    url: "/eeg/getPatientGenderChartsData",
    type: 'get',
    dataType: "json",
    success: function (data) {
      addChart2(data, chart2);
    }
  });
  $.ajax({
    url: "/eeg/getPatient10InfoData",
    type: 'get',
    dataType: "json",
    success: function (data) {
      infoData = data;
      onTimeInfo(data, window.thisMoment);
    }
  });
  getTime("pageTimeText");
  var endDate1 = linkageDate(new Date(todayDate()),0);
  var srartDate1 = linkageDate(new Date(todayDate()),-4);
  $.ajax({
    url: "/eeg/getAll",
    type: 'get',
    dataType: "json",
    success: function (data) {
      $("#number4").text(numberFormat(data.scale));
      $("#number1").text(numberFormat(data.eeg));
      $("#number3").text(numberFormat(data.tmsEeg));
      $("#number2").text(numberFormat(data.rTms));
    }
  })
  $.ajax({
    url: "/eeg/getEegData",
    type: 'get',
    data:{startDate: srartDate1, endDate: endDate1},
    dataType: "json",
    success: function (data) {
      setPatient(data,chart3,"#02c06f","EEG记录条数", srartDate1);
    }
  })
// tms
  $.ajax({
    url: "/eeg/getTmsEegData",
    type: 'get',
    data:{startDate: srartDate1, endDate: endDate1},
    dataType: "json",
    success: function (data) {
      setPatient(data,chart5,"#02c06f","TMS-EGG记录条数", srartDate1);
    }
  })
// rtms
  $.ajax({
    url: "/eeg/getRTmsData",
    type: 'get',
    data:{startDate: srartDate1, endDate: endDate1},
    dataType: "json",
    success: function (data) {
      setPatient(data,chart4,"#02c06f","rTMS记录条数", srartDate1);
    }
  })
// 量表
  $.ajax({
    url: "/eeg/getScaleData",
    type: 'get',
    data:{startDate: srartDate1, endDate: endDate1},
    dataType: "json",
    success: function (data) {
      setPatient(data, chart6,"#02c06f","量表记录条数", srartDate1);
    }
  })
});

function addChart1 (data, chart, color, srartDate, endDate) {
  var timeArr = [];
  var dataArr = [];
  var maxCount = 0;
  var dataShadow = [];
  for (var i = 0; i < 10; i++) {
    timeArr.push(linkageDate(new Date(srartDate),i));
  }
  var cnt = data.allCount;
  timeArr.forEach(function (item, index, array) {
    data.dateCount.forEach(function (item0, index0, array0) {
      if (item == item0.time) {
        cnt += item0.cnt;
      }
    });
    timeArr[index] = item.substring(8, 10);
    dataArr.push(cnt);
  });
  for (let index in dataArr) {
    if (maxCount < dataArr[index]) {
      maxCount = dataArr[index]
    }
  }
  for (var i = 0; i < dataArr.length; i++) {
    dataShadow.push(maxCount);
  }
  var option = {
    tooltip: {
      formatter: function (val) {
        return "<div>数量</div><div>" + val.marker + val.value + "人</div>"
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisPointer: {
        type: 'shadow'
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: chartFontSize,
        interval:0,
        color: "#797981",
        margin:4
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      data: timeArr
    },
    yAxis: {
      type: 'value',
      show: false,
      max:maxCount
    },
    grid: {
      x:20,
      y:5,
      x2:20,
      y2:20,
    },
    color:"#47d1ea",
    series: [{
      name:"背景",
      type: 'bar',
      itemStyle: {
        normal: {color: 'rgba(60,60,60,0.2)'}
      },
      barGap:'-100%',
      barCategoryGap:'40%',
      data: dataShadow,
      barWidth: "30%",
      animation: false
    },{
      data: dataArr,
      type: 'bar',
      barWidth:"30%",
      itemStyle: {
        color: "#" + color
      }
    }]
  };
  chart.setOption(option);
}

function linkageDate(newDate, n) {
  var dateTime = new Date(newDate);
  dateTime.setDate(newDate.getDate() + n);
  var newMonth = dateTime.getMonth() + 1;
  if (newMonth < 10) {
    newMonth = "0" + newMonth;
  }
  var newDay = dateTime.getDate()
  if (newDay < 10) {
    newDay = "0" + newDay;
  }
  var newTime = dateTime.getFullYear() + "-" + newMonth + "-" + newDay;
  return newTime
}

function addChart2 (data, chart) {
  var dataArr = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].patientGender == 0) {
      dataArr.push({
        value: data[i].cnt,
        name: '女'
      });
    } else if (data[i].patientGender == 1) {
      dataArr.push({
        value: data[i].cnt,
        name: '男'
      });
    }
  }
  option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color: ["#cca645", "#0394e5"],
    legend: {
      orient: 'horizontal',
      data:['男','女'],
      bottom: 0,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#87868f'
      }
    },
    series: [
      {
        name:'比例',
        type:'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        data: dataArr
      }
    ]
  };
  chart.setOption(option);
}

function onTimeInfo (data,moment) {
  if (moment == window.thisMoment) {
    $("#infoContent").children('ul').html("");
    data.forEach(function (item, index, array) {
      if (index < 15) {
        $("#swiper-wrapper").append('<div class="swiper-slide"><div class="infoBox"><div class="bortop"></div>姓名:' + item.patientName + ',性别:' + (item.patientGender == 0 ? '女' : '男') + ',疾病:' + item.diseaseType + '<p>日期:' + item.createDate + '</p><p class="zhenduan">诊断:' + item.diagnose + '</p></div></div>');
      }
    })
    $("#infoContent").children('ul').children("li").each(function (index,ele) {
      var detailedWidth = $(ele).children(".detailedInfo").width() / 2 + 38;
      setTimeout(function () {
        setTimeout(function () {
          $(ele).children(".detailedInfo").animate({"left":-detailedWidth + "px"},13000,"linear");
          if (index == $("#infoContent").children('ul').children("li").length - 1) {
            setTime = window.setTimeout(function () {
              onTimeInfo(infoData,moment);
            },13000)
          }
        },1000);
      },50 * index);
    })
    var swiper = new Swiper('.swiper-container', {
      slidesPerView :7,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      direction:'vertical',
      grabCursor:true,
      autoplayDisableOnInteraction:false,
      mousewheelControl:true,
      autoHeight:true,
      speed:500,
      // observer: true,//修改swiper自己或子元素时，自动初始化swiper
      // observeParents: true,//修改swiper的父元素时，自动初始化swiper
      loop: true, // 循环模式选项
    });
  }
}


function getTime (id) {
  $("#" + id).text(getNowTime());
  setTimeout(function () {
    if ($("#" + id).length != 0) {
      getTime(id);
    }
  },1000)
}

function getNowTime () {
  var myDate = new Date;
  var year = myDate.getFullYear(); //获取当前年
  var mon = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1; //获取当前月
  var date = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate(); //获取当前日
  var h = myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours();//获取当前小时数(0-23)
  var m = myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes();//获取当前分钟数(0-59)
  var s = myDate.getSeconds() < 10 ? "0" + myDate.getSeconds() : myDate.getSeconds();//获取当前秒
  var timeStr = year + "-" + mon + "-" + date + " " + h + ":" + m + ":" + s;
  return timeStr;
}

function todayDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var today = year + "-" + month + "-" + day;
  var startDate = linkageDate(new Date(today), 0);
  return startDate;
}

function numberFormat(value){
  if (value) {
    var temp = value.toString().split('.');
    if (temp.length > 1) {
      return temp[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + "." + temp[1];
    } else {
      return value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
  }
  return 0;
}

function setPatient (data,myChart,color,name_y, srartDate) {
  // var xArr = [],dataArr = [];
  // data.forEach(function (item, index, array) {
  //     xArr.push(item.createDate);
  //     dataArr.push(item.cnt);
  // });
  var timeArr = [];
  var dataArr = [];
  for (var i = 0; i < 5; i++) {
    timeArr.push(linkageDate(new Date(srartDate),i));
  }
  var cnt = data.allCount;
  timeArr.forEach(function (item, index, array) {
    data.dateCount.forEach(function (item0, index0, array0) {
      if (item == item0.createDate) {
        cnt += item0.cnt;
      }
    });
    timeArr[index] = item.substring(8, 10);
    dataArr.push(cnt);
  });
  //console.info(data, timeArr, dataArr);
  var option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      x: 25,
      y: 10,
      x2: 20,
      y2: 20,
      // top: '4%',
      // left: '3%',
      // right: '4%',
      // bottom: '3%',
      // containLabel: true
    },
    xAxis: [{
      name: "",
      type: 'category',
      data: timeArr,
      axisPointer: {
        type: 'shadow'
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: "#797981",
        }
      }

    }],
    yAxis: [{
      type: 'value',
      name: name_y,
      minInterval:1,
      axisTick: {
        show:false
      },
      nameTextStyle:{
        color: "#797981",
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: "#797981",
        }
      },
      splitLine: { //网格线
        show: false
      }
    }],
    series: [
      //     {
      //     name: name_y,
      //     type: 'line',
      //     data: dataArr,
      //     itemStyle: {
      //         color: color
      //     },
      //     barWidth: "50%",
      //     barGap: '-100%'
      // }
      {
        name: name_y,
        type:'line',
        data: dataArr,
        symbol: 'none',
        smooth:true,
        itemStyle: {
          normal: {
            color: color,
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(2,192,111,.5)'
            }, {
              offset: 1,
              color: 'rgba(2,192,111,.5)'
            }])
          }
        },
      }
    ]
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
$(window).resize(function(){
  chart1.resize();
  chart2.resize();
  chart3.resize();
  chart4.resize();
  chart5.resize();
  chart6.resize();
});
// alert(1)
