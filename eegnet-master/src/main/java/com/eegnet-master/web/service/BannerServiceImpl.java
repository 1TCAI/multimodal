package com.eegnet.web.service.impl;

import com.eegnet.web.dao.BannerDao;
import com.eegnet.web.entity.Banner;
import com.eegnet.web.request.BannerRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * @author sun
 * @date 2019/06/10
 */

@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerDao bannerDao;

    @Override
    public DataTablePagerResult<Banner> getBannerList(BannerRequest request) {
        final String title = request.getTitle();
        final Integer type = request.getType();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<Banner> result = new DataTablePagerResult<>();
        List<Banner> data = bannerDao.queryBannerList(page, rows, type, title);
        Integer recordCount = bannerDao.queryBannerListCount(type, title);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public String uploadImg(File file, String folderPath) throws IOException {
//        String picUrl = UpYunUtil.writePic(file, folderPath);
        return "";
    }

    @Override
    public void addBanner(Banner banner) {
        bannerDao.add(banner);
    }

    @Override
    public void updateBanner(Banner banner) {
        bannerDao.update(banner);
    }

    @Override
    public void deleteBanner(Long id) {
        bannerDao.delete(id);
    }

    @Override
    public void verify(Integer verify, Long id) {
        bannerDao.updateVerify(verify, id);
    }

    @Override
    public Banner selectById(Long id) {
        return bannerDao.queryById(id);
    }
}
