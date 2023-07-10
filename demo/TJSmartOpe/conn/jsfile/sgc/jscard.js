/*
* 请将html添加到body中
* 如：
* var div = document.createElement("div");
* div.textContent = "我将被添加到body中";
* body.appendChild(div);
* ***********jQuery写法*********
* $(body).append("<div>我将被添加到body中</div>");
*/
/*
var body = global.body;
//外部参数，如筛选器，联动参数，形如：[{name:'age',value:23}]
var params = global.params;
*/
var objData = '';

window.callback = function (result) {
    var jsonObj = $.parseJSON(result);
    //debugger;
    window.showCard(jsonObj.data);
}

window.showCard = function (option) {
    var message = {
        type: 'renderCard',
        data: option
    };
    //debugger
    window.postMessage(JSON.stringify(message), '*');
}

/* 与其他厂家重复，同意后删除
if(window.top.addEventListener){
	window.top.addEventListener("message",function(event){
		var message = JSON.parse(event.data); //通过postMessage首参传递过来数据在event.data中
		if(message.type === 'renderCard'){
			renderCard(message.data);
		};
	}, false);
}else{
	window.top.attachEvent("onmessage",function(){
		var message = JSON.parse(window.event.data); //通过postMessage首参传递过来数据在event.data中
		if(message.type === 'renderCard'){
			renderCard(message.data);
		};
	});
}
*/

//isEqual：判断两个对象是否键值对应相等
function isEqual(a, b) {
    //如果a和b本来就全等
    if (a === b) {
        //判断是否为0和-0
        return a !== 0 || 1 / a === 1 / b;
    }
    //判断是否为null和undefined
    if (a == null || b == null) {
        return a === b;
    }
    //接下来判断a和b的数据类型
    var classNameA = toString.call(a),
        classNameB = toString.call(b);
    //如果数据类型不相等，则返回false
    if (classNameA !== classNameB) {
        return false;
    }
    //如果数据类型相等，再根据不同数据类型分别判断
    switch (classNameA) {
        case '[object RegExp]':
        case '[object String]':
            //进行字符串转换比较
            return '' + a === '' + b;
        case '[object Number]':
            //进行数字转换比较,判断是否为NaN
            if (+a !== +a) {
                return +b !== +b;
            }
            //判断是否为0或-0
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }
    //如果是对象类型
    if (classNameA == '[object Object]') {
        //获取a和b的属性长度
        var propsA = Object.getOwnPropertyNames(a),
            propsB = Object.getOwnPropertyNames(b);
        if (propsA.length != propsB.length) {
            return false;
        }
        for (var i = 0; i < propsA.length; i++) {
            var propName = propsA[i];
            //如果对应属性对应值不相等，则返回false
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    }
    //如果是数组类型
    if (classNameA == '[object Array]') {
        if (a.toString() == b.toString()) {
            return true;
        }
        return false;
    }
}

/**
 * 初始化节点数据时触发
* @param {Object} data
*/
//global.init = function (data) {
$(function () {
    return;
    /* 
     var params = global.params;  
         //debugger;
     var devid = null;
     if(params && params.length > 0){
        devid = params[0].value;
     }
     if(devid == null){
         return;
     }
     */
    //5s一次 time dev 
    var timer1 = "";
    var temp1 = 0;
    function func1() {
        timer1 = setTimeout(func1, 10000);
        console.info("here............10s了");
        //每5秒进行请求，返回的数据判断如果有新增，就调卡片接口弹出
        $.ajax({
            url: 'http://26.47.30.112:9000/osp/iswserver/rest/IswServer/getHvdcFaultInfo?callback=callback',
            dataType: 'json',
            crossDomain: true,
            type: 'post',
            success: function (result) {
                console.info(result);
                if (result != null) {
                    /* if(objData == ""){
                          console.info("1111111111111111");
                                  getDeviceFaultCard(result.event_result[0].equip_id);
                          objData = result;
                     }*/
                    console.info(result.event_result[0].fault_time);
                    console.info(isEqualTime(result.event_result[0].fault_time))
                    console.info(objData)

                    getDeviceFaultCard(result.event_result[0].equip_id);//add by tsy 20190422

                    //判断和之前一次查询到的结果是否一样的
                    /*if(objData == ""){
                         for(var i = 0;i<result.event_result.length;i++){
                           if(isEqualTime(result.event_result[i].fault_time)){
                             console.info("22222222222222");
                             //不一样调卡片接口
                             getDeviceFaultCard(result.event_result[i].equip_id);
                                   }
                       }
                      objData = result;
                    }*/
                }
            }
        });

    }
    timer1 = setTimeout(func1, 0);

    //getDeviceFaultCard("120699010000000001");

    //调卡片服务接口
    function getDeviceFaultCard(devid) {
        $.ajax({
            url: 'http://26.47.30.24:9000/osp/devFaultService/rest/fault/getDeviceFaultCardInfo',
            data: { "devid": devid },
            dataType: 'json',
            type: 'get',
            success: function (message) {
                renderCard(message.data);
            }
        });
    }
    function isEqualTime(time) {
        var date = new Date();
        var datetime = date.getFullYear()
            + ""// "年"
            + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
                + (date.getMonth() + 1))
            + ""// "月"
            + (date.getDate() < 10 ? "0" + date.getDate() : date
                .getDate())
            + ""
            + (date.getHours() < 10 ? "0" + date.getHours() : date
                .getHours())
            + ""
            + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                .getMinutes())
            + ""
            + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                .getSeconds());
        console.log("datetime:" + datetime)
        console.log("time:" + time)
        if (datetime <= time) {
            return true;
        } else {
            return false;
        }
    }
});

/**
 * 更新节点数据时触发
 * @param {Object} data
 */
/*
global.update = function(data) {
	
}
*/
/*
$('.').on('keydown', debounce(func1, 2500));
function debounce(fn, delay){
	    var timer = null; // 声明计时器
	    return function(){
	        var context = this, args = arguments;
	        clearTimeout(timer);
	        timer = setTimeout(function(){
	            fn.apply(context, args);
	        }, delay);
	    };
	}
*/
/**
 * 窗口大小改变的时候触发
* @param {Event} e
*/
/*
global.resize = function(e) {
   
}
*/
/**
 * 设备横屏竖屏切换时触发
 * @param {Object} e
 */
/*
global.orientationchange = function(e) {

}
*/