<%@ WebHandler Language="C#" Class="SettingHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Text;
using System.Data;
using System.Collections.Generic;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Models;
using ReportEditer.Kernel.Common;

public class SettingHandler : ReportHandler {

    public override string DoOperation(HttpContext context)
    {
        ReportObject reportObject = ReportManage.Instance.Get(XmlFile);
        ActionOperation.Add("GetConditions", delegate() {            
            foreach (Condition con in reportObject.Conditions.Values)
            {
                ListResult.Start();
                ListResult.Add("id", con.Id);
                ListResult.Add("name", con.Name);
                ListResult.Add("type", con.Type);
                ListResult.Add("out", con.Out);
                ListResult.Add("def", con.Def);
                ListResult.Add("src", con.DataSource.Src);
                ListResult.Add("text", con.DataSource.Text);
                ListResult.Add("val", con.DataSource.Val);
                ListResult.Add("format", con.Format);
                ListResult.Add("sel", con.Sel);
                ListResult.Add("all", con.DataSource.All);
                ListResult.Add("at", con.DataSource.At);
                ListResult.Add("av", con.DataSource.Av);              
                ListResult.End();                
            }
            var varResult = new { file = reportObject.CllFile, course = reportObject.IsNewCourse.ToString().ToLower(), condition = ListResult.Results };
            return JsonConvert.Parse(varResult);
        });        
        ActionOperation.Add("SaveCon", delegate() {
            Condition condition = new Condition();
            condition.Id = ReqFormValue("pId").Trim();
            condition.Name = ReqFormValue("pName").Trim();
            condition.Type = ReqFormValue("pType").Trim();
            condition.Out = ReqFormValue("pOut").Trim();
            condition.Def = ReqFormValue("pDef").Trim();
            condition.Format = ReqFormValue("pFormat").Trim();
            if (reportObject.Conditions.ContainsKey(condition.Id) && ReqFormValue("pOld").Trim() != condition.Id)
            {
                return JsonConvert.GetJson(false, "当前已经包含了此查询编号,不能继续添加！");
            }
            if (!CheckCreateColumn(reportObject, condition.Id, condition.Name))
            {
                return JsonConvert.GetJson(false, "创建数据列失败,不能继续添加！");
            }
            if (ReqFormValue("pOld").Trim().Length == 0)
            {
                reportObject.CreateCondition(condition);
                Log.Add("-99", "创建查询条件", "Id:" + condition.Id + "", LogType.Condition, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
            else
            {
                reportObject.UpdateCondition(condition, ReqFormValue("pOld").Trim());
                Log.Add("-99", "修改查询条件", "Id:" + condition.Id + "", LogType.Condition, UserName);
                return JsonConvert.GetJson(true, "保存成功！");
            }
        });
        
        ActionOperation.Add("RemoveCondition", delegate() {
            reportObject.RemoveCondition(ReqFormValue("pId").Trim());
            Log.Add("-99", "删除查询条件", "Id:" + ReqFormValue("pId") + "", LogType.Condition, UserName);
            return  JsonConvert.GetJson(true, "删除成功！"); 
        });
        ActionOperation.Add("SaveConditionSource", delegate() {
            Condition condition = new Condition();
            condition = reportObject.Conditions[ReqFormValue("pId")];
            condition.DataSource.Src = ReqFormValue("pSrc").Trim();
            condition.DataSource.Text = ReqFormValue("pText").Trim();
            condition.DataSource.Val = ReqFormValue("pVal").Trim();
            condition.DataSource.All = ReqFormValue("pAll").Trim();
            condition.DataSource.At = ReqFormValue("pAt").Trim();
            condition.DataSource.Av = ReqFormValue("pAv").Trim();
            reportObject.SaveConditionSource(condition);
            Log.Add("-99", "修改条件数据源", "Id:" + ReqFormValue("pId") + "", LogType.Condition, UserName);
            return JsonConvert.GetJson(true, "保存成功！");
        });
        ActionOperation.Add("GetCondition", delegate()
        {
            if (!reportObject.Conditions.ContainsKey(ReqFormValue("pId").Trim()))
            {
                return JsonConvert.GetJson(false, "没有可获取的查询条件数据！");
            }
            Condition con = reportObject.Conditions[ReqFormValue("pId").Trim()];           
            ListResult.Start();
            ListResult.Add("id", con.Id);
            ListResult.Add("name", con.Name);
            ListResult.Add("type", con.Type);
            ListResult.Add("out", con.Out);
            ListResult.Add("def", con.Def);
            ListResult.Add("src", con.DataSource.Src);
            ListResult.Add("text", con.DataSource.Text);
            ListResult.Add("val", con.DataSource.Val);
            ListResult.Add("format", con.Format);
            ListResult.Add("sel", con.Sel);
            ListResult.Add("all", con.DataSource.All);
            ListResult.Add("at", con.DataSource.At);
            ListResult.Add("av", con.DataSource.Av);            
            ListResult.End();
            var vResult = new { info = ListResult.Results[0], cus = con.CurrentListDefaultValue };
            return JsonConvert.Parse(vResult);
        });
        ActionOperation.Add("SetDataSource", delegate() //设置下拉列表框的数据来源类型
        {
            if (!reportObject.Conditions.ContainsKey(ReqFormValue("pId").Trim()))
            {
                return JsonConvert.GetJson(false, "没有可获取的查询条件数据！");
            }
            string strId = ReqFormValue("pId").Trim();
            string strVal = ReqFormValue("pVal").Trim();
            reportObject.SetConditionSourceData(strId, strVal);
            Log.Add("-99", "修改下拉列表数据来源", "Id:" + ReqFormValue("pId") + "", LogType.Condition, UserName);
            return JsonConvert.GetJson(true, "成功修改数据来源！");
        }); 
        ActionOperation.Add("RemoveConditionCusSource", delegate()
        {
            if (!reportObject.Conditions.ContainsKey(ReqFormValue("pId").Trim()))
            {
                return JsonConvert.GetJson(false, "没有可获取的查询条件数据！");
            }
            Condition con = reportObject.Conditions[ReqFormValue("pId").Trim()];
            for (int i = 0; i < con.CurrentListDefaultValue.Count; i++)
            {
                if (con.CurrentListDefaultValue[i].Key == ReqFormValue("pKey").Trim() && con.CurrentListDefaultValue[i].Value == ReqFormValue("pValue").Trim())
                {
                    reportObject.RemoveConditionCusData(ReqFormValue("pKey").Trim(), ReqFormValue("pValue").Trim(), ReqFormValue("pId").Trim());
                    Log.Add("-99", "删除下拉列表自定义数据", "Id:" + ReqFormValue("pId") + "", LogType.Condition, UserName);
                    return JsonConvert.GetJson(true, "删除成功！");
                }
            }
            return JsonConvert.GetJson(false, "没有获得指定的自定义数据");
        });
        ActionOperation.Add("SaveConditionCusData", delegate()
        {
            string strId = ReqFormValue("pId").Trim();
            string strKey = ReqFormValue("pKey").Trim();
            string strValue = ReqFormValue("pValue").Trim();
            string strOldKey = ReqFormValue("pOldKey").Trim();
            string strOldValue = ReqFormValue("pOldValue").Trim();
            string strSaveType = ReqFormValue("pSaveType").Trim();
            if (strSaveType == "0")
            {
                reportObject.CreateConditionCusData(strKey, strValue, strId);
                Log.Add("-99", "新建下拉列表自定义数据", "Id:" + ReqFormValue("pId") + "", LogType.Condition, UserName);
            }
            else
            {
                reportObject.UpdateConditionCusData(strKey, strValue, strOldKey, strOldValue, strId);
                Log.Add("-99", "修改下拉列表自定义数据", "Id:" + ReqFormValue("pId") + "", LogType.Condition, UserName);
            }
            return JsonConvert.GetJson(true, "保存成功！");
        });
        
        return base.DoOperation(context);
    }

    private bool CheckCreateColumn(ReportObject reportObject, string strId, string strDesc)
    {
        if (ReportConfig.EnableDB)
        {
            foreach (DBTable table in reportObject.DBTables.Values)
            {
                string strTableName = table.Name;
                string strTableColumnName = strId;
                string strTableColumnDataType = Enum.GetName(typeof(EnumDBColType), EnumDBColType.Varchar);
                string strTableColumnDesc = strDesc;
                if (!rptHelper.IsExistTableColumnName(strTableName, strTableColumnName))
                {
                    if (!rptHelper.CreateTableColumn(strTableName, strTableColumnName, strTableColumnDataType, strTableColumnDesc))
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }
        
}