{//init开始

    this.showFilter = function (rangeList, rangeColor, defRange, onchange) {
        var jqBar = $("#slider-bar");
        var jqBox = jqBar.find("#slider-box");
        if (!rangeList) {
            jqBox.empty();
            jqBar.hide();
            return;
        }
        jqBar.show();
        jqBox.html('<input type="hidden" class="slider-input" value="' + defRange + '" />');
        var jq = jqBox.find(".slider-input");
        var sz = [], img = [];
        var w = 100.0 / rangeColor.length;
        for (var i = 0; i < rangeColor.length; i++) {
            var clr = rangeColor[i]
            sz.push(Ysh.Number.toFixed(w * (i + 1), 2) + "% 100%");
            img.push(clr ? ("linear-gradient(" + clr + "," + clr + ")") : "");
        }
        sz = sz.join();
        img = img.join();
        jq.jRange({
            from: 0,
            to: rangeList.length - 1,
            step: 1,
            scale: rangeList,
            format: function (value) { return new String(rangeList[value]) },
            width: 300,
            showLabels: true,  		// 是否显示滑块上方的数值标签
            showScale: true,  		// 是否显示滑动条下方的尺寸标签
            isRange: true,     		// 是否为选取范围
            snap: true,
            onstatechange: function (e) {    //滑块范围改变时触发的方法
                temp = e.split(',')
                maxV = rangeList[Number(temp[1])]
                minV = rangeList[Number(temp[0])]
                onchange(minV, maxV);
            }
        });
        var box = jqBox.find(".clickable-dummy")[0];
        box.style.backgroundSize=sz
        box.style.backgroundImage=img
    }
    this.showFilter(this.rangeList,this.rangeColor,this.defRange,this.onchange)
}//init结束