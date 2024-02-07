jQuery.validator.addMethod("checkInput", function(value, element) {
    var pattern = new RegExp("[.`~!@#$^&*=|{}':',\\[\\]<>《》?~！@#￥……&*|{}【】‘；：”“'。，、？' ']");
    if(pattern.test(value)) {
        return false;
    } else if(value.indexOf(" ") != -1){
        return false;
    } else {
        return true;
    }
}, "禁止输入特殊字符及空格");