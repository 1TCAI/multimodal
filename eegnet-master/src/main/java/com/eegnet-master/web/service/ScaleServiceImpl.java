package com.eegnet.web.service.impl;

import com.eegnet.framework.util.ScaleUtils;
import com.eegnet.web.dao.PatientRecordDao;
import com.eegnet.web.dao.ScaleDao;
import com.eegnet.web.dao.ScaleTypeDao;
import com.eegnet.web.entity.PatientRecord;
import com.eegnet.web.entity.Scale;
import com.eegnet.web.request.ScaleRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.response.ResponseResult;
import com.eegnet.web.service.ScaleService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author sun
 * @date 2019/06/10
 */

@Service
public class ScaleServiceImpl implements ScaleService {

    @Autowired
    private ScaleTypeDao scaleTypeDao;

    @Autowired
    private ScaleDao scaleDao;

    @Autowired
    private PatientRecordDao patientRecordDao;

    @Override
    public ResponseResult importList(List<String[]> list, String scaleType) {
        List<Scale> scaleList = new ArrayList<>();
        List<Scale> scaleUpdateList = new ArrayList<>();
        if (list == null || list.size() == 0) {
            return ResponseResult.e(ResponseCode.ERROR, "excel文件可能有损坏, 请打开后重新保存!");
        }
        //获取excel表头
        String[] titleExcel = list.get(0);
        //获取类型表头
        String[] titleScale = scaleTypeDao.queryById(Long.parseLong(scaleType)).getExcelTitle().split(";");
        if (!Arrays.equals(titleExcel, titleScale)) {
            if (titleExcel == null) {
                return ResponseResult.e(ResponseCode.ERROR, "excel文件可能有损坏, 请打开后重新保存!");
            }
            if (titleExcel[0].isEmpty()) {
                return ResponseResult.e(ResponseCode.ERROR, "请删除主标题行, 确保第一行为列表头!");
            }
            return ResponseResult.e(ResponseCode.ERROR, "excel文件与量表类型字段不匹配, 请检查!");
        }
        String[] dataGroup;
        PatientRecord patientRecord;
        String notHaves = "";
        for (int i = 1; i < list.size(); i++) {
            dataGroup = list.get(i);
            patientRecord = patientRecordDao.queryByPatientNumberOrHospitalNumber(null, dataGroup[1]);
            if (patientRecord == null) {
                patientRecord = patientRecordDao.queryByPatientNumberOrHospitalNumber(dataGroup[0], null);
            }
            if (patientRecord != null) {
                Scale checkScale = scaleDao.queryScaleByPatientNumberAndDateAndScaleType(dataGroup[0], dataGroup[2], scaleType);
                Scale scale = ScaleUtils.setScale(dataGroup, scaleType);
                scale.setPatientNumberId(patientRecord.getId());
                if (checkScale != null) {
                    scale.setId(checkScale.getId());
                    scaleUpdateList.add(scale);
                } else {
                    scaleList.add(scale);
                }
            } else {
                if (notHaves.split(";").length % 4 == 0) {
                    notHaves += "\n" + dataGroup[0] + ";";
                } else {
                    notHaves += dataGroup[0] + ";";
                }
            }
        }
        if (scaleList.size() > 0) {
            scaleDao.addBatch(scaleList);
        }
        for (Scale item : scaleUpdateList) {
            scaleDao.updateById(item);
        }
        String msg = "上传成功!";
        if (!notHaves.isEmpty()) {
            msg = "部分上传未成功: " + notHaves;
        }
        return ResponseResult.e(ResponseCode.OK, msg);
    }

    @Override
    public DataTablePagerResult<Scale> getScaleList(ScaleRequest request) {
        final String diseaseType = request.getDiseaseType();
        final Integer patientGender = request.getPatientGender();
        final String diagnose = request.getDiagnose();
        final String birthday = request.getBirthday();
        final Integer dimensions = request.getDimensions();
        final String scaleType = request.getScaleType();
        final String patientNumber = request.getPatientNumber();
        String rowDate = request.getRowDate();
        if (!rowDate.isEmpty()) {
            rowDate = rowDate.replace("-", "/");
        }
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<Scale> result = new DataTablePagerResult<>();
        List<Scale> data = scaleDao.queryScaleList(page, rows, scaleType, patientGender, diseaseType, diagnose, birthday, dimensions, null, patientNumber, rowDate);
        Integer recordCount = scaleDao.queryScaleListCount(scaleType, patientGender, diseaseType, diagnose, birthday, dimensions, null, patientNumber, rowDate);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public List<String> getTitle(String scaleType) {
        return Arrays.asList(scaleTypeDao.queryById(Long.parseLong(scaleType)).getExcelTitle().split(";"));
    }

    @Override
    public Scale selectById(Long id) {
        return scaleDao.queryById(id);
    }

    @Override
    public void updateScale(Scale scale) {
        scaleDao.updateById(scale);
    }

    @Override
    public Map<String, Object> getChartData(String keyset, String startDate, String endDate) {
        Map<String, Object> result = new HashMap<>();
        result.put("allCount", scaleDao.getCountByDate(startDate));
        result.put("dateCount", scaleDao.getChartData(keyset, startDate, endDate));
        return result;
    }

    @Override
    public Integer getAllCount(String keyset) {
        return scaleDao.queryAllCount(keyset);
    }
}
