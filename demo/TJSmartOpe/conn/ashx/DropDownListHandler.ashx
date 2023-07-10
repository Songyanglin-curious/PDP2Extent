<%@ WebHandler Language="C#" Class="DropDownListHandler" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using FreeGrid;

using Microsoft.International.Converters.PinYinConverter;

public class DropDownListHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.Clear();
        context.Response.ContentEncoding = Encoding.UTF8;
        context.Response.ContentType = "application/json";
        try
        {
            using (YshGrid.CreateDBManager())
            {
                context.Response.Write(GetAjaxResult(context));
            }
        }
        catch (Exception ex)
        {
            System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
            var vResult = new { msg = ex.Message, flag = 0 };
            context.Response.Write(js.Serialize(vResult));
        }
        finally
        {
            context.Response.Flush();
            context.Response.End();
        }
    }

    private const string CONST_WHERE_REG = @"\s(([^\s]+='?%?\{.+?\}%?'?)|([^\s]+([^\WHERE]|\s)?(like|=|>=|<=)(.*?)?'?%?\{.+?\}%?'?)|('?%?\{.+?\}%?'?\s?=\s?[^\s]+))\s?";

    private string GetAjaxResult(HttpContext context)
    {
        string strResult = "";
        if (!string.IsNullOrEmpty(context.Request.Form["postType"]))
        {
            System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
            List<Dictionary<string, string>> listResult = new List<Dictionary<string, string>>();
            string strPostType = context.Request.Form["postType"];
            string strDataType = context.Request.Form["dt"];
            string strDb = context.Request.Form["db"];
            string strDataSource = context.Request.Form["ds"];
            string strDataSourceAll = context.Request.Form["dsa"];
            string strDataFilter = context.Request.Form["df"];
            string strTextField = context.Request.Form["tk"];
            string strValueField = context.Request.Form["vk"];
            string strSearchParam = context.Request.Form["wp"];
            List<SearchParam> listParam = js.Deserialize<List<SearchParam>>(strSearchParam);
            DataTable dt = new DataTable();
            if (strDataType.ToLowerTrimEquals("sql") && (strDb.IsEmptyOrNull() || strDataSource.IsEmptyOrNull()))
            {
                var vResult = new { data = DBNull.Value };
                strResult = js.Serialize(vResult);
            }
            else
            {
                switch (strPostType)
                {
                    case "GetDataList": 
                        dt = GetSourceData(strDataType, strDb, strDataSource, strTextField, strValueField, listParam, false);
                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            listResult.Add(GetJsonItem(dt.Rows[i]));
                        }
                        var vResult = new { data = listResult, col = GetTableColumns(dt), flag = 1 };
                        strResult = js.Serialize(vResult);
                        break;
                    case "SearchKey":
                        {
                            string strKeyValue = context.Request.Form["text"];
                            dt = GetSourceData(strDataType, strDb, strDataSource, strTextField, strValueField, listParam, false);
                            /*string strNewColumnName = "chinese_aa_bb_cc001";
                            dt.Columns.Add(strNewColumnName);
                            dt.ConvertRowsToChineseSpell(strTextField, strNewColumnName, delegate(string strFieldValue)
                            {
                                return GetChineseSpell(strFieldValue, true);
                            });
                            DataRow[] rs = dt.MatchChineseFirst(strTextField, strNewColumnName, strKeyValue);
                            for (int i = 0; i < rs.Length; i++)
                            {
                                listResult.Add(GetJsonItem(rs[i]));
                            }*/
                            string strUpperKeyValue = strKeyValue.ToUpper();
                            foreach (DataRow r in dt.Rows)
                            {
                                bool bMatch = false;
                                string strText = r[strTextField].ToString();
                                if (strText.IndexOf(strKeyValue) >= 0)
                                    bMatch = true;
                                else
                                {
                                    List<string> arrChinese = GetSimpleChineseSpell(strText);
                                    foreach (string strChinese in arrChinese)
                                    {
                                        if (strChinese.IndexOf(strUpperKeyValue) >= 0)
                                        {
                                            bMatch = true;
                                            break;
                                        }
                                    }
                                }
                                //if (r[strTextField].ToString().IndexOf(strKeyValue) >= 0 || r[strNewColumnName].ToString().ToUpper().IndexOf(strKeyValue.ToUpper()) >= 0)
                                if (bMatch)
                                {
                                    listResult.Add(GetJsonItem(r));
                                }
                            }
                            
                            //dt.Columns.Remove(strNewColumnName);
                            vResult = new { data = listResult, col = GetTableColumns(dt), flag = 1 };
                            strResult = js.Serialize(vResult);
                        }
                        break;
                    case "GetValueText":
                        {
                            if (string.IsNullOrEmpty(strDataSourceAll))
                            {
                                dt = GetSourceData(strDataType, strDb, strDataSource, strTextField, strValueField, listParam, true);
                            }
                            else
                            {
                                dt = GetAllDataTable(strDataType, strDb, strDataSourceAll, strTextField, strValueField);
                            }
                            //update by wangbinbin 20130325 改成多个选中值
                            string strValue = context.Request.Form["val"];
                            DataRow[] rs = null;
                            if (string.IsNullOrEmpty(strValue))
                            {
                                rs = dt.Select(strValueField + " IS NULL");
                            }
                            else
                            {
                                strValue = "'" + strValue.Replace(",", "','") + "'";
                                rs = dt.Select("" + strValueField + " in (" + strValue + ")");
                            }

                            var vText = new { text = "", flag = 1 };
                            if (rs.Length > 0)
                            {
                                string strText = "";
                                for (int i = 0; i < rs.Length; i++)
                                    strText += rs[i][strTextField].ToString().Trim() + ",";
                                if (strText != "")
                                    strText = strText.Substring(0, strText.Length - 1);
                                vText = new { text = strText, flag = 1 };
                            }
                            //update end
                            strResult = js.Serialize(vText);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return strResult;
    }

    private Dictionary<string, string> GetJsonItem(DataRow r)
    {
        Dictionary<string, string> dicItem = new Dictionary<string, string>();
        for (int j = 0; j < r.Table.Columns.Count; j++)
        {
            dicItem.Add(r.Table.Columns[j].ColumnName.ToLower(), r[j].ToString().Trim());
        }
        return dicItem;
    }

    private List<object> GetTableColumns(DataTable dt)
    {
        List<object> listCol = new List<object>();
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            listCol.Add(new { cname = dt.Columns[j].ColumnName });
        }
        return listCol;
    }


    private DataTable GetAllDataTable(string strDataType, string strDb, string strDataSource, string strTextField,
                                    string strValueField)
    {
        DataTable dt = new DataTable();
        if (strDataType.ToLowerTrimEquals("sql"))
        {
            dt = GetSqlDataTable(strDb, strDataSource, new List<SearchParam>(), true);
        }
        else if (strDataType.ToLowerTrimEquals("list"))
        {
            dt = GetListDataTable(strTextField, strValueField, strDataSource);
        }
        else if (strDataType.ToLowerTrimEquals("dll"))
        {
            dt = GetDllDataTable(strDataSource);
        }
        return dt;
    }


    /// <summary>
    /// 查询数据源数据
    /// </summary>
    /// <param name="strDataType"></param>
    /// <param name="strDb"></param>
    /// <param name="strDataSource"></param>
    /// <param name="strTextField"></param>
    /// <param name="strValueField"></param>
    /// <param name="strDataFilter"></param>
    /// <param name="bAllGet">是否获取所有数据</param>
    /// <returns></returns>
    private DataTable GetSourceData(string strDataType, string strDb, string strDataSource, string strTextField,
                                    string strValueField, List<SearchParam> listParam, bool bAllGet)
    {
        DataTable dt = new DataTable();
        if (strDataType.ToLowerTrimEquals("sql"))
        {
            dt = GetSqlDataTable(strDb, strDataSource, listParam, bAllGet);
        }
        else if (strDataType.ToLowerTrimEquals("list"))
        {
            dt = GetListDataTable(strTextField, strValueField, strDataSource);
        }
        else if (strDataType.ToLowerTrimEquals("dll"))
        {
            dt = GetDllDataTable(listParam, strDataSource);
        }
        return dt;
    }

    /// <summary>
    /// 获取SQL语句查询的数据
    /// </summary>
    /// <param name="strDb"></param>
    /// <param name="strDataSource"></param>
    /// <param name="listParam"></param>
    /// <param name="bAllGet"></param>
    /// <returns></returns>
    public DataTable GetSqlDataTable(string strDb, string strDataSource, List<SearchParam> listParam, bool bAllGet)
    {
        DataTable dt = new DataTable();
        DBAdapte.DBAdapter db = YshGrid.GetCurrDBManager().GetDBAdapter(strDb);
        {
            Regex regWhere = new Regex(CONST_WHERE_REG, RegexOptions.Compiled);
            Match mt = regWhere.Match(strDataSource);
            string[] strReplaces = new string[0];
            while (mt.Success)
            {
                Array.Resize<string>(ref strReplaces, strReplaces.Length + 1);
                strReplaces[strReplaces.Length - 1] = mt.Value.Trim();
                strDataSource = strDataSource.Replace(mt.Value.Trim(), "{" + (strReplaces.Length - 1) + "}");
                mt = regWhere.Match(strDataSource);
            }
            for (int i = 0; i < strReplaces.Length; i++)
            {
                if (!bAllGet)
                {
                    Regex reg = new Regex(@"\{(.*?)}", RegexOptions.Compiled);
                    Match m = reg.Match(strReplaces[i]);
                    while (m.Success)
                    {
                        foreach (SearchParam sp in listParam)
                        {
                            if (m.Groups[1].Value.Trim() == sp.key)
                            {
                                if (sp.must)
                                {
                                    strReplaces[i] = strReplaces[i].Replace("{" + sp.key + "}", sp.value);
                                }
                                else
                                {
                                    if (string.IsNullOrEmpty(sp.value))
                                    {
                                        strReplaces[i] = "1=1";
                                    }
                                    else
                                    {
                                        strReplaces[i] = strReplaces[i].Replace("{" + sp.key + "}", sp.value);
                                    }
                                }
                            }
                        }
                        m = reg.Match(strReplaces[i]);
                    }
                }
                else
                {
                    strReplaces[i] = "1=1";
                }
            }
            strDataSource = string.Format(strDataSource, strReplaces);
            DataSet ds = db.ExecuteDataSet(strDataSource);
            dt = ds.Tables[0];
        }
        return dt;
    }

    /// <summary>
    /// 获取自定义LIST数据
    /// </summary>
    /// <param name="strTextField"></param>
    /// <param name="strValueField"></param>
    /// <param name="strDataSource"></param>
    /// <returns></returns>
    public DataTable GetListDataTable(string strTextField, string strValueField, string strDataSource)
    {
        DataTable dt = new DataTable();
        dt.Columns.Add(strTextField);
        dt.Columns.Add(strValueField);
        string[] strItems = strDataSource.Split(',');
        foreach (string strItem in strItems)
        {
            DataRow r = dt.NewRow();
            string[] strValues = strItem.Replace("'", string.Empty).Split(':');
            r[0] = strValues[0];
            r[1] = strValues[1];
            dt.Rows.Add(r);
        }
        return dt;
    }

    public DataTable GetDllDataTable(string strDataSource)
    {
        return GetDllDataTable(null, strDataSource);
    }

    /// <summary>
    /// 获取DLL数据源数据
    /// </summary>
    /// <param name="listParam"></param>
    /// <param name="strDataSource"></param>
    /// <returns></returns>
    public DataTable GetDllDataTable(List<SearchParam> listParam, string strDataSource)
    {
        using (YshGrid.CreateDBManager())
        {
            DataTable dt = new DataTable();
            GudUsing.YshDllUsing dllUsing = new GudUsing.YshDllUsing();
            dllUsing.Parse(strDataSource);
            object[] objs = new object[listParam.Count];
            for (int i = 0; i < listParam.Count; i++)
            {
                objs[i] = listParam[i].value;
            }
            object objValue = dllUsing.Invoke(objs);
            dt = objValue == null ? new DataTable() : (DataTable)objValue;

            return dt;
        }

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    public class SearchParam
    {
        public string key { get; set; }
        public string value { get; set; }
        public bool must { get; set; }
    }

    #region 汉语拼音获取

    private Dictionary<char, string[]> dictChineseSpell = new Dictionary<char, string[]>();

    public List<string> GetSimpleChineseSpell(string strText)
    {
        List<string> lstSpell = new List<string>();
        foreach (char ch in strText)
        {
            string[] arrCharChinese = null;
            if (dictChineseSpell.ContainsKey(ch))
            {
                arrCharChinese = dictChineseSpell[ch];
            }
            else
            {
                if (ChineseChar.IsValidChar(ch))
                {
                    ChineseChar chineseChar = new ChineseChar(ch);
                    List<string> lstTemp = new List<string>();
                    foreach (string strChinese in chineseChar.Pinyins)
                    {
                        if (string.IsNullOrEmpty(strChinese))
                            continue;
                        string strFirst = strChinese.Substring(0, 1);
                        if (!lstTemp.Contains(strFirst))
                            lstTemp.Add(strFirst);
                    }
                    arrCharChinese = lstTemp.ToArray();

                }
                else
                {
                    arrCharChinese = new string[] { };
                }
                dictChineseSpell[ch] = arrCharChinese;
            }
            if (arrCharChinese.Length == 0)
                continue;
            if (lstSpell.Count == 0)
            {
                lstSpell.AddRange(arrCharChinese);
            }
            else
            {
                List<string> lstTemp = new List<string>();
                foreach (string str0 in lstSpell)
                {
                    foreach (string str1 in arrCharChinese)
                    {
                        lstTemp.Add(str0 + str1);
                    }
                }
                lstSpell = lstTemp;
            }
        }
        return lstSpell;
    }
    
    /// <summary> 
    /// 获取中文字符串的首字母
    /// </summary> 
    /// <param name="str">汉字</param> 
    /// <returns>首字母</returns> 
    public static string GetChineseSpell(string strText)
    {
        return GetChineseSpell(strText, false);
    }

    /// <summary>
    /// 获取中文字符串的首字母
    /// </summary>
    /// <param name="strText">汉字</param>
    /// <param name="bPolyphone">是否多音字首字母,选择true：结果将以‘|’分隔首字母拼音</param>
    /// <returns></returns>
    public static string GetChineseSpell(String strText, Boolean bPolyphone)
    {
        string strResult = String.Empty;
        List<String> lstPinYin = new List<String>();//最终结果，从缓存结果中过滤掉重复字段
        List<String[]> lstPinYin2 = new List<String[]>();//缓存
        List<String[]> lstPolyphone = new List<String[]>();
        for (Int32 i = 0; i < strText.Length; i++)
        {
            Char obj = strText[i];
            if (ChineseChar.IsValidChar(obj))
            {
                ChineseChar chineseChar = new ChineseChar(obj);
                if (bPolyphone)
                {
                    lstPolyphone = new List<String[]>();//记录汉字多音字
                    List<String> listStr = GetPolyphone(obj);
                    for (Int32 j = 0; j < listStr.Count; j++)
                    {
                        String[] tmp = { i.ToString(), listStr[j].Substring(0, 1) };
                        if (!lstPolyphone.Contains(tmp))
                        {
                            lstPolyphone.Add(tmp);
                        }
                    }
                    MergerPolyphoneList(lstPinYin2, lstPolyphone);
                }
                else
                {
                    String[] tmp = { i.ToString(), chineseChar.Pinyins[0].ToString().Substring(0, 1) };
                    lstPinYin2.Add(tmp);
                }
            }
            else
            {
                if (bPolyphone)
                {
                    String[] tmp = { i.ToString(), obj.ToString() };
                    if (!lstPinYin2.Contains(tmp))
                        lstPinYin2.Add(tmp);
                    for (int k = 0; k < lstPinYin2.Count; k++)
                    {
                        if (Convert.ToInt32(lstPinYin2[k][0]) == (i - 1))
                        {
                            String[] tmp2 = { i.ToString(), lstPinYin2[k][1] + obj.ToString() };
                            lstPinYin2.Add(tmp2);
                        }
                    }
                }
                else
                {
                    String[] tmp = { i.ToString(), obj.ToString() };
                    lstPinYin2.Add(tmp);
                }
            }
        }
        for (Int32 j = 0; j < lstPinYin2.Count; j++)
        {
            if (!lstPinYin.Contains(lstPinYin2[j][1]))
                lstPinYin.Add(lstPinYin2[j][1]);
        }
        return GetPinYinFirstSpell(lstPinYin, bPolyphone);
    }

    /// <summary>
    /// 合并多音字拼音列表
    /// </summary>
    /// <param name="lst1"></param>
    /// <param name="lst2"></param>
    /// <returns></returns>
    public static void MergerPolyphoneList(List<String[]> lst1, List<String[]> lst2)
    {
        if (lst1.Count == 0)
        {
            lst1.InsertRange(0, lst2);
        }
        else
        {
            List<String[]> lstTemp = lst1;
            for (Int32 i = 0; i < lst2.Count; i++)
            {
                if (!lstTemp.Contains(lst2[i]))
                    lstTemp.Add(lst2[i]);
                for (Int32 j = 0; j < lstTemp.Count; j++)
                {
                    if (Convert.ToInt32(lstTemp[j][0]) == (Convert.ToInt32(lst2[i][0]) - 1))
                    {
                        String[] tmp = { lst2[i][0], lstTemp[j][1] + lst2[i][1] };
                        lstTemp.Add(tmp);
                    }
                }
            }
        }
    }

    /// <summary>
    /// 获取拼音首字母转换后的字符串
    /// </summary>
    /// <param name="lstPinYin"></param>
    /// <param name="bPolyphone"></param>
    /// <returns></returns>
    public static string GetPinYinFirstSpell(List<string> lstPinYin, bool bPolyphone)
    {
        string strRetValue = string.Empty;
        if (bPolyphone)
        {
            strRetValue = string.Join("|", lstPinYin);
        }
        else
        {
            foreach (string strPinYin in lstPinYin)
            {
                strRetValue += strPinYin;
            }
        }
        return strRetValue;
    }

    /// <summary>
    /// 获取汉字所有多音字
    /// </summary>
    /// <param name="cnChar"></param>
    /// <returns></returns>
    public static List<string> GetPolyphone(char cnChar)
    {
        List<string> lstPinYin = new List<string>();
        if (ChineseChar.IsValidChar(cnChar))
        {
            ChineseChar chineseChar = new ChineseChar(cnChar);
            System.Collections.ObjectModel.ReadOnlyCollection<string> colPinYin = chineseChar.Pinyins;
            foreach (string strPinYin in colPinYin)
            {
                if (!strPinYin.IsEmptyOrNull() && !lstPinYin.Contains(strPinYin.Substring(0, strPinYin.Length - 1)))
                {
                    lstPinYin.Add(strPinYin.Substring(0, strPinYin.Length - 1));
                }
            }
        }
        else
        {
            lstPinYin.Add(cnChar.ToString());
        }
        return lstPinYin;
    }
    #endregion
}