<%@ WebHandler Language="C#" Class="ViewHandler" %>

using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Web;
using System.Web.SessionState;
using System.IO;
using System.Xml;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Models;
using ReportEditer.Kernel.Common;

public class ViewHandler : ReportHandler
{

    public override string DoOperation(HttpContext context)
    {
        ReportObject reportObject = ReportManage.Instance.Get(XmlFile);
        ActionOperation.Add("ViewList", delegate()
        {
            foreach (ViewEntity view in reportObject.Views.Values)
            {
                if (ReqFormValue("pId").Trim().Length == 0 || ReqFormValue("pId").Trim() == view.DB.Trim())
                {
                    ListResult.Start();
                    ListResult.Add("id", view.Id);
                    ListResult.Add("name", view.Name);
                    ListResult.Add("db", view.DB);
                    ListResult.Add("data", view.CData);
                    ListResult.End();
                }                
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("GetView", delegate()
        {
            if (!reportObject.Views.ContainsKey(ReqFormValue("pId").Trim()))
            {
                return JsonConvert.GetJson(false, "没有可获取的视图数据！");
            }
            ViewEntity view = reportObject.Views[ReqFormValue("pId").Trim()];
            var vResult = new { id = view.Id, name = view.Name, db = view.DB, data = view.CData };
            return JsonConvert.Parse(vResult);
        });
        ActionOperation.Add("SaveView", delegate()
        {
            ViewEntity view = new ViewEntity();
            view.Id = ReqFormValue("pId").Trim();
            view.Name = ReqFormValue("pName").Trim();
            view.DB = ReqFormValue("pDb").Trim();
            view.CData = ReqFormValue("pData").Trim();
            if (reportObject.Views.ContainsKey(view.Id) && ReqFormValue("pOldId").Trim() != view.Id)
            {
                return JsonConvert.GetJson(false, "当前已经包含了此视图关键字,不能继续添加！");
            }
            if (ReqFormValue("pOldId").Trim().Length == 0)
            {
                reportObject.CreateView(view);
                Log.Add("-99", "创建查询条件", "Id:" + view.Id + "", LogType.View, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
            else
            {
                reportObject.UpdateView(view, ReqFormValue("pOldId").Trim());
                Log.Add("-99", "修改查询条件", "Id:" + view.Id + "", LogType.View, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
        });
        ActionOperation.Add("RemoveView", delegate()
        {
            reportObject.RemoveView(ReqFormValue("pId").Trim());
            Log.Add("-99", "删除查询条件", "Id:" + ReqFormValue("pId") + "", LogType.View, UserName);
            return JsonConvert.GetJson(true, "删除成功！");
        });
        return base.DoOperation(context);
    }

}