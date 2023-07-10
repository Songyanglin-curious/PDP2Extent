<%@ WebHandler Language="C#" Class="SortableHandler" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using System.Web.SessionState;

public class SortableHandler : IHttpHandler, IRequiresSessionState {

    public void ProcessRequest(HttpContext context)
    {
        context.Response.Clear();
        context.Response.ContentEncoding = Encoding.UTF8;
        context.Response.ContentType = "application/json";
        try
        {
            context.Response.Write(GetAjaxResult(context));
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
 
    public bool IsReusable {
        get {
            return false;
        }
    }

    public string GetAjaxResult(HttpContext context)
    {
        string strResult = "";
        string strType = context.Request.Form["type"];
        if (context.Session["userid"] == null)
        {
            if (strType == "get")
                throw new Exception("您的用户已经过期,请重新登录！"); 
            else
                return strResult;
        }
        DBAdapte.DBAdapter dbHelper = YshGrid.GetDBAdapter("ConnMain");
        using (dbHelper.Open())
        {
            string strSql = "";
            string strUser = context.Session["userid"].ToString();
            switch (strType)
            {
                case "set":
                    string strData = context.Server.UrlDecode(context.Request.Form["content"]);
                    strSql = dbHelper.GetSQL("IF NOT EXISTS(SELECT 1 FROM tbSortable WHERE userid='{0}') "
                        + "INSERT INTO tbSortable (userid,content) VALUES('{0}','{1}') "
                        + "ELSE UPDATE tbSortable SET content='{1}' WHERE userid='{0}'", strUser, strData);
                    dbHelper.ExecuteCommand(strSql);
                    break;
                case "get":
                    strSql = dbHelper.GetSQL("SELECT content FROM tbSortable WHERE userid='{0}'", strUser);
                    using (IDataReader reader = dbHelper.ExecuteReader(strSql))
                    {
                        if (reader.Read())
                            strResult = reader[0].ToString();
                    }
                    break;
                default:
                    break;
            }
        }
        System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
        var vResult = new { text = strResult, flag = 1 };
        return js.Serialize(vResult);  
    }
}