<%@ WebHandler Language="C#" Class="UploadReportHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.IO;
using ReportEditer.Kernel.Common;

public class UploadReportHandler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {

        context.Response.Buffer = true;
        string filename = context.Request.QueryString["filename"].Trim();
        string filepath = context.Request.QueryString["path"].Trim();
        //创建备份目录
        string strPath = Path.Combine(ApplicationPhysicalPath, filepath);
        string strFileName = Path.Combine(strPath, filename);

        byte[] UpFile = context.Request.BinaryRead(context.Request.TotalBytes);      
        FileStream fs = new FileStream(strFileName, FileMode.Append);
        fs.Write(UpFile, 0, UpFile.Length);
        fs.Close();

        Log.Add("-9", "报表上传", "报表上传", LogType.UpLoadReport, context.Session["userid"] == null ? "过期用户" : context.Session["userid"].ToString());
        
        context.Response.Clear();
       
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    /// <summary>
    /// 获取应用程序物理路径
    /// </summary>
    public static string ApplicationPhysicalPath
    {
        get { return HttpContext.Current.Request.PhysicalApplicationPath; }
    }

}