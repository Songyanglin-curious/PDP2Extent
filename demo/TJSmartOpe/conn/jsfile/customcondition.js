function customCondition(file, type, element, codetype) {
    //file是文件名，用以区分不同的控件；
    //type是条件类型，用以区分某个控件中的某个自定义条件
    //element是元素，代表控件的id
    //codetype是代码类型，代表要返回的代码类型
    ////0代表html代码，如<input type='text' />
    ////1代表sql语句，如“value='5'”
    ////2代表sql描述，如“~~至~~”
    var code = new Array(3);
    code[0] = ""; //code[0][1][2]即对应上边的codetype
    code[1] = ""; //如果想使用数据校验功能，即用户填的数据有误情况下弹出alert，请将code[1]赋值为空
    code[2] = "";
    switch (file) {
        case "file1":
            switch (type) {
                case "custom1":

                    code[0] += "<input id='" + element + "Input' type='text' style='width:100px' />节";
                    var value = $("#" + element + "Input").val(); //数值
                    if (value != "") {//这个if即是一种校验，如果为真则正常赋值，如果为假，则进行alert并将code[1]赋值为空，这样就不会输出了
                        code[1] += "inputvalue=" + "'" + value + "'";
                        code[2] += value + "节";
                    }
                    else {
                        alert("值不能为空！");
                        code[1] += "";
                    }
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return code[codetype];
}