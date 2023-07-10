//网格模式
function GridLine() {
    //公共属性
    this.editMode = 0;//网格编辑模式，0否1是
    this.autoAlign = 1;//自动对齐，0否1是
    this.selectStatus = 0;//框选状态，0表示没有进行框选，1表示框选中，2表示点击到的是元素
    //私有属性
    var paddingValue = 9.5;//单元格内边距
    var perLength = paddingValue * 2 + 1;//每单元格的边长，默认20
    var xBlocks = 40;//默认水平单元格数
    var yBlocks = 30;//默认垂直单元格数
    var rszD = 4;//resize框和控件的距离
    var thisGL = this;
    //私有方法
    //对数n进行网格化取整
    function FloorAndCeil(n) {
        return parseInt(n / perLength, 10) * perLength;
    }
    //边界检测，检查value是否处于boundary附近
    function CheckBoundary(value, boundary) {
        var delta = 5;//用于判断鼠标是否位于边界的差值参数，处于0~delta范围内都被认为是界内；
        if (Math.abs(value - boundary) <= delta) return true;
        else return false;
    }
    //设置鼠标的显示样式，b=0时设置样式，b=1时返回方向
    function ShowResize(arrBl, b) {
        var divResize = $("#divResize");
        var divLeft = divResize[0].style.pixelLeft;
        var divRight = divLeft + divResize[0].clientWidth;
        var divTop = divResize[0].style.pixelTop;
        var divBottom = divTop + divResize[0].clientHeight;
        var resizeDirection;
        // 1—2—3
        // 4—5—6
        // 7—8—9
        if (CheckBoundary(arrBl[0], divLeft)) {
            if (CheckBoundary(arrBl[1], divTop))
                b == 0 ? divResize.css("cursor", "nw-resize") : resizeDirection = 1;
            else if (CheckBoundary(arrBl[1], divBottom))
                b == 0 ? divResize.css("cursor", "sw-resize") : resizeDirection = 7;
            else
                b == 0 ? divResize.css("cursor", "w-resize") : resizeDirection = 4;
        } else if (CheckBoundary(arrBl[0], divRight)) {
            if (CheckBoundary(arrBl[1], divTop))
                b == 0 ? divResize.css("cursor", "ne-resize") : resizeDirection = 3;
            else if (CheckBoundary(arrBl[1], divBottom))
                b == 0 ? divResize.css("cursor", "se-resize") : resizeDirection = 9;
            else
                b == 0 ? divResize.css("cursor", "e-resize") : resizeDirection = 6;
        } else if (CheckBoundary(arrBl[1], divTop))
            b == 0 ? divResize.css("cursor", "n-resize") : resizeDirection = 2;
        else if (CheckBoundary(arrBl[1], divBottom))
            b == 0 ? divResize.css("cursor", "s-resize") : resizeDirection = 8;
        else
            b == 0 ? divResize.css("cursor", "move") : resizeDirection = 5;
        return resizeDirection;
    }
    //获取页面里divDefRoot下的全部子元素
    function GetAllNodes() {
        return $("#divMain").children().last().children();
    }
    //改变元素的display属性，el1为设置显示的对象id集合，el2为设置隐藏的对象id集合
    function ChangeDisplay(el1, el2) {
        for (var i = 0; i < el1.length; i++)
            $("#" + el1[i]).css("display", "inline");
        for (var i = 0; i < el2.length; i++)
            $("#" + el2[i]).css("display", "none");
    }
    //检测框选状态
    function CheckSelected(area) {
        var left = area[0].style.pixelLeft;
        var right = left + area[0].clientWidth;
        var top = area[0].style.pixelTop;
        var bottom = top + area[0].clientHeight;
        GetAllNodes().each(function () {
            var elLeft = this.style.pixelLeft;
            var elRight = elLeft + this.clientWidth;
            var elTop = this.style.pixelTop;
            var elBottom = elTop + this.clientHeight;
            if (elLeft >= left && elRight <= right && elTop >= top && elBottom <= bottom)
                SelectThis(g_yshFactory.GetYsh(this).id);
        })
    }
    //重设框选Div
    function ResetSelectArea() {
        var x = event.x, y = event.y;
        var el = document.elementFromPoint(event.x, event.y);
        if (window.event.button == 1 && thisGL.selectStatus == 0 && (x - 190) <= $("#divMain")[0].offsetWidth && (y - 25) <= $("#divMain")[0].offsetHeight && el.parentNode.parentNode.id != "floatButtons") {//左键点击，没有进行框选，鼠标位于divMain内，并且点击的不是floatButtons
            thisGL.selectStatus = 1;
            ClearSelected();
            var left = x - $("#divMain").offset().left + $("#divMain").scrollLeft();
            var top = y - $("#divMain").offset().top + $("#divMain").scrollTop();
            var str = "<div id='selectArea'></div>";
            $("#divMain").prepend(str);
            $("#selectArea")[0].setCapture();
            $("#selectArea").css({ 'left': left, 'top': top, 'width': 0, 'height': 0 });
            $(document).mousemove(function (e) {
                if (event.x < x)
                    left = event.x - $("#divMain").offset().left + $("#divMain").scrollLeft();
                if (event.y < y)
                    top = event.y - $("#divMain").offset().top + $("#divMain").scrollTop();
                var width = Math.abs(event.x - x);
                var height = Math.abs(event.y - y);
                $("#selectArea").css({ 'left': left, 'top': top, 'width': width, 'height': height });
            });
            $(document).mouseup(function () {
                CheckSelected($("#selectArea"));
                thisGL.selectStatus = 0;
                $("#selectArea").remove();
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        }
    }
    //重设网格的显隐状态，b=1显示，b=0不显示
    function ResetGridLine(b) {
        var width = $("#divMain").children().last()[0].offsetWidth;
        var height = $("#divMain").children().last()[0].offsetHeight;
        xBlocks = width / perLength - 1;
        yBlocks = height / perLength - 1;
        $("#grid").remove();
        $("#divResize").remove();
        if (b == 1) {
            var str = "<div id='grid'></div>";
            $("#divMain").prepend(str);
            $("#grid").css({ 'width': xBlocks * perLength, 'height': yBlocks * perLength });
            var table = document.createElement("table");
            var tbody = document.createElement("tbody");
            table.style.borderCollapse = "collapse";
            for (var i = 0; i < yBlocks; i++) {
                var tr = document.createElement("tr");
                for (var j = 0; j < xBlocks; j++) {
                    var td = document.createElement("td");
                    var text = document.createTextNode("");
                    td.style.border = "1px solid #C3C3C3";
                    td.style.padding = paddingValue + "px";
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            $("#grid").append(table);
        }
    }
    //清除界面中元素的被选中状态
    function ClearSelected() {
        cleancontextMenu();
        $("#selectArea").remove();
        $("#divResize").remove();
        $("#floatButtons").remove();
        if (arrBk[0]) {//清除被选择状态
            arrBk[0].style.backgroundColor = arrBk[1];
            arrBk = [null, null];
        }
    }
    //设置拖动事件
    function SetDrag(o) {
        o.onmousedown = function () {//在元素上按下左键
            thisGL.selectStatus = 2;
            var moved = 0;//是否进行过移动
            $("#divResize").remove();
            SelectThis();//设置选中被拖动元素
            if (window.event.ctrlKey)
                return false;
            $("#divMain").prepend("<div id='divResize'></div>");
            var divResize = $("#divResize");
            divResize.css({ "left": o.style.pixelLeft - rszD, "top": o.style.pixelTop - rszD, "width": o.clientWidth + 2 * rszD, "height": o.clientHeight + 2 * rszD });
            var rangeLeft = 0, rangeTop = 0;
            var rangeRight = (xBlocks - 1) * perLength;
            var rangeBottom = (yBlocks - 1) * perLength;
            var oldLeft = divResize[0].offsetLeft;
            var oldTop = divResize[0].offsetTop;
            var disX = window.event.clientX - o.offsetLeft;
            var disY = window.event.clientY - o.offsetTop;
            var xx, yy, arrBl;
            divResize.mousemove(function () {//在缩放框上移动鼠标，改变鼠标样式
                divResize.unbind("mousedown");
                arrBl = thisGL.GetPosition(2);
                ShowResize(arrBl, 0);
                divResize.mousedown(function (e) {//在相应的缩放方向上按下左键，开始缩放
                    divResize.css("z-index", "20");
                    thisGL.selectStatus = 2;
                    var resizeDirection = ShowResize(arrBl, 1);
                    var oldLeft = divResize[0].style.pixelLeft;
                    var oldTop = divResize[0].style.pixelTop;
                    var oldWidth = divResize[0].clientWidth;
                    var oldHeight = divResize[0].clientHeight;
                    var oldRight = oldLeft + oldWidth;
                    var oldBottom = oldTop + oldHeight;
                    var newWidth = oldWidth;
                    var newHeight = oldHeight;
                    $(document).mousemove(function (e) {//鼠标拖动缩放中
                        var limit = 10;//限制参数，使得元素的宽高不能小于此值
                        xx = thisGL.GetPosition(2)[0];
                        yy = thisGL.GetPosition(2)[1];
                        if (xx < rangeLeft) xx = rangeLeft;
                        else if (yy < rangeTop) yy = rangeTop;
                        else if (xx > rangeRight) xx = rangeRight;
                        else if (yy > rangeBottom) yy = rangeBottom;
                        switch (resizeDirection) {//检测缩放方向
                            case 1:
                                if (yy > oldBottom - limit) yy = oldBottom - limit;
                                if (xx > oldRight - limit) xx = oldRight - limit;
                                newHeight = oldBottom - yy;
                                newWidth = oldRight - xx;
                                divResize.css({ "top": yy, "left": xx, "height": newHeight, "width": newWidth });
                                break;
                            case 2:
                                if (yy > oldBottom - limit) yy = oldBottom - limit;
                                newHeight = oldBottom - yy;
                                divResize.css({ "top": yy, "height": newHeight });
                                break;
                            case 3:
                                if (yy > oldBottom - limit) yy = oldBottom - limit;
                                if (xx < oldLeft + limit) xx = oldLeft + limit;
                                newHeight = oldBottom - yy;
                                newWidth = xx - oldLeft;
                                divResize.css({ "top": yy, "left": oldLeft, "height": newHeight, "width": newWidth });
                                break;
                            case 4:
                                if (xx > oldRight - limit) xx = oldRight - limit;
                                newWidth = oldRight - xx;
                                divResize.css({ "left": xx, "width": newWidth });
                                break;
                            case 6:
                                if (xx < oldLeft + limit) xx = oldLeft + limit;
                                newWidth = xx - oldLeft;
                                divResize.css({ "left": oldLeft, "width": newWidth });
                                break;
                            case 7:
                                if (xx > oldRight - limit) xx = oldRight - limit;
                                if (yy < oldTop + limit) yy = oldTop + limit;
                                newHeight = yy - oldTop;
                                newWidth = oldRight - xx;
                                divResize.css({ "top": oldTop, "left": xx, "height": newHeight, "width": newWidth });
                                break;
                            case 8:
                                if (yy < oldTop + limit) yy = oldTop + limit;
                                newHeight = yy - oldTop;
                                divResize.css({ "top": oldTop, "height": newHeight });
                                break;
                            case 9:
                                if (xx < oldLeft + limit) xx = oldLeft + limit;
                                if (yy < oldTop + limit) yy = oldTop + limit;
                                newHeight = yy - oldTop;
                                newWidth = xx - oldLeft;
                                divResize.css({ "top": oldTop, "left": oldLeft, "height": newHeight, "width": newWidth });
                                break;
                            default: break;
                        }
                    });
                    $(document).mouseup(function () {//鼠标抬起，结束缩放
                        if (resizeDirection != 5)
                            SaveXml();
                        divResize.css("z-index", "9");
                        thisGL.selectStatus = 0;
                        xx = divResize[0].offsetLeft + rszD - 1;
                        yy = divResize[0].offsetTop + rszD - 1;
                        newHeight -= 2 * rszD;
                        newWidth -= 2 * rszD;
                        $(o).css({ "left": xx, "top": yy, "width": newWidth, "height": newHeight });
                        var ysh = g_yshFactory.GetYsh(o);
                        ysh.styles.left = xx + "px";
                        ysh.styles.top = yy + "px";
                        ysh.styles.width = newWidth + "px";
                        ysh.styles.height = newHeight + "px";
                        ShowFloatButtons(o);
                        $(document).unbind('mousemove');
                        $(document).unbind('mouseup');
                    });
                });
            });
            $(document).mousemove(function (e) {
                if (moved == 0) {
                    divResize.css("z-index", "20");
                    moved = 1;
                }
                xx = e.clientX - disX;
                yy = e.clientY - disY;
                if (xx < rangeLeft) xx = rangeLeft;
                if (xx > rangeRight) xx = rangeRight;
                if (yy < rangeTop) yy = rangeTop;
                if (yy > rangeBottom) yy = rangeBottom;
                divResize.css({ "left": xx - rszD, "top": yy - rszD });
            });
            $(document).mouseup(function () {
                if (moved == 1) {//如果进行过移动
                    xx = thisGL.autoAlign == 1 ? FloorAndCeil(divResize[0].offsetLeft + rszD) : divResize[0].offsetLeft;
                    yy = thisGL.autoAlign == 1 ? FloorAndCeil(divResize[0].offsetTop + rszD) : divResize[0].offsetTop;
                    if (o.tagName == "DIV" && o.style.imeMode == "active")//若是DIV且是容器
                        GetAllNodes().each(function () {
                            var divLeft = o.offsetLeft, divTop = o.offsetTop;
                            var divRight = o.offsetLeft + o.offsetWidth;
                            var divBottom = o.offsetTop + o.offsetHeight;
                            var thisLeft = this.offsetLeft, thisTop = this.offsetTop;
                            var thisRight = this.offsetLeft + this.offsetWidth;
                            var thisBottom = this.offsetTop + this.offsetHeight;
                            if (thisLeft > divLeft && thisRight < divRight && thisTop > divTop && thisBottom < divBottom) {
                                childXX = this.style.pixelLeft + xx - oldLeft - rszD + 1;
                                childYY = this.style.pixelTop + yy - oldTop - rszD + 1;
                                this.style.pixelLeft = childXX;
                                this.style.pixelTop = childYY;
                                var ysh = g_yshFactory.GetYsh(this);
                                ysh.styles.left = childXX + "px";
                                ysh.styles.top = childYY + "px";
                            }
                        });
                    $(o).css({ "left": xx, "top": yy });
                    divResize.css({ "left": xx - rszD, "top": yy - rszD });
                    ShowFloatButtons(o);
                    var ysh = g_yshFactory.GetYsh(o);
                    ysh.styles.left = xx + "px";
                    ysh.styles.top = yy + "px";
                    moved = 0;
                    divResize.css("z-index", "15");
                    SaveXml();
                }
                thisGL.selectStatus = 0;
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        };
    }
    //公共方法
    //返回位置信息
    this.GetPosition = function (type) {
        var mouseX = window.event.clientX + document.documentElement.scrollLeft;//鼠标绝对x坐标
        var mouseY = window.event.clientY + document.documentElement.scrollTop;//鼠标绝对y坐标
        var baseX = $("#grid").offset().left;//网格x坐标
        var baseY = $("#grid").offset().top;//网格y坐标
        var x = mouseX - baseX;//相对x坐标
        var y = mouseY - baseY;//相对y坐标
        var blockX = parseInt(x / perLength, 10);//相对x格数
        var blockY = parseInt(y / perLength, 10);//相对y格数
        var arrBl = new Array(2);
        if (type == 0) {//返回单元格格数
            arrBl[0] = blockX;
            arrBl[1] = blockY;
        } else if (type == 1) {//返回单元格坐标
            arrBl[0] = blockX * perLength;
            arrBl[1] = blockY * perLength;
        } else if (type == 2) {//返回鼠标相对网格的坐标
            arrBl[0] = x;
            arrBl[1] = y;
        }
        return arrBl;
    }
    //检测参数是否处于网格范围之中
    this.CheckRange = function (arrBl) {
        var rangeX = xBlocks * perLength;
        var rangeY = yBlocks * perLength;
        if (arrBl[0] >= 0 && arrBl[0] <= rangeX && arrBl[1] >= 0 && arrBl[1] <= rangeY)
            return true;
        else
            return false;
    }
    //切换是否开启网格编辑模式
    this.SetEditable = function (b) {
        if (b) {//如果有传参，那么变换editMode的状态
            $("#imgSetEditable").attr("src", "/i/Defined/setedit" + this.editMode + ".png");
            this.editMode = 1 - this.editMode;
            ResetGridLine(this.editMode);
        }
        var elements1 = ["imgSameWidth", "imgSameHeight", "imgAlignLeft", "imgAlignCenter", "imgAlignRight", "imgAlignTop", "imgAlignMiddle", "imgAlignBottom", "imgSameVerticalSpace", "imgSameHorizontalSpace", "imgAutoAlign"];
        var elements2 = ["imgAlignLeftTB", "imgAlignCenterTB", "imgAlignRightTB", "imgAlignTopTB", "imgAlignMiddleTB", "imgAlignBottomTB"];
        if (this.editMode == 1) {
            $("#divMain").parent().removeAttr("onclick");//解绑onclick事件
            $("#divMain").parent()[0].onmousedown = ResetSelectArea;
            GetAllNodes().each(function () {
                SetDrag(this);
            })
            ChangeDisplay(elements1, elements2);
        } else {
            $("#divMain").parent().removeAttr("onmousedown");//解绑onmousedown事件
            $("#divMain").parent()[0].onclick = function () { IsSelected = true; SelectThis(); }
            GetAllNodes().each(function () {
                $(this).removeAttr("onmousedown");
            })
            ChangeDisplay(elements2, elements1);
        }
    }
    //切换是否自动对齐
    this.SetAutoAlign = function () {
        this.autoAlign = 1 - this.autoAlign;
        $("#imgAutoAlign").attr("src", "/i/Defined/autoalign" + this.autoAlign + ".png");
    }
    //设置多个元素的属性，由type决定操作的类型
    this.SetMultiEl = function (type) {
        var arrEl = GetArrEl(0);
        if (arrEl.length <= 1)
            return false;
        switch (type) {
            case "sameWidth":
                var width = arrEl[0].ctrl.style.pixelWidth;
                for (var i = 1; i < arrEl.length; i++) {
                    arrEl[i].ctrl.style.width = width;
                    arrEl[i].styles.width = width + "px";
                }
                break;
            case "sameHeight":
                var height = arrEl[0].ctrl.style.pixelHeight;
                for (var i = 1; i < arrEl.length; i++) {
                    arrEl[i].ctrl.style.height = height;
                    arrEl[i].styles.height = height + "px";
                }
                break;
            case "sameVerticalSpace":
                if (arrEl.length <= 2)
                    return false;
                var top = 0, height = 0, perHeight = 0;
                for (var i = 0; i < arrEl.length; i++)
                    for (var j = i + 1; j < arrEl.length; j++)
                        if (arrEl[i].ctrl.style.pixelTop > arrEl[j].ctrl.style.pixelTop) {
                            temp = arrEl[i];
                            arrEl[i] = arrEl[j];
                            arrEl[j] = temp;
                        }
                height = arrEl[arrEl.length - 1].ctrl.style.pixelTop - arrEl[0].ctrl.style.pixelTop - arrEl[0].ctrl.style.pixelHeight;
                for (var i = 1; i < arrEl.length - 1; i++)
                    height -= arrEl[i].ctrl.style.pixelHeight;
                perHeight = height / (arrEl.length - 1);
                for (var i = 1; i < arrEl.length - 1; i++) {
                    top = arrEl[i - 1].ctrl.style.pixelTop + arrEl[i - 1].ctrl.style.pixelHeight + perHeight;
                    arrEl[i].ctrl.style.pixelTop = top;
                    arrEl[i].styles.top = top + "px";
                }
                break;
            case "sameHorizontalSpace":
                if (arrEl.length <= 2)
                    return false;
                var left = 0, width = 0, perWidth = 0;
                for (var i = 0; i < arrEl.length; i++)
                    for (var j = i + 1; j < arrEl.length; j++)
                        if (arrEl[i].ctrl.style.pixelLeft > arrEl[j].ctrl.style.pixelLeft) {
                            temp = arrEl[i];
                            arrEl[i] = arrEl[j];
                            arrEl[j] = temp;
                        }
                width = arrEl[arrEl.length - 1].ctrl.style.pixelLeft - arrEl[0].ctrl.style.pixelLeft - arrEl[0].ctrl.style.pixelWidth;
                for (var i = 1; i < arrEl.length - 1; i++)
                    width -= arrEl[i].ctrl.style.pixelWidth;
                perWidth = width / (arrEl.length - 1);
                for (var i = 1; i < arrEl.length - 1; i++) {
                    left = arrEl[i - 1].ctrl.style.pixelLeft + arrEl[i - 1].ctrl.style.pixelWidth + perWidth;
                    arrEl[i].ctrl.style.pixelLeft = left;
                    arrEl[i].styles.left = left + "px";
                }
                break;
            case "alignLeft":
                var left = 9999;
                for (var i = 0; i < arrEl.length; i++) {
                    if (arrEl[i].ctrl.style.pixelLeft < left)
                        left = arrEl[i].ctrl.style.pixelLeft;
                }
                for (var i = 0; i < arrEl.length; i++) {
                    arrEl[i].ctrl.style.pixelLeft = left;
                    arrEl[i].styles.left = left + "px";
                }
                break;
            case "alignCenter":
                var center = arrEl[0].ctrl.style.pixelWidth / 2 + arrEl[0].ctrl.style.pixelLeft;
                for (var i = 1; i < arrEl.length; i++) {
                    var left = center - arrEl[i].ctrl.style.pixelWidth / 2;
                    arrEl[i].ctrl.style.pixelLeft = left;
                    arrEl[i].styles.left = left + "px";
                }
                break;
            case "alignRight":
                var right = 0;
                for (var i = 0; i < arrEl.length; i++)
                    if (arrEl[i].ctrl.style.pixelLeft + arrEl[i].ctrl.style.pixelWidth > right)
                        right = arrEl[i].ctrl.style.pixelLeft + arrEl[i].ctrl.style.pixelWidth;
                for (var i = 0; i < arrEl.length; i++) {
                    arrEl[i].ctrl.style.pixelLeft = right - arrEl[i].ctrl.style.pixelWidth;
                    arrEl[i].styles.left = right - arrEl[i].ctrl.style.pixelWidth + "px";
                }
                break;
            case "alignTop":
                var top = 9999;
                for (var i = 0; i < arrEl.length; i++) {
                    if (arrEl[i].ctrl.style.pixelTop < top)
                        top = arrEl[i].ctrl.style.pixelTop;
                }
                for (var i = 0; i < arrEl.length; i++) {
                    arrEl[i].ctrl.style.pixelTop = top;
                    arrEl[i].styles.top = top + "px";
                }
                break;
            case "alignMiddle":
                var middle = arrEl[0].ctrl.style.pixelHeight / 2 + arrEl[0].ctrl.style.pixelTop;
                for (var i = 1; i < arrEl.length; i++) {
                    var top = middle - arrEl[i].ctrl.style.pixelHeight / 2;
                    arrEl[i].ctrl.style.pixelTop = top;
                    arrEl[i].styles.top = top + "px";
                }
                break;
            case "alignBottom":
                var bottom = 0;
                for (var i = 0; i < arrEl.length; i++) {
                    if (arrEl[i].ctrl.style.pixelTop + arrEl[i].ctrl.style.pixelHeight > bottom)
                        bottom = arrEl[i].ctrl.style.pixelTop + arrEl[i].ctrl.style.pixelHeight;
                }
                for (var i = 0; i < arrEl.length; i++) {
                    arrEl[i].ctrl.style.pixelTop = bottom - arrEl[i].ctrl.style.pixelHeight;
                    arrEl[i].styles.top = bottom - arrEl[i].ctrl.style.pixelHeight + "px";
                }
                break;
            default: break;
        }
        SaveXml();
        return false;
    }
    //对元素的坐标进行微调
    this.TrimPosition = function (direction, value) {
        var arrEl = GetArrEl(0);
        try {
            for (var i = 0; i < arrEl.length; i++) {
                var newValue = parseInt(arrEl[i].ctrl.style[direction], 10) + value + "px";
                arrEl[i].ctrl.style[direction] = newValue;
                arrEl[i].styles[direction] = newValue;
            }
        } catch (err) { }
    }
}
//初始化
var gL = new GridLine();

function SessionStorage() {
    //公共属性
    this.support = Support();
    //私有方法
    //判断是否支持本地存储
    function Support() {
        return !!window.sessionStorage;
    }
    function GetObj(key, value) {
        var obj = new Object();
        obj.key = key;
        obj.value = value;
        return obj;
    }
    //公共方法
    //存储一个对象
    this.Set = function (key, value) {
        this.Remove(key);
        window.sessionStorage.setItem(key, value);
    }
    //获取一个对象
    this.Get = function (key) {
        return window.sessionStorage.getItem(key);
    }
    //删除一个对象
    this.Remove = function (key) {
        window.sessionStorage.removeItem(key);
    }
    //清空本地存储
    this.Clear = function () {
        window.sessionStorage.clear();
    }
    //获取对象的数量
    this.Count = function () {
        return window.sessionStorage.length;
    }
    //获取全部对象
    this.GetAll = function () {
        var arr = new Array();
        for (var i = 0; i < this.Count() ; i++) {
            var key = window.sessionStorage.key(i);
            arr.push(GetObj(key, this.Get(key)));
        }
        return arr;
    }
}
//初始化
var SS = new SessionStorage();

//自定义控件的初始属性
function CustomCtrl(strType, type, pYsh, arrBl) {
    var content = $("#divDialog .divContent");
    var btnOK = $("#divDialog .btnOk");
    btnOK.unbind("click");
    var str;
    switch (strType) {
        case "table":
            str = GetTableStr();//获取html代码
            btnOK.click(function () {//设定确定按钮的事件
                var attrs = GetTableAttr();//获取属性值
                SetNewCtrl(strType, type, pYsh, arrBl, attrs);//添加控件
                return CustomDialog(0);//关闭弹出层
            });
            break;
        default: break;
    }
    content.empty();
    content.append(str);
    CustomDialog(1);

    function GetTableStr() {
        var str = " <span>控件类型：</span>";
        str += "表格";
        str += "<br /><br />";
        str += "<span>行数：</span>";
        str += "<input id='custom01' type='text' style='width:100px' value='3'/><br />";
        str += "<span>列数：</span>";
        str += "<input id='custom02' type='text' style='width:100px' value='3'/><br />";
        str += "<span>行高：</span>";
        str += "<input id='custom03' type='text' style='width:100px' value='50'/><br />";
        str += "<span>列宽：</span>";
        str += "<input id='custom04' type='text' style='width:100px' value='250'/><br />";
        return str;
    }
    function GetTableAttr() {
        var attrs = new Object();
        attrs.rows = parseInt($("#custom01").val(), 10);
        attrs.cols = parseInt($("#custom02").val(), 10);
        attrs.rowHeight = parseInt($("#custom03").val(), 10);
        attrs.colWidth = parseInt($("#custom04").val(), 10);
        return attrs;
    }
}
//操作自定义的弹出层对话框
function CustomDialog(type) {
    var id = "divDialog";
    if (type == 1) {
        $.showPopLayer({
            target: id
        })
    } else {
        $.closePopLayer();
    }
    return false;
}
//用于新加控件自定义属性的弹出层
(function ($) {
    var openedLayer;
    var parentElement = "no";
    $.showPopLayer = function (options) {
        options = jQuery.extend({
            target: "",
            screenLock: true,
            screenLockBackground: "#000",
            screenLockOpacity: "0.5",
            onClose: function () { },
            fixedPosition: true,
            animate: true
        }, options);
        showIt(options);
        return this;
    }
    $.closePopLayer = function () {
        target = openedLayer.target;
        openedLayer.onClose();
        if (openedLayer.animate) {
            $("#" + target).fadeOut('normal');
            hideScreenLock(true);
        } else {
            $("#" + target).css("display", "none");
            hideScreenLock(false);
        }
        if (parentElement != "no") {
            $("#" + target).appendTo($("#" + parentElement));
        }
    }
    function setScreenLockSize() {
        $('#ScreenLockDiv').height($(document).height() + "px");
        $('#ScreenLockDiv').width($(document.body).outerWidth(true) + "px");
    }
    function showScreenLock(bg_color, bg_opacity, useAnimate) {
        if ($('#ScreenLockDiv').length) {
            setScreenLockSize();
            if (useAnimate) {
                $('#ScreenLockDiv').fadeIn('slow');
            } else {
                $('#ScreenLockDiv').css("display", "block");
            }
        } else {
            $("body").append("<div id='ScreenLockDiv'></div>");
            $('#ScreenLockDiv').css({
                position: "absolute",
                background: bg_color,
                left: "0",
                top: "0",
                opacity: bg_opacity,
                "z-index": "1000",
                display: "none"
            });
            showScreenLock(bg_color, bg_opacity, useAnimate);
        }
    }
    function hideScreenLock(useAnimate) {
        if (useAnimate) {
            $('#ScreenLockDiv').fadeOut('normal');
        } else {
            $('#ScreenLockDiv').css("display", "none");
        }
    }
    function setPopLayerPosition(obj) {
        var windowWidth = document.documentElement.clientWidth;
        var windowHeight = document.documentElement.clientHeight;
        var popupHeight = $(obj).height();
        var popupWidth = $(obj).width();
        $(obj).css({
            "position": "absolute",
            "z-index": "10000",
            "top": (windowHeight - popupHeight) / 2 + $(document).scrollTop() + "px",
            "left": (windowWidth - popupWidth) / 2 + "px"
        });
        if ($(obj).parent() != "body") {
            parentElement = $(obj).parent().attr("id");
            $(obj).appendTo("body");
        }
    }
    function showIt(popObject) {
        openedLayer = popObject;
        var _tDiv = $("#" + popObject.target);
        var _screenlock = popObject.screenLock;
        var _bgcolor = popObject.screenLockBackground;
        var _bgopacity = popObject.screenLockOpacity;
        var _animate = popObject.animate;
        var _isFixed = popObject.fixedPosition;
        if (_screenlock) {
            showScreenLock(_bgcolor, _bgopacity, _animate);
            $(window).resize(function () { setScreenLockSize(); });
        }
        setPopLayerPosition(_tDiv);
        if (_animate) {
            _tDiv.fadeIn();
        } else {
            _tDiv.css("display", "block");
        }
        if (_isFixed) {
            $(window).scroll(function () { setPopLayerPosition(_tDiv); });
            $(window).resize(function () { setPopLayerPosition(_tDiv); });
        }
    }
})(jQuery);

//配置数据关联的弹出层
function PopLayer(id, options) {
    //私有属性
    var defaults = {//默认值
        width: 500,//宽度
        height: 300,//高度
        alpha: 5,//参数α，对拖动的边界值进行微调
        title: "标题",//弹出层标题
        bSetDrag: false,//是否可拖动
        bAutoFix: false//是否修正位置
    };
    var options = $.extend(defaults, options);
    var show = false;
    //公有属性
    //私有方法
    //设置可拖动
    var SetDrag = function () {//设置浮动层拖动
        $("#" + id + " .spanDrag").html(defaults.title);
        $("#" + id + ' .spanDrag').mousedown(function (e) {//鼠标按下
            var disX = e.clientX - $("#" + id)[0].offsetLeft;
            var disY = e.clientY - $("#" + id)[0].offsetTop;
            $(document).mousemove(function (e) {//鼠标移动
                xx = e.clientX - disX;
                yy = e.clientY - disY;
                width = parseInt(document.body.offsetWidth, 10);
                height = parseInt(document.body.offsetHeight, 10);
                var limitLeft = defaults.alpha;
                var limitTop = defaults.alpha;
                var limitRight = width - defaults.width - defaults.alpha;
                var limitBottom = height - defaults.height - 3 * defaults.alpha;
                var divLeft = xx; //div距右侧距离
                var divTop = yy; //div距上端距离
                if (divLeft <= limitLeft) divLeft = limitLeft;
                if (divLeft >= limitRight) divLeft = limitRight;
                if (divTop <= limitTop) divTop = limitTop;
                if (divTop >= limitBottom) divTop = limitBottom;
                $("#" + id).css({ "left": divLeft, "top": divTop });
            });
            $(document).mouseup(function () {//鼠标抬起
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        })
    };
    //设置自动调整位置
    var AutoFix = function () {
        var SetPopPosition = function () {
            var lw = (document.body.clientWidth - defaults.width) / 2; //弹出宽度距离
            var th = (document.body.clientHeight - defaults.height) / 2; //弹出高度距离
            $("#" + id).css({ top: th, left: lw });
        };
        $(window).scroll(function () { SetPopPosition(); });
        $(window).resize(function () { SetPopPosition(); });
    };
    //公共方法
    //显示浮动层
    this.ShowPop = function () {
        if (defaults.bSetDrag) {
            SetDrag();
            defaults.bSetDrag = false;
        }
        if (defaults.bAutoFix) {
            AutoFix();
            defaults.bAutoFix = false;
        }
        var lw = (document.body.clientWidth - defaults.width) / 2; //弹出宽度距离
        var th = (document.body.clientHeight - defaults.height) / 2; //弹出高度距离
        $("#" + id).animate({//浮动层动画效果
            top: th,
            opacity: 'show',
            width: defaults.width,
            height: defaults.height,
            left: lw
        }, 500);
        show = true;
        return false;
    };
    //隐藏浮动层
    this.HidePop = function () {
        $("#" + id).animate({
            top: 0,
            opacity: 'hide',
            width: 0,
            height: 0,
            left: 170
        }, 500);
        show = false;
        return false;
    };
    //设置Html
    this.SetHtml = function (str) {
        $("#" + id + " .divContent").html(str);
    };
    //获取显示状态
    this.GetShow = function () {
        return show;
    };
}
var pL = new PopLayer("divEditDataBase", { width: 500, height: 300, title: "配置数据关联", bSetDrag: true, bAutoFix: true });

//获取页面控件的数据关联信息
function GetDataBaseInfo() {
    //table
    var str = "<table cellspacing=0>";
    var ctrl;
    str += "<tr attr='0'><th style='width:19%;'>Id</th><th style='width:19%;'>描述</th><th style='width:19%;'>节点</th><th style='width:19%;'>表</th><th style='width:100%;'>列</th></tr>"
    for (var i = 0; i < docDesign.ctrls.length; i++) {
        ctrl = docDesign.ctrls[i];
        if (CheckTag(ctrl.tag)) {
            if (typeof ctrl.datasource != "undefined") {
                str += StringPP.format("<tr onclick=\"SelectThis('{0}');window.location.href='#floatButtons';\" ondblclick=\"g_yshFactory.GetYshById('{0}').Edit();\" name=\"{0}\">", ctrl.id);
                str += StringPP.format("<td class='tdId'>{0}</td>", ctrl.id);
                str += StringPP.format("<td>{0}</td>", ctrl.desc);
                str += StringPP.format("<td class='tdDb'>{0}</td>", ctrl.datasource.db);
                str += StringPP.format("<td class='tdSrc'>{0}</td>", ctrl.datasource.src);
                str += StringPP.format("<td class='tdCol'>{0}</td>", ctrl.datasource.col);
                str += "</tr>";
            }
        }
    }
    str += "</table>";
    pL.SetHtml(str);
    $("#divEditDataBase tr").click(function () {
        if (!window.event.ctrlKey)
            $("#divEditDataBase .trSelected").removeClass("trSelected");
        if ($(this).attr("attr") != '0')
            $(this).addClass("trSelected");
    })
    //select数据关联
    str = Defined.SelectDB("").value;

    $("#slctDb").html(str);
    $("#slctDb").change(function () {
        SlctDbChange();
    });
    SlctDbChange();
    $("#slctSrc").change(function () {
        SlctSrcChange();
    });
    SlctSrcChange();
    function CheckTag(tagName) {//检查tag是否符合要求
        var illegalTagName = ["div", "table", "tr", "td", "label"];
        var b = true;
        for (var i = 0; i < illegalTagName.length; i++)
            if (tagName == illegalTagName[i]) {
                b = false;
                break;
            }
        return b;
    };
    function SlctDbChange() {//slctDb值发生变更，触发的事件
        var str = Defined.SelectDB($("#slctDb").val()).value;
        if (str != "") {
            $("#slctSrc").html(str);
            $("#slctSrc").removeAttr("disabled");
            SlctSrcChange();
        } else {
            str = "<option>节点下不存在表</option>";
            $("#slctSrc").html(str);
            $("#slctSrc").attr("disabled", "disabled");
            $("#divEditDataBase .divCol").html("");
        }
    };
    function SlctSrcChange() {//slctSrc值发生变更，触发的事件
        var str = Defined.SelectCol($("#slctDb").val(), $("#slctSrc").val()).value;
        $("#divEditDataBase .divCol").html(str);
        $("#divEditDataBase .divCol span").mousedown(function (e) {
            var div = $("#divEditDataBase");
            var xOld = e.clientX, yOld = e.clientY;
            var xNew, yNew;
            var span = $(this).clone();
            $("body").append(span);
            span.css({ "position": "absolute", "left": xOld, "top": yOld, "z-index": 10000, "background-color": "#CCE7BA", "cursor": "pointer" });
            $(document).mousemove(function (e) {//鼠标移动
                xNew = e.clientX, yNew = e.clientY;
                var limitLeft = div.offset().left;
                var limitTop = div.offset().top + 26;
                var limitRight = limitLeft + div.width() - span.width();
                var limitBottom = limitTop + div.height() - span.height() - 26;
                if (xNew <= limitLeft) xNew = limitLeft;
                if (xNew >= limitRight) xNew = limitRight;
                if (yNew <= limitTop) yNew = limitTop;
                if (yNew >= limitBottom) yNew = limitBottom;
                span.css({ "left": xNew, "top": yNew });
            });
            $(document).mouseup(function () {//鼠标抬起
                var col = span.html();
                span.remove();
                document.elementFromPoint(xNew, yNew);//无实意，但不加有可能出bug
                var target = document.elementFromPoint(xNew, yNew).parentNode;
                if (target.nodeName == "TR") {
                    $(target).click();
                    SelectThis($(target).children(".tdId").html());
                    ChangeSelectedDb(col);
                }
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        })
    };
};
function ChangeSelectedDb(value) {
    if ($(".trSelected").length > 0) {
        if (value != "") {
            $(".trSelected .tdDb").html($("#slctDb").val());
            $(".trSelected .tdSrc").html($("#slctSrc").val());
            $(".trSelected .tdCol").html(value);
        } else {
            $(".trSelected .tdDb").html(value);
            $(".trSelected .tdSrc").html(value);
            $(".trSelected .tdCol").html(value);
        }
    }
    return false;
};
function SetDataBaseInfo() {
    var b = confirm("确定要保存所做的更改吗？");
    if (b) {
        $("#divEditDataBase .divContent table tr").each(function (i) {
            var db = $(this).children(".tdDb").html();
            var src = $(this).children(".tdSrc").html();
            var col = $(this).children(".tdCol").html();
            if (i > 0) {
                var ctrl = docDesign.GetYshById($(this).children(".tdId").html());
                ctrl.datasource.db = db;
                ctrl.datasource.src = src;
                ctrl.datasource.col = col;
            }
        });
        pL.HidePop();
    }
    return false;
};

//绑定按键
document.onkeydown = function () {
    var key = window.event.keyCode;
    if (event.ctrlKey) {//Ctrl
        window.event.returnValue = false;
        switch (key) {
            case 37://←
                gL.TrimPosition("left", -5);
                break;
            case 38://↑
                gL.TrimPosition("top", -5);
                break;
            case 39://→
                gL.TrimPosition("left", 5);
                break;
            case 40://↓
                gL.TrimPosition("top", 5);
                break;
            case 67: //C
                CopyCtrl(); //Ctrl+C，复制
                break;
            case 68://D
                EditDataBase();//Ctrl+D，配置数据源
                break;
            case 69: //E
                EditCtrl(); //Ctrl+E，编辑
                break;
            case 72: //H
                ShowHelp(); //Ctrl+H，帮助
                break;
            case 77: //M
                SaveMstPg(); //Ctrl+M，保存为母版
                break;
            case 79: //O
                EditPage(); //Ctrl+O，页面设置
                break;
            case 80: //P
                Preview(); //Ctrl+P，预览
                break;
            case 83: //S
                SaveFile(); //Ctrl+S，保存
                break;
            case 84://T
                SaveTmplt();//Ctrl+T，保存为模板
                break;
            case 86: //V
                PasteCtrl(); //Ctrl+V，粘贴
                break;
            case 88: //X
                CutCtrl(); //Ctrl+X，剪切
                break;
            case 89: //Y
                Redo(); //Ctrl+Y，重做
                break;
            case 90: //Z
                Undo(); //Ctrl+Z，撤销
                break;
            default: break;
        }
    } else {
        switch (key) {
            case 37://←
                window.event.returnValue = false;
                gL.TrimPosition("left", -1);
                break;
            case 38://↑
                window.event.returnValue = false;
                gL.TrimPosition("top", -1);
                break;
            case 39://→
                window.event.returnValue = false;
                gL.TrimPosition("left", 1);
                break;
            case 40://↓
                window.event.returnValue = false;
                gL.TrimPosition("top", 1);
                break;
            case 46: //Delete
                DeleteCtrl(); //Delete，删除
                break;
            default: break;
        }
    }
};

function LoadMstPgHTML(filename) {//读取母版页的Html
    var str = window.YshGrid.LoadXml("", StringPP.format("{0}.master", filename), true).value;
    var doc = null;
    eval("doc = " + str);
    g_yshFactory.ExtendObjects(doc.ctrls, function (ysh) { });
    return doc.ctrls.GetHtml();
}

function AddMstPgItem(filename, pYsh) {//添加母版子控件，适用于相对定位
    var str = window.YshGrid.LoadXml("", StringPP.format("{0}.master", filename), true).value;
    var doc = null;
    eval("doc = " + str);
    var list = new Array();
    function GetItem(node) {
        if (node.tag == "yshmasterpageitem") {
            list.push(node)
        }
        for (var i = 0; i < node.children.length; i++) {
            GetItem(node.children[i]);
        }
    };
    GetItem(doc.ctrls.children[0]);
    if (gL.editMode == 0) {
        for (var i = 0; i < list.length; i++) {
            var newCtrl = pYsh.doc.CreateObject("yshmasterpageitem", pYsh);
            $(pYsh.ctrl).append(newCtrl.GetHtml())
            newCtrl.AttachControl(pYsh.ctrl.children[pYsh.children.length - 1]);
        }
    }
};