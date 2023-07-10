<%@ WebHandler Language="C#" Class="ProcessFileHandler" %>

using System;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.IO;
using ReportEditer.Kernel.Common;
using System.Xml;

public class ProcessFileHandler : IHttpHandler,IRequiresSessionState
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
            string filename = context.Request.Form["filename"].Trim();
            string filepath = context.Request.Form["path"].Trim();
            //创建备份目录
            string strPath = Path.Combine(ApplicationPhysicalPath, filepath);
            string strFileName = Path.Combine(strPath, filename);

            string strBackUpPath = Path.Combine(strPath, "backup");
            string strBackUpFileName = Path.GetFileNameWithoutExtension(filename) + DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(filename);
            if (!Directory.Exists(strBackUpPath))
            {
                Directory.CreateDirectory(strBackUpPath);
            }
            //备份当前的文件
            if (File.Exists(strFileName))
            {
                File.Copy(strFileName, Path.Combine(strBackUpPath, strBackUpFileName));
            }
            FileInfo fidelete = new FileInfo(strFileName);
            if (fidelete.Exists)
            {
                fidelete.Delete();
                //保存模板HTML add by wangbinbin 20140211
                string strXmlPath = fidelete.FullName.Replace("\\cllfile\\", "\\xmlfile\\").Replace("/cllfile/", "/xmlfile/").Replace(".cll", ".xml");
                if (File.Exists(strXmlPath))
                {
                    string strHTML = context.Server.UrlDecode(context.Request.Form["html"]);
                    SaveTemplateHTML(strHTML, strXmlPath);
                }
                strResult = JsonConvert.GetJson(true, "处理成功！");
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


    /// <summary>
    /// 保存模板HTML
    /// </summary>
    public static void SaveTemplateHTML(string strHTML,string strPath)
    {
        if (string.IsNullOrEmpty(strHTML))
            return;
        XmlDocument xmlDoc = new XmlDocument();
        xmlDoc.Load(strPath);
        XmlElement eTrs = xmlDoc.CreateElement("trHTMLs");
            XmlElement eTr = xmlDoc.CreateElement("trHTML");
        XmlCDataSection cData = xmlDoc.CreateCDataSection(strHTML);
            eTr.AppendChild(cData);
            eTrs.AppendChild(eTr);
        XmlNode nReport = xmlDoc.SelectSingleNode("report");
        if (nReport!=null)
        {
            XmlNode nTr=nReport.SelectSingleNode("trHTMLs");
            if (nTr != null)
                nReport.RemoveChild(nTr);
            nReport.AppendChild(eTrs);
        }
        xmlDoc.Save(strPath);
    }
}