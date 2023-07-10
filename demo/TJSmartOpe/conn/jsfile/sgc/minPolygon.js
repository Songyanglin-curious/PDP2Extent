// 参考https://blog.csdn.net/ChangHongJian/article/details/53024300
function Graham_example(points){
    var n=points.length; // 传入点的个数
    var res=[];
    Graham_scan(points,res,n);
    return res;

}
function Graham_scan(pointSet,ch,n) {
// 这里会修改pointSet
    var i, j, k = 0, top = 2;
    var tmp = {};
    // 找到一个基点，基本就是保证最下面最左面的点
    for (i = 1; i < n; i++) {
        if ((pointSet[i].y < pointSet[k].y) ||
            ((pointSet[i].y === pointSet[k].y) && (pointSet[i].x < pointSet[k].x))
        ) {
            k = i;
        }
    }

    tmp = pointSet[0];
    pointSet[0] = pointSet[k];
    pointSet[k] = tmp;

    use = n;
    for (i = 1; i < use - 1; i++) {
        k = i;
        for (j = i + 1; j < use; j++) {
            var direct = multiply(pointSet[0], pointSet[k], pointSet[j]);
            if (direct > 0) {
                k = j;
            } else if (direct === 0) {
                // k j 同方向
                var dis = distance_no_sqrt(pointSet[0], pointSet[j]) - distance_no_sqrt(pointSet[0], pointSet[k]);
                use--; // 也就是不要了
                if (dis > 0) {
                    // 保留j
                    // 把 k 就不要了
                    pointSet[k] = pointSet[j];
                    pointSet[j] = pointSet[use];
                    j--;
                } else {
                    tmp = pointSet[use];
                    pointSet[use] = pointSet[j];
                    pointSet[j] = tmp;
                }
            }
        }
        tmp = pointSet[i];
        pointSet[i] = pointSet[k];
        pointSet[k] = tmp;
    }

    ch.push(pointSet[0]);
    ch.push(pointSet[1]);
    ch.push(pointSet[2]);
    for (i = 3; i < use; i++) {
        while (!(multiply(pointSet[i], ch[top - 1], ch[top]) < 0)) {
            top--;
            ch.pop();
        }
        top++;
        ch.push(pointSet[i]);
    }
}
function multiply(p0,p1,p2) {
    return ((p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1]));
}