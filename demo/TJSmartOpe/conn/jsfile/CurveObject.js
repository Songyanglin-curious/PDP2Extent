// JScript File
function CC_InitCurveObject(obj) {
    if (!obj.precision)
        obj.precision = 2;
    obj.GetCursorTime = function(pt) {
        if (pt < 0) return "";
        idx = parseInt(pt,10);
        var h = parseInt(idx / 4,10);
        var m = idx % 4;
        return ((h < 10) ? "0" + h : h) + ((m == 0) ? ":00" : ":" + m * 15);
    }
    obj.GetTip = function() {
        var str = "";
        for (var i = 0;i < this.chart.Subsets;i++) {
	        var strLabel = this.chart.SubsetLabels(i);
	        if (strLabel == "")
		        continue;
	        str += "&nbsp;&nbsp;<font color='#" + CC_ToColor(this.chart.SubsetColors(i)) + "'>" + strLabel;		
	        if (this.chart.CursorPoint >= 0)
	            str += ":" + CC_ParseNumber(this.chart.YData(i,this.chart.CursorPoint),this.precision);
	        str += "</font>";
        }
        return str;
    }
    obj.FullFill = function() {
        var pobj = this.chart.parentElement;
        if (!pobj) return;
        this.ResetSize(parseInt(pobj.clientWidth,10),parseInt(pobj.clientHeight,10));
    }
    obj.ResetSize = function(w,h) {
        this.ResetSizeChart(w,h - 20);
    }
    obj.ResetSizeChart = function(w,h) {
        if (w < 1) w = 1;
        if (h < 1) h = 1;
        this.chart.height = h;
        this.chart.width = w;
        var tbl = CC_GetParentTable(this.chart);
        //tbl.rows[0].cells[0].style.width = w;
        tbl.rows[0].cells[0].style.width = Math.max(0,w - tbl.rows[0].cells[1].clientWidth);
        tbl.rows[0].cells[0].children[0].style.width = Math.max(0,w - tbl.rows[0].cells[1].clientWidth);
    }
    obj.CursorMoved =  function() {
        var pt = this.chart.CursorPoint;
        var str = "&nbsp;";
        if (pt >= this.chart.Points)
            pt = this.chart.Points - 1;
        if (pt < 0)
            pt = 0;
        CC_GetParentTable(this.chart).rows[0].cells[0].childNodes[0].innerHTML = "&nbsp;<font color='white'>[" + this.GetCursorTime(pt) +"]</font>" + this.GetTip();
        this.CursorMovedEx(pt);
    }
    obj.CursorMovedEx = function(pt) {
    }
}