$.fn.Tooltip = function (options) {
    var defaults = {//默认值，显示速度和显示延迟
        speed: 200,
        delay: 300
    };
    var options = $.extend(defaults, options);
    getTip = function () {
        var tTip =
			"<div class='tip'>" +
				"<div class='tipMid'>" +
				"</div>" +
				"<div class='tipBtm'></div>" +
			"</div>";
        return tTip;
    }
    $("body").prepend(getTip());
    $(this).each(function () {
        var $this = $(this);
        var tip = $('.tip');
        var tipInner = $('.tip .tipMid');
        var tTitle = (this.title);
        this.title = "";
        var lock = false; //异步锁定，同时只能执行一个hover事件
        $this.hover(//鼠标hover事件
			function () {//鼠标进入
			    if (!lock) {
			        lock = true;
			        var offset = $(this).offset();
			        var tLeft = offset.left; //控件和窗口的左边距
			        var tTop = offset.top; //控件和窗口的上边据
			        var tWidth = this.offsetWidth; //自身宽
			        var tHeight = this.offsetHeight; //自身高
			        tipInner.html(tTitle);
			        setTip(tTop, tLeft, tWidth, tHeight);
			        setTimer();
			    }
			},
			function () {//鼠标移出
			    if (lock) {
			        stopTimer();
			        tip.hide();
			        lock = false;
			    }
			}
		);
        setTimer = function () {
            $this.showTipTimer = setInterval("showTip()", defaults.delay);
        }
        stopTimer = function () {
            clearInterval($this.showTipTimer);
        }
        setTip = function (top, left, width, height) {
            var scrollWidth = parseInt(document.body.scrollWidth); //网页宽度
            var scrollHeight = parseInt(document.body.scrollHeight); //网页高度
            var topOffset = tip.height(); //提示框高度
            var x = left - 30;
            var y = top - topOffset - 45;

            if (x < width) x = left;
            else if (x > (scrollWidth - 222)) x = scrollWidth - 222;
            if (y < height) y = top + height;
            var xTip = x + "px";
            var yTip = y + "px";
            tip.css({ 'top': yTip, 'left': xTip });
        }
        showTip = function () {
            stopTimer();
            tip.animate({ "top": "+=15px", "opacity": "toggle" }, defaults.speed);
        }
    });
};
function ToolTipsShow() {
    this.setToolTip = function (s, d) {
        $("[title]").Tooltip({ speed: s, delay: d });//添加提示样式，speed为弹出速度，delay为延迟
    }
}