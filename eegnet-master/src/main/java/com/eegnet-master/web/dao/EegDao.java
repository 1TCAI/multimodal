package com.eegnet.web.dao;

import com.pandabus.web.entity.Eeg;
import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

public interface EegDao {

	List<Eeg> queryEegList(@Param("page") int page,
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

	int queryEegListCount(@Param("patientGender") Integer patientGender,
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
	
	void add(Eeg eeg);
	
	Eeg queryById(Long id);
	
	void update(Eeg eeg);
	
	void delete(Long id);

	Integer queryAllCount(String keyset);

	int getCountByDate(@Param("startDate")String startDate);

	List<Map<String, Object>> getChartData(@Param("keyset")String keyset, @Param("startDate")String startDate, @Param("endDate")String endDate);

	void updateStatus(@Param("id")Long id, @Param("status")Integer status);

	List<Map<String, Object>> queryEegListByPatientNumber(@Param("patientNumber") String patientNumber);
}
