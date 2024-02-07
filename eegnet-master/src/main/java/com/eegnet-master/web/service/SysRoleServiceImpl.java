package com.eegnet.web.service.impl;

import com.eegnet.web.dao.SysMenuDao;
import com.eegnet.web.dao.SysRoleDao;
import com.eegnet.web.entity.SysMenu;
import com.eegnet.web.entity.SysRole;
import com.eegnet.web.entity.SysRoleMenu;
import com.eegnet.web.entity.SysUser;
import com.eegnet.web.request.SysRoleRequest;
import com.eegnet.web.request.SysRoleUserRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.RoleMenuResponse;
import com.eegnet.web.service.SysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Service
public class SysRoleServiceImpl implements SysRoleService {

    @Autowired
    private SysRoleDao sysRoleDao;
    @Autowired
    private SysMenuDao sysMenuDao;

    @Override
    public List<RoleMenuResponse> getAllMenu() {
        List<RoleMenuResponse> rList = new ArrayList<>();
        RoleMenuResponse response;
        List<SysMenu> menuList = sysMenuDao.listAllMenus();
        for (SysMenu sysMenu : menuList) {
            rList.add(response = new RoleMenuResponse());
            response.setId(String.valueOf(sysMenu.getMenuId()));
            if (sysMenu.getParentId() > 0) {
                response.setParent(String.valueOf(sysMenu.getParentId()));
            } else {
                response.setParent("#");
            }
            if (Objects.equals(sysMenu.getMenuType(), "M")) {
                if (sysMenu.getParentId() > 0) {
                    response.setIcon("fa fa-bars");
                } else {
                    response.setIcon(sysMenu.getIcon());
                }
            } else if (Objects.equals(sysMenu.getMenuType(), "C")) {
                response.setIcon("fa fa-dot-circle-o");
            }
            response.setText(sysMenu.getMenuName());
        }
        return rList;
    }

    @Override
    public List<SysRole> getRoleName() {
        return sysRoleDao.getRoleName();
    }

    @Override
    public DataTablePagerResult<SysRole> listAllSysRole(SysRoleRequest request) {
        final String roleName = request.getRoleName();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<SysRole> result = new DataTablePagerResult<>();
        List<SysRole> data = sysRoleDao.listSysRole(page, rows, roleName);
        Integer recordCount = sysRoleDao.countListSysRole(roleName);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addSysRole(SysRole sysRole) {

        sysRoleDao.addSysRole(sysRole);

        if(null != sysRole.getRoleId()){
            if (!CollectionUtils.isEmpty(sysRole.getMenuIds())) {
                List<SysRoleMenu> list = new ArrayList<>();
                for (Integer i : sysRole.getMenuIds()) {
                    SysRoleMenu entity = new SysRoleMenu();
                    entity.setRoleId(sysRole.getRoleId());
                    entity.setMenuId(i);
                    list.add(entity);
                }
                sysRoleDao.insertSysRoleMenu(list);
            }
        }
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Boolean deleteSysRole(Integer roleId) {
        //验证当前角色下是否有人员
        List<SysUser> data = sysRoleDao.getRoleUserList(0, 0, roleId);
        if(!CollectionUtils.isEmpty(data)){
            return false;
        }
        try {
            sysRoleDao.deleteSysRole(roleId);
            sysRoleDao.deleteSysRoleMenu(roleId);
        }catch (Exception e){
            e.printStackTrace();
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return true;
    }

    @Override
    public List<SysUser> getAllSysRoleUser() {
        return sysRoleDao.getAllSysRoleUser();
    }

    @Override
    public SysMenu getSysRoleMenu(Integer roleId) {
        return sysRoleDao.getSysRoleMenu(roleId);
    }

    @Override
    public SysUser getSysRoleUser(Integer roleId) {
        return sysRoleDao.getSysRoleUser(roleId);
    }

    @Override
    public SysRole getMenuIdByRoleId(Integer roleId) {
        System.out.println("-----------------------------------------" + sysRoleDao.getMenuIdByRoleId(roleId));
        return sysRoleDao.getMenuIdByRoleId(roleId);
    }

    /**
     * @return com.eegnet.web.response.PageResult<com.eegnet.web.entity.SysUser>
     * @Description 查询角色下用户信息
     * @Date 11:26
     * @Param [request]
     **/
    @Override
    public DataTablePagerResult<SysUser> getRoleUserList(SysRoleUserRequest request) {
        final Integer roleId = request.getRoleId();
        final Integer rows = request.getLimit();
        final Integer page = (request.getPage() - 1) * rows;

        DataTablePagerResult<SysUser> result = new DataTablePagerResult<>();

        if (null == roleId) {
            return result;
        }

        List<SysUser> data = sysRoleDao.getRoleUserList(page, rows, roleId);
        Integer recordCount = sysRoleDao.countRoleUserList(roleId);

        result.setData(data);
        result.setRecordsTotal(recordCount);
        result.setRecordsFiltered(recordCount);
        result.setDraw(request.getDraw());
        return result;
    }

    /**
     * @return com.eegnet.web.response.PageResult<com.eegnet.web.entity.SysMenu>
     * @Description 查询角色下权限
     * @Date 14:45
     * @Param [roleId]
     **/
    @Override
    public List<SysRoleMenu> findSysRoleMenu(Integer roleId) {
        List<SysRoleMenu> newlist = new ArrayList<>();
        List<SysRoleMenu> list = sysRoleDao.findSysRoleMenu(roleId);
        for(SysRoleMenu i : list){
            boolean b = false;
            for(SysRoleMenu j : list){
                if(j.getParentId().equals(i.getMenuId())){
                    b = true;
                    break;
                }
            }
            if(!b){
                newlist.add(i);
            }
        }
        return newlist;
    }

    /**
     * @return boolean
     * @Description 更新角色权限
     * @Date 18:12
     * @Param [roleId, idArray]
     **/
    @Override
    public boolean updateRoleMenu(SysRole sysRole,List<Integer> idArray) {

        sysRoleDao.updateRole(sysRole);
        sysRoleDao.deleteSysRoleMenu(sysRole.getRoleId());

        if (!CollectionUtils.isEmpty(idArray)) {
            List<SysRoleMenu> list = new ArrayList<>();
            for (Integer i : idArray) {
                SysRoleMenu entity = new SysRoleMenu();
                entity.setRoleId(sysRole.getRoleId());
                entity.setMenuId(i);
                list.add(entity);
            }
            sysRoleDao.insertSysRoleMenu(list);
        }
        return true;
    }

    @Override
    public void updateRole(SysRole sysRole) {
        sysRoleDao.updateRole(sysRole);
    }

    @Override
    public SysRole getRole(Integer roleId) {
        return sysRoleDao.getRole(roleId);
    }
}
