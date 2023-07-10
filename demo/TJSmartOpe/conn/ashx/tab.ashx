<%@ WebHandler Language="C#" Class="tab" %>

using System;
using System.Web;
using System.Data;
using System.Text;


public class tab : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string tag = context.Request.QueryString[0];
        string strResult = "";
        strResult = GetTabCount(tag).ToString();
        context.Response.Write(strResult);
    }
    
    //获取各属性条数
    public string GetTabCount(string tagname)
    {
        string count_list = "";
        DataTable dt = new DataTable();
        DBAdapte.DBAdapter db = YshGrid.GetDBAdapter(string.Empty);
        using (db.Open())
        {
            string strSql = db.GetSQL( "select cfgname,count(cfgname) as count from tbCtrlConfig where tagname={0} group by cfgname",tagname);
            using (IDataReader dr = db.ExecuteReader(strSql))
            {
                dt.Load(dr);
            }
        }
        count_list = DataTable2Json(dt);
        
        return count_list;
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }
    
    //转json
    public static string DataTable2Json(DataTable dt)
    {
        if (dt.Rows.Count == 0)
        {
            return "";
        }

        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.Append("{");

        for (int i = 0; i < dt.Rows.Count; i++)
        {
            jsonBuilder.Append("\"");
            jsonBuilder.Append(dt.Rows[i][0].ToString());
            jsonBuilder.Append("\":\"");
            jsonBuilder.Append(dt.Rows[i][1].ToString());
            jsonBuilder.Append("\",");
        }

        jsonBuilder.Remove(jsonBuilder.Length - 1, 1);
        jsonBuilder.Append("}");

        return jsonBuilder.ToString();
    }

}