<%@ WebHandler Language="C#" Class="RecorderHandler" %>

using System;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.IO;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Common;

public class RecorderHandler : IHttpHandler,IRequiresSessionState {

    public void ProcessRequest(HttpContext context)
    {
        if (context.Request.Files.Count == 0)
            return;
        using (YshGrid.CreateDBManager())
        {
            //context.Request.Files[0].SaveAs("d:\\1.wav");
            Stream s = context.Request.Files[0].InputStream;
            byte[] wav = new byte[1024 * 1024 * 10];
            int length = s.Read(wav, 0, wav.Length);
            CzpYuAn.QueryResult res = CzpYuAn.Utility.QueryByTalk("192.168.5.178", 4010, wav, length);
            switch (res.Type)
            {
                case CzpYuAn.ResultType.eError:
                    GudUsing.Log.Add(res.Data.ToString());
                    break;
                case CzpYuAn.ResultType.eShowResult:
                    System.Collections.Generic.List<CzpYuAn.ShowInfo> lst = res.Data as System.Collections.Generic.List<CzpYuAn.ShowInfo>;
                    if (null != lst)
                    {
                        CzpYuAn.ShowInfo si = lst[0];
                        switch (si.Type)
                        {
                            case CzpYuAn.ShowType.eHtml:
                                GudUsing.Log.Add(si.Data.ToString());
                                break;
                            case CzpYuAn.ShowType.eTable:
                                CzpYuAn.TableInfo ti = si.Data as CzpYuAn.TableInfo;
                                break;
                        }
                    }
                    break;
            }
        }
    }

    private void CopyTo<T>(T[] src, T[] dest, int nOffset, int nLength)
    {
        for (int i = 0; i < nLength; i++)
        {
            dest[nOffset + i] = src[i];
        }
    }

    public bool IsReusable
    {
        get {
            return false;
        }
    }
}