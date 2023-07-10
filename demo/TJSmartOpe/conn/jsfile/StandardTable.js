// JScript 文件
function getStandardTableTop(strTitle) {
    var strTable = "<table class=\"tblStandard\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr><td><div class=\"tdStandardTopLeft\" /></td>";
    strTable += "<td class=\"tdStandardTopCenter\">" + strTitle + "</td>";
    strTable += "<td><div class=\"tdStandardTopRight\" /></td></tr>";
    strTable += "</table>";
    document.write(strTable);
}

function getStandardTableBottom() {
    var strTable = "<table class=\"tblStandard\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr><td><div class=\"tdStandardBottomLeft\" /></td>";
    strTable += "<td class=\"tdStandardBottomCenter\"></td>";
    strTable += "<td><div class=\"tdStandardBottomRight\" /></td></tr>";
    strTable += "</table>";
    document.write(strTable);
}

function getSmallTableTop(strTitle) {
    var strTable = "<table class=\"tblStandard\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr><td><div class=\"tdSmallTopLeft\" /></td>";
    strTable += "<td class=\"tdSmallTopCenter\">" + strTitle + "</td>";
    strTable += "<td><div class=\"tdSmallTopRight\" /></td></tr>";
    strTable += "</table>";
    document.write(strTable);
}

function getSmallTableBottom() {
    var strTable = "<table class=\"tblStandard\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr><td><div class=\"tdSmallBottomLeft\" /></td>";
    strTable += "<td class=\"tdSmallBottomCenter\"></td>";
    strTable += "<td><div class=\"tdSmallBottomRight\" /></td></tr>";
    strTable += "</table>";
    document.write(strTable);
}