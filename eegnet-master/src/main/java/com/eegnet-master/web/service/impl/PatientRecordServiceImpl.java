package com.eegnet.web.service.impl;

import com.eegnet.web.dao.*;
import com.eegnet.web.entity.PatientRecord;
import com.eegnet.web.entity.ScaleType;
import com.eegnet.web.request.PatientRecordRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.service.PatientRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author sun
 * @date 2019/06/10
 */

@Service
public class PatientRecordServiceImpl implements PatientRecordService {

    @Autowired
    private PatientRecordDao patientRecordDao;

    @Autowired
    private ScaleTypeDao scaleTypeDao;

    @Autowired
    private ScaleDao scaleDao;

    @Autowired
    private EegDao eegDao;

    @Autowired
    private RtmsDao rtmsDao;

    @Autowired
    private TmsEegDao tmsEegDao;

    @Override
    public DataTablePagerResult<PatientRecord> getPatientRecordList(PatientRecordRequest request) {
        final Integer diseaseType = request.getDiseaseType();
        final Integer patientGender = request.getPatientGender();
        final String diagnose = request.getDiagnose();
        final String birthday = request.getBirthday();
        final Integer dimensions = request.getDimensions();
        final String patientNumber = request.getPatientNumber();
        final String hospitalNumber = request.getHospitalNumber();
        final Integer isDeleted = request.getIsDeleted();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<PatientRecord> result = new DataTablePagerResult<>();
        List<PatientRecord> data = patientRecordDao.queryPatientRecordList(page, rows, patientGender, diseaseType, diagnose, birthday, dimensions, patientNumber, hospitalNumber, isDeleted);
        Integer recordCount = patientRecordDao.queryPatientRecordListCount(patientGender, diseaseType, diagnose, birthday, dimensions, patientNumber, hospitalNumber, isDeleted);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public PageResult<Void> addPatientRecord(PatientRecord patientRecord) {
        PageResult<Void> result = new PageResult<>();
        String checkStr;
        if (!patientRecord.getPatientNumber().isEmpty()) {
            checkStr = patientRecord.getPatientNumber();
        } else {
            checkStr = patientRecord.getHospitalNumber();
        }
        PatientRecord item = patientRecordDao.queryByPatientNumberOrHospitalNumber(checkStr, null);
        if (item == null) {
            item = patientRecordDao.queryByPatientNumberOrHospitalNumber(null, checkStr);
        }
        if (item == null) {
            patientRecordDao.add(patientRecord);
            result.setMsg(ResponseCode.OK.msg);
            result.setCode(ResponseCode.OK.code);
        } else {
            if (item.getPatientNumber().equals(item.getPatientNumber())) {
                result.setMsg("门诊号已存在!");
            } else {
                result.setMsg("住院号已存在!");
            }
            result.setCode(ResponseCode.ERROR.code);
        }
        return result;
    }

    @Override
    public PageResult<Void> updatePatientRecord(PatientRecord patientRecord) {
        PageResult<Void> result = new PageResult<>();
        String checkStr;
        if (!patientRecord.getPatientNumber().isEmpty()) {
            checkStr = patientRecord.getPatientNumber();
        } else {
            checkStr = patientRecord.getHospitalNumber();
        }
        PatientRecord item = patientRecordDao.queryByPatientNumberOrHospitalNumber(checkStr, null);
        if (item == null) {
            item = patientRecordDao.queryByPatientNumberOrHospitalNumber(null, checkStr);
        }
        if (item != null && item.getId().equals(patientRecord.getId())) {
            patientRecordDao.update(patientRecord);
            result.setMsg(ResponseCode.OK.msg);
            result.setCode(ResponseCode.OK.code);
        } else {
            if (item == null) {
                result.setMsg("被试资料信息不存在!");
            } else if (item.getPatientNumber().equals(item.getPatientNumber())) {
                result.setMsg("门诊号已存在!");
            } else {
                result.setMsg("住院号已存在!");
            }
            result.setCode(ResponseCode.ERROR.code);
        }
        return result;
    }

    @Override
    public void deletePatientRecord(Long id) {
        patientRecordDao.delete(id);
    }

    @Override
    public PatientRecord selectById(Long id) {
        return patientRecordDao.queryById(id);
    }

    @Override
    public Integer getAllCount(String keyset) {
        return patientRecordDao.queryAllCount(keyset);
    }

    @Override
    public List<Map<String, Object>> getChartData(String keyset, String startDate, String endDate) {
        return patientRecordDao.getChartData(keyset, startDate, endDate);
    }

    @Override
    public List<Map<String, Object>> getAllData(String keyset, int page, int rows) {
        return patientRecordDao.getAllData(keyset, (page - 1) * rows, rows);
    }

    @Override
    public int getAllDataCount(String keyset) {
        return patientRecordDao.getAllDataCount(keyset);
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        patientRecordDao.updateStatus(id, status);
    }

    @Override
    public Map<String, Object> getDetailByPatientNumber(String patientNumber, String id) {
        Map<String, Object> result = new HashMap<>();
        result.put("mainInfo", patientRecordDao.getDetailByPatientNumber(id));
        result.put("eegInfo", eegDao.queryEegListByPatientNumber(id));
        result.put("rtmsInfo", rtmsDao.queryRtmsListByPatientNumber(id));
        result.put("tmsInfo", tmsEegDao.queryTmsEegListByPatientNumber(id));

        List<ScaleType> scaleList = scaleTypeDao.queryScaleTypeList(0, 0, null, null);
        List<Map<String, Object>> scaleInfoList = new ArrayList<>();
        for (ScaleType item : scaleList) {
            Map<String, Object> scaleInfo = new HashMap<>();
            scaleInfo.put("titles", item.getExcelTitle().split(";"));
            scaleInfo.put("typeName", item.getScaleType());
            scaleInfo.put("datas", scaleDao.queryScaleList(0, 0, item.getId().toString(), null, null, null, null, null, id, null, null));
            scaleInfoList.add(scaleInfo);
        }
        result.put("scaleInfoList", scaleInfoList);
        return result;
    }

    @Override
    public Map<String, Object> getPatientChartsData(String startDate, String endDate) {
        Map<String, Object> result = new HashMap<>();
        result.put("allCount", patientRecordDao.getCountByDate(startDate));
        result.put("dateCount", patientRecordDao.getPatientChartsData(startDate, endDate));
        return result;
    }

    @Override
    public List<Map<String, Object>> getPatientGenderChartsData() {
        return patientRecordDao.getPatientGenderChartsData();
    }

    @Override
    public List<Map<String, Object>> getPatient10InfoData() {
        return patientRecordDao.getPatient10InfoData();
    }
}
