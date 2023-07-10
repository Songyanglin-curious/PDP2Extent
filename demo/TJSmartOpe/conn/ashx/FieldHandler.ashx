<%@ WebHandler Language="C#" Class="FieldHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Text;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Common;
using ReportEditer.Kernel.Models;
using ReportEditer.Kernel.Generate;

public class FieldHandler : ReportHandler {

    public override string DoOperation(HttpContext context)
    {
        ReportObject reportObject = ReportManage.Instance.Get(XmlFile);
        ActionOperation.Add("GetFields", delegate()
        {
            foreach (Field fd in reportObject.Fields.Values)
            {
                ListResult.Start();
                ListResult.Add("id", fd.Id);
                ListResult.Add("name", fd.Name);
                ListResult.Add("type", fd.Type);
                ListResult.Add("col", fd.Col);
                ListResult.Add("src", fd.Src);
                ListResult.Add("separator", fd.Separator);
                ListResult.Add("filter", fd.Filter);
                ListResult.Add("sheet", fd.Sheet);
                ListResult.Add("st", fd.St);               
                ListResult.Add("permission", fd.Permission);         
                ListResult.End();
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("SaveField", delegate()
        {
            Field field = new Field();
            field.Sheet = ReqFormValue("pSheet").Trim();
            field.Id = ReqFormValue("pId").Trim();
            field.Name = ReqFormValue("pName").Trim();
            field.Type = ReqFormValue("pType").Trim();
            field.Src = ReqFormValue("pSrc").Trim();
            field.Col = ReqFormValue("pField").Trim();
            field.Separator = ReqFormValue("pSeparator").Trim();
            field.Filter = ReqFormValue("pFilter").Trim();
            field.St = ReqFormValue("pSt").Trim();
            field.Dt = ReqFormValue("pDt").Trim();
            field.Def = ReqFormValue("pDef").Trim();
            field.Permission = ReqFormValue("pPermission").Trim();
            if (reportObject.Fields.ContainsKey(field.Id) && ReqFormValue("pOldId").Trim() != field.Id)
            {
                return JsonConvert.GetJson(false, "当前已经包含了此数据绑定字段,不能完成添加！");
            }
            if (!string.IsNullOrEmpty(field.St))
            {
                string strTableName = field.St;
                string strTableColumnName = "";
                string strTableColumnDataType = field.Dt;
                string strTableColumnDesc = field.Name;
                FieldDataSourceEnum eFieldSource = (FieldDataSourceEnum)Enum.Parse(typeof(FieldDataSourceEnum), field.Type);
                switch (eFieldSource)
                {
                    case FieldDataSourceEnum.Search:
                        strTableColumnName = field.Src;
                        break;
                    case FieldDataSourceEnum.DataBase:
                        strTableColumnName = field.Id;
                        if (string.IsNullOrEmpty(field.Col))
                        {
                            field.Col = field.Id;
                        }                        
                        break;
                    default:
                        break;
                }
                if (ReportConfig.EnableDB)
                {
                    if (!rptHelper.IsExistTableColumnName(strTableName, strTableColumnName))
                    {
                        if (!rptHelper.CreateTableColumn(strTableName, strTableColumnName, strTableColumnDataType, strTableColumnDesc))
                        {
                            return JsonConvert.GetJson(false, "创建数据列失败！");
                        }
                    }
                }
            }
            if (ReqFormValue("pOldId").Trim().Length == 0)
            {                
                reportObject.CreateField(field);                
                Log.Add("-99", "创建数据绑定", "ID:" + field.Id + "", LogType.Field, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
            else
            {
                reportObject.UpdateField(field, ReqFormValue("pOldId").Trim());
                Log.Add("-99", "修改数据绑定", "ID:" + field.Id + "", LogType.Field, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
        });
        ActionOperation.Add("RemoveField", delegate()
        {
            reportObject.RemoveField(ReqFormValue("pId").Trim());
            Log.Add("-99", "删除数据绑定", "ID:" + ReqFormValue("pId") + "", LogType.Field, UserName);
            return JsonConvert.GetJson(true, "删除成功！");
        });

        ActionOperation.Add("SaveInitSrc", delegate() {
            string strId = ReqFormValue("pId").Trim();
            string strISrc = ReqFormValue("pISrc").Trim();
            string strICol = ReqFormValue("pICol").Trim();
            reportObject.SaveInitSource(strId, strISrc, strICol);
            Log.Add("-99", "设置了数据召唤数据源", "ID:" + strId + " ISRC:" + strISrc + " ICOL:" + strICol + " ", LogType.Field, UserName);
            return JsonConvert.GetJson(true, "设置数据召唤数据源成功！");
        });
        
        ActionOperation.Add("GetField", delegate()
        {
            if (!reportObject.Fields.ContainsKey(ReqFormValue("pId").Trim()))
            {
                return JsonConvert.GetJson(false, "没有可获取的数据绑定数据！");
            }
            Field fd = reportObject.Fields[ReqFormValue("pId").Trim()];
            ListResult.Start();
            ListResult.Add("id", fd.Id);
            ListResult.Add("name", fd.Name);
            ListResult.Add("type", fd.Type);
            ListResult.Add("col", fd.Col);
            ListResult.Add("src", fd.Src);
            ListResult.Add("separator", fd.Separator);
            ListResult.Add("filter", fd.Filter);
            ListResult.Add("sheet", fd.Sheet);
            ListResult.Add("st", fd.St);
            ListResult.Add("dt", fd.Dt);
            ListResult.Add("def", fd.Def);
            ListResult.Add("isrc", fd.ISrc);
            ListResult.Add("icol",fd.ICol);  
            ListResult.Add("permission", fd.Permission);  
            ListResult.End();
            return JsonConvert.Parse(ListResult.Results[0]);
        });    
        
        return base.DoOperation(context);
    }
    
    
    
}