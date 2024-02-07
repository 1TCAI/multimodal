package com.eegnet.web.dao;

import com.eegnet.web.entity.ScaleType;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ScaleTypeDao {

	List<ScaleType> queryScaleTypeList(@Param("page") int page,
      @Param("rows") int rows,
      @Param("scaleType") String scaleType,
			@Param("isDeleted") Integer isDeleted);

	int queryScaleTypeListCount(
      @Param("scaleType") String scaleType,
			@Param("isDeleted") Integer isDeleted);
	
	void add(ScaleType scaleType);
	
	ScaleType queryById(Long id);
	
	void update(ScaleType scaleType);
	
	void delete(Long id);

	void updateStatus(@Param("id")Long id, @Param("status")Integer status);
}
