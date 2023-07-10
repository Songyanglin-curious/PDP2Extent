<%@ WebHandler Language="C#" Class="UploadFileHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.IO;

public class UploadFileHandler : IHttpHandler, IRequiresSessionState
{
    public static int UploadDiskFile(HttpContext context, DBAdapte.DBAdapter db, HttpPostedFile f)
    {
        if (f.ContentLength <= 0) //没有上传内容
            return -1;
        //文件保存位置 UploadFiles\文件名
        string path = "~/UploadFiles/";
        string lastName = System.IO.Path.GetExtension(f.FileName).ToUpper();
        string oldName = System.IO.Path.GetFileName(f.FileName).ToString();
        string salt = YshUpdown.GetSalt();
        string fileName = path + DateTime.Now.ToString("yyyy-MM-dd hh:MM:ss").Replace("-", "").Replace(":", "").Replace(" ", "") + salt + oldName + ".up";
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

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            context.Response.ContentType = "text/plain";
            HttpPostedFile file = context.Request.Files["comUpload"];
            if (file != null)
            {
                DBAdapte.DBAdapter db = YshGrid.GetDBAdapter(string.Empty);
                using (db.Open())
                {
                    int nId = UploadDiskFile(context, db, file);
                    //返回保存的文件,这里修改成返回保存的ID即可
                    context.Response.Write(nId);
                    context.Response.End();
                }
            }
            else
            {
                //上传失败
                context.Response.Write("上传失败!文件不存在");
                context.Response.End();
            }
        }
        catch(Exception ex)
        {
            //上传失败
            context.Response.Write("上传失败!" + ex.Message);
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