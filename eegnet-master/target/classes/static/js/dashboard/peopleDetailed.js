$(document).ready(function () {
    var param = $.urlGet();
    $("#subTitleStrongLi").show();
    $("#subTitleStrong").html("个人资料");
    $("#subTitleStrongLi").before("<li class='breadcrumb-item'><a href='list?search=" + param.search + "'>资料列表</a></li>");

    $.ajax({
        url:"/eeg/getDetailByPatientNumber",
        type: 'get',
        data: {
            patientNumber: param.patientNumber,
            id: param.id
        },
        success: function (data) {
            addData(data.datas.mainInfo, data);
            addFormData(data.datas.scaleInfoList);
        }
    })
    function addData (data1, data) {
        // 基础信息
        $("#patientName").text(data1.patientName != null ? "姓名: " + data1.patientName : "姓名: 未知");
        var patientGender = "未知";
        switch (data1.patientGender) {
            case 0:
                patientGender = "女";
                break;
            case 1:
                patientGender = "男";
                break;
        }
        $("#patientGender").text("性别: " + patientGender);
        $("#birthday").text(data1.birthday != null ? "出生日期: " + data1.birthday : "出生日期: 未知");
        $("#patientNumber").text(data1.patientNumber != null ? "门诊号: " + data1.patientNumber : "门诊号: 未知");
        $("#hospitalNumber").text(data1.hospitalNumber != null ? "住院号: " + data1.hospitalNumber : "住院号: 未知");
        var education = "未知";
        switch (data1.education) {
            case 1:
                education = '文盲';
                break;
            case 2:
                education = '小学';
                break;
            case 3:
                education = '初中';
                break;
            case 4:
                education = '中专';
                break;
            case 5:
                education = '高中';
                break;
            case 6:
                education = '大专';
                break;
            case 7:
                education = '本科';
                break;
            case 8:
                education = '硕士';
                break;
            case 9:
                education = '博士';
                break;
        }
        $("#education").text("文化程度:" + education);
        $("#phone").text(data1.phone != null ? "联系电话: " + data1.phone : "联系电话: 未知");
        $("#from").text(data1.from != null ? "来源: " + data1.from : "来源: 未知");
        $("#bedNumber").text(data1.bedNumber != null ? "病床号: " + data1.bedNumber : "病床号: 未知");
        $("#diseaseType").text(data1.diseaseType != null ? "疾病类型: " + data1.diseaseType : "疾病类型: 未知");
        $("#diagnose").text(data1.diagnose != null ? "诊断: " + data1.diagnose : "诊断: 未知");
        var dimensions = "未知";
        switch (data1.dimensions) {
            case 1:
                dimensions = '一级';
                break;
            case 2:
                dimensions = '二级';
                break;
            case 3:
                dimensions = '三级';
                break;
            case 4:
                dimensions = '四级';
                break;
            case 5:
                dimensions = '五级';
                break;
        }
        $("#dimensions").text("严重程度: " + dimensions);
        $("#outDiagnose").text(data1.outDiagnose != null ? "出院诊断: " + data1.outDiagnose : "住院诊断: 未知");
        $("#createDate").text(data1.createDate != null ? "创建时间: " + data1.createDate : "创建时间: 未知");
        // EEG记录
        var eegHtml = ""
        data = data.datas;
        if (data.eegInfo){
            // console.log(data.eegInfo)
            for (var i = 0;i<data.eegInfo.length;i++){
                var haveSleep = "未知";
                switch (data.eegInfo[i].haveSleep) {
                    case 1:
                        haveSleep = '有';
                        break;
                    case 0:
                        haveSleep = '无';
                        break;
                };
                // debugger
                if (i==0){
                    // debugger
                    eegHtml+='<div class="infoBox row"><div class="col-md-4"><div class="info">'+(data.eegInfo[i].eegRecord != null ? "记录名称: " + data.eegInfo[i].eegRecord :"记录名称: 未知") +'</div></div><div class="col-md-4"><div class="info">'+(data.eegInfo[i].eegType != null ? "记录类型: " + data.eegInfo[i].eegType : "记录类型: 未知")+'</div></div><div class="col-md-4"><div class="info">'+ (data.eegInfo[i].gatherDate != null ? "采集日期: " + data.eegInfo[i].gatherDate : "采集日期: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.eegInfo[i].eegDetail != null ? "记录描述: " + data.eegInfo[i].eegDetail : "记录描述: 未知")+'</div></div><div class="col-md-4"><div class="info">'+"有无睡着:" + haveSleep+'</div></div><div class="col-md-4"><div class="info">'+(data.eegInfo[i].applyDoctor != null ? "申请医生: " + data.eegInfo[i].applyDoctor : "申请医生: 未知")+'</div></div></div>'
                }else {
                    // debugger
                    eegHtml+='<div class="infoBox row" style="border-top: 1px solid #3333"><div class="col-md-4"><div class="info">'+(data.eegInfo[i].eegRecord != null ? "记录名称: " + data.eegInfo[i].eegRecord : "记录名称: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.eegInfo[i].eegType != null ? "记录类型: " + data.eegInfo[i].eegType : "记录类型: 未知")+'</div></div><div class="col-md-4"><div class="info">'+ (data.eegInfo[i].gatherDate != null ? "采集日期: " + data.eegInfo[i].gatherDate : "采集日期: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.eegInfo[i].eegDetail != null ? "记录描述: " + data.eegInfo[i].eegDetail : "记录描述: 未知")+'</div></div><div class="col-md-4"><div class="info">'+"有无睡着:" + haveSleep+'</div></div><div class="col-md-4"><div class="info">'+(data.eegInfo[i].applyDoctor != null ? "申请医生: " + data.eegInfo[i].applyDoctor : "申请医生: 未知")+'</div></div></div>'
                }

            }
        }
        // console.log(eegHtml)
        $("#eegBox").html(eegHtml);
        // $("#eegRecord").text(data.eegRecord != null ? "记录名称: " + data.eegRecord : "记录名称: 未知");
        // $("#eegType").text(data.eegType != null ? "记录类型: " + data.eegType : "记录类型: 未知");
        // $("#gatherDate").text(data.gatherDate != null ? "采集日期: " + data.gatherDate : "采集日期: 未知");
        // $("#eegDetail").text(data.eegDetail != null ? "记录描述: " + data.eegDetail : "记录描述: 未知");
        // var haveSleep = "未知";
        // switch (data.haveSleep) {
        //     case 1:
        //         haveSleep = '有';
        //         break;
        //     case 0:
        //         haveSleep = '无';
        //         break;
        // }
        // $("#haveSleep").text("有无睡着: " + haveSleep);
        // $("#applyDoctor").text(data.applyDoctor != null ? "申请医生: " + data.applyDoctor : "申请医生: 未知");
        // rTMS记录
        var rtmsHtml = "";
        if (data.rtmsInfo) {
            for (var i = 0;i<data.rtmsInfo.length;i++){
                if (i==0){
                    rtmsHtml+='<div class="infoBox row"><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].restingMotionThreshold != null ? "静息运动阈值(%): " + data.rtmsInfo[i].restingMotionThreshold : "静息运动阈值(%): 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].stimulusSite != null ? "刺激部位: " + data.rtmsInfo[i].stimulusSite : "刺激部位: 未知")+'</div></div><div class="col-md-4"><div class="info">'+ (data.rtmsInfo[i].stimulusIntensity != null ? "刺激强度(%): " + data.rtmsInfo[i].stimulusIntensity : "刺激强度(%): 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].stimulusFrequency != null ? "刺激频率(%): " + data.rtmsInfo[i].stimulusFrequency : "刺激频率(%): 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].stimulationTimeSeries != null ? "串刺激时间: " + data.rtmsInfo[i].stimulationTimeSeries : "串刺激时间: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].serialIntervalTime != null ? "串间歇时间: " + data.rtmsInfo[i].serialIntervalTime : "串间歇时间: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].totalTime != null ? "总时间: " + data.rtmsInfo[i].totalTime : "总时间: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].pulseCount != null ? "脉冲总数: " + data.rtmsInfo[i].pulseCount : "脉冲总数: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].pretreatmentEvaluation != null ? "治疗前评估: " + data.rtmsInfo[i].pretreatmentEvaluation : "治疗前评估: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].treatmentCount != null ? "第几次: " + data.rtmsInfo[i].treatmentCount : "第几次: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].treatmentDate != null ? "治疗时间: " + data.rtmsInfo[i].treatmentDate : "治疗时间: 未知")+'</div></div></div>'
                }else {
                    rtmsHtml+='<div class="infoBox row" style="border-top: 1px solid #3333"><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].restingMotionThreshold != null ? "静息运动阈值(%): " + data.rtmsInfo[i].restingMotionThreshold : "静息运动阈值(%): 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].stimulusSite != null ? "刺激部位: " + data.rtmsInfo[i].stimulusSite : "刺激部位: 未知")+'</div></div><div class="col-md-4"><div class="info">'+ (data.rtmsInfo[i].stimulusIntensity != null ? "刺激强度(%): " + data.rtmsInfo[i].stimulusIntensity : "刺激强度(%): 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].stimulusFrequency != null ? "刺激频率(%): " + data.rtmsInfo[i].stimulusFrequency : "刺激频率(%): 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].stimulationTimeSeries != null ? "串刺激时间: " + data.rtmsInfo[i].stimulationTimeSeries : "串刺激时间: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].serialIntervalTime != null ? "串间歇时间: " + data.rtmsInfo[i].serialIntervalTime : "串间歇时间: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].totalTime != null ? "总时间: " + data.rtmsInfo[i].totalTime : "总时间: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].pulseCount != null ? "脉冲总数: " + data.rtmsInfo[i].pulseCount : "脉冲总数: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].pretreatmentEvaluation != null ? "治疗前评估: " + data.rtmsInfo[i].pretreatmentEvaluation : "治疗前评估: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].treatmentCount != null ? "第几次: " + data.rtmsInfo[i].treatmentCount : "第几次: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.rtmsInfo[i].treatmentDate != null ? "治疗时间: " + data.rtmsInfo[i].treatmentDate : "治疗时间: 未知")+'</div></div></div>'
                }
            }
        }
        $("#rTmsBox").html(rtmsHtml);
        // $("#restingMotionThreshold").text(data.restingMotionThreshold != null ? "静息运动阈值(%): " + data.restingMotionThreshold : "静息运动阈值(%): 未知");
        // $("#stimulusSite").text(data.stimulusSite != null ? "刺激部位: " + data.stimulusSite : "刺激部位: 未知");
        // $("#stimulusIntensity").text(data.stimulusIntensity != null ? "刺激强度(%): " + data.stimulusIntensity : "刺激强度(%): 未知");
        // $("#stimulusFrequency").text(data.stimulusFrequency != null ? "刺激频率(%): " + data.stimulusFrequency : "刺激频率(%): 未知");
        // $("#stimulationTimeSeries").text(data.stimulationTimeSeries != null ? "串刺激时间: " + data.stimulationTimeSeries : "串刺激时间: 未知");
        // $("#serialIntervalTime").text(data.serialIntervalTime != null ? "串间歇时间: " + data.serialIntervalTime : "串间歇时间: 未知");
        // $("#totalTime").text(data.totalTime != null ? "总时间: " + data.totalTime : "总时间: 未知");
        // $("#pulseCount").text(data.pulseCount != null ? "脉冲总数: " + data.pulseCount : "脉冲总数: 未知");
        // $("#pretreatmentEvaluation").text(data.pretreatmentEvaluation != null ? "治疗前评估: " + data.pretreatmentEvaluation : "治疗前评估: 未知");
        // $("#treatmentCount").text(data.treatmentCount != null ? "第几次: " + data.treatmentCount : "第几次: 未知");
        // $("#treatmentDate").text(data.treatmentDate != null ? "治疗时间: " + data.treatmentDate : "治疗时间: 未知");
        // TMS-EEG记录
        var tmsHtml = '';
        if (data.tmsInfo) {
            for (var i = 0;i<data.tmsInfo.length;i++){
                var haveSleep = "未知";
                switch (data.tmsInfo[i].haveSleep) {
                    case 1:
                        haveSleep = '有';
                        break;
                    case 0:
                        haveSleep = '无';
                        break;
                }
                var isThreshold = "未知";
                switch (data.tmsInfo[i].isThreshold) {
                    case 1:
                        isThreshold = '是';
                        break;
                    case 0:
                        isThreshold = '否';
                        break;
                }
                if (i==0){
                    tmsHtml+='<div class="infoBox row"><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].eegRecord != null ? "记录名称: " + data.tmsInfo[i].eegRecord : "记录名称: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].eegDetail != null ? "记录描述: " + data.tmsInfo[i].eegDetail : "记录描述: 未知")+'</div></div><div class="col-md-4"><div class="info">'+ (data.tmsInfo[i].eegType != null ? "记录类型: " + data.tmsInfo[i].eegType : "记录类型: 未知")+'</div></div><div class="col-md-4"><div class="info">'+"有无睡着: " + haveSleep+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].applyDoctor != null ? "申请医生: " + data.tmsInfo[i].applyDoctor : "申请医生: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].gatherDate != null ? "采集日期: " + data.tmsInfo[i].gatherDate : "采集日期: 未知")+'</div></div><div class="col-md-4"><div class="info">'+"是否测出阈值: " + isThreshold+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].threshold != null ? "阈值(%): " + data.tmsInfo[i].threshold : "阈值(%): 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].stimulusIntensity != null ? "刺激强度(%): " + data.tmsInfo[i].stimulusIntensity : "刺激强度(%): 未知")+'</div></div></div>'
                }else {
                    tmsHtml+='<div class="infoBox row" style="border-top: 1px solid #3333"><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].eegRecord != null ? "记录名称: " + data.tmsInfo[i].eegRecord : "记录名称: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].eegDetail != null ? "记录描述: " + data.tmsInfo[i].eegDetail : "记录描述: 未知")+'</div></div><div class="col-md-4"><div class="info">'+ (data.tmsInfo[i].eegType != null ? "记录类型: " + data.tmsInfo[i].eegType : "记录类型: 未知")+'</div></div><div class="col-md-4"><div class="info">'+"有无睡着: " + haveSleep+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].applyDoctor != null ? "申请医生: " + data.tmsInfo[i].applyDoctor : "申请医生: 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].gatherDate != null ? "采集日期: " + data.tmsInfo[i].gatherDate : "采集日期: 未知")+'</div></div><div class="col-md-4"><div class="info">'+"是否测出阈值: " + isThreshold+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].threshold != null ? "阈值(%): " + data.tmsInfo[i].threshold : "阈值(%): 未知")+'</div></div><div class="col-md-4"><div class="info">'+(data.tmsInfo[i].stimulusIntensity != null ? "刺激强度(%): " + data.tmsInfo[i].stimulusIntensity : "刺激强度(%): 未知")+'</div></div></div>'
                }
            }
        }
        $("#tmsBox").html(tmsHtml);
        // $("#eegRecord_t").text(data.eegRecord_t != null ? "记录名称: " + data.eegRecord_t : "记录名称: 未知");
        // $("#eegDetail_t").text(data.eegDetail_t != null ? "记录描述: " + data.eegDetail_t : "记录描述: 未知");
        // $("#eegType_t").text(data.eegType_t != null ? "记录类型: " + data.eegType_t : "记录类型: 未知");
        // var haveSleep_t = "未知";
        // switch (data.haveSleep_t) {
        //     case 1:
        //         haveSleep_t = '有';
        //         break;
        //     case 0:
        //         haveSleep_t = '无';
        //         break;
        // }
        // $("#haveSleep_t").text("有无睡着: " + haveSleep_t);
        // $("#applyDoctor_t").text(data.applyDoctor_t != null ? "申请医生: " + data.applyDoctor_t : "申请医生: 未知");
        // $("#gatherDate_t").text(data.gatherDate_t != null ? "采集日期: " + data.gatherDate_t : "采集日期: 未知");
        // var isThreshold_t = "未知";
        // switch (data.isThreshold) {
        //     case 1:
        //         isThreshold_t = '是';
        //         break;
        //     case 0:
        //         isThreshold_t = '否';
        //         break;
        // }
        // $("#isThreshold_t").text("是否测出阈值: " + isThreshold_t);
        // $("#threshold_t").text(data.threshold != null ? "阈值(%): " + data.threshold : "阈值(%): 未知");
        // $("#stimulusIntensity_t").text(data.stimulusIntensity_t != null ? "刺激强度(%): " + data.stimulusIntensity_t : "刺激强度(%): 未知");
    }
    // 添加量表数据
    function addFormData (data) {
        data.forEach(function (item, index, array) {
            if (item.datas[0]) {
                $("#scaleContent").append("<div class='col-md-12' style='text-align: center'>《" + item.typeName + "》</div>");
                item.titles.forEach(function (val, num, ar) {
                    if (num > 2) {
                        // var state = "未知";
                        var state = item.datas[0]["filed" + (num - 2)] != "" ? item.datas[0]["filed" + (num - 2)] : "未知";
                        $("#scaleContent").append("<div class='col-md-4'><div class='info'>" + val + ": " + state + "</div></div>");
                    }
                })
            }

        })
    }
})