<%@ WebHandler Language="C#" Class="SourceHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Text;
using System.Collections.Generic;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Models;
using ReportEditer.Kernel.Common;
using ReportEditer.Kernel.Generate;

public class SourceHandler : ReportHandler
{
    public override string DoOperation(HttpContext context)
    {
        ReportObject reportObject = ReportManage.Instance.Get(XmlFile);
        Property property = new Property();
        Source source = new Source();
        ActionOperation.Add("GetPropertys", delegate()
        {
            foreach (Property pro in reportObject.Propertys.Values)
            {
                ListResult.Start();
                ListResult.Add("id", pro.Id);
                ListResult.Add("name", pro.Name);
                ListResult.Add("out", pro.Out);
                ListResult.End();
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("GetSources", delegate()
        {
            foreach (Source con in reportObject.Sources.Values)
            {
                ListResult.Start();
                ListResult.Add("id", con.Id);
                ListResult.Add("name", con.Name);
                ListResult.Add("type", con.Type);
                ListResult.Add("sql", con.Sql);
                ListResult.Add("src", con.Src);
                ListResult.Add("field", con.Field);
                ListResult.Add("where", con.Where);
                ListResult.Add("order", con.OrderBy);
                ListResult.Add("lsrc", con.LSrc);
                ListResult.Add("rsrc", con.RSrc);
                ListResult.Add("join", con.Join);
                ListResult.Add("on", con.On);
                ListResult.Add("fill", con.Fill);
                ListResult.Add("ref", con.Ref);
                ListResult.Add("seq", con.Seq);
                ListResult.Add("trans", con.Trans);
                ListResult.Add("temp", con.Temp);
                ListResult.Add("tf", con.Tf);
                ListResult.Add("db", con.DB);
                ListResult.Add("memorysource", con.MemorySource);
                ListResult.Add("modulefun", con.ModuleFun);
                ListResult.Add("moduletable", con.ModuleTable);
                ListResult.End();
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("Positions", delegate()
        {
            foreach (Source con in reportObject.Sources.Values)
            {
                ListResult.Start();
                ListResult.Add("id", con.Id);
                ListResult.Add("name", con.Name);
                ListResult.Add("type", con.Type);
                ListResult.Add("sql", con.Sql);
                ListResult.Add("src", con.Src);
                ListResult.Add("field", con.Field);
                ListResult.Add("where", con.Where);
                ListResult.Add("order", con.OrderBy);
                ListResult.Add("lsrc", con.LSrc);
                ListResult.Add("rsrc", con.RSrc);
                ListResult.Add("join", con.Join);
                ListResult.Add("on", con.On);
                ListResult.Add("fill", con.Fill);
                ListResult.Add("ref", con.Ref);
                ListResult.Add("seq", con.Seq);
                ListResult.Add("trans", con.Trans);
                ListResult.Add("temp", con.Temp);
                ListResult.Add("tf", con.Tf);
                ListResult.Add("db", con.DB);
                ListResult.Add("memorysource", con.MemorySource);
                ListResult.Add("modulefun", con.ModuleFun);
                ListResult.Add("moduletable", con.ModuleTable);
                ListResult.End();
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("GetSource", delegate()
        {
            if (!reportObject.Sources.ContainsKey(ReqFormValue("pId").Trim()))
            {
                return JsonConvert.GetJson(false, "没有可获取的数据源数据！");
            }
            Source con = reportObject.Sources[ReqFormValue("pId").Trim()];
            ListResult.Start();
            ListResult.Add("id", con.Id);
            ListResult.Add("name", con.Name);
            ListResult.Add("type", con.Type);
            ListResult.Add("sql", con.Sql);
            ListResult.Add("src", con.Src);
            ListResult.Add("field", con.Field);
            ListResult.Add("where", con.Where);
            ListResult.Add("order", con.OrderBy);
            ListResult.Add("lsrc", con.LSrc);
            ListResult.Add("rsrc", con.RSrc);
            ListResult.Add("join", con.Join);
            ListResult.Add("on", con.On);
            ListResult.Add("fill", con.Fill);
            ListResult.Add("ref", con.Ref);
            ListResult.Add("seq", con.Seq);
            ListResult.Add("trans", con.Trans);
            ListResult.Add("temp", con.Temp);
            ListResult.Add("tf", con.Tf);
            ListResult.Add("db", con.DB);
            ListResult.Add("memorysource", con.MemorySource);
            ListResult.Add("modulefun", con.ModuleFun);
            ListResult.Add("moduletable", con.ModuleTable);
            ListResult.End();
            return JsonConvert.Parse(ListResult.Results[0]);
        });
        ActionOperation.Add("GetFills", delegate()
        {
            foreach (SupplyEmpty supply in reportObject.Fills.Values)
            {
                ListResult.Start();
                ListResult.Add("id", supply.Id);
                ListResult.Add("name", supply.Name);
                ListResult.Add("type", supply.Type);
                ListResult.Add("offset", supply.Offset);
                ListResult.Add("start", supply.Start);
                ListResult.Add("max", supply.Max);
                ListResult.Add("out", supply.Out);
                ListResult.Add("cus", supply.CusData);               
                ListResult.End();
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("GetFill", delegate()
        {
            if (!reportObject.Fills.ContainsKey(ReqFormValue("pId").Trim()))
            {
                return JsonConvert.GetJson(false, "没有可获取的查询条件数据！");
            }
            SupplyEmpty supply = reportObject.Fills[ReqFormValue("pId").Trim()];            
            ListResult.Start();
            ListResult.Add("id", supply.Id);
            ListResult.Add("name", supply.Name);
            ListResult.Add("type", supply.Type);
            ListResult.Add("offset", supply.Offset);
            ListResult.Add("start", supply.Start);
            ListResult.Add("max", supply.Max);
            ListResult.Add("out", supply.Out);
            ListResult.Add("cus", supply.CusData);               
            ListResult.End();            
            return JsonConvert.Parse(ListResult.Results[0]);
        });
        ActionOperation.Add("SaveSource", delegate()
        {
            source.Id = ReqFormValue("pId").Trim();
            source.Name = ReqFormValue("pName").Trim();
            source.Type = ReqFormValue("pType").Trim();
            source.Sql = ReqFormValue("pSql").Trim();
            source.Src = ReqFormValue("pTable").Trim();
            source.Field = ReqFormValue("pField").Trim();
            source.Where = ReqFormValue("pWhere").Trim();
            source.OrderBy = ReqFormValue("pOrder").Trim();
            source.LSrc = ReqFormValue("pLSrc").Trim();
            source.RSrc = ReqFormValue("pRSrc").Trim();
            source.Join = ReqFormValue("pJoin").Trim();
            source.On = ReqFormValue("pOn").Trim();
            source.Seq = ReqFormValue("pSeq").Trim();
            source.Trans = ReqFormValue("pTrans").Trim();
            source.DB = ReqFormValue("pDb").Trim();
            source.MemorySource = ReqFormValue("pMemorySource").Trim();
            source.ModuleFun = ReqFormValue("pModuleFun").Trim();
            source.ModuleTable = ReqFormValue("pModuleTable").Trim();
            if (reportObject.Sources.ContainsKey(source.Id) && ReqFormValue("pOldId").Trim() != source.Id)
            {
                return JsonConvert.GetJson(false, "当前已经包含了此数据源关键字,不能继续添加！");
            }
            if (ReqFormValue("pOldId").Trim().Length == 0)
            {
                reportObject.CreateSource(source);
                Log.Add("-99", "创建数据源", "ID:" + source.Id + "", LogType.Source, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
            else
            {
                reportObject.UpdateSource(source, ReqFormValue("pOldId").Trim());
                Log.Add("-99", "修改数据源", "ID:" + source.Id + "", LogType.Source, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
        });
        ActionOperation.Add("RemoveSource", delegate()
        {
            reportObject.RemoveSource(ReqFormValue("pId").Trim());
            Log.Add("-99", "删除数据源", "ID:" + ReqFormValue("pId").Trim() + "", LogType.Source, UserName);
            return JsonConvert.GetJson(true, "删除成功！");
        });
        ActionOperation.Add("SaveFill", delegate()
        {
            SupplyEmpty supplyEmpty = new SupplyEmpty();
            supplyEmpty.Id = ReqFormValue("pFillId").Trim();
            supplyEmpty.Name = ReqFormValue("pFillName").Trim();
            supplyEmpty.Type = ReqFormValue("pType").Trim();
            supplyEmpty.Offset = ReqFormValue("pOffset").Trim();
            supplyEmpty.Out = ReqFormValue("pOut").Trim();
            supplyEmpty.CusData = ReqFormValue("pCusData").Trim();
            supplyEmpty.Start = ReqFormValue("pStart").Trim();
            supplyEmpty.Max = ReqFormValue("pMax").Trim();
            if (reportObject.Fills.ContainsKey(supplyEmpty.Id) && ReqFormValue("pOldId").Trim() != supplyEmpty.Id)
            {
                return JsonConvert.GetJson(false, "当前已经包含了此填充关键字,不能继续添加！");
            }            
            if (ReqFormValue("pOldId").Trim().Length == 0)
            {
                reportObject.CreateFill(supplyEmpty);
                Log.Add("-99", "创建填充数据集", "ID:" + supplyEmpty.Id + "", LogType.Fill, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
            else
            {
                reportObject.UpdateFill(supplyEmpty, ReqFormValue("pOldId").Trim());
                Log.Add("-99", "修改填充数据集", "ID:" + supplyEmpty.Id + "", LogType.Fill, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
        });
        ActionOperation.Add("RemoveFill", delegate()
        {
            reportObject.RemoveFill(ReqFormValue("pId").Trim());
            Log.Add("-99", "删除填充数据集", "ID:" + ReqFormValue("pId").Trim() + "", LogType.Fill, UserName);
            return JsonConvert.GetJson(true, "删除成功！");
        });
        ActionOperation.Add("SetFillSource", delegate()
        {
            reportObject.SaveFillSource(ReqFormValue("pId").Trim(), ReqFormValue("pFillId").Trim(), ReqFormValue("pField").Trim());
            Log.Add("-99", "设置数据源填充数据集", "ID:" + context.Request.Form["pId"].Trim() + "", LogType.Source, UserName);
            return JsonConvert.GetJson(true, "设置成功！");
        });
        ActionOperation.Add("SaveTempSetting", delegate()
        {
            reportObject.SaveSourceTemp(ReqFormValue("pId").Trim(), ReqFormValue("pTemp").Trim(), ReqFormValue("pTf").Trim());
            Log.Add("-99", "设置数据源模板", "ID:" + context.Request.Form["pId"].Trim() + "", LogType.Source, UserName);
            return JsonConvert.GetJson(true, "设置成功！");
        });
        ActionOperation.Add("GetSourceColumns", delegate()
        {            
            foreach (string strColumnName in GenerateUtil.GetSourceColumns(ReqFormValue("pSourceName").Trim(), reportObject))
            {
                ListResult.Start();
                ListResult.Add("name", strColumnName);
                ListResult.End();
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        return base.DoOperation(context);
    }
        
}