package com.eegnet.web.service.impl;

import com.eegnet.web.dao.DiseaseTypeDao;
import com.eegnet.web.entity.DiseaseType;
import com.eegnet.web.request.DiseaseTypeRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.service.DiseaseTypeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author sun
 * @date 2019/06/10
 */

@Service
public class DiseaseTypeServiceImpl implements DiseaseTypeService {

    @Autowired
    private DiseaseTypeDao diseaseTypeDao;

    @Override
    public DataTablePagerResult<DiseaseType> getDiseaseTypeList(DiseaseTypeRequest request) {
        final String diseaseType = request.getDiseaseType();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;
        final Integer isDeleted = request.getIsDeleted();

        DataTablePagerResult<DiseaseType> result = new DataTablePagerResult<>();
        List<DiseaseType> data = diseaseTypeDao.queryDiseaseTypeList(page, rows, diseaseType, isDeleted);
        Integer recordCount = diseaseTypeDao.queryDiseaseTypeListCount(diseaseType, isDeleted);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public void addDiseaseType(DiseaseType diseaseType) {
        diseaseTypeDao.add(diseaseType);
    }

    @Override
    public void updateDiseaseType(DiseaseType diseaseType) {
        diseaseTypeDao.update(diseaseType);
    }

    @Override
    public void deleteDiseaseType(Long id) {
        diseaseTypeDao.delete(id);
    }

    @Override
    public DiseaseType selectById(Long id) {
        return diseaseTypeDao.queryById(id);
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        diseaseTypeDao.updateStatus(id, status);
    }
}
