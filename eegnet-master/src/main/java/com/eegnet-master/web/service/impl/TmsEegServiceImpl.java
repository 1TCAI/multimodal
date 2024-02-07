package com.eegnet.web.service.impl;

import com.eegnet.web.dao.TmsEegDao;
import com.eegnet.web.entity.TmsEeg;
import com.eegnet.web.request.TmsEegRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.service.TmsEegService;
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
public class TmsEegServiceImpl implements TmsEegService {

    @Autowired
    private TmsEegDao tmsEegDao;

    @Override
    public DataTablePagerResult<TmsEeg> getTmsEegList(TmsEegRequest request) {
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

        DataTablePagerResult<TmsEeg> result = new DataTablePagerResult<>();
        List<TmsEeg> data = tmsEegDao.queryTmsEegList(page, rows, patientGender, diseaseType, diagnose, gatherDate, eegDetail, haveSleep, birthday, dimensions, patientNumber, hospitalNumber, isDeleted);
        Integer recordCount = tmsEegDao.queryTmsEegListCount(patientGender, diseaseType, diagnose, gatherDate, eegDetail, haveSleep, birthday, dimensions, patientNumber, hospitalNumber, isDeleted);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public void addTmsEeg(TmsEeg tmsEeg) {
        tmsEegDao.add(tmsEeg);
    }

    @Override
    public void updateTmsEeg(TmsEeg tmsEeg) {
        tmsEegDao.update(tmsEeg);
    }

    @Override
    public void deleteTmsEeg(Long id) {
        tmsEegDao.delete(id);
    }

    @Override
    public TmsEeg selectById(Long id) {
        return tmsEegDao.queryById(id);
    }

    @Override
    public Integer getAllCount(String keyset) {
        return tmsEegDao.queryAllCount(keyset);
    }

    @Override
    public Map<String, Object> getChartData(String keyset, String startDate, String endDate){
        Map<String, Object> result = new HashMap<>();
        result.put("allCount", tmsEegDao.getCountByDate(startDate));
        result.put("dateCount", tmsEegDao.getChartData(keyset, startDate, endDate));
        return result;
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        tmsEegDao.updateStatus(id, status);
    }
}
