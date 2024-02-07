package com.eegnet.web.service.impl;

import com.eegnet.web.dao.ScaleTypeDao;
import com.eegnet.web.entity.ScaleType;
import com.eegnet.web.request.ScaleTypeRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.service.ScaleTypeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author sun
 * @date 2019/06/10
 */

@Service
public class ScaleTypeServiceImpl implements ScaleTypeService {

    @Autowired
    private ScaleTypeDao scaleTypeDao;

    @Override
    public DataTablePagerResult<ScaleType> getScaleTypeList(ScaleTypeRequest request) {
        final String scaleType = request.getScaleType();
        final Integer isDeleted = request.getIsDeleted();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<ScaleType> result = new DataTablePagerResult<>();
        List<ScaleType> data = scaleTypeDao.queryScaleTypeList(page, rows, scaleType, isDeleted);
        Integer recordCount = scaleTypeDao.queryScaleTypeListCount(scaleType, isDeleted);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public void addScaleType(ScaleType scaleType) {
        scaleTypeDao.add(scaleType);
    }

    @Override
    public void updateScaleType(ScaleType scaleType) {
        scaleTypeDao.update(scaleType);
    }

    @Override
    public void deleteScaleType(Long id) {
        scaleTypeDao.delete(id);
    }

    @Override
    public ScaleType selectById(Long id) {
        return scaleTypeDao.queryById(id);
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        scaleTypeDao.updateStatus(id, status);
    }
}
