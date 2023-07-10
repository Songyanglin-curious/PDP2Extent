<%@ WebHandler Language="C#" Class="BackUpCllHandler" %>

using System;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.IO;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Common;

public class BackUpCllHandler : IHttpHandler,IRequiresSessionState {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.Clear();
        context.Response.ContentEncoding = Encoding.UTF8;
        context.Response.ContentType = "application/json";
        string strResult = "";
        try
        {
            if (context.Session["userid"] == null) { throw new Exception("您的用户已经过期,请重新登录！"); }
            string strPostType = context.Request.QueryString["postType"].Trim();
            string strFilename = context.Request.QueryString["filename"].Trim();
            switch (strPostType)
            {
                case "Process":
                    if (Path.GetExtension(strFilename).Trim().ToLower() != ".cll")
                    {
                        strFilename = Path.GetFileNameWithoutExtension(strFilename) + ".cll";
                    }
                    string strPath = ReportConfig.GetReportSearchedPath();
                    strFilename = Path.GetFileNameWithoutExtension(strFilename) + DateTime.Now.ToString("yyyyMMddHHmmss") + ".cll";
                    strResult = JsonConvert.Parse(new { flag = 1, path = strPath, file = strFilename });
                    break;
                case "UpLoad":
                    byte[] UpFile = context.Request.BinaryRead(context.Request.TotalBytes);
                    FileStream fs = new FileStream(Path.Combine(ReportConfig.GetReportSearchedPath(), strFilename), FileMode.Append);
                    fs.Write(UpFile, 0, UpFile.Length);
                    fs.Close();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {
            strResult = JsonConvert.GetJson(false, ex.Message);
        }

        context.Response.Write(strResult);
        context.Response.Flush();
        context.Response.End();
    }
 
    public bool IsReusable {
        get {
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