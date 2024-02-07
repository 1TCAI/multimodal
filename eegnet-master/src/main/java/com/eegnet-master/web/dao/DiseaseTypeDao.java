package com.eegnet.web.dao;

import com.eegnet.web.entity.DiseaseType;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface DiseaseTypeDao {

	List<DiseaseType> queryDiseaseTypeList(@Param("page") int page,
      @Param("rows") int rows,
      @Param("diseaseType") String diseaseType,
			@Param("isDeleted") Integer isDeleted);

	int queryDiseaseTypeListCount(
      @Param("diseaseType") String diseaseType,
			@Param("isDeleted") Integer isDeleted);
	
	void add(DiseaseType diseaseType);
	
	DiseaseType queryById(Long id);
	
	void update(DiseaseType diseaseType);
	
	void delete(Long id);

	void updateStatus(@Param("id")Long id, @Param("status")Integer status);
}
