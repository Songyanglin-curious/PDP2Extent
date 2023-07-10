//////////////////////////////////////////////////////////
function ChartBindClass() {
    this.precision = 2;
    this.chart;
    this.arrIndex;
    this.arrName;
    this.tbl;
    this.nGroups;
    this.bV;
    this.nRows;
    this.nPoints = 96;
    this.GetPointHTML = function(SubsetIndex,PointIndex) { return CC_ParseNumber(this.chart.YData(SubsetIndex,PointIndex),this.precision); }
    this.GetPointIndex = function(r,gidx) { return (this.bV) ? (this.nRows * gidx + r) : (this.nGroups * r + gidx); }
    this.setRowStyle = function(row) { row.style.backgroundColor = "#FFFFFF"; }
    this.setTimeCellStyle = function(cell) { cell.style.textAlign = "center";cell.style.backgroundColor = "#D2ECFA"; }
    this.setDataCellStyle = function(cell) { cell.style.textAlign = "center"; }
    this.GetTimeStr = function(r,gidx) { 
        var t = this.GetPointIndex(r,gidx);
        var nPointsPerHour = this.nPoints / 24;
        var h = parseInt(t / nPointsPerHour,10);
        var m = (60 / nPointsPerHour) * (t % nPointsPerHour);
        return CC_GetMinuteStr(h,m); 
    }
    this.InsertTitleRow = function() {
	    var titlerow = this.tbl.insertRow(-1);
	    for (var i = 0;i < this.nGroups;i++) {
	        var timecell = titlerow.insertCell(-1);
	        timecell.className = "titlecol";
	        timecell.innerHTML = "<font color='#D15F13'>Ê±¼ä</font>";
		    for (var j = 0;j < this.arrName.length;j++) { var titlecell = titlerow.insertCell(-1);titlecell.className="titlecol";titlecell.style.fontSize = "12px";titlecell.innerHTML = this.arrName[j]; }
	    }
    }
    this.InsertDataRows = function() {
	    this.nRows = this.nPoints / this.nGroups;
	    for (var r = 0;r < this.nRows;r++) {
		    var row = this.tbl.insertRow(-1);
		    this.setRowStyle(row);
		    for (var groupindex = 0;groupindex < this.nGroups;groupindex++) {
			    var timecell = row.insertCell(-1);
			    this.setTimeCellStyle(timecell);
			    timecell.innerHTML = this.GetTimeStr(r,groupindex);
			    for (var k = 0;k < this.arrIndex.length;k++) {
			        var datacell = row.insertCell(-1);
			        this.setDataCellStyle(datacell);
			        datacell.innerHTML = this.GetPointHTML(this.arrIndex[k],this.GetPointIndex(r,groupindex));
			    }
		    }
	    }
    }
    this.SetChart = function(chart,arrIndex,arrName) {
        this.chart = chart;this.arrIndex = arrIndex;this.arrName = arrName;
        this.nPoints = this.chart.Points;
        if (!arrIndex) { this.arrIndex = [];this.arrName = [];for (var i = 0;i < chart.Subsets;i++) { var strLabel = chart.SubsetLabels(i);if (strLabel != "") { this.arrIndex.push(i);this.arrName.push(strLabel); }}}
    }
    this.BindTable = function(tbl,cols,v) {
        for (var i = tbl.rows.length - 1;i >= 0;i--) { tbl.deleteRow(i); }
        this.tbl = tbl;this.nGroups = cols;this.bV = v;
        this.InsertTitleRow();this.InsertDataRows();
    }
    this.GetPointIndexByPos = function(r,c) { return this.GetPointIndex(r - 1,parseInt(c / (this.arrIndex.length + 1),10)); }
    this.GetCellPos = function(idx,pt) {
        var r,c;
        if (this.bV) {
            r = pt % this.nRows;
            c = parseInt(pt / this.nRows,10);
        } else {
            r = parseInt(pt / this.nGroups,10);
            c = pt % this.nGroups;
        }
        return this.tbl.rows[r + 1].cells[(this.arrIndex.length + 1) * c + 1 + this.arrIndex.indexOf(idx)];
    }
    this.SetValue = function(idx,pt,v) {
        this.chart.YData(idx,pt) = v;
        this.GetCellPos(idx,pt).innerHTML = this.GetPointHTML(idx,pt);
    }
}