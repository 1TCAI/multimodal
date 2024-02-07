package com.eegnet.web.service.impl;

import com.eegnet.web.dao.RtmsDao;
import com.eegnet.web.entity.Rtms;
import com.eegnet.web.request.RtmsRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.service.RtmsService;
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
public class RtmsServiceImpl implements RtmsService {

    @Autowired
    private RtmsDao rtmsDao;

    @Override
    public DataTablePagerResult<Rtms> getRtmsList(RtmsRequest request) {
        final String diseaseType = request.getDiseaseType();
        final Integer patientGender = request.getPatientGender();
        final String diagnose = request.getDiagnose();
        final Integer treatmentCount = request.getTreatmentCount();
        final String pretreatmentEvaluation = request.getPretreatmentEvaluation();
        final String birthday = request.getBirthday();
        final Integer dimensions = request.getDimensions();
        final String patientNumber = request.getPatientNumber();
        final String hospitalNumber = request.getHospitalNumber();
        final Integer isDeleted = request.getIsDeleted();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<Rtms> result = new DataTablePagerResult<>();
        List<Rtms> data = rtmsDao.queryRtmsList(page, rows, patientGender, diseaseType, diagnose, treatmentCount, pretreatmentEvaluation, birthday, dimensions, patientNumber, hospitalNumber, isDeleted);
        Integer recordCount = rtmsDao.queryRtmsListCount(patientGender, diseaseType, diagnose, treatmentCount, pretreatmentEvaluation, birthday, dimensions, patientNumber, hospitalNumber, isDeleted);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public void addRtms(Rtms rtms) {
        rtmsDao.add(rtms);
    }

    @Override
    public void updateRtms(Rtms rtms) {
        rtmsDao.update(rtms);
    }

    @Override
    public void deleteRtms(Long id) {
        rtmsDao.delete(id);
    }

    @Override
    public Rtms selectById(Long id) {
        return rtmsDao.queryById(id);
    }

    @Override
    public Integer getAllCount(String keyset) {
        return rtmsDao.queryAllCount(keyset);
    }

    @Override
    public Map<String, Object> getChartData(String keyset, String startDate, String endDate){
        Map<String, Object> result = new HashMap<>();
        result.put("allCount", rtmsDao.getCountByDate(startDate));
        result.put("dateCount", rtmsDao.getChartData(keyset, startDate, endDate));
        return result;
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        rtmsDao.updateStatus(id, status);
    }
}
