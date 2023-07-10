<%@ WebHandler Language="C#" Class="CheckOnlyHandler" %>

using System;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.IO;

public class CheckOnlyHandler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.Clear();
        context.Response.ContentEncoding = Encoding.UTF8;
        context.Response.ContentType = "application/json";
        string strResult = "";
        try
        {
            if (context.Session["userid"] == null) { throw new Exception("您的用户已经过期,请重新登录！"); }
            string method = context.Request.Form["method"].Trim();//维护方法
            string prikey = context.Request.Form["prikey"].Trim();//维护对象
            string prival = context.Request.Form["privalue"].Trim();//维护实例
            string count = context.Request.Form["count"].Trim();//计数器
            string user = context.Session["userid"].ToString();
            switch (method)
            {
                case "check":
                    //检查是否已经被锁定
                    if (context.Application[prikey + "_" + prival] == null)//现在没人维护
                    {
                        context.Application.Lock();
                        context.Application[prikey + "_" + prival] = user;//我维护了
                        context.Application[prikey + "_" + prival + "_num"] = "1";//设置计数器
                        context.Application.UnLock();
                        strResult = "{user:'" + user + "',count:0}";
                    }
                    else
                    {
                        strResult = "{user:'" + context.Application[prikey + "_" + prival].ToString() + "',count:" + context.Application[prikey + "_" + prival + "_num"].ToString() + "}";
                    }
                    break;
                case "add":
                    context.Application.Lock();
                    context.Application[prikey + "_" + prival] = user;//我维护了
                    context.Application[prikey + "_" + prival + "_num"] = count;//设置计数器
                    context.Application.UnLock();
                    break;
                case "remove":
                    context.Application.Remove(prikey + "_" + prival);
                    context.Application.Remove(prikey + "_" + prival + "_num");
                    strResult = "{lock:false}";
                    break;
                default:
                    strResult = "{lock:false}";
                    break;
            }
        }
        catch (Exception /*ex*/)
        {
            strResult = "{lock:false}";
        }
        context.Response.Write(strResult);
        context.Response.Flush();
        context.Response.End();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}