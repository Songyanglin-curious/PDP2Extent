function PicMenu() {
    this.picId = "";//该控件id
    this.arrSrc = []; //图片的地址
    this.strDirection = "1"; //展开的方向
    this.strRadius = "30"; //展开的半径
    this.offsetTop = 0;//父节点相对左的位置
    this.offsetLeft = 0;  //父节点相对上的位置
    this.parentCtrl; //子节点外的div
    this.parentFrame; //用来遮挡select
    this.imgCtrl; //父节点图片
    this.startAngle = 0; //第一个子图片开始的角度
    this.betweenAngle = 15;//每个图片默认的角度距离
    this.toOpen = true; //子图片是否是展开状态
    this.nowRadius = []; //存储每个子图片现在走到的位置
    this.step = 5; //字图片每次移动的距离
    this.pHeight = 0;
    this.pWidth = 0;
    this.cHeight = 0;
    this.cWidth = 0;
    this.cPicHrefs = [];//存储图片的连接地址
    this.init = function (picId, strSrcs, strDirection, strRadius, strcPicHrefs, pHeight, pWidth, cHeight, cWidth) {//初始化控件的信息
        this.picId = picId;
        this.cHeight = cHeight;
        this.cWidth = cWidth;
        this.pHeight = pHeight;
        this.pWidth = pWidth;
        if (strSrcs != "")
            this.arrSrc = strSrcs.split('@@@');
        this.cPicHrefs = new Array(this.arrSrc.length -2); //获得子节点图片的所有个数
        var hrefs = strcPicHrefs.split('@@@');
        for (var i = 0; i < hrefs.length; i++) {//初始化子图片的地址连接
            this.cPicHrefs[i] = hrefs[i];
        }
        this.strDirection = strDirection;//初始化方向
        this.strRadius = strRadius;
        //初始化父(子)图片
        var newEle = document.createElement("<div id='div" + this.picId + "' style='position: absolute;z-index:999'></div>"); //该div存储子节点的图片和用于隐藏Select的iframe层
        var parentImg = document.createElement("<img alt='' id='image" + this.picId + "' src='' style='position: absolute;z-index:999;height:" + this.pHeight + ";width:" + this.pWidth + "'; />"); //父图片
        document.getElementById(this.picId).appendChild(newEle);
        document.getElementById(this.picId).appendChild(parentImg);
        var parentFrame = document.createElement("<iframe id='pFrame" + this.picId + "' style='position:absolute;z-index:-1;filter:alpha(opacity=0);-moz-opacity:0;opacity:0;' src='javascript:false;'></iframe>"); //作为图片的底层用于遮挡Select
        document.getElementById(this.picId).appendChild(parentFrame);
        this.parentCtrl = document.getElementById("div" + this.picId);
        this.imgCtrl = document.getElementById("image" + this.picId);
        this.parentFrame = document.getElementById("pFrame" + this.picId);
        this.addParentImg();
        this.addChildImg();
        this.setIframe();
        document.getElementById("div" + this.picId).style.display = "none"; 
    }
    this.setIframe = function () { //根据图片的大小设定图片底层ifame的大小
        var cframeCtrl = this.parentCtrl.children;
        for (var i = 1; i < cframeCtrl.length; i = i + 2) {
            cframeCtrl[i].style.height = cframeCtrl[i - 1].style.height;
            cframeCtrl[i].style.width = cframeCtrl[i - 1].style.width;
            cframeCtrl[i].style.top = this.offsetTop;
            cframeCtrl[i].style.left = this.offsetLeft;
        }       
        this.parentFrame.style.height = this.parentCtrl.style.height;
        this.parentFrame.style.width = this.parentCtrl.style.width;
    }
    this.addChildImg = function () {//添加子图片
        for (var i = 2; i < this.arrSrc.length; i++) {
            var imgEle = document.createElement("<img alt='' id='Img" + this.picId + (i - 2) + "' src='" + this.arrSrc[i] + "' style='position: absolute;z-index:999;height:" + this.cHeight + ";width:" + this.cWidth + "' />");
            var childFrame = document.createElement("<iframe id='cFrame" + this.picId + (i - 2) + "' style='position:absolute;z-index:-1;filter:alpha(opacity=0);-moz-opacity:0;opacity:0;' src='javascript:false;'></iframe>");
            document.getElementById("div" + this.picId).appendChild(imgEle);
            this.nowRadius.push(0);
            document.getElementById("div" + this.picId).appendChild(childFrame);
            this.nowRadius.push(0);
        }
        var imgs = this.parentCtrl.children;
        for (var i = 0; i < imgs.length; i = i + 2) { //给子图片添加click事件
            var hrefs = this.cPicHrefs; //得到所有的连接地址
            var ctrlId = this.picId;
            imgs[i].onclick = function () {
                var index = this.id.split(ctrlId)[1]; //得到子图片的索引值
                var ahref = hrefs[index];
                if (ahref != "" && ahref != undefined)
                    window.location.href = ahref;
            }
        }
        if (imgs.length / 2 < 8) {//设置第一个子图片的其实位置，单位角度；当图片数小于8个时，默认的图片间隔角度为15度
            this.startAngle = (90 - (imgs.length / 2 - 1) * this.betweenAngle) / 2;
        }
        else {//当图片数大于等于8时，平均分配在1/4圆中
            this.betweenAngle = 90 / (imgs.length / 2 - 1);
            this.startAngle = 0;
        }
    }
    this.addParentImg = function () {//添加父图片
        if (this.arrSrc.length > 0) {
            this.imgCtrl.src = this.arrSrc[0];
        }
        var ctrl = this;
        //var itemid;
        //var a = 1;
        var parentImgCtrl = this.imgCtrl;
        parentImgCtrl.onclick = function () {//父图片的单击事件
            var timer = ctrl.itemid;
            var thismoveImage = function () { ctrl.moveImage(); };
            if (ctrl.toOpen) {//展开 
                for (var i = 0; i < ctrl.nowRadius.length; i++) { //初始化每个图片的半径
                    ctrl.nowRadius[i] = 0;
                }
                this.src = ctrl.arrSrc[1];
                document.getElementById("div" + ctrl.picId).style.display = "";
                window.clearInterval(ctrl.itemid);
                ctrl.itemid = window.setInterval(thismoveImage, 1);
            }
            else {//合并
                for (var i = 0; i < ctrl.nowRadius.length; i++) {    //初始化每个图片的半径
                    ctrl.nowRadius[i] = parseInt(ctrl.strRadius);
                }
                this.src = ctrl.arrSrc[0];             
                window.clearInterval(ctrl.itemid);
                ctrl.itemid = window.setInterval(thismoveImage, 1);

            }
        }
        this.offsetLeft = parentImgCtrl.offsetLeft;
        this.offsetTop = parentImgCtrl.offsetTop;
       
    }
    this.moveImage = function () {
        var imgs = this.parentCtrl.children;
        var index = this.moveImgIndex;
        var everyRadius = this.nowRadius;

        for (var m = 0; m < everyRadius.length; m = m + 2) {//计算现在每个图片应该走到的位置
            if (this.toOpen) {
                if (everyRadius[m] == 0) { //如果这个图片刚开始走，它走完后，剩下的不再走，从而实现逐渐散开的效果
                    everyRadius[m] = everyRadius[m + 1] = everyRadius[m] + this.step;
                    if (everyRadius[m] > parseInt(this.strRadius))
                        everyRadius[m] = everyRadius[m + 1] = parseInt(this.strRadius);
                    break;
                }
                else if (everyRadius[m] == parseInt(this.strRadius)) {//如果该图片已经走完，不再走
                    continue;
                }
                else {
                    everyRadius[m] = everyRadius[m + 1] = everyRadius[m] + this.step;
                    if (everyRadius[m] > parseInt(this.strRadius))
                        everyRadius[m] = everyRadius[m + 1] = parseInt(this.strRadius);
                }
            }
            else {
                if (everyRadius[m] == 0) {
                    continue;
                }
                else if (everyRadius[m] == parseInt(this.strRadius)) {
                    everyRadius[m] = everyRadius[m + 1] = everyRadius[m] - this.step;
                    if (everyRadius[m] < 0)
                        everyRadius[m] = everyRadius[m + 1] = 0;
                    break;
                }
                else {
                    everyRadius[m] = everyRadius[m + 1] = everyRadius[m] - this.step;
                    if (everyRadius[m] < 0)
                        everyRadius[m] = everyRadius[m + 1] = 0;
                }
            }
        }
        for (var i = 0; i < imgs.length; i = i + 2) {//根据图片应该走的位置定位top和left值
            var stateAngle = (this.startAngle + (i / 2) * this.betweenAngle) / 360;
            stateAngle = stateAngle * 2 * 3.141592653;
            if (this.strDirection == "1" || this.strDirection == "2") {
                imgs[i].style.top = (this.offsetTop - everyRadius[i] * Math.sin(stateAngle)) + "px";
                imgs[i + 1].style.top = (this.offsetTop - everyRadius[i + 1] * Math.sin(stateAngle)) + "px";
            }
            else {
                imgs[i].style.top = (this.offsetTop + everyRadius[i] * Math.sin(stateAngle)) + "px";
                imgs[i + 1].style.top = (this.offsetTop + everyRadius[i + 1] * Math.sin(stateAngle)) + "px";
            }
            if (this.strDirection == "1" || this.strDirection == "4") {
                imgs[i].style.left = (this.offsetLeft + everyRadius[i] * Math.cos(stateAngle)) + "px";
                imgs[i + 1].style.left = (this.offsetLeft + everyRadius[i + 1] * Math.cos(stateAngle)) + "px";
            }
            else {
                imgs[i].style.left = (this.offsetLeft - everyRadius[i] * Math.cos(stateAngle)) + "px";
                imgs[i + 1].style.left = (this.offsetLeft - everyRadius[i + 1] * Math.cos(stateAngle)) + "px";
            }
        }
        //debugger
        if ((this.nowRadius[this.nowRadius.length - 1] == parseInt(this.strRadius) && this.toOpen)) {
            window.clearInterval(this.itemid);
            this.toOpen = false;
        }
        else if ((this.nowRadius[this.nowRadius.length - 1] == 0 && (!this.toOpen))) {
            window.clearInterval(this.itemid);
            document.getElementById("div" + this.picId).style.display = "none";
            this.toOpen = true;
        }
        this.nowRadius = everyRadius;
    }
    this.ImgClick = function(i) { 
    }
}
function Wa_SetImgAutoSize(iframe) { //根据图片的大小设定图片底层ifame的大小
    var img = iframe.previousSibling;
    //alert($(img).width());
    //var img=document.all.img1;//获取图片 
    var MaxWidth = 100; //设置图片宽度界限 
    var MaxHeight = 100; //设置图片高度界限 
    var HeightWidth = img.offsetHeight / img.offsetWidth; //设置高宽比 
    var WidthHeight = img.offsetWidth / img.offsetHeight; //设置宽高比 
    //alert("test"+img.offsetHeight+img.fileSize);
    if (img.offsetHeight > 1) //alert(img.offsetHeight);
        if (img.readyState != "complete") {
            return false; //确保图片完全加载
        }

    if (img.offsetWidth > MaxWidth) {
        img.width = MaxWidth;
        img.height = MaxWidth * HeightWidth;
    }
    if (img.offsetHeight > MaxHeight) {
        img.height = MaxHeight;
        img.width = MaxHeight * WidthHeight;
    }
    iframe.height = img.height;
    iframe.width = img.width;
}

