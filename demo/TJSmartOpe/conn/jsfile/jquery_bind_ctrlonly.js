//使用方法：
//使用ctrlonly_bind（prikey，prival）的方式绑定一个功能页的对象，操作这个对象时，只允许一个，例如某个流程的某张单子只允许一人操作
//加载ctrlonly_showbeLock和ctrlonly_showbeUnLock方法来实现锁定和解锁的客户端操作，参数为锁的用户
//如果没有被其他人锁定，那么在离开界面的时候记得调用ctrlonly_lockremove(prikey，prival)来清除锁的痕迹
var ctrlonly_lockinfo = [];
function ctrlonly_bind(k, v) {//绑定控件,指定对象（锁住的功能页），指定值（锁住的对象）
    ctrlonly_lockinfo = ctrlonly_getlockInfo(k, v);
    if (ctrlonly_lockinfo && ctrlonly_lockinfo[1] != "0") {//已经被人锁定了
        ctrlonly_showbeLock(ctrlonly_lockinfo[0]);
        ctrlonly_lockflag = parseInt(ctrlonly_lockinfo[1], 10); //获取计数器
        setTimeout("ctrlonly_reviewlock('" + k + "','" + v + "')", 5500);
    }
}
var ctrlonly_iLockNochangeTime = 0;
function ctrlonly_reviewlock(k, v) {
    var templockinfo = ctrlonly_getlockInfo(k, v);
    if (templockinfo == null || templockinfo[1] == "0" || templockinfo[1] == ctrlonly_lockflag) {//没人编辑了
        if (templockinfo[1] == ctrlonly_lockflag) {
            if (ctrlonly_iLockNochangeTime < 10) {//IE崩溃的话重复十次，如果没消息就接手
                ctrlonly_iLockNochangeTime++;
                setTimeout("ctrlonly_reviewlock('" + k + "','" + v + "')", 5500);
                return false;
            }
        }
        ctrlonly_showbeUnLock(ctrlonly_lockinfo[0]);
    }
    else {
        ctrlonly_lockinfo = templockinfo;
        ctrlonly_lockflag = parseInt(ctrlonly_lockinfo[1], 10);
        setTimeout("ctrlonly_reviewlock()", 5500);
    }
}
function ctrlonly_showbeUnLock(user) {
    alert(user + "已经解除锁定");
}
function ctrlonly_showbeLock(user) {
    alert("已经被" + user + "锁定");
}
function ctrlonly_ajax(m, k, v, c) {
    res = { lock: null, user: null, count: null };
    $.ajax({
        url: "conn/ashx/CheckOnlyHandler.ashx", //先检查是否已经锁定
        type: "post",
        data: { method: m, prikey: k, privalue: v, count: c },
        cache: false,
        success: function (data) {
            res = data;
        },
        error: function (data, status, e) {
            alert(e);
        }
    });
    return res;
}
function ctrlonly_getlockInfo(k, v) {//获取当前锁定的信息
    return ctrlonly_ajax("check", k, v, "0");
}
var ctrlonly_lockflag = 0; //本次获取的锁定计数器
function ctrlonly_lockitem(k, v, c) {//更新锁定计数器
    if (isNaN(c)) c = 1;
    ctrlonly_ajax("add", k, v, c);
    setTimeout("ctrlonly_lockitem(++ctrlonly_lockflag)", 5000);
}
function ctrlonly_lockremove(k, v) {//清除锁定计数器
    ctrlonly_ajax("remove", k, v, "0");
}