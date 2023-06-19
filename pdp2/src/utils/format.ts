// 根据长度生成空字符串的函数
export function generateEmptyString(length: number) {
    // 定义空字符串用于存放结果
    let result = '';
    // 定义循环计数器
    let counter = 0;
    // 循环指定的长度次
    while (counter < length) {
        // 将一个空格字符拼接到结果字符串上
        result += ' ';
        // 增加计数器的值
        counter++;
    }
    // 返回结果字符串
    return result;
}