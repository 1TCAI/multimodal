package com.eegnet.web.dao;

import com.eegnet.web.entity.Scale;
import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

public interface ScaleDao {

	List<Scale> queryScaleList(@Param("page") int page,
      @Param("rows") int rows,
      @Param("scaleType") String scaleType,
			@Param("patientGender") Integer patientGender,
			@Param("diseaseType") String diseaseType,
			@Param("diagnose") String diagnose,
			@Param("birthday") String birthday,
			@Param("dimensions") Integer dimensions,
			@Param("patientId") String patientId,
			@Param("patientNumber") String patientNumber,
			@Param("rowDate") String rowDate);

	int queryScaleListCount(
      @Param("scaleType") String scaleType,
			@Param("patientGender") Integer patientGender,
			@Param("diseaseType") String diseaseType,
			@Param("diagnose") String diagnose,
			@Param("birthday") String birthday,
			@Param("dimensions") Integer dimensions,
			@Param("patientId") String patientId,
			@Param("patientNumber") String patientNumber,
			@Param("rowDate") String rowDate);

	void addBatch(@Param("scaleList")List<Scale> scaleList);

	Scale queryScaleByPatientNumberAndDateAndScaleType(@Param("patientNumber") String patientNumber,
			@Param("rowDate") String rowDate,
			@Param("scaleType") String scaleType);

	void updateById(Scale scale);

	Scale queryById(Long id);

	int getCountByDate(@Param("startDate")String startDate);

	List<Map<String, Object>> getChartData(@Param("keyset")String keyset, @Param("startDate")String startDate, @Param("endDate")String endDate);

	Integer queryAllCount(String keyset);
}
