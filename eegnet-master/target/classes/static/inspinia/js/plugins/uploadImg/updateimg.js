window.onload = function () {
    var input = document.getElementById("upgteimg");
    var showui = document.getElementById("showui");
    var result;
    var dataArr = []; // 储存所选图片的结果(文件名和base64数据)
    var fd; //FormData方式发送请求
    var showinput = document.getElementById("showinput");
    // var oSubmit = document.getElementById("start_upload");

    function randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    if (typeof FileReader === 'undefined') {
        Alert("", "抱歉，你的浏览器不支持 FileReader");
        input.setAttribute('disabled', 'disabled');
    } else {
        input.addEventListener('change', readFile, false);
    }

    function readFile() {

        fd = new FormData();
        var iLen = this.files.length;
        var index = 0;
        var currentReViewImgIndex = 0;
        var dataresult;
        for (var i = 0; i < iLen; i++) {
            if (!input['value'].match(/.jpg|.gif|.png|.jpeg|.bmp/i)) {　　 //判断上传文件格式
                return Alert("", "上传的图片格式不正确，请重新选择");
            }

            var reader = new FileReader();
            reader.index = i;
            fd.append(i, this.files[i]);
            reader.readAsDataURL(this.files[i]); //转成base64
            reader.fileName = this.files[i].name;
            reader.files = this.files[i];
            reader.onload = function (e) {
                dataresult = this.result;
                if (document.getElementById("imgSize")) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        var imgsize = this.width + "*" + this.height;
                        if ($('#imgSize').val().indexOf(imgsize) == -1) {
                            Alert("", "图片尺寸不正确，请重新选择", "error");
                            return false;
                        }
                        // send();
                        loadingImg(dataresult);
                    };
                } else {
                    // send();
                    loadingImg(this.result);
                }
            }
        }

        function loadingImg(data) {
            var imgMsg = {
                name: randomString(5), //获取文件名
                base64: data, //reader.readAsDataURL方法执行完后，base64数据储存在reader.result里
            };
            dataArr.push(imgMsg);
            for (var j = 0; j < dataArr.length; j++) {
                currentReViewImgIndex = j
            }
            result = '<div class="showdiv"><img class="center" src="../../../../inspinia/js/plugins/uploadImg/img/delete.svg" /></div><img id="img' + currentReViewImgIndex + randomString(1) + randomString(2) + randomString(5) + '" class="showimg" src="' + data + '" />';
            var li = document.createElement('li');//<img class="left" src="img/Arrow_left.svg" /> <img class="right" src="img/Arrow_right.svg" />
            li.innerHTML = result;
            showui.appendChild(li);
            document.getElementById('upimgId').style.display = 'none';
            index++;
        }
    }

    function onclickimg() {
        var dataArrlist = dataArr.length;
        var lilength = document.querySelectorAll('ul#showui li');
        for (var i = 0; i < lilength.length; i++) {
            // 左移
            // lilength[i].getElementsByTagName('img')[0].onclick = function (num) {
            //     return function () {
            //         if (num == 0) {
            //         } else {
            //             var list = 0;
            //             for (var j = 0; j < dataArr.length; j++) {
            //                 list = j
            //             }
            //             var up = num - 1;
            //             dataArr.splice(up, 0, dataArr[num]);
            //             dataArr.splice(num + 1, 1)
            //             var lists = $("ul#showui li").length;
            //             for (var j = 0; j < lists; j++) {
            //                 var usid = $("ul#showui li")[j].getElementsByTagName('img')[3];
            //                 $("#" + usid.id + "").attr("src", dataArr[j].base64)
            //             }
            //         }
            //     }
            // }(i)
            //删除图标
            lilength[i].getElementsByTagName('img')[0].onclick = function (num) {
                return function () {
                    // if (dataArr.length == 1) {
                    //     dataArr = [];
                    $("ul#showui").html("");
                    // } else {
                    //     $("ul#showui li:eq(" + num + ")").remove();
                    //     dataArr.splice(num, 1)
                    // }
                    $('#upgteimg').val('');
                    $('#uploadImgUrl').val('');
                    document.getElementById('upimgId').style.display = '';
                }
            }(i)
            //右箭头图标
            // lilength[i].getElementsByTagName('img')[2].onclick = function(num) {
            // 	return function() {
            // 		var list = 0;
            // 		for(var j = 0; j < dataArr.length; j++) {
            // 			list = j
            // 		}
            // 		var datalist = list + 1;
            // 		dataArr.splice(datalist, 0, dataArr[num]);
            // 		dataArr.splice(num, 1)
            // 		var lists = $("ul#showui li").length;
            // 		for(var j = 0; j < lists; j++) {
            // 			var usid = $("ul#showui li")[j].getElementsByTagName('img')[3];
            // 			$("#" + usid.id + "").attr("src", dataArr[j].base64)
            // 		}
            //
            // 	}
            // }(i)

        }
    }

    showui.addEventListener("click", function () {
        onclickimg();
    }, true)

// oSubmit.onclick = function () {
//     if (!dataArr.length) {
//         return Alert("", '请先选择文件');
//     }
//     send(dataArr);
// }

// function send() {
//     $('#upgteimg').val();
//     for (var j = 0; j < dataArr.length; j++) {
//         console.log(dataArr[j].name)
//     }
// }
};

function initImg(imgUrlVal) {
    var str = '<div class="showdiv"><img class="center" src="../../../../inspinia/js/plugins/uploadImg/img/delete.svg" /></div><img class="showimg"  src="' + imgUrlVal + '" />';
    var li = document.createElement('li');
    li.innerHTML = str;
    var showui = document.getElementById("showui");
    showui.appendChild(li);
    document.getElementById('upimgId').style.display = 'none';
}

function uploadError() {
    $("ul#showui").html("");
    $('#upgteimg').val('');
    $('#uploadImgUrl').val('');
    document.getElementById('upimgId').style.display = '';
}

function uploadSuccess(url) {
    $('#uploadImgUrl').val(url);
    $("#upgteimg").val('');
}