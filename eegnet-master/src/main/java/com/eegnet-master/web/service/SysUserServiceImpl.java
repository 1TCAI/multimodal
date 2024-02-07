package com.eegnet.web.service.impl;


import com.eegnet.web.dao.SysUserDao;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.request.SysUserRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.service.SysUserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SysUserServiceImpl implements SysUserService {

    @Autowired
    private SysUserDao sysUserDao;

    @Override
    public DataTablePagerResult<SysUser> getSysUserList(SysUserRequest request) {

        final String  username = request.getUsername();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<SysUser> result = new DataTablePagerResult<>();
        List<SysUser> data = sysUserDao.getAll(page, rows, username);
        Integer recordCount = sysUserDao.querySysUserListCount(username);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    public SysUser selectByUserId(String userId) {
        return sysUserDao.getByUserId(userId);
    }

    @Override
    public void updatePassword(SysUser sysUser) {
            String password = new SimpleHash("MD5", sysUser.getPassword(), sysUser.getUsername() + sysUser.getSalt(), 1024).toString();
            sysUser.setPassword(password);
        sysUserDao.updatePassword(sysUser);
    }

    @Override
    public SysUser selectUserByUserId(String userId) {
        return sysUserDao.selectByUserId(userId);
    }

    @Override
    public List<SysUser> selectByUsername(String username) {
        return sysUserDao.selectByUsername(username);
    }


    @Override
    public void updateUserByUserId(SysUser sysUser) {
        String pwd1 = sysUserDao.selectByUserId(sysUser.getUserId()).getPassword();
        String pwd2 = sysUser.getPassword();
        if(pwd1.equals(pwd2)) {
            sysUserDao.updateUserByUserId(sysUser);
        }else {
            String password = new SimpleHash("MD5", sysUser.getPassword(), sysUser.getUsername() + sysUser.getSalt(), 1024).toString();
            sysUser.setPassword(password);
            sysUserDao.updateUserByUserId(sysUser);

        }
    }

    @Override
    public void addUser(SysUser sysUser) {

        sysUser.setUserId(UUID.randomUUID().toString().replace("-", ""));
        String salt = RandomStringUtils.randomAlphabetic(12);
        sysUser.setSalt(salt);
        String password = new SimpleHash("MD5", sysUser.getPassword(), sysUser.getUsername() + salt, 1024).toString();
        sysUser.setPassword(password);
        sysUserDao.addUser(sysUser);
        sysUserDao.addUserRole(sysUser);
    }

    @Override
    public void updateStatusByUserId(SysUser sysUser) {
        sysUserDao.updateStatusByUserId(sysUser);
    }
}
