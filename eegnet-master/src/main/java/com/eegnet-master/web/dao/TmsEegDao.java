package com.eegnet.web.dao;

import com.eegnet.web.entity.TmsEeg;
import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

public interface TmsEegDao {

	List<TmsEeg> queryTmsEegList(@Param("page") int page,
      @Param("rows") int rows,
      @Param("patientGender") Integer patientGender,
      @Param("diseaseType") String diseaseType,
      @Param("diagnose") String diagnose,
			@Param("gatherDate") String gatherDate,
			@Param("eegDetail") String eegDetail,
			@Param("haveSleep") Integer haveSleep,
			@Param("birthday") String birthday,
			@Param("dimensions") Integer dimensions,
			@Param("patientNumber") String patientNumber,
			@Param("hospitalNumber") String hospitalNumber,
			@Param("isDeleted") Integer isDeleted);

	int queryTmsEegListCount(@Param("patientGender") Integer patientGender,
      @Param("diseaseType") String diseaseType,
      @Param("diagnose") String diagnose,
			@Param("gatherDate") String gatherDate,
			@Param("eegDetail") String eegDetail,
			@Param("haveSleep") Integer haveSleep,
			@Param("birthday") String birthday,
			@Param("dimensions") Integer dimensions,
			@Param("patientNumber") String patientNumber,
			@Param("hospitalNumber") String hospitalNumber,
			@Param("isDeleted") Integer isDeleted);
	
	void add(TmsEeg tmsEeg);
	
	TmsEeg queryById(Long id);
	
	void update(TmsEeg tmsEeg);
	
	void delete(Long id);

	Integer queryAllCount(String keyset);

	List<Map<String, Object>> getChartData(@Param("keyset")String keyset, @Param("startDate")String startDate, @Param("endDate")String endDate);

	void updateStatus(@Param("id")Long id, @Param("status")Integer status);

	int getCountByDate(@Param("startDate")String startDate);

	List<Map<String, Object>> queryTmsEegListByPatientNumber(@Param("patientNumber") String patientNumber);
}
