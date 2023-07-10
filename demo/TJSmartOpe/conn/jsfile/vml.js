/*********************************************************
函数名称：drawPie
函数说明：画饼状图
传入参数：
vmlImage :VMLImage对象，包含图形的宽度，高度和边距参数
vmlGroup :VMLGroup对象
dataDesc :数组，描述每个数据代表的意义
dataArray :绘制图形的数据值
返回：无
***********************************************************/
function drawPie(vmlImage,vmlGroup,dataDesc,dataArray)
{
    offsetLeft = vmlImage.left;
    offsetTop = vmlImage.top;
    canvasWidth = vmlImage.width;
    canvasHeight = vmlImage.height; 
    var dataCount = dataDesc.length;
    var totalValue = sumArray(dataArray);

    var divImage = document.createElement("<div style='z-index:100;' width:"+eval(canvasWidth-50)+"px;height:"+eval(canvasHeight+50)+"px></div>");
    var PreAngle = 0;
    var eleShape = null;
    var eleTextBox = null;
    for(var i=0;i<dataCount;i++)
    { 
       var color = getColor(i);
       eleShape = document.createElement("<v:shape style='position:absolute;left:" + offsetLeft + "px;top:" + offsetTop + "px;width:" + canvasWidth + "px;height:" + canvasHeight + "px;z-index:1' coordsize='1500,1400' o:spt='100' adj='0,,0' path='m750,700ae750,700,750,700," + parseInt(23592960*PreAngle) + "," + parseInt(23592960*dataArray[i]/totalValue) + "xe' fillcolor='" + color.color1 + "' strokecolor='#FFFFFF'></v:shape>");
       eleShape.appendChild(document.createElement("<v:fill color2='" + color.color2 + "' rotate='t' focus='100%' type='gradient'/>"));
       eleShape.appendChild(document.createElement("<v:stroke joinstyle='round'/>"));
       eleShape.appendChild(document.createElement("<v:formulas/>"));
       eleShape.appendChild(document.createElement("<v:path o:connecttype='segments'/>"));
       eleShape.appendChild(document.createElement("<v:extrusion type='view' on='t' backdepth='20' brightness='0.2' rotationangle='0,0' />"));
       divImage.appendChild(eleShape);
  
       PreAngle += dataArray[i] / totalValue;
    }
    var pie = Math.PI;
    var TempPie = 0;
    var startX = offsetLeft + canvasWidth/2;
    var startY = offsetTop + canvasHeight/2;

    for(var i=0;i<dataCount;i++)
    {
       var TempAngle = pie * 2 * (dataArray[i] / (totalValue * 2) + TempPie);
       var x1 = startX + Math.cos(TempAngle) * canvasWidth * 3/8;
       var y1 = startY - Math.sin(TempAngle) * canvasHeight * 3/8;
       var x2 = startX + Math.cos(TempAngle) * canvasWidth * 3/4;
       var y2 = startY - Math.sin(TempAngle) * canvasHeight * 3/4;

       if(x2>offsetLeft + canvasWidth/2)
       {
           x3 = x2 + 20;
           x4 = x3;
       }
       else
       {
           x3 = x2 - 20;
           x4 = x3 - 100;
       }
       divImage.appendChild(document.createElement("<v:line style='position:absolute;left:0;text-align:left;top:0;z-index:1' from='" + x1 + "px," + y1 + "px' to='" + x2 + "px," + y2 + "px' coordsize='21600,21600' strokecolor='#111111' strokeweight='1px'></v:line>"));
       divImage.appendChild(document.createElement("<v:line style='position:absolute;left:0;text-align:left;top:0;z-index:1' from='" + x2 + "px," + y2 + "px' to='" + x3 + "px," + y2 + "px' coordsize='21600,21600' strokecolor='#111111' strokeweight='1px'></v:line>"));
       eleShape = document.createElement("<v:shape style='position:absolute;left:" + x4 + "px;top:" + (y2 - 10) + "px;width:100px;height:20px;z-index:1'></v:shape>")
       eleTextBox = document.createElement("<v:textbox inset='0px,0px,0px,0px'></v:textbox>");
       eleTextBox.innerHTML = "<table cellspacing='3' border=0 cellpadding='0' width='100%' height='100%'><tr><td align='center'>" + dataDesc[i] + " " + Math.round(parseFloat(dataArray[i] * 100/ totalValue)*100)/100 + "%</td></tr></table>";
       eleShape.appendChild(eleTextBox);
       divImage.appendChild(eleShape);
       TempPie += dataArray[i]/totalValue;
   }
    vmlGroup.appendChild(divImage);
}
/**********************************
函数名称：Point
函数说明：定义点坐标类
传入参数：
返回：
**********************************/
function Point(x,y)
{
    this.x=x;
    this.y=y;
    return this;
}
/**********************************
函数名称：Color
函数说明：定义颜色类
传入参数：
返回：
**********************************/
function Color(color1,color2)
{
    this.color1 = color1;
    this.color2 = color2;
    return this;
}
/**********************************
函数名称：getMaxValue
函数说明：获得数组中的最大值
传入参数：
dataArray:查找最大值的数组
返回：数组中的最大值
**********************************/
function getMaxValue(dataArray)
{
    if(null==dataArray || dataArray.length==0) return 0;
    var maxValue = 0;
    for(var i=0;i<dataArray.length;i++)
    {
       if(dataArray[i]>maxValue)
        maxValue = dataArray[i];
    }
    return maxValue;
}
/**********************************
函数名称：getMinValue
函数说明：获得数组中的最小值
传入参数：
dataArray:查找最小值的数组
返回：数组中的最小值
**********************************/
function getMinValue(dataArray)
{
    if(null==dataArray || dataArray.length==0) return null;
    var minValue = dataArray[0];
    for(var i=0;i<dataArray.length;i++)
    {
       if(dataArray[i]<minValue)
        minValue = dataArray[i];
    }
    return minValue;
}
/**********************************
函数名称：resetValue
函数说明：对数组中的值按比率缩放
传入参数：
   ratio:比率值
   baseValue:要减去的值
   dataArray:进行缩放数据的数组
返回：缩放后的新数组
**********************************/
function resetValue(ratio,baseValue,dataArray)
{
    if(null==dataArray || dataArray.length==0) return;
    var newArray = new Array();
    for(var i=0;i<dataArray.length;i++)
    {
       newArray[i] = (dataArray[i]-baseValue)*ratio;
    }
    return newArray;
}
/*****************************************
函数名称：getColor
函数说明：获取指定位置的颜色值
传入参数：颜色值索引
返回：颜色变量对象
*****************************************/
function getColor(index)
{
    var color = new Color();
    switch(index)
    {
       case 0:
        {
         color.color1 = "#00ff00";
         color.color2 = "#d1ffd1";
        }
        break;
       case 1:
        {
         color.color1 = "#ff0000";
         color.color2 = "#ffbbbb";
        }
        break;
       case 2:
        {
         color.color1 = "#ff9900";
         color.color2 = "#ffbbbb";
        }
        break;
        return "#ffe3bb";
       case 3:
        {
         color.color1 = "#33cccc";
         color.color2 = "#cff4f3";
        }
        break;
       case 4:
        {
         color.color1 = "#666699";
         color.color2 = "#d9d9e5";
        }
        break;
       case 5:
        {
         color.color1 = "#993300";
         color.color2 = "#ffc7ab";
        }
        break;
       case 6:
        {
         color.color1 = "#99cc00";
         color.color2 = "#ecffb7";
        }
        break;
       case 7:
        {
         color.color1 = "#ff0000";
         color.color2 = "#FF0000";
        }
        break;
       default:
        return "";
    }
    return color;
}
/*****************************************
函数名称：sumArray
函数说明：对数组中的值进行求和
传入参数：进行求和的数组
返回：求和后的值
*****************************************/
function sumArray(dataArray)
{
    var sumValue = 0;
    for(var i=0;i<dataArray.length;i++)
       sumValue = eval(sumValue+dataArray[i]);
    return sumValue;
}