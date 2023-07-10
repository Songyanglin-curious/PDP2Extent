<%@ WebHandler Language="C#" Class="GetDataHandler" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Text.RegularExpressions;
using System.Net;
using System.IO;

public class GetDataHandler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
            string url = context.Request["url"] ?? "";
            string conn = context.Request["conn"] ?? "";
            string xml = context.Request["xml"] ?? "";
            string args = context.Request["args"] ?? "";
                string address = url + "?conn=" + conn + "&xml=" + xml + "&args=" + args;
        try
        {
            string strResult = HttpClientDoGet(address);
            context.Response.Clear();

            context.Response.ContentEncoding = Encoding.UTF8;
            context.Response.ContentType = "text/plain";
            context.Response.Write(strResult);
            context.Response.End();
        }
        catch (Exception e)
        {
                GudUsing.Log.Add(address);
            GudUsing.ExceptHelper.Log(e);
            context.Response.Write("");
        }
        finally
        {
            context.Response.End();
        }
    }

    private static string HttpClientDoGet(string address)
    {
        GudUsing.LogEx.Add("card", address);
        Encoding myEncoding = Encoding.UTF8;
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

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}