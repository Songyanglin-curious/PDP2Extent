<%@ WebHandler Language="C#" Class="DataHandler" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Text.RegularExpressions;
using System.Net;
using System.IO;

public class DataHandler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.Clear();
        context.Response.ContentEncoding = Encoding.UTF8;
        context.Response.ContentType = "text/plain";
        string strResult = "";
        try
        {
            //if (context.Session["userid"] == null) { throw new Exception(Message.NoSession); }
            string m = context.Request["m"];
            switch (m)
            {
                case "Read":
                    {
                        string conn = context.Request["conn"] ?? "";
                        string xml = context.Request["xml"] ?? "";
                        string args = context.Request["args"] ?? "";
                        strResult = Read(conn, xml, args);
                    }
                    break;
                case "test":
                    {
                        string conn = context.Request["conn"] ?? "";
                        string xml = context.Request["xml"] ?? "";
                        int n = int.Parse(context.Request["count"] ?? "1");
                        for (int i = 0;i < n;i++)
                        {
                            System.Threading.Thread th = new System.Threading.Thread(delegate () {
                                Read(conn, xml, "");
                            });
                            th.Start();
                        }
                        strResult = "[true,[]]";
                    }
                    break;
                default:
                    {
                        string sql = context.Request["s"] ?? "";
                        if (string.IsNullOrEmpty(sql))
                            return;
                        string conn = context.Request["d"] ?? "";
                        if (sql.ToLower().EndsWith(".sql"))
                        {

                            string[] arrSQL = System.IO.File.ReadAllLines(sql.Trim());
                            List<string> lstSQL = new List<string>();
                            foreach (string s0 in arrSQL)
                            {
                                    string s1 = s0.Trim();
                                    if (!string.IsNullOrEmpty(s1))
                                        lstSQL.Add(s1);
                            }
                            DBAdapte.DBAdapter db = DBAdapte.DBAdapter.FromConnCfg(conn);
                            using (db.Open())
                            {
                                db.ExecuteHugeCommands(lstSQL, 200);
                            }
                            strResult = "[[\"执行成功\"],[[\"" + sql + "\"]]]";
                        }
                        else
                        {
                            strResult = Read(conn, sql);
                        }
                    }
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

    private static object DoRead(System.Data.IDataReader reader)
    {
        int nFieldCount = reader.FieldCount;
        List<string> fields = new List<string>();
        for (int i = 0; i < nFieldCount; i++)
        {
            string name = reader.GetName(i);
            fields.Add(name);
        }
        var o = GudUsing.ReaderHelper.ReadList<AjaxPro.JavaScriptArray>(reader, delegate ()
        {
            AjaxPro.JavaScriptArray arrRet = new AjaxPro.JavaScriptArray();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.IsDBNull(i))
                {
                    arrRet.Add(string.Empty);
                    continue;
                }
                object v = reader[i];
                if (v.GetType() == typeof(decimal))
                    arrRet.Add(v.ToString());
                else if (v.GetType() == typeof(DateTime))
                    arrRet.Add(((DateTime)v).ToString("yyyy-MM-dd HH:mm:ss"));
                else if (v.GetType() == typeof(Int64))
                    arrRet.Add(v.ToString());
                else
                    arrRet.Add(v);
            }
            return arrRet;
        });
        return new object[] { fields, o };
    }

    private static string Read(string d, string s)
    {
        using (DBAdapte.DBAdapterManager m = YshGrid.CreateDBManager())
        {
            DBAdapte.DBAdapter db = m.GetDBAdapter(d);
            using (System.Data.IDataReader reader = db.ExecuteReader(s))
            {
                return AjaxPro.JavaScriptSerializer.Serialize(DoRead(reader));
            }
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}