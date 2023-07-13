// import replaceSchema from "./replace";
//1、替换，将cdata模式性替换成原来的，将模式名替换成cdata
/**
 * 1、创建一个配置文件
 * 2）根目录文件名，从当前文件向上查找，找到根目录文件
 * 3）schema文件路径，相对于上方的根目录文件
 * 4) 在光标处出个预览窗口，对于能替换的部分可以点击，有下拉框，选择替换的内容，该替换是双向的
 * 5）对于替换的操作设置键盘操作，上下左右可以移动要替换的部分
 */
//2、格式化，简单的分析SQL语句，将其格式化
/**
 * 简单的进行抽象语法树分析，分析出子查询，递归的进行格式化
 * same:  的cdata要被识别为模式名  或者部分cdata要被识别为SQL片段
 * 对select insert update delete进行分析和格式阿虎
 */
export { adjustSql } from "./adjust";