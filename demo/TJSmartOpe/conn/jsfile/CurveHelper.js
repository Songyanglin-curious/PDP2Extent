// JScript File
function LA_Add2(v1, v2) {
    if (v1 == LA_NULLVALUE)
        return v2;
    if (v2 == LA_NULLVALUE)
        return v1;
    return v1 + v2;
}

function LA_Add3(v1, v2, v3) {
    if (v1 == LA_NULLVALUE)
        return LA_Add2(v2, v3);
    if (v2 == LA_NULLVALUE) {
        if (v3 == LA_NULLVALUE)
            return v1;
        return v1 + v3;
    }
    if (v3 == LA_NULLVALUE)
        return v1 + v2;
    return v1 + v2 + v3;
}

function LA_Sub(v1, v2) {
    if (v1 == LA_NULLVALUE)
        return v1;
    if (v2 == LA_NULLVALUE)
        return v1;
    return v1 - v2;
}
//color operate
function CC_TenToHexChar(i) {
	switch(i) {
		case 10:return 'A';
		case 11:return 'B';
		case 12:return 'C';
		case 13:return 'D';
		case 14:return 'E';
		case 15:return 'F';
	}
	return '' + i;
}
function CC_TenToHexChar2(i) {
	if (i < 16)
		return '0' + CC_TenToHexChar(i);
	return CC_TenToHexChar(parseInt(i/16,10)) + CC_TenToHexChar(i % 16);
}
function CC_ToColor(i) {
    if (i < 0)
        i += 256 * 256 * 256;
	var r,g,b;
	r = i % 256;
	g = (i % (256*256) - r) / 256;
	b = parseInt(i/256/256,10);
	return CC_TenToHexChar2(r) + CC_TenToHexChar2(g) + CC_TenToHexChar2(b);
}
//end color operate
function CC_GetParentTable(obj) { var tbl = obj;while (tbl) { if (tbl.tagName.toUpperCase() == "TABLE") { return tbl; };tbl = tbl.parentElement; };return null; }
function CC_RemoveCurve(chart) {
    if (chart.Subsets < 1)
        return;
    chart.Subsets = chart.Subsets - 1;
}
function CC_EmptyCurve(chart,idx) {
    for (var i = 0;i < chart.Points;i++)
        chart.YData(idx,i) = LA_NULLVALUE;
}
function CC_RemoveCurveEx(chart,idx) {
    for (var i = idx;i < chart.Subsets - 1;i++) {
        chart.SubsetLabels(i) = chart.SubsetLabels(i + 1);
        chart.SubsetColors(i) = chart.SubsetColors(i + 1);
        for (var j = 0;j < chart.Points;j++)
            chart.YData(i,j) = chart.YData(i + 1,j);
    }
    chart.Subsets = chart.Subsets - 1;
}
function CC_JumpReplaceCurveEx(chart,idx,arrData,iStart,iJump) {
    chart.SubsetLabels(idx) = arrData[0];
    for (var i = 0,j = 0;i < chart.Points;i+=iJump,j++) {
        if (iStart + 1 + j >= arrData.length)
            break;
        chart.YData(idx,i) = arrData[iStart + 1 + j];
    }
}
function CC_JumpReplaceCurve(chart,idx,arrData,iJump) {
    CC_JumpReplaceCurveEx(chart,idx,arrData,0,iJump);
}
function CC_ReplaceCurveEx(chart,idx,arrData,iStart) {
    CC_JumpReplaceCurveEx(chart,idx,arrData,iStart,1);
}
function CC_ReplaceCurve(chart,idx,arrData) {
    CC_ReplaceCurveEx(chart,idx,arrData,0);
}
function CC_CopyCurve(chart,idxSrc,idxDest) {
    chart.SubsetLabels(idxDest) = chart.SubsetLabels(idxSrc);
    chart.SubsetColors(idxDest) = chart.SubsetColors(idxSrc);
    chart.PlottingMethods(idxDest) = chart.PlottingMethods(idxSrc);
    chart.SubsetPointTypes(idxDest) = chart.SubsetPointTypes(idxSrc);
    chart.SubsetLineTypes(idxDest) = chart.SubsetLineTypes(idxSrc);
    for (var i = 0;i < chart.Points;i++) 
    {
        chart.PointTypes(idxDest,i) = chart.PointTypes(idxSrc,i);
        chart.PointColors(idxDest,i) = chart.PointColors(idxSrc,i);
        chart.YData(idxDest,i) = chart.YData(idxSrc,i);
    }
}
function CC_GetCurveData(chart,idx) {
    var arrData = [];
    arrData.push(chart.SubsetLabels(idx));
    for (var i = 0;i < chart.Points;i++)
        arrData.push(chart.YData(idx,i));
    return arrData;
}
function CC_IsNullData(arrData) {
    for (var i = 1;i < arrData.length;i++) {
        if (arrData[i] != LA_NULLVALUE)
            return false;
    }
    return true;
}
function CC_IsNullCurve(chart,idx,pt0,pt1) {
    for (var i = pt0;i <= pt1;i++) {
        if (chart.YData(idx,i) != LA_NULLVALUE)
            return false;
    }
    return true;
}
function CC_AddCurve(chart,arrData) {
    var idx  = chart.Subsets;
    chart.Subsets = idx + 1;
    chart.SubsetLineTypes(idx) = 0;
    CC_ReplaceCurve(chart,idx,arrData);
}
function CC_SetCurvePointsColor(chart,idx) {
    var clr = chart.SubsetColors(idx);
    for (var i = 0;i < chart.Points;i++)
        chart.PointColors(idx,i) = clr;
}
function CC_NavigateCurve(chart,idx) {
    if (idx >= 0) {
        for (var j = 0;j < chart.Points;j++) {
            var v = chart.YData(idx,j);
            if (v != LA_NULLVALUE)
                chart.YData(idx,j) = -v;
        }
    } else {
        for (var i = 0;i < chart.Subsets;i++) {
            for (var j = 0;j < chart.Points;j++) {
                var v = chart.YData(i,j);
                if (v != LA_NULLVALUE)
                    chart.YData(i,j) = -v;
            }
        }
    }
}
function CC_DrawCurveIncRate(chart,idx,clr,curvename) {
	var nSubsets = chart.Subsets;
	chart.Subsets++;
	with (chart) {
	    SubsetLabels(nSubsets) = curvename;
	    SubsetColors(nSubsets) = clr;
	    YData(nSubsets,0) = LA_NULLVALUE;
	    for (var j = 1;j < Points;j++) {
	        var v1 = YData(idx,j - 1),v2 = YData(idx,j);
	        if ((v1 == LA_NULLVALUE)||(v2 == LA_NULLVALUE)||(v1 == 0))
	            YData(nSubsets,j) = LA_NULLVALUE;
	        else
	            YData(nSubsets,j) = 100 * (v2 - v1) / v1;
	    }
	    MultiAxesSubsets(0) = 1;
	    MultiAxesSubsets(1) = 1;
	    OverlapMultiAxes(0) = 2;
	    WorkingAxis = 1;
	    YAxisColor = clr;
	    YAxisLabel = curvename;
	    PlottingMethod = 1;
	}
}
function CC_GetMinuteStr(h,m) {
    return ((h < 10) ? '0' + h : h) + ':' + ((m < 10) ? '0' + m : m);
}
function CC_GetSecondStr(h,m,s) {
    var strM = ((h < 10) ? '0' + h : h) + ':' + ((m < 10) ? '0' + m : m);
    if (s == 0)
        return strM;
    return strM + ':' + ((s < 10) ? '0' + s : s);
}