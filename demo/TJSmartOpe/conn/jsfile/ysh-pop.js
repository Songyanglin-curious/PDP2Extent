//兼容ie6的fixed代码 
//jQuery(function($j){
//	$j('#pop').positionFixed()
//})
(function ($j) {
    $j.positionFixed = function (el, iRight, iBottom) {
        $j(el).each(function () {
            new fixed(this, iRight, iBottom)
        })
        return el;
    }
    $j.fn.positionFixed = function (iRight, iBottom) {
        return $j.positionFixed(this, iRight, iBottom)
    }
    var fixed = $j.positionFixed.impl = function (el, iRight, iBottom) {
        var o = this;
        o.sts = {
            target: $j(el).css('position', 'absolute'),
            container: $j(window)
        }
        o.sts.currentCss = {
            top: o.sts.target.css('top'),
            right: o.sts.target.css('right'),
            bottom: o.sts.target.css('bottom'),
            left: o.sts.target.css('left')
        }
        //if (!o.ie6) return;
        o.bindEvent(iRight, iBottom);
    }
    $j.extend(fixed.prototype, {
        ie6: $.browser.msie && $.browser.version < 7.0,
        bindEvent: function (iRight, iBottom) {
            var o = this;
            o.sts.target.css('position', 'absolute')
            o.overRelative().initBasePos(iRight, iBottom);
            o.sts.target.css(o.sts.basePos)
            o.sts.container.scroll(o.scrollEvent()).resize(o.resizeEvent(iRight, iBottom));
            o.setPos();
        },
        overRelative: function () {
            var o = this;
            var relative = o.sts.target.parents().filter(function () {
                if ($j(this).css('position') == 'relative') return this;
            })
            if (relative.size() > 0) relative.after(o.sts.target)
            return o;
        },
        initBasePos: function (iRight, iBottom) {
            var o = this;
            o.sts.basePos = {
                top: iBottom ? $(window).height() - iBottom : (o.sts.target.offset().top - (o.sts.currentCss.top == 'auto' ? o.sts.container.scrollTop() : 0)),
                left: iRight ? $(window).width() - iRight : (o.sts.target.offset().left - (o.sts.currentCss.left == 'auto' ? o.sts.container.scrollLeft() : 0))
            }
            return o;
        },
        setPos: function () {
            var o = this;
            o.sts.target.css({
                top: o.sts.container.scrollTop() + o.sts.basePos.top,
                left: o.sts.container.scrollLeft() + o.sts.basePos.left
            })
        },
        scrollEvent: function () {
            var o = this;
            return function () {
                o.setPos();
            }
        },
        resizeEvent: function (iRight, iBottom) {
            var o = this;
            return function () {
                setTimeout(function () {
                    o.sts.target.css(o.sts.currentCss)
                    o.initBasePos(iRight, iBottom);
                    o.setPos()
                }, 1)
            }
        }
    })
})(jQuery)


function Pop(options) {
    var defaults = {
        title: "提示", //标题行内容
        info: "", //弹出框内容
        infoUrl: "",//弹出页面
        popClass: "pop", //整体样式
        popTitleClass: "popTitle", //标题样式
        popContentClass: "popContent", //内容样式
        popCloseClass: "popClose", //关闭按钮样式
        delayTime: 0 //多长时间后自动隐藏，单位秒
    };
    options = $.extend(defaults, options);
    var popDiv = null, titleHeight = 0, contentHeight = 0;
    this.init = function () {
        addStyle(".pop{background:#fff;width:260px;border:1px solid #c0c0c0;font-size:12px;position: absolute;right:10px;bottom:10px;display:none;}");
        addStyle(".popTitle{background: #E0E7EB;border-bottom: 1px solid #e0e0e0;position: relative;padding: 0 0 0 10px;cursor: pointer;font-size: 14px;font-weight: bold;color: #666;line-height: 32px;height: 32px;}");
        addStyle(".popContent{padding: 0;height: 350px;overflow-y: auto;line-height:150%;}");
        addStyle(".popClose{position:absolute;right:10px;top:1px;color:red;}");

        $("body").append("<div class='" + options.popClass + "'><div class='" + options.popTitleClass + "'>" + options.title
            + "<a class='" + options.popCloseClass + "'>×</a>" + "</div>"
            + "<div class='" + options.popContentClass + "'>" 
            + (options.infoUrl ? "<iframe style='height:100%;width:100%;' frameborder='no' border='0' src='" + options.infoUrl + "'></iframe>" : options.info) + "</div></div>");

        popDiv = $("." + options.popClass);
        titleHeight = $("." + options.popTitleClass).height();
        contentHeight = $("." + options.popContentClass).height();
        this.show();
        this.close();
    };
    this.show = function () {
        popDiv.show();
        jQuery(function ($j) {
            popDiv.positionFixed(popDiv.width() + 10, titleHeight + contentHeight + 10);
        });
        if (options.delayTime > 0) {
            popDiv.delay(options.delayTime * 1000).animate({ "margin-top": popDiv.height() - titleHeight, "height": titleHeight }, 1000);
        }
    };
    this.close = function () {
        $("." + options.popTitleClass).click(function () {
            popDiv.animate({ "margin-top": popDiv.height() - titleHeight, "height": popDiv.height() > titleHeight ? titleHeight : titleHeight + contentHeight }, 1000);
        });
        $("." + options.popCloseClass).click(function () {
            popDiv.hide();
        });
    };
    this.init();
}