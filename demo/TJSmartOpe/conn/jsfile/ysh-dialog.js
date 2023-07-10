(function ($) {
    $this = null;
    var methods = {
        init: function (options) {
            $this = $(this);
            var self = this;
            this._dragging = false;
            this._options = options;
            this.dh = null;
            this.zIndex = 10009;
            this.iframeID = 'ifr' + $(this).attr('id');
            $(this).removeAttr('width');
            $(this).removeAttr('height');
            $(this).removeAttr('class').attr('class', 'dialog-box');
            $(this).css('width', (parseInt(options.width) + 15) + 'px');
            $(this).css('height', (parseInt(options.height) + 40) + 'px');
            $(this).css('z-index', self.zIndex);
            var html = "<table width=100% height=100% cellpadding=0 cellspacing=0><tr><td valign=top  class='dialog-header' >" +
				        "<div class='dialog-title'>" + options.title + "</div>" +
				        "<div class='dialog-close'></div>" +
			        "</td></tr>" +
			        "<tr><td valign=top class='dialog-content'>" + $(this).html() + "</td></tr></table>";
            $(this).html(html);
            $('form')[0].appendChild($(this)[0]);

            //遮挡层
            $(this).after($("<iframe id='" + this.iframeID + "' style='position:absolute; top:0px ; left:0px;'></iframe>"));
            $('#' + this.iframeID).css('width', (parseInt(options.width) + 15) + 'px');
            $('#' + this.iframeID).css('height', (parseInt(options.height) + 40) + 'px');

            this.dh = $(this);
            $(this).find(".dialog-close").unbind('click').click(function () {
                $('#' + self.iframeID).hide(); self.dh.hide();
                if (typeof options.closejs != 'undefined') {
                    eval(options.closejs);
                }
            });
            this.draggable = function () {
                self.dh.find('.dialog-header, .dialog-content').mousedown(function (event) {
                    if (event.srcElement.className == "dialog-header" || event.srcElement.className == "dialog-content") {
                        self._ox = self.dh.position().left;
                        self._oy = self.dh.position().top;
                        self._mx = event.clientX;
                        self._my = event.clientY;
                        self._dragging = true;
                    }
                });
                var handle = $(document);
                $(document).mousemove(function (event) {
                    if (self._dragging == true) {
                        self.dh.css({
                            left: self._ox + event.clientX - self._mx,
                            top: self._oy + event.clientY - self._my
                        });
                        $('#' + self.iframeID).css({
                            left: self._ox + event.clientX - self._mx,
                            top: self._oy + event.clientY - self._my
                        });
                        if (typeof options.dragjs != 'undefined') {
                            eval(options.dragjs);
                        }
                    }
                }).mouseup(function () {
                    self._mx = null;
                    self._my = null;
                    self._dragging = false;
                });
                var e = self.dh.find('.dialog-header, .dialog-content').get(0);
                e.unselectable = "on";
                e.onselectstart = function () {
                    return false;
                };
                if (e.style) {
                    e.style.MozUserSelect = "none";
                }
            }
            this.draggable();
            this.GetClientHeight = function () {
                if ($.browser.msie && $.browser.version < 7) {
                    var scrollHeight = Math.max(
					document.documentElement.scrollHeight,
					document.body.scrollHeight
				);
                    var offsetHeight = Math.max(
					document.documentElement.offsetHeight,
					document.body.offsetHeight
				);

                    if (scrollHeight < offsetHeight) {
                        return $(window).height();
                    } else {
                        return scrollHeight;
                    }
                } else {
                    return $(document).height();
                }
            }
            this.GetClientWidth = function () {
                if ($.browser.msie && $.browser.version < 7) {
                    var scrollWidth = Math.max(
					document.documentElement.scrollWidth,
					document.body.scrollWidth
				);
                    var offsetWidth = Math.max(
					document.documentElement.offsetWidth,
					document.body.offsetWidth
				);

                    if (scrollWidth < offsetWidth) {
                        return $(window).width();
                    } else {
                        return scrollWidth;
                    }
                } else {
                    return $(document).width();
                }
            }
            this.setCenterPosition = function () {
                var wnd = $(window), doc = $(document),
				pTop = doc.scrollTop(), pLeft = doc.scrollLeft(),
				minTop = pTop;
                pTop += (wnd.height() - self.dh.height()) / 2;
                pTop = Math.max(pTop, minTop);
                pLeft += (wnd.width() - self.dh.width()) / 2;
                self.dh.css({ top: pTop, left: pLeft });
                $('#' + self.iframeID).css({ top: pTop, left: pLeft });
            }
            this.setCenterPosition();
            self.dh.click(function () {
                $.each($('div[t=ysh_dialog]'), function (i, n) {
                    if (parseInt($(n).css('z-index')) > self.zIndex) {
                        self.zIndex = parseInt($(n).css('z-index'));
                    }
                });
                self.dh.css('z-index', ++self.zIndex);
            });
            self.css('display', 'none');
            $('#' + self.iframeID).css('display', 'none');
            $(this).data('d0', self);
            $(this).data('d1', $('#' + self.iframeID));
            $(this).data('options', options);
        },
        open: function () {
            $(this).data('d0').show();
            $(this).data('d1').show();
            if (typeof $(this).data('options').openjs != 'undefined') {
                eval($(this).data('options').openjs);
            }
        },
        close: function () {
            if (typeof $(this).data('options').closejs != 'undefined') {
                eval($(this).data('options').closejs);
            }
            $(this).data('d0').hide();
            $(this).data('d1').hide();
        },
        setWidth: function (w) {
            $(this).data('d0').css('width', w + 'px');
            $(this).data('d1').css('width', w + 'px');
            $(this).data('options').width = w;
        },
        setHeight: function (h) {
            $this.data('d0').css('height', h + 'px');
            $this.data('d1').css('height', h + 'px');
            $this.data('options').height = h;
        },
        getSize: function () {
            return { width: $(this).data('options').width, height: $(this).data('options').height };
        },
        hiddenHead: function (showHead) {
            var header = $(this).data('d0').find('.dialog-header').parent();
            if (showHead == false)
                header.hide();
            else
                header.show();
        },
        fullScreen: function (showHead) {
            var header = $(this).data('d0').find('.dialog-header').parent();
            if (showHead == false)
                header.hide();
            else
                header.show();
            var w = $.GetClientWidth(document);
            var h = $.GetClientHeight(document);
            $(this).data('d0').css('width', w + 'px').css('left', '0').css('top', '0');
            $(this).data('d1').css('width', w + 'px').css('left', '0').css('top', '0');
            $(this).data('d0').css('height', h + 'px').css('left', '0').css('top', '0');
            $(this).data('d1').css('height', h + 'px').css('left', '0').css('top', '0');
            $(this).data('options').width = w;
            $(this).data('options').height = h;
            this.find('.dialog-header, .dialog-content').unbind('mousedown');
        },
        moveScreent: function (x,y) {
            $(this).data('d0').css({
                left: x,
                top: y
            });
            $(this).data('d1').css({
                left: x,
                top: y
            });
        }
    }

    $.fn.yshdialog = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        }
    };

})(jQuery);
