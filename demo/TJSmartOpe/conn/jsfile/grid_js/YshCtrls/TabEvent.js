var TabEvent = {
    binding: function (tabObj) { TabEvent.change(tabObj.parentElement.parentElement.parentElement.id); },
    change: function (tabId) {
        var tabs = document.getElementById(tabId);
        var tablis = tabs.childNodes[0].getElementsByTagName("div");
        var tabcs = tabs.childNodes[1].getElementsByTagName("div");
        for (var i = 0, len = tablis.length; i < len; i++) {
            (function (a) {
                tablis[a].onclick = function () {
                    addClass(clearAllClass(tablis, 'on')[a], 'on');
                    addClass(clearAllClass(tabcs, 'show')[a], 'show');
                }
            })(i);
        }
        clearAllClass = function (arr, name) {
            var lens = arr.length, re = new RegExp(name, 'gi');
            for (var j = 0; j < lens; j++) {
                if (re.test(arr[j].className)) {
                    arr[j].className = arr[j].className.replace(re, '');
                }
            }
            return arr;
        },
        addClass = function (o, name) {
            var re = new RegExp(name, 'gi');
            if (!re.test(o.className)) o.className += " " + name;
            return o;
        };
    }
}