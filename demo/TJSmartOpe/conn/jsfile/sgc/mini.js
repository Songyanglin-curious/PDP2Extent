// 计算points的在地球上的最小包围圆（获取这个圆的多边形坐标）
function getEncircle(points, numOfCircle) {
    var dateTemp = new Date();
    var points3D = [];
    var lon, lat; // lon经度，lat纬度
    for (var i = 0; i < points.length; i++) {
        lon = points[i][0] * Math.PI / 180;
        lat = points[i][1] * Math.PI / 180;
        points3D[i] = [Math.sin(lat + Math.PI / 2) * Math.cos(lon + Math.PI),
                       Math.sin(lat + Math.PI / 2) * Math.sin(lon + Math.PI),
                       Math.cos(lat + Math.PI / 2)];
    }
    var c, r = 0;
    var p1, p2, p3;
    var delta = 0; // 扩大圈的半径，把变电站图表包进去
    delta = 0.002;
    calc:
    {
        if (points3D.length < 2) {
            c = points3D[0];
            r = 0;
        } else {
            if (points3D.length == 2) {
                c = [(points3D[0][0] + points3D[1][0]) / 2,
                (points3D[0][1] + points3D[1][1]) / 2,
                (points3D[0][2] + points3D[1][2]) / 2];
                r = dist(points3D[0], points3D[1]) / 2;
            } else {
                c = points3D[0];
                p1 = getFurthestPoint(points3D, c);

                if (p1 === false) {
                    r = 0;
                    break calc;
                }
                p2 = getFurthestPoint(points3D, p1);
                c = [(p1[0] + p2[0]) / 2,
                (p1[1] + p2[1]) / 2,
                (p1[2] + p2[2]) / 2];
                r = dist(p1, p2) / 2;
                for (var i = 0; i < points3D.length; i++) {
                    if (checkPoints(points3D, c, r)) {
                        break;
                    } else {
                        p3 = getFurthestPoint(points3D, c);
                        var info;
                        info = getCircle(p1, p2, p3);
                        c = info[0];
                        r = info[1];
                        p1 = p2;
                        p2 = p3;
                    }
                }
            }
        }
    }
    var outputString = '';
    return getPoly(numOfCircle, c, r, delta);
}
function dist(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
}
function checkPoints(points3D, c, r) {
    for (var i = 0; i < points3D.length; i++) {
        if (((dist(c, points3D[i]) - r).toFixed(5) - 0) > 0) {
            return false;
        }
    }
    return true;
}
function getFurthestPoint(points3D, c) {
    var max = 0, len = 0;
    var maxpoint = points3D[0];
    for (var i = 0; i < points3D.length; i++) {
        len = dist(c, points3D[i]);
        if (len > max) {
            max = len;
            maxpoints = points3D[i];
        }
    }
    if (max == 0) {
        return false;
    } else {
        return maxpoints;
    }
}
function getCircle(p1, p2, p3) {
    var a1, b1, c1, a2, b2, c2, xf, yf, zf, k; // xf, yf, zf为法向量，k为系数，求圆心坐标
    var x0, y0, z0; // 圆心坐标
    var x1 = p1[0];
    var y1 = p1[1];
    var z1 = p1[2];
    var x2 = p2[0];
    var y2 = p2[1];
    var z2 = p2[2];
    var x3 = p3[0];
    var y3 = p3[1];
    var z3 = p3[2];
    a1 = x1 - x2;
    b1 = y1 - y2;
    c1 = z1 - z2;
    a2 = x1 - x3;
    b2 = y1 - y3;
    c2 = z1 - z3;
    xf = b1 * c2 - b2 * c1;
    yf = c1 * a2 - c2 * a1;
    zf = a1 * b2 - a2 * b1;
    k = (xf * x1 + yf * y1 + zf * z1) / (xf ** 2 + yf ** 2 + zf ** 2);
    x0 = xf * k;
    y0 = yf * k;
    z0 = zf * k;
    r = Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2 + (z0 - z1) ** 2);
    return [[x0, y0, z0], r];
}
function getPoly(numOfCircle, c, r, delta) {
    var poly = [];
    var A = c[0];
    var B = c[1];
    var C = c[2];
    var t = [];
    r = r + delta;
    for (var i = 0; i <= numOfCircle; i++) {
        t = 2 * Math.PI * i / numOfCircle;
        z = B * r * Math.cos(t) / Math.sqrt(B ** 2 +
            B ** 2 * C ** 2 / (A ** 2 + B ** 2));
        x = (B * r * Math.sin(t) - A * C * z / Math.sqrt(A ** 2 + B ** 2)) / Math.sqrt(A ** 2 + B ** 2);
        y = - (A * x + C * z) / B;
        x = (x + A).toFixed(5) - 0;
        y = (y + B).toFixed(5) - 0;
        z = (z + C).toFixed(5) - 0;
        lat = (Math.acos(z) * 180 / Math.PI - 90).toFixed(5) - 0;
        lon = (180 + Math.atan(y / x) * 180 / Math.PI).toFixed(5) - 0;
        poly[i] = [lon, lat];
    }
    return poly;
}