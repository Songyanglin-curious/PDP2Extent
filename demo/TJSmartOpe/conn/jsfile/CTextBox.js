function CTextBox(id, dbName, xmlPath) {
    //判断是否重复
    //arrArgs为String[]格式的参数
    this.Check = function (arrArgs) {
        //return window.YshGrid.GetSingleValueBySQL(dbName, xmlPath, arrArgs).value;
        var arrRet = GetBkData(YshGrid.ExecuteReader(dbName, xmlPath, arrArgs));
        if (!arrRet.check())
            return false;
        arrRet = arrRet.value;
        return (arrRet.length == 0);
    }
}
