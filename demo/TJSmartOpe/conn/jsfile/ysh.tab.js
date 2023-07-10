function $D(id) {
    return document.getElementById(id);
}
// 封装函数
helpers = function () {
    function reg(c) {
        return new RegExp('(\\s|^)' + c + '(\\s|$)');
    };
    function hasClass(el, c) {
        return el.className.match(reg(c));
    };
    function addClass(el, c) {
        if (!hasClass(el, c)) el.className += " " + c;
    };
    function removeClass(el, c) {
        if (hasClass(el, c)) {
            el.className = el.className.replace(reg(c), ' ');
        }
    };
    function addEvent(el, t, f) {
        if (el.addEventListener) {
            el.addEventListener(t, f, false);
            return true;
        } else if (el.attachEvent) {
            el.attachEvent('on' + t, f);
            return true;
        }
        return false;
    }
    return { addClass: addClass,
        removeClass: removeClass, hasClass: hasClass, addEvent: addEvent
    }
} ();

function tabInit(tabType) {
    /* 
    tabType={
    trigger:'触发事件',
    tabCurrentClass:'当前tab的className',
    delay:'事件触发的延时'
    [,auto:'是否自动播放',
    timer:'自动播放周期']
    }
    其后的tab->content对应关系以数组形式添加，以其id为参数识别，如下：
    [tab1.id,content1.id],[tab2.id,content2.id],......
    */
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments;
        if (arg[i].length > 2 && arg[i][2] == 'o') {
            helpers.addClass($D(arg[i][0]), tabType.tabCurrentClass);
            $D(arg[i][1]).style.display = 'block';
        } else {
            $D(arg[i][1]).style.display = 'none';
        }
        var func = function (i) {
            return function () {
                c_func = function () {
                    for (var j = 1; j < arg.length; j++) {
                        helpers.removeClass($D(arg[j][0]), tabType.tabCurrentClass);
                        $D(arg[j][1]).style.display = 'none';
                    }
                    $D(arg[i][1]).style.display = 'block';
                    helpers.addClass($D(arg[i][0]), tabType.tabCurrentClass);
                }
                t_func = setTimeout(c_func, tabType.delay)
            }
        };
        helpers.addEvent($D(arg[i][0]), tabType.trigger, func(i));
        if (tabType.trigger == 'click' || tabType.auto) {
            //helpers.addEvent($D(arg[i][0]), 'mouseout', function () {
            //    clearTimeout(t_func);
            //});
        } 
//        if (tabType.auto) {
//            helpers.addEvent($D(arg[i][0]), tabType.trigger, function () { clearInterval(changeFunc) });
//            helpers.addEvent($D(arg[i][1]), 'click', function () { clearInterval(changeFunc) });
//            helpers.addEvent($D(arg[i][1]), 'mouseout', function () {
//                sNum = watchfunc();
//                changeFunc = setInterval(changeTab, tabType.timer)
//            });
//            helpers.addEvent($D(arg[i][0]), 'mouseout', function () {
//                sNum = watchfunc();
//                changeFunc = setInterval(changeTab, tabType.timer)
//            });

//        }
    }
    //tab切换
    changeTab = function () {
        if (sNum == arg.length) sNum = 1;
        func(sNum)();
        sNum++;
    }
    //判断是否开始自动播放
    if (tabType.auto) {
        sNum = watchfunc();
        changeFunc = setInterval(changeTab, tabType.timer);

    }
    //监听当前激活的tab
    function watchfunc() {
        for (var i = 1; i < arg.length; i++) {
            if (helpers.hasClass($D(arg[i][0]), tabType.tabCurrentClass))
                return i;
        }
    }
}
