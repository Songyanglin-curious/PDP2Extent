<%@ WebHandler Language="C#" Class="PDP2Handler" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Text.RegularExpressions;

public class PDP2Handler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        try
        {
            if (!string.IsNullOrEmpty(context.Request["log"]))
            {
                object oAppId = context.Application.Get("appid");
                string appid = (null == oAppId) ? "" : oAppId.ToString();
                object oRankId = context.Application.Get("rankid");
                string rankid = (null == oRankId) ? "" : oRankId.ToString();
                string userid = context.Request["u"];
                string employeeid = context.Request["e"];
                string ip = YshWebUI.GetClientIP(context.Request);
                //    GudUsing.Log.Add("recordaccesslog"+ "?appid=" + appid + "&rankid=" + rankid + "&userid=" + userid + "&employeeid=" + employeeid + "&ip=" + ip);
                if (!string.IsNullOrEmpty(userid))
                    SGCLib.Service.Get("recordaccesslog", "?appid=" + appid + "&rankid=" + rankid + "&userid=" + userid + "&employeeid=" + employeeid + "&ip=" + ip);
            }
        }
        catch
        {
        }
        try
        {
            AjaxPro.AjaxHandlerFactory fac = new AjaxPro.AjaxHandlerFactory();
            IHttpHandler handle = fac.GetHandler(context, context.Request.RequestType, "~/ajaxpro/PDP,PDP2.0.ashx", "~/ajaxpro/PDP,PDP2.0.ashx");
            if (handle == null) return;
            context.Handler = handle;
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");
            handle.ProcessRequest(context);
        }
        catch (Exception e)
        {
            GudUsing.ExceptHelper.Log(e);
            context.Response.Write("[false,0,\"" + e.Message + "\"]");
        }
        finally
        {
            context.Response.End();
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