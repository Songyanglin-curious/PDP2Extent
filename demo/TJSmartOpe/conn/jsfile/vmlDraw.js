
addStyle("v\:* {behavior: url(#default#VML);}"
    + ".centertext{font-family:微软雅黑;font-size:28px;}"
    + ".nodetext{font-family:微软雅黑;font-size:28px;}"
    + ".linetext{font-family:微软雅黑;font-size:14px;}");
/*window.attachEvent("onload", function () {
    var a = [];

    var b = { text: "中心节点", width: 200, height: 140 };
    a.push(b);
    b = { text: "节点1", x: 100, y: 100, width: 100, height: 70, linetext: "a", linecolor: "black", linetextcolor: "black" };
    a.push(b);
    b = { text: "节点2", x: 100, y: 700, width: 100, height: 70, linetext: "b", linecolor: "black", linetextcolor: "black" };
    a.push(b);
    b = { text: "节点3", x: 1100, y: 100, width: 100, height: 70, linetext: "c", linecolor: "black", linetextcolor: "black" };
    a.push(b);
    b = { text: "节点4", width: 100, height: 70, linetext: "d", linecolor: "black", linetextcolor: "black" };
    a.push(b);
    redrawVML(a, document.all.v_VML);
})*/


function redrawVML(data, div) {
    ///data格式：{text:节点内容,x:向右位移,y:向下位移,width:宽,height:高,linetext:线上的文字,linecolor:线颜色,linetextcolor:线文字颜色,detail:详细内容}
    if (!data || data.length == 0 || !div)
        return false;
    var swidth = $(div).width();
    var sheight = $(div).height();
    var vml = "";
    vml += '<v:group id="VML" style="left: 0px; width: 1000px; position1: absolute; top: 0px; height: 700px">';
    vml += '<v:oval style="z-index: 2;LEFT:' + (getValue(data[0].x, swidth / 2) - data[0].width / 2) + '; TOP:' + (getValue(data[0].y, sheight / 2) - data[0].height / 2) + ';WIDTH:' + data[0].width + ';HEIGHT:' + data[0].height + ';POSITION: absolute; cursor:pointer;" fillcolor="#A7BEE0" onclick="showDetail(' + 0 + ');"><v:extrusion on="t" type="parallel" backdepth="40px" color="#A7BEE0" diffusity="1.2" rotationangle="0,0" metal="F" brightness="0.4" skewangle="90" /><v:textbox class="centertext" style="text-align: center; vertical-align: middle; word-break: break-all; ">' + data[0].text + '</v:textbox></v:oval>';
    var c = [];
    if (data.length == 2) {
        c.push([getValue(data[0].x, swidth / 2), getValue(data[0].y, sheight / 2) + 300]);
    }
    else if (data.length == 3) {
        c.push([getValue(data[0].x, swidth / 2) - 200, getValue(data[0].y, sheight / 2) + 300]);
        c.push([getValue(data[0].x, swidth / 2) + 200, getValue(data[0].y, sheight / 2) + 300]);
    }
    else {
        var r;
        if (getValue(data[0].x, swidth / 2) > getValue(data[0].y, sheight / 2)) {
            r = getValue(data[0].y, sheight / 2) - 50;
        }
        else {
            r = getValue(data[0].x, swidth / 2) - 50;
        }
        c = getxy(data.length - 1, r, getValue(data[0].x, swidth / 2), getValue(data[0].y, sheight / 2));
    }
    for (var i = 1; i < data.length; i++) {
        vml += '<v:oval style="z-index: 2;LEFT:' + Math.max((getValue(data[i].x, c[i - 1][0]) - data[i].width / 2), 0) + ';TOP:' + Math.max((getValue(data[i].y, c[i - 1][1]) - data[i].height / 2), 0) + ';WIDTH: ' + data[i].width + ';HEIGHT:' + data[i].height + '; POSITION: absolute; cursor:pointer;" fillcolor="#A7BEE0" onclick="showDetail(' + i + ');"><v:extrusion on="t" type="parallel" backdepth="40px" color="#A7BEE0" diffusity="1.2" rotationangle="0,0" metal="F" brightness="0.4" skewangle="90" /><v:textbox class="nodetext" style="text-align: center; vertical-align: middle; word-break: break-all; ">' + data[i].text + '</v:textbox></v:oval>';
        vml += '<v:line strokecolor="' + data[i].linecolor + '" strokeweight="3px" style="position:static;z-index:1;left:' + getValue(data[i].x,c[i-1][0]) + ';top:' + getValue(data[i].y,c[i-1][1]) + ';" to="' + (getValue(data[0].x, swidth / 2) - getValue(data[i].x,c[i-1][0])) + ',' + (getValue(data[0].y, sheight / 2) - getValue(data[i].y,c[i-1][1])) + '"></v:line>'
        vml += '<v:roundrect style="z-index:6;width:50px;height:50px;position:absolute;left:' + (((getValue(data[0].x, swidth / 2) + getValue(data[i].x,c[i-1][0])) / 2) - 25) + ';top:' + (((getValue(data[0].y, sheight / 2) + getValue(data[i].y,c[i-1][1])) / 2) - 25) + ';" fillcolor="#34abbc";strokecolor="black"><v:textbox class="linetext" style="text-align: center; vertical-align: middle; color:' + data[i].linetextcolor + '">' + data[i].linetext + '</v:textbox></v:roundrect>'
    }
    vml += '</v:group>';
    div.innerHTML = vml;
}

function showDetail(index) {
    alert(index);
}

function getxy(count, r, a, b) {
    var l = [];
    for (var num = 0; num < count; num++) {

        var hudu = (2 * Math.PI / count) * num;

        var x = a + Math.sin(hudu) * r;

        var y = b - Math.cos(hudu) * r;    //  注意此处是“-”号，因为我们要得到的Y是相对于（0,0）而言的。
        l.push([x, y]);
    }
    return l;
}

function getValue(v, defValue) {
    return v == undefined ? defValue : v;
}
