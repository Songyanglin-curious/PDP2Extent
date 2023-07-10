<%@ WebHandler Language="C#" Class="UserCtrlHandler" %>

using System;
using System.Web;
using System.Data;
using System.Text;

public class UserCtrlHandler : IHttpHandler {
  
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string tag = context.Request.QueryString[0];
        string strResult = "";
        strResult = createNewCtrlXml(tag).ToString();
        context.Response.Write(strResult);
    }
    
    //创建xml
    public bool createNewCtrlXml(string nName)
    {
        bool iscreated = true;
        string strSPath = "/conn/complexxml/";
        string strOPath = "/conn/complexxml/";
        strSPath = System.Web.HttpContext.Current.Server.MapPath(strSPath);
        strOPath = System.Web.HttpContext.Current.Server.MapPath(strOPath);
        try
        {
            System.IO.File.Copy(strSPath + "empty.xml", strOPath + nName + ".xml");
        }
        catch { iscreated = false; }
        return iscreated;
    }

    //更新xml
    public string updateListXml(string tagname)
    {
        //string strPath = "/conn/complexxml/";
        //strPath = System.Web.HttpContext.Current.Server.MapPath(strPath);
        //System.IO.File.Copy(strPath + "empty" + strExt, strPath + nName + strExt);
        //return nName;

        return "";
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }


}