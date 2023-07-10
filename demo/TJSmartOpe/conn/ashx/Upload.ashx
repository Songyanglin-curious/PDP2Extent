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
    private int SaveFile(HttpContext context, DBAdapte.DBAdapter db, HttpPostedFile f)
    {
        if (f.ContentLength <= 0) //没有上传内容
            return -1;
        //文件保存位置 UploadFiles\文件名
        string path = "~/UploadFiles/";
        string lastName = System.IO.Path.GetExtension(f.FileName).ToUpper();
        string oldName = System.IO.Path.GetFileName(f.FileName).ToString();
        string salt = YshUpdown.GetSalt();
        string fileName = path + DateTime.Now.ToString("yyyy-MM-dd hh:MM:ss").Replace("-", "").Replace(":", "").Replace(" ", "") + salt + ".up";
        try
        {
            f.SaveAs(context.Server.MapPath(fileName));
        }
        catch
        {
            return -1;
        }
        return YshUpdown.SaveFileInfo(db, oldName, fileName);
    }

    private string SaveDirFile(HttpContext context, string dir, HttpPostedFile f)
    {
        string lastName = System.IO.Path.GetExtension(f.FileName).ToUpper();
        string strExtend = "";
        int idx = lastName.LastIndexOf(".");
        if (idx >= 0)
            strExtend = lastName.Substring(idx);
        string oldName = System.IO.Path.GetFileName(f.FileName).ToString();
        string salt = YshUpdown.GetSalt().Replace("-", "");
        string fileName = dir + DateTime.Now.ToString("yyyy-MM-dd hh:MM:ss").Replace("-", "").Replace(":", "").Replace(" ", "") + salt + strExtend;
        try
        {
            f.SaveAs(context.Server.MapPath("~" + fileName));
            return fileName;
        }
        catch
        {
            return string.Empty;
        }
    }

    private string SaveFile(HttpContext context)
    {
        var Request = context.Request;
        string strRet = string.Empty;
        if (Request.Files.Count == 0)
            return strRet;
        HttpPostedFile upLoadFile = Request.Files.Get(0);
        if (upLoadFile.ContentLength <= 0)
            return strRet;
        string dir = Request["dir"];
        if (!string.IsNullOrEmpty(dir))
            return SaveDirFile(context, dir, upLoadFile);
        using (YshGrid.CreateDBManager())
        {
            string dll = Request["do"];
            if (!string.IsNullOrEmpty(dll))
            {
                GudUsing.YshDllUsing d = new GudUsing.YshDllUsing();
                d.Parse(dll);
                object o = d.Invoke(upLoadFile, upLoadFile.FileName);
                strRet = (o == null ? string.Empty : o.ToString());
            }
            else
            {
                //上传文件

                byte[] buffer = new byte[upLoadFile.InputStream.Length];

                upLoadFile.InputStream.Read(buffer, 0, buffer.Length);
                int n = YshUpdown.UploadBinary(YshGrid.GetCurrDBManager().GetDBAdapter(string.Empty), Request.Files[0].FileName, buffer);

                //int n = SaveFile(context, YshGrid.GetCurrDBManager().GetDBAdapter(string.Empty), upLoadFile);
                strRet = "/GetFile.aspx?id=" + n.ToString();
            }
        }
        return strRet;
    }

    public void ProcessRequest(HttpContext context)
    {
        var Response = context.Response;
        Response.Clear();
        Response.Write(SaveFile(context));
        Response.End();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}