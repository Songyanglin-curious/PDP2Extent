
{//table开始
    var TableHandel = {
        filterData: function (vm, targetData, DataSource, params) {
            var dataArr = []
            if (!params || params.length == 0) {
                vm[targetData] = DataSource
            } else {
                dataArr[0] = DataSource
                for (var i = 0; i < params.length; i++) {
                    dataArr[i + 1] = []
                }
            }
            // 这部分循环太多，后续使用new Function 来替换
            for (var i = 0; i < params.length; i++) {
                if (vm[params[i].dataName].length === 0 || vm[params[i].dataName].includes(params[i].allSignal)) {
                    dataArr[i + 1] = dataArr[i]
                } else {
                    dataArr[i].forEach(item => {
                        if (vm[params[i].dataName].includes(String(item[params[i].col]))) {
                            dataArr[i + 1].push(item)
                        }
                    })
                }
            }
            vm[targetData] = dataArr[dataArr.length - 1]
        }
    }
}//table结束
{//format开始
    /**
     * 时分秒为0只显示 年-月-日，否则显示 年-月-日-时-分-秒
     * @param {*} time 
     * @returns 
     */
    function formatTime(time) {

        if (!time) return "";
        var h = Ysh.Time.formatString(time, "000100");
        var m = Ysh.Time.formatString(time, "000010");
        var s = Ysh.Time.formatString(time, "000001");
        if (0 === Number(h) && 0 === Number(m) && 0 === Number(s)) {
            return Ysh.Time.formatString(time, "111000");
        }
        return Ysh.Time.formatString(time, "111111");
    }
}//format结束

