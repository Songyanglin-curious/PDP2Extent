<%@ WebHandler Language="C#" Class="AskHandler" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Text.RegularExpressions;
using System.Net;
using System.IO;

[AjaxPro.JavaScriptConverterAttribute(typeof(JavascriptFunc))]
public class JavascriptFunc : AjaxPro.IJavaScriptConverter
{
    private System.Text.StringBuilder sb = new StringBuilder();

    public JavascriptFunc()
    {
    }

    public void Add(string str)
    {
        sb.Append(str);
    }

    public override string Serialize(object o)
    {
        JavascriptFunc t = o as JavascriptFunc;
        if (t == null)
            return base.Serialize(o);
        return "function() {" + t.sb.ToString() + "}";
    }

    public override Type[] DeserializableTypes
    {
        get
        {
            return new Type[] { typeof(JavascriptFunc) };
        }
    }
}

public class AskHandler : IHttpHandler, IRequiresSessionState
{
    private class SearchSession : GudAILib.ISession
    {
        private HttpSessionState s = null;
        private string key = string.Empty;
        public SearchSession(HttpSessionState session, string flag)
        {
            s = session;
            key = flag;
        }
        public object this[string name]
        {
            get { return s[key + "_#_" + name]; }
            set { s[key + "_#_" + name] = value; }
        }
        public string SessionID { get { return s.SessionID; } }
        public string Key { get { return key; } }
    }

    public void ProcessRequest(HttpContext context)
    {
        context.Response.Clear();
        context.Response.ContentEncoding = Encoding.UTF8;
        context.Response.ContentType = "text/plain";
        string strResult = "";
        GudUsing.Log.Add("进入AskHanlder:" + context.Request["m"] ?? "");
        try
        {
            //if (context.Session["userid"] == null) { throw new Exception(Message.NoSession); }
            string m = context.Request["m"];
            switch (m)
            {
                case "GetCountByText":
                    strResult = AjaxPro.JavaScriptSerializer.Serialize(GetCountByText(context.Request["key"], context.Session, context.Request["strInfo"].Trim()));
                    break;
                case "GetHistory":
                    strResult = AjaxPro.JavaScriptSerializer.Serialize(GetHistory(context.Request["key"], context.Session));
                    break;
                case "GetCardInfo":
                    strResult = AjaxPro.JavaScriptSerializer.Serialize(GetCardInfo(context.Request.Form["args"], context.Request.Form["id"]));
                    break;
                case "Read":
                    {
                        string conn = context.Request["conn"] ?? "";
                        string xml = context.Request["xml"] ?? "";
                        string args = context.Request["args"] ?? "";
                        strResult = Read(conn, xml, args);
                    }
                    break;
                case "Read2":
                    {
                        string conn = context.Request["conn"] ?? "";
                        string xml = context.Request["xml"] ?? "";
                        strResult = Read2(conn, xml);
                    }
                    break;
                case "List":
                    {
                        string conn = context.Request["conn"] ?? "";
                        string xml = context.Request["xml"] ?? "";
                        strResult = List(conn, xml);
                    }
                    break;
                case "UpdateAudio":
                    strResult = AjaxPro.JavaScriptSerializer.Serialize(UpdateAudio(context, context.Session, Convert.ToInt32(context.Request.Form["nRows"])));
                    break;
                case "dll":
                    {
                        string dll = context.Request.Form["dll"];
                        string args = context.Request.Form["args"];
                        strResult = Exec(context, dll, args);
                    }
                    break;
                case "sync":
                    strResult = GetSyncDataList(context, context.Request["name"], context.Request["time"]);
                    break;
                case "download":
                    DownloadFile(context);
                    break;
                case "g":
                    strResult = GenerateGFile(context);
                    break;
                default:
                    string strInfo = context.Request.Form["strInfo"].Trim();
                    int nPage = Convert.ToInt32(context.Request.Form["nPage"]);
                    int nMaxRows = Convert.ToInt32(context.Request.Form["nRows"]);
                    strResult = AjaxPro.JavaScriptSerializer.Serialize(GetInfoByText(context.Request["key"], context.Session, strInfo, nPage, nMaxRows));
                    break;
            }
        }
        catch (Exception ex)
        {
            GudUsing.Log.Add(ex.Message + "\r\n" + ex.StackTrace);
            strResult = "[{ 'display':'','err':' +" + WebUsing.ClientHelper.GetClientScript(ex.Message) + "'}]";
        }

        try
        {
            context.Response.Write(strResult);
            context.Response.Flush();
        }
        catch (Exception ex)
        {
            GudUsing.Log.Add(ex.Message + "\r\n" + ex.StackTrace);
        }
        finally
        {
            context.Response.End();
        }
    }

    public static string ToText(List<List<string>> lst, string sepRow = "\n", string sepCol = ",")
    {
        StringBuilder sb = new StringBuilder();
        bool bStartRow = true;
        foreach (List<string> row in lst)
        {
            if (bStartRow)
                bStartRow = false;
            else
                sb.Append(sepRow);
            bool bStartCol = true;
            foreach (string str in row)
            {
                if (bStartCol)
                    bStartCol = false;
                else
                    sb.Append(sepCol);
                sb.Append(str);
            }
        }
        return sb.ToString();
    }

    private static string List(string conn, string xml)
    {
        int n0 = System.Environment.TickCount;
        using (DBAdapte.DBAdapterManager m = YshGrid.CreateDBManager())
        {
            DBAdapte.DBAdapter db = m.GetDBAdapter(conn);
            string strSQL = YshGrid.GetSQLStatement(xml).TrimStart();
            using (System.Data.IDataReader reader = db.ExecuteReader(strSQL))
            {
                int nFieldCount = reader.FieldCount;
                while (reader.Read())
                    for (int i = 0; i < nFieldCount; i++)
                    {
                        object o = reader[i];
                    }
                GudUsing.Log.Add("use times:" + (System.Environment.TickCount - n0));
                return "";
            }
        }
    }

    private static string Read2(string conn, string xml)
    {
        string dt = DateTime.Now.ToString("yyyyMMdd");
        string file = System.Web.HttpContext.Current.Server.MapPath("~/App_Data/cache/" + conn + xml.Replace(":", "_").Replace("/", "_"));
        if (System.IO.File.Exists(file))
        {
            string text = System.IO.File.ReadAllText(file);
            if (text.StartsWith(dt))
                return text.Substring(dt.Length);
        }
        using (DBAdapte.DBAdapterManager m = YshGrid.CreateDBManager())
        {
            PDP pdp = new PDP();
            AjaxPro.JavaScriptArray arr = pdp.Read(conn, xml);
            string str = AjaxPro.JavaScriptSerializer.Serialize(arr);
            try
            {
                if (arr.Count > 1)
                {
                    bool b = (bool)arr[0];
                    if (b)
                        System.IO.File.WriteAllText(file, dt + str);
                }
            }
            catch
            {
            }
            return str;
        }
    }

    private static string Read(string conn, string xml, string args)
    {
        PDP pdp = new PDP();
        if (string.IsNullOrEmpty(args))
        {
            string str = AjaxPro.JavaScriptSerializer.Serialize(pdp.Read(conn, xml));
            return str;
        }
        string[] arrArgs = args.Split(',');
        object[] arrAjaxString = new object[arrArgs.Length];
        for (int i = 0; i < arrArgs.Length; i++)
        {
            AjaxPro.JavaScriptString s = new AjaxPro.JavaScriptString();
            arrAjaxString[i] = s + arrArgs[i];
        }
        return AjaxPro.JavaScriptSerializer.Serialize(pdp.Read(conn, xml, arrAjaxString));
    }

    private static string Exec(HttpContext context, string dll, string args)
    {
        AjaxPro.JavaScriptArray arrArgs = new AjaxPro.JavaScriptArray();
        if (!string.IsNullOrEmpty(args))
        {
            string[] arrArgName = args.Split(',');
            for (int a = 0; a < arrArgName.Length; a++)
                arrArgs.Add(context.Request.Form[arrArgName[a]]);
        }
        PDP pdp = new PDP();
        AjaxPro.JavaScriptObject o = new AjaxPro.JavaScriptObject();
        o.Add("type", "dll");
        o.Add("dll", dll);
        o.Add("args", arrArgs);
        AjaxPro.JavaScriptArray arr = pdp.Execute(new AjaxPro.JavaScriptObject[] { o }) as AjaxPro.JavaScriptArray;
        if ((bool)arr[0])
            arr[1] = (arr[1] as List<object>)[0];
        return AjaxPro.JavaScriptSerializer.Serialize(arr);
        //PDP2.IExecutor e = new PDP2.DLLExecutor(dll, arrArgs);
        //return AjaxPro.JavaScriptSerializer.Serialize(e.Execute(new List<object>()));
    }

    private static string HttpClientDoGet(string address)
    {
        Encoding myEncoding = Encoding.UTF8;
        //string address = "http://127.0.0.1:8001/card/" + strType + "?id=" + strID;
        HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(address);
        req.Method = "GET";
        req.ContentType = "text/html;charset=UTF-8";
        using (HttpWebResponse response = (HttpWebResponse)req.GetResponse())
        {
            using (Stream myResponseStream = response.GetResponseStream())
            {
                using (StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.UTF8))
                {
                    return myStreamReader.ReadToEnd();
                }
            }
        }
    }

    private static object GetCardInfo(DBAdapte.DBAdapterManager m, string args, string id)
    {
        string[] info = args.Split(',');
        string strLinkUrl = "", strWidth = "", strHeight = "", strUrlInfo = "";
        if (!string.IsNullOrEmpty(info[0]))
        {
            strUrlInfo = HttpClientDoGet("http://127.0.0.1:8001/card/" + info[0] + "?id=" + id);
            //string[] arr = strUrlInfo.Split(new string[] { "|||" }, StringSplitOptions.None);
            //if (arr.Length >= 3)
            //{
            //    strLinkUrl = arr[0];
            //    for (int j = 1; j < arr.Length - 2; j++)
            //        strLinkUrl += "|||" + arr[j];
            //    strWidth = arr[arr.Length - 2];
            //    strHeight = arr[arr.Length - 1];
            //}
        }
        if (info.Length > 1)
        {
            DBAdapte.DBAdapter db = m.GetDBAdapter("SGC");
            Linger.Common.XmlHelper xml = new Linger.Common.XmlHelper(wt.QueryHelper.GetSQLXml());
            string strSql = db.GetSQL(xml.GetSqlString(info[1]/*"GetStationLocation"*/), id);
            GudAILib.DccCache d = YshGrid.GetCache<GudAILib.DccCache>();
            d.DBManager = m;
            d.GetDcc("1");
            using (System.Data.IDataReader reader = db.ExecuteReader(strSql))
            {
                if (reader.Read())
                {
                    Regex reg = new Regex(@"\d+\.?\d+");
                    switch (info[1].ToLower())
                    {
                        case "getlineinfo":
                            return new
                            {
                                type = info[1],
                                dccid = d.GetDccIDLimit(reader["DISPATCH_ORG_ID"].ToString()),
                                url = strUrlInfo,
                                id = id,
                                voltage = getVoltageValue(reg, reader["VOLNAME"].ToString()),
                            };
                        default:
                            return new
                            {
                                type = info[1],
                                dccid = d.GetDccIDLimit(reader["DCC_ID"].ToString()),
                                url = strUrlInfo,
                                longitude = reader["LONGITUDE"].ToString(),
                                latitude = reader["LATITUDE"].ToString(),
                                voltage = getVoltageValue(reg, reader["VOLNAME"].ToString()),
                                data = new { id = reader["ID"].ToString(), name = reader["NAME"].ToString(), plantstationtype = reader["PLANTSTATIONTYPE"].ToString() }
                            };
                    }
                }
            }
        }
        return new { url = strUrlInfo };
    }

    public object GetCardInfo(string args, string id)
    {
        using (DBAdapte.DBAdapterManager m = YshGrid.CreateDBManager())
        {
            return GetCardInfo(m, args, id);
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    private void LocationStation(string strInfo, DBAdapte.DBAdapterManager m, GudAI.Ask ask, wt.DBQuestion q, string strPart, GudAI.QuestionResult rr)
    {
        GudAI.DBQuestionResult r = rr as GudAI.DBQuestionResult;
        if (r == null)
            return;
        //wt.DBQuestion q = lstQ[0];
        wt.DBTable tblStation = ask.DBSet.GetDatabase(q.DB).GetTableMatchName("SG_CON_COMMONSUBSTATION_B");
        if (tblStation == null)
            return;
        wt.DBTable tbl = q.GetQueryTable();
        List<wt.DBColumn> lstRef = new List<wt.DBColumn>();
        foreach (wt.DBColumn col in tbl.Columns)
        {
            if ((col.ForeignRef != null) && (col.ForeignRef.Table == tblStation))
            {
                lstRef.Add(col);
                break;//只搜一列
            }
        }
        if (lstRef.Count == 0)
            return;
        string strQSQL = string.IsNullOrEmpty(strPart) ? q.GetQuerySQL() : q.GetPartSQL(strPart);//把搜索结果改成搜索引用列
                                                                                                 //int idx = strQSQL.IndexOf(" FROM ");
                                                                                                 //string strSQL = "SELECT " + GudUsing.StringHelper.LinkArray(lstRef, ",", delegate (wt.DBColumn col) { return col.Table.Alias + "." + col.Name; })
                                                                                                 //+ strQSQL.Substring(idx);
        List<string> lstStationId = new List<string>();
        //用原来的sql语句搜索，保持排序不变
        using (System.Data.IDataReader reader = m.GetDBAdapter(q.DB).ExecuteReader(strQSQL))
        {
            List<int> lstRefIndex = new List<int>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                string strColName = reader.GetName(i).ToUpper();
                foreach (wt.DBColumn c in lstRef)
                {
                    if (c.Name.ToUpper() == strColName)
                    {
                        lstRefIndex.Add(i);
                        break;
                    }
                }
                /*
                if (lstRef.Any(c => c.Name.ToUpper() == strColName))
                    lstRefIndex.Add(i);
                */
            }
            while (reader.Read())
            {
                for (int i = 0; i < lstRefIndex.Count; i++)
                {
                    string id = reader[lstRefIndex[i]].ToString();
                    if (!lstStationId.Contains(id))
                        lstStationId.Add(id);
                }
            }
        }
        if (lstStationId.Count == 0)
            return;
        JavascriptFunc f = new JavascriptFunc();
        if (strInfo.IndexOf("投运") > -1)
        {
            f.Add("MapOpeInst.locate({ locateType: 4, locateItem: [ "
        + GudUsing.StringHelper.LinkArray(lstStationId, ",", delegate (string id)
        {
            return "{ staid: '" + id + "', data: { } }";
        }) + " ] });");
        }
        else
        {
            Dictionary<string, List<string>> dicStationLocation = new Dictionary<string, List<string>>();
            List<List<string>> lstStationLocation = new List<List<string>>();
            Linger.Common.XmlHelper xml = new Linger.Common.XmlHelper(wt.QueryHelper.GetSQLXml());
            string strSQL = xml.GetSqlString("GetStationLocation");
            DBAdapte.DBAdapter db = m.GetDBAdapter(q.DB);
            if (lstStationId.Count > 10)
            {
                //只定位前十个变电站
                lstStationId.RemoveRange(10, lstStationId.Count - 10);
            }
            strSQL = db.GetSQL(strSQL, string.Join(",", lstStationId));
            using (System.Data.IDataReader reader = db.ExecuteReader(strSQL))
            {
                while (reader.Read())
                {
                    string id = reader["ID"].ToString();
                    dicStationLocation.Add(id,
                    new List<string>() { id, reader["LONGITUDE"].ToString(),
                                            reader["LATITUDE"].ToString(),
                                            reader["VOLNAME"].ToString(),
                                            reader["NAME"].ToString(),
                                            reader["PLANTSTATIONTYPE"].ToString()
                            });
                }
            }
            for (int i = 0; i < lstStationId.Count; i++)
            {
                if (dicStationLocation.ContainsKey(lstStationId[i]))
                    lstStationLocation.Add(dicStationLocation[lstStationId[i]]);
                else
                    lstStationLocation.Add(new List<string>() { "", "", "", "", "", "" });
            }
            if (lstStationLocation.Count > 0)
            {
                Regex reg = new Regex(@"\d+\.?\d+");
                f.Add("MapOpeInst.locate({ locateType: 3, locateItem: [ "
            + GudUsing.StringHelper.LinkArray(lstStationLocation, ",", delegate (List<string> lst)
            {
                return "{ longitude: '" + lst[1] + "', latitude: '" + lst[2] + "', voltage:'"
                        + getVoltageValue(reg, lst[3]) + "', data: { id:'" + lst[0] + "',name:'" + lst[4] + "',plantstationtype:'" + lst[5] + "' } }";
            }) + " ] });");
                if (lstStationLocation.Count == 1)
                {
                    var lst = lstStationLocation[0];
                    f.Add("MapOpeInst.postMessage({ locateType: 10, locateItem: { stationid: '" + lst[0] + "', volvalue: '" + getVoltageValue(reg, lst[3])
                        + "', longitude: '" + lst[1] + "', latitude: '" + lst[0] + "', time: 5 } });");
                }
            }
        }
        r.ExecScript = f;
    }

    private wt.DBTable GetTableMatchName(wt.DBDatabase db, string strName)
    {
        strName = strName.ToLower().Trim();
        return db.Tables.Find(t => { var arr = t.Name.ToLower().Split('.', ':'); return arr[arr.Length - 1] == strName; });
    }

    private void LocationStationByData(string strInfo, DBAdapte.DBAdapterManager m, GudAI.Ask ask, wt.DBQuestion q, string strPart, GudAI.QuestionResult rr)
    {
        GudAI.DBQuestionResult r = rr as GudAI.DBQuestionResult;
        if (r == null)
            return;
        wt.DBTable tblStation = GetTableMatchName(ask.DBSet.GetDatabase(q.DB), "SG_CON_COMMONSUBSTATION_B");
        if (tblStation == null)
            return;
        wt.DBTable tbl = q.GetQueryTable();
        List<int> lstRef = new List<int>();
        for (int i = 0; i < r.Columns.Count; i++)
        {
            KeyValuePair<wt.DBColumn, wt.StatisticsEnum> kv = r.Columns[i];
            wt.DBColumn col = kv.Key;
            if (col.IsName && (r.IDColumn != null) && (col.Table == r.IDColumn.Table))
                col = r.IDColumn;
            if ((col.ForeignRef != null) && (col.ForeignRef.Table == tblStation))
            {
                lstRef.Add(i);
            }
        }
        if (lstRef.Count != 1)
            return;
        List<string> lstStationId = new List<string>();
        foreach (List<object> row in r.Data)
        {
            foreach (int i in lstRef)
            {
                object o = row[i];
                if (o is object[])
                    lstStationId.Add((o as object[])[0].ToString());
                else
                    lstStationId.Add(o.ToString());
            }
        }
        if (lstStationId.Count == 0)
            return;
        JavascriptFunc f = new JavascriptFunc();
        if (strInfo.IndexOf("投运") > -1)
        {
            f.Add("MapOpeInst.locate({ locateType: 4, locateItem: [ "
        + GudUsing.StringHelper.LinkArray(lstStationId, ",", delegate (string id)
        {
            return "{ staid: '" + id + "', data: { } }";
        }) + " ] });");
        }
        else
        {
            Dictionary<string, List<string>> dicStationLocation = new Dictionary<string, List<string>>();
            List<List<string>> lstStationLocation = new List<List<string>>();
            Linger.Common.XmlHelper xml = new Linger.Common.XmlHelper(wt.QueryHelper.GetSQLXml());
            string strSQL = xml.GetSqlString("GetStationLocation");
            DBAdapte.DBAdapter db = m.GetDBAdapter(q.DB);
            if (lstStationId.Count > 10)
            {
                //只定位前十个变电站
                lstStationId.RemoveRange(10, lstStationId.Count - 10);
            }
            strSQL = db.GetSQL(strSQL, string.Join(",", lstStationId));
            using (System.Data.IDataReader reader = db.ExecuteReader(strSQL))
            {
                while (reader.Read())
                {
                    string id = reader["ID"].ToString();
                    dicStationLocation.Add(id,
                    new List<string>() { id, reader["LONGITUDE"].ToString(),
                                            reader["LATITUDE"].ToString(),
                                            reader["VOLNAME"].ToString(),
                                            reader["NAME"].ToString(),
                                            reader["PLANTSTATIONTYPE"].ToString()
                            });
                }
            }
            for (int i = 0; i < lstStationId.Count; i++)
            {
                if (dicStationLocation.ContainsKey(lstStationId[i]))
                    lstStationLocation.Add(dicStationLocation[lstStationId[i]]);
                else
                    lstStationLocation.Add(new List<string>() { "", "", "", "", "", "" });
            }
            if (lstStationLocation.Count > 0)
            {
                Regex reg = new Regex(@"\d+\.?\d+");
                f.Add("MapOpeInst.locate({ locateType: 3, locateItem: [ "
            + GudUsing.StringHelper.LinkArray(lstStationLocation, ",", delegate (List<string> lst)
            {
                return "{ longitude: '" + lst[1] + "', latitude: '" + lst[2] + "', voltage:'"
                        + getVoltageValue(reg, lst[3]) + "', data: { id:'" + lst[0] + "',name:'" + lst[4] + "',plantstationtype:'" + lst[5] + "' } }";
            }) + " ] });");
                if (lstStationLocation.Count == 1)
                {
                    var lst = lstStationLocation[0];
                    f.Add("MapOpeInst.postMessage({ locateType: 10, locateItem: { stationid: '" + lst[0] + "', volvalue: '" + getVoltageValue(reg, lst[3])
                        + "', longitude: '" + lst[1] + "', latitude: '" + lst[2] + "', time: 5 } });");
                }
            }
        }
        r.ExecScript = f;
    }

    public object GetInfoByText(string flag, HttpSessionState Session, string strInfo, int nPage, int nRows)
    {
        if (string.IsNullOrEmpty(flag))
            flag = "ASK";
        CzpYuAn.QueryResult res = null;
        using (DBAdapte.DBAdapterManager m = YshGrid.CreateDBManager())
        {
            //GudAILib.Ask.DB = "ASK";
            res = GudAI.GudAIMain.GetInfoByText(new SearchSession(Session, flag), m, strInfo, nPage, nRows
                , delegate (GudAI.Ask ask, wt.DBQuestion q, string strPart, GudAI.QuestionResult r)
                {
                    LocationStationByData(strInfo, m, ask, q, strPart, r);
                });
        }
        return ReturnResult(flag, Session, res, nPage, nRows);
    }

    public object GetHistory(string flag, HttpSessionState Session)
    {
        if (string.IsNullOrEmpty(flag))
            flag = "ASK";
        using (DBAdapte.DBAdapterManager m = YshGrid.CreateDBManager())
        {
            return GudAILib.GudAIMain.GetAskHistory(new SearchSession(Session, flag), m);
        }
    }

    public object GetCountByText(string flag, HttpSessionState Session, string strInfo)
    {
        if (string.IsNullOrEmpty(flag))
            flag = "ASK";
        using (DBAdapte.DBAdapterManager m = YshGrid.CreateDBManager())
        {
            return GudAI.GudAIMain.GetCountByText(new SearchSession(Session, flag), m, strInfo);
        }
    }

    private static string getVoltageValue(Regex reg, string str)
    {
        Match m = reg.Match(str);
        if (m.Success)
            return m.Value;
        return "";
    }

    //private object ReturnResult(CzpYuAn.QueryResult res)
    //{
    //    MyAjaxObject o = new MyAjaxObject();
    //    o["type"] = (int)res.Type;
    //    o["data"] = res.Data;
    //    o["cmd"] = res.Command;
    //    return o;
    //}

    private object ReturnResult(string flag, HttpSessionState Session, CzpYuAn.QueryResult res, int nPage, int nRows)
    {
        MyAjaxObject o = new MyAjaxObject();
        o["type"] = (int)res.Type;
        switch (res.Type)
        {
            case CzpYuAn.ResultType.eOpenApp:
                var cmdInfo = res.Data as CzpYuAn.AppInfo;
                o["args"] = cmdInfo.Argument;
                break;
            case CzpYuAn.ResultType.eSendMsg:
                CzpYuAn.MsgInfo msg = res.Data as CzpYuAn.MsgInfo;
                if (msg != null)
                {
                    CzpYuAn.Socket skt = new CzpYuAn.Socket();
                    skt.IP = msg.IP;
                    skt.Port = msg.Port;
                    string ret = skt.Get(msg.Message);
                    o["cmd"] = res.Command;
                    o["success"] = (ret == "[[[cmdstart]]]1[[[cmdend]]]");
                    break;
                }
                break;
            case CzpYuAn.ResultType.eAskQuestion:
                return GetInfoByText(flag, Session, res.Data.ToString(), nPage, nRows);
            default:
                o["data"] = res.Data;
                o["cmd"] = res.Command;
                break;
        }
        return o;
    }
    public string UpdateAudio(HttpContext context, HttpSessionState Session, int nMaxRows)
    {
        if (context.Request.Files.Count == 0)
            return "{ \"state\":\"fail\" }";
        //return JsonConvert.SerializeObject(new { state = "fail" });
        using (YshGrid.CreateDBManager())
        {
            Stream s = context.Request.Files[0].InputStream;
            byte[] wav = new byte[1024 * 1024 * 10];
            int length = s.Read(wav, 0, wav.Length);
            CzpYuAn.QueryResult res = CzpYuAn.Utility.QueryByTalk(Common.GetConfig("TALKSERVER"), int.Parse(Common.GetConfig("TALKPORT")), wav, length);
            return (string.IsNullOrEmpty(res.Command) ? "" : res.Command) + res.Data;
        }
    }
    public string GetSyncDataList(HttpContext context, string name, string time)
    {
        try
        {
            Linger.Common.XmlHelper xml = new Linger.Common.XmlHelper("sync.xml");
            System.Xml.XmlNode nd = xml.GetXmlNode(name);
            if (nd == null)
                return string.Empty;
            string type = XmlUsing.XMLHelper.GetAttribute(nd, "type");
            switch (type)
            {
                case "dll":
                    switch (time)
                    {
                        case "all":
                            return Exec(context, XmlUsing.XMLHelper.GetAttribute(nd, "all"), string.Empty);
                        default:
                            return Exec(context, XmlUsing.XMLHelper.GetAttribute(nd, "time"), time);
                    }
                default:
                    string db = XmlUsing.XMLHelper.GetAttribute(nd, "db");
                    switch (time)
                    {
                        case "all":
                            return Read(db, XmlUsing.XMLHelper.GetAttribute(nd, "all"), null);
                        default:
                            return Read(db, XmlUsing.XMLHelper.GetAttribute(nd, "time"), time);
                    }
            }
        }
        catch (Exception err)
        {
            GudUsing.ExceptHelper.Log(err);
            return "";
        }
    }
    public void DownloadFile(HttpContext p)
    {
        var Request = p.Request;
        string strFilePath = WebUsing.RequestHelper.GetRequestString(Request, "path", "").Trim();
        string strPathLower = strFilePath.ToLower();
        if (strPathLower.EndsWith(".dll") || strPathLower.EndsWith(".cs") || strPathLower.EndsWith(".ashx") || strPathLower.EndsWith(".aspx"))
            return;
        string arg = WebUsing.RequestHelper.GetRequestString(Request, "arg", "").Trim(); // 下载参数//attachment,inline
        if (!string.IsNullOrEmpty(arg))
        {
            if (!arg.EndsWith(";"))
                arg += ";";
        }
        string filename = p.Server.UrlEncode(WebUsing.RequestHelper.GetRequestString(Request, "name", ""));
        string path = p.Server.MapPath(strFilePath);
        System.IO.FileInfo fi = new System.IO.FileInfo(path);
        //判断文件是否存在
        if (!fi.Exists)
            return;
        if (string.IsNullOrEmpty(filename))
            filename = fi.Name;
        //将文件保存到本机上
        p.Response.Clear();
        /*
        String fileName = URLEncoder.encode(atta.getFileName(), "UTF-8");
        if (fileName.length() > 150) {
            String guessCharset = xxxx /根据request的locale 得出可能的编码，中文操作系统通常是gb2312/
            fileName = new String(atta.getFileName().getBytes(guessCharset), "ISO8859-1");
        }
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        */
        p.Response.AddHeader("Content-Disposition", arg + "filename=" + filename);   // AddHeader：交一个HTTP标头添加到输出流
        p.Response.AddHeader("Content-Length", fi.Length.ToString());
        // ContentType：获取或设置HTTP标头的类型
        p.Response.ContentType = "application/octet-stream";
        //获取或设置包装筛选器对象，该对象用于在专输之前用于修改HTTP实体主体
        p.Response.Filter.Close();
        //  将文件的内容直接作为文件块直接写入HTTP响应的输出流
        p.Response.WriteFile(fi.FullName);
        p.Response.End();
    }
    public string GenerateGFile(HttpContext p)
    {
        string s = p.Request["s"];
        string l = p.Request["l"];
        string f = p.Request["f"];
        string b = p.Request["b"];
        GudUsing.Log.Add("生成G文件参数：");
        GudUsing.Log.Add(s);
        GudUsing.Log.Add(l);
        GudUsing.Log.Add(f);
        GudUsing.Log.Add(b);
        return SGCLib.GFile.gg(p.Request["w"], p.Request["h"], s, l, f, b);
    }
}