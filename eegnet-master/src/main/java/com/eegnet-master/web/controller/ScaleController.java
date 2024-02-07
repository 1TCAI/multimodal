package com.eegnet.web.controller;

import com.eegnet.framework.annotation.ActionType;
import com.eegnet.framework.annotation.SysLog;
import com.eegnet.framework.util.ExcelImportUtils;
import com.eegnet.web.entity.Scale;
import com.eegnet.web.request.ScaleRequest;
import com.eegnet.web.request.ScaleTypeRequest;
import com.eegnet.web.response.DataTablePagerResult;
import com.eegnet.web.response.PageResult;
import com.eegnet.web.response.ResponseCode;
import com.eegnet.web.response.ResponseResult;
import com.eegnet.web.service.ScaleService;
import com.eegnet.web.service.ScaleTypeService;
import java.util.List;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author sun
 * @date 2018/12/29
 */
@Controller
@RequestMapping("/eeg/")
public class ScaleController {

    @Autowired
    private ScaleTypeService scaleTypeService;

    @Autowired
    private ScaleService scaleService;

    @RequestMapping("scale")
    @RequiresPermissions("scale:list")
    @SysLog(value = "查看-量表管理")
    public ModelAndView index() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("scale/index");
        ScaleTypeRequest request = new ScaleTypeRequest();
        request.setPage(0);
        request.setLimit(0);
        modelAndView.addObject("scaleTypeList", scaleTypeService.getScaleTypeList(request).getData());
        return modelAndView;
    }

    @RequestMapping(value = "scale/update", method = RequestMethod.GET)
    @RequiresPermissions("scale:update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("scale/update");
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping("scale/import")
    @RequiresPermissions("scale:create")
    public ResponseResult upload(@RequestParam(value = "excelFile", required = false) MultipartFile excelFile,
        @RequestParam(value = "scaleType") String scaleType) {
        //这里得到的是一个集合，里面的每一个元素是String[]数组
        List<String[]> list = ExcelImportUtils.readExcel(excelFile);
        return scaleService.importList(list, scaleType);
    }

    @ResponseBody
    @RequestMapping("scale/list")
    public DataTablePagerResult<Scale> list(ScaleRequest request) {
        DataTablePagerResult<Scale> result = scaleService.getScaleList(request);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("scale/getTitle")
    public List<String> getTitle(@RequestParam(value = "scaleType", required = false) String scaleType) {
        return scaleService.getTitle(scaleType);
    }

    @ResponseBody
    @RequestMapping("scale/selectById")
    public PageResult<Scale> selectById(@RequestParam(value = "id", required = false) Long id) {
        PageResult<Scale> result = new PageResult<>();
        Scale scale = scaleService.selectById(id);
        result.setData(scale);
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }

    @ResponseBody
    @RequestMapping("scale/edit")
    @RequiresPermissions("scale:update")
    @SysLog(value = "修改-EEG信息", type = ActionType.UPDATE)
    public PageResult<Void> edit(@RequestBody Scale scale) {
        scaleService.updateScale(scale);
        PageResult<Void> result = new PageResult<>();
        result.setMsg(ResponseCode.OK.msg);
        result.setCode(ResponseCode.OK.code);
        return result;
    }
}
