package com.eegnet.web.dao;

import com.eegnet.web.entity.Banner;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface BannerDao {
	
	List<Banner> queryBannerList(@Param("page") int page,
	                             @Param("rows") int rows,
                                 @Param("type") Integer type,
                                 @Param("title") String title);
	
	int queryBannerListCount(@Param("type") Integer type, @Param("title") String title);
	
	void add(Banner banner);
	
	Banner queryById(Long id);
	
	void update(Banner banner);
	
	void delete(Long id);
	
	void updateVerify(@Param("verify") Integer verify, @Param("id") Long id) ;
}
