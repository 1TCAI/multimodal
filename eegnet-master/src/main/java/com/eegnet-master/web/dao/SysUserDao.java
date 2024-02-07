package com.eegnet.web.dao;

import com.eegnet.web.entity.SysUser;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
public interface SysUserDao {

	SysUser getByUsername(@Param("username") String username);

	List <SysUser> getAll(@Param("page") Integer page, @Param("rows") Integer rows, @Param("username") String username);

	int querySysUserListCount(@Param("username") String username);

	SysUser getByUserId(String userId);

	void updatePassword(SysUser sysUser);

	SysUser selectByUserId(String userId);

	void updateUserByUserId(SysUser sysUser);

	void addUser(SysUser sysUser);

	void addUserRole(SysUser sysUser);

	void updateStatusByUserId(SysUser sysUser);

    List<SysUser> selectByUsername(@Param("username") String username);

}
