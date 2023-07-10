//广告控件扩展脚本
// wanglei 20120612 add
$.fn.Advertise = function (options) {
    var defaults = {
        direct: "left",
        scrollSpeed: "2000",
        imgwidth: "100",
        imgheight: "100",
        items: [],
        showcount: 1,
        changecount: 1,
        isshowtext: false
    }
    var textheight = 25;
    var options = $.extend(defaults, options);
    var self = $(this);
    var containerHTML = "<ul>";
    $.each(options.items, function (i, n) {
        containerHTML += "<li>";
        containerHTML += "<a href='" + n.url + "' target='" + n.target + "'>";
        containerHTML += "<img src='" + n.img + "' />";
        if (options.isshowtext) {
            containerHTML += "<p style='height:" + textheight + "px; line-height:" + textheight + "px; margin: 0px; padding:0px; text-align:center; width:" + options.imgwidth + "'>" + n.text + "</p>";
        }
        containerHTML += "</a>";
        containerHTML += "</li>";
    });
    if (!options.isshowtext) { textheight = 0; }
    containerHTML += "</ul>";
    self.html(containerHTML);
    var varUl = self.children().eq(0);
    var varLi = varUl.children();
    varUl.css({ position: "absolute" });
    varUl.css('padding', '0px').css('margin', '0px');
    varLi.css('float', 'left').css("list-style-type", "none");
    varLi.find('img').css('width', options.imgwidth).css("height", options.imgheight);
    var itemCount = options.items.length;
    var containerWidth = 0;
    var containerHeigth = 0;
    if (options.direct == 'left' || options.direct == 'right') {
        containerWidth = varLi.find('img').eq(0).width() * options.showcount;
        containerHeigth = varLi.find('img').eq(0).height();
    }
    else {
        containerWidth = varLi.find('img').eq(0).width();
        containerHeigth = varLi.find('img').eq(0).height() * options.showcount;
    }
    self.css('width', containerWidth + 2).css('height', containerHeigth + textheight);
    var rleft = 0;
    switch (options.direct) {
        case 'left':
            varUl.css('width', (options.imgwidth * itemCount)*2 + 'px');
            varUl.css('left', '0px');
            break;
        case 'right':
            varUl.css('width', (options.imgwidth * itemCount) * 2 + 'px');
            varUl.css('right', '0px');
            break;
        case 'top':
            varUl.css('height', (options.imgheight * itemCount) * 2 + 'px');
            varUl.css('left', '0px');
            break;
        case 'bottom':
            varUl.css('height', (options.imgheight * itemCount) * 2 + 'px');
            varUl.css('left', '0px').css('bottom', '0px');
            break;
        default:
    }
    varUl.append(varLi.clone());
    var h = 0;
    h = setInterval(scrollContent, options.scrollSpeed);
    var i = 0;
    function scrollContent() {
        i++;
        var iw = varLi.find('img').eq(0).width() * options.changecount;
        var ih = varLi.find('img').eq(0).height() * options.changecount + textheight;
        var param = {};
        switch (options.direct) {
            case 'left':
                param = { left: '-' + iw };
                break;
            case 'right':
                param = { right: "-" + iw };
                break;
            case 'top':
                param = { top: '-' + ih };
                break;
            case 'bottom':
                param = { bottom: '-' + ih };
                break;
            default:
        }
        self.children().eq(0).animate(param, 'slow', function () {
            for (var n = 0; n < options.changecount; n++) {
                switch (options.direct) {
                    case 'left':
                    case 'top':
                        self.children().eq(0).children().first().insertAfter(self.children().eq(0).children().last());
                        self.children().eq(0).css('left', '0px').css('top', '0px');
                        break;
                    case 'right':
                        self.children().eq(0).prepend(self.children().eq(0).children().last().clone());
                        self.children().eq(0).children().last().remove();
                        self.children().eq(0).css('right', '0px').css('top', '0px');
                        break;
                    case 'bottom':
                        self.children().eq(0).prepend(self.children().eq(0).children().last().clone());
                        self.children().eq(0).children().last().remove();
                        self.children().eq(0).css('bottom', '0px');
                        break;
                    default:
                }
            }
        });
    }

}
