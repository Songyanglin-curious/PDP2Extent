// JScript File -- Edit by Gud
function getPointsStr(pts) {
    if ((pts.length == 0) || (pts.length % 2 != 0)) return '';
    if (pts.length == 4) return 'from="' + pts[0] + ',' + pts[1] + '" to="' + pts[2] + ',' + pts[3] + '"';
    var str = '';
    for (var i = 0; i < pts.length; i += 2)
        str += pts[i] + ',' + pts[i + 1] + ' ';
    return str;
}

function getTextPoints(pts) {
    if (pts.length == 0) return [];
    var x = pts[0], y = pts[1];
    if (pts[3] < pts[1]) y -= 80;
    if (pts[3] > pts[1]) y += 20;
    var i = 0;
    if (pts.length > 4) i = 2;
    if (pts[2 + i] < pts[0]) x -= 20;
    if (pts[2 + i] > pts[0]) x += 20;
    return [x, y];
}

function ifRepeatStep(fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight) {
    return (fromStepX + fromStepWidth >= toStepX)
	&& (fromStepY + fromStepHeight >= toStepY)
	&& (toStepX + toStepWidth >= fromStepX)
	&& (toStepY + toStepHeight >= fromStepY);
}

//20160128
function getPoint(x, y) { return { "x": x, "y": y }; }
function getRect(x, y, w, h) {
    return {
        "x": x, "y": y, "w": w, "h": h
    };
}
//20160128 end

function getPolyLineActionPoints(linkType, fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight) {
    if (ifRepeatStep(fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight))
        return [];
    //linkType打算是用来决定线的连接方式，比如说：直连，先同Y,先同X等；现在用的是先同X
    linkType = parseInt(linkType, 10);
        var fromCenterX = fromStepX + parseInt(fromStepWidth / 2);
        var fromCenterY = fromStepY + parseInt(fromStepHeight / 2);
        var toCenterX = toStepX + parseInt(toStepWidth / 2);
        var toCenterY = toStepY + parseInt(toStepHeight / 2);
    if (linkType == 1) {

        var point1X, point1Y, point3X, point3Y;
        var point2X = fromCenterX;
        var point2Y = toCenterY;
        if (toCenterX > fromCenterX) {
            absY = toCenterY >= fromCenterY ? toCenterY - fromCenterY : fromCenterY - toCenterY;
            if (parseInt(fromStepHeight / 2) >= absY) {
                point1X = fromStepX + fromStepWidth;
                point1Y = toCenterY;
                point2X = point1X;
                point2Y = point1Y;
            } else {
                point1X = fromCenterX;
                point1Y = fromCenterY < toCenterY ? fromStepY + fromStepHeight : fromStepY;
            }
            absX = toCenterX - fromCenterX;
            if (parseInt(fromStepWidth / 2) >= absX) {
                point3X = fromCenterX;
                point3Y = fromCenterY < toCenterY ? toStepY : toStepY + toStepHeight;
                point2X = point3X;
                point2Y = point3Y;
            } else {
                point3X = toStepX;
                point3Y = toCenterY;
            }
        }
        else if (toCenterX < fromCenterX) {
            absY = toCenterY >= fromCenterY ? toCenterY - fromCenterY : fromCenterY - toCenterY;
            if (parseInt(fromStepHeight / 2) >= absY) {
                point1X = fromStepX;
                point1Y = toCenterY;
                point2X = point1X;
                point2Y = point1Y;
            } else {
                point1X = fromCenterX;
                point1Y = fromCenterY < toCenterY ? fromStepY + fromStepHeight : fromStepY;
            }
            absX = fromCenterX - toCenterX;
            if (parseInt(fromStepWidth / 2) >= absX) {
                point3X = fromCenterX;
                point3Y = fromCenterY < toCenterY ? toStepY : toStepY + toStepHeight;
                point2X = point3X;
                point2Y = point3Y;
            } else {
                point3X = toStepX + toStepWidth;
                point3Y = toCenterY;
            }
        }
        else /* (toCenterX == fromCenterX)*/{
            point1X = fromCenterX;
            point1Y = fromCenterY > toCenterY ? fromStepY : fromStepY + fromStepHeight;
            point3X = fromCenterX;
            point3Y = fromCenterY > toCenterY ? toStepY + toStepHeight : toStepY;
            point2X = point3X; point2Y = point3Y;
        }
        if (toCenterY == fromCenterY) {
            point1X = fromCenterX > toCenterX ? fromStepX : fromStepX + fromStepWidth;
            point1Y = fromCenterY;
            point3Y = fromCenterY;
            point3X = fromCenterX > toCenterX ? toStepX + toStepWidth : toStepX;
            point2X = point3X;
            point2Y = point3Y;
        }
        return [point1X, point1Y, point2X, point2Y, point3X, point3Y];
    }
    if (linkType == 2) {
    var arr = getPolyLineActionPoints(1, toStepX, toStepY, toStepWidth, toStepHeight, fromStepX, fromStepY, fromStepWidth, fromStepHeight);
    if (arr.length == 0)
        return arr;
    return [arr[4], arr[5], arr[2], arr[3], arr[0], arr[1]];
    }
    if (linkType == 3) {
        var midY = parseInt((fromCenterY + toCenterY) / 2);
        var point1 = { "x": fromCenterX, "y": midY };
        var point2 = { "x": toCenterX, "y": midY };
        if (fromStepY > point1.y)
            return [point1.x, fromStepY, point1.x, point1.y, point2.x, point2.y, point2.x, toStepY + toStepHeight];
        return [point1.x, fromStepY + fromStepHeight, point1.x, point1.y, point2.x, point2.y, point2.x, toStepY];
    }
    if (linkType == 4) {
        var midX = parseInt((fromCenterX + toCenterX) / 2);
        var point1 = { "x": midX, "y": fromCenterY };
        var point2 = { "x": midX, "y": toCenterY };
        if (fromStepX > point1.x)
            return [fromStepX, point1.y, point1.x, point1.y, point2.x, point2.y, toStepX + toStepWidth, point2.y];
        return [fromStepX + fromStepWidth,point1.y, point1.x, point1.y, point2.x, point2.y, toStepX, point2.y];
    }
    return [];
}