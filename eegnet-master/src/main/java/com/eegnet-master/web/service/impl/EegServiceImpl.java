package com.eegnet.web.service.impl;

import com.eegnet.web.dao.EegDao;
import com.eegnet.web.entity.Eeg;
import com.eegnet.web.request.EegRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.service.EegService;
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
public class EegServiceImpl implements EegService {

    @Autowired
    private EegDao eegDao;

    @Override
    public DataTablePagerResult<Eeg> getEegList(EegRequest request) {
        final String diseaseType = request.getDiseaseType();
        final Integer patientGender = request.getPatientGender();
        final String diagnose = request.getDiagnose();
        final String gatherDate = request.getGatherDate();
        final String eegDetail = request.getEegDetail();
        final Integer haveSleep = request.getHaveSleep();
        final String birthday = request.getBirthday();
        final Integer dimensions = request.getDimensions();
        final Integer isDeleted = request.getIsDeleted();
        final String patientNumber = request.getPatientNumber();
        final String hospitalNumber = request.getHospitalNumber();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<Eeg> result = new DataTablePagerResult<>();
        List<Eeg> data = eegDao.queryEegList(page, rows, patientGender, diseaseType, diagnose, gatherDate, eegDetail, haveSleep, birthday, dimensions, patientNumber, hospitalNumber, isDeleted);
        Integer recordCount = eegDao.queryEegListCount(patientGender, diseaseType, diagnose, gatherDate, eegDetail, haveSleep, birthday, dimensions, patientNumber, hospitalNumber, isDeleted);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public void addEeg(Eeg eeg) {
        eegDao.add(eeg);
    }

    @Override
    public void updateEeg(Eeg eeg) {
        eegDao.update(eeg);
    }

    @Override
    public void deleteEeg(Long id) {
        eegDao.delete(id);
    }

    @Override
    public Eeg selectById(Long id) {
        return eegDao.queryById(id);
    }

    @Override
    public Integer getAllCount(String keyset) {
        return eegDao.queryAllCount(keyset);
    }

    @Override
    public Map<String, Object> getChartData(String keyset, String startDate, String endDate){
        Map<String, Object> result = new HashMap<>();
        result.put("allCount", eegDao.getCountByDate(startDate));
        result.put("dateCount", eegDao.getChartData(keyset, startDate, endDate));
        return result;
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        eegDao.updateStatus(id, status);
    }
}
