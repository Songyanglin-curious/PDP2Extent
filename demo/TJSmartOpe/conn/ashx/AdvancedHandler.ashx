<%@ WebHandler Language="C#" Class="AdvancedHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Text;
using System.Data;
using System.Collections.Generic;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Models;
using ReportEditer.Kernel.Common;

public class AdvancedHandler : ReportHandler
{
    public override string DoOperation(HttpContext context)
    {
        ReportAdvancedObject rptObject = ReportAdvancedManage.Instance.Get(XmlFile);
        IList<ReportAdvancedObject.AttributeStruct> listAttr;
        string strNode = "";
        string strId = "";
        string strName = "";
        ActionOperation.Add("InitAdvanced", delegate()
        {
            var varResult = new
            {
                conditions = GetResultByDicValue(rptObject.ReportNodes[ReportAdvancedObject.CONST_OLD_SETTING_CONDITIONS_LABEL], ReportAdvancedObject.CONST_OLD_SETTING_CONDITIONS_LABEL),
                sources = GetResultByDicValue(rptObject.ReportNodes[ReportAdvancedObject.CONST_OLD_SETTING_SOURCES_LABEL], ReportAdvancedObject.CONST_OLD_SETTING_SOURCES_LABEL),
                fields = GetResultByDicValue(rptObject.ReportNodes[ReportAdvancedObject.CONST_OLD_SETTING_FIELDS_LABEL], ReportAdvancedObject.CONST_OLD_SETTING_FIELDS_LABEL)
            };
            return JsonConvert.Parse(varResult);
        });
        ActionOperation.Add("SaveNode", delegate()
        {            
            strNode = ReqFormValue("node").Trim();
            strId = ReqFormValue("oid").Trim();
            listAttr = rptObject.GetAttributeList(strId, strNode);
            if (listAttr == null)
            {
                return JsonConvert.GetJson(false, "Can not find" + strId + ":" + strNode + "Node,Save failed!");
            }
            else
            {
                if (listAttr.Count > 0)
                {
                    SetAttribute(context, listAttr);
                    rptObject.SaveNode(listAttr, strId, strNode, listAttr[0].NodeName);
                    Log.Add("-99", "Update Node", "Node:" + strNode + " ID:" + strId + "", LogType.Advance, UserName);
                }
                return JsonConvert.GetJson(true, "Save sucess!");
            }
        });
        ActionOperation.Add("AddAttr", delegate()
        {
            strNode = ReqFormValue("node").Trim();
            strId = ReqFormValue("id").Trim();
            strName = ReqFormValue("name").Trim();
            string strValue = ReqFormValue("value").Trim();
            string strType = ReqFormValue("type").Trim();
            listAttr = rptObject.GetAttributeList(strId, strNode);
            if (listAttr == null)
            {
                return JsonConvert.GetJson(false, "Can not find" + strId + ":" + strNode + "Node,Save failed!");
            }
            else
            {
                if (listAttr.Count > 0)
                {
                    rptObject.CreateAttribute(strName, strValue, strType, strId, strNode, listAttr[0].NodeName);
                    Log.Add("-99", "Add attibute", "Name:" + strName + " ID:" + strId + "", LogType.Advance, UserName);
                }
                return JsonConvert.GetJson(true, "Save sucess!");
            }                   
        });
        ActionOperation.Add("DelAttr", delegate()
        {
            strNode = ReqFormValue("node").Trim();
            strId = ReqFormValue("id").Trim();
            strName = ReqFormValue("name").Trim();
            listAttr = rptObject.GetAttributeList(strId, strNode);
            if (listAttr == null)
            {
                return JsonConvert.GetJson(false, "Can not find" + strId + ":" + strNode + "Node,Save failed!");
            }
            else
            {
                if (listAttr.Count > 0)
                {
                    rptObject.DeleteAttribute(strName, strId, strNode, listAttr[0].NodeName);
                    Log.Add("-99", "Delete attribute", "Name:" + strName + " ID:" + strId + "", LogType.Advance, UserName);
                } 
                return JsonConvert.GetJson(true, "Delete sucess!");
            }
        });
        ActionOperation.Add("AddNode", delegate()
        {
            rptObject.CreateNode(ReqFormValue("pn").Trim(), ReqFormValue("n").Trim());
            Log.Add("-99", "Add Node", "Parent:" + ReqFormValue("pn").Trim() + " Node:" + ReqFormValue("n").Trim() + "", LogType.Advance, UserName);
            return JsonConvert.GetJson(true, "Create sucess!");
        });
        ActionOperation.Add("DelNode", delegate()
        {
            strNode = ReqFormValue("node").Trim();
            strId = ReqFormValue("id").Trim();
            listAttr = rptObject.GetAttributeList(strId, strNode);
            if (listAttr == null)
            {
                return JsonConvert.GetJson(false, "Can not find" + strId + ":" + strNode + "Node,Save failed!");
            }
            else
            {
                if (listAttr.Count > 0)
                {
                    rptObject.RemoveNode(strId, strNode, listAttr[0].NodeName);
                    Log.Add("-99", "Delete Node", "Node:" + strNode + " Id:" + strId + "", LogType.Advance, UserName);
                }
                return JsonConvert.GetJson(true, "Delete sucess!");
            }                     
        });
        
        return base.DoOperation(context);
    }
    
    public IList<object> GetResultByDicValue(Dictionary<string, IList<ReportAdvancedObject.AttributeStruct>> dicValue, string strParentNode)
    {
        IList<object> listResult = new List<object>();
        foreach (string strKey in dicValue.Keys)
        {
            IList<object> listItem = new List<object>();
            for (int i = 0; i < dicValue[strKey].Count; i++)
            {
                listItem.Add(new {
                    name = dicValue[strKey][i].Name,
                    type = dicValue[strKey][i].Type,
                    value = dicValue[strKey][i].Value,
                    nodename = dicValue[strKey][i].NodeName
                });
            }
            listResult.Add(new { id = strKey, node = strParentNode, attrs = listItem });
        }       
        return listResult;
    }

    public void SetAttribute(HttpContext context, IList<ReportAdvancedObject.AttributeStruct> listAttr)
    {
        for (int i = 0; i < listAttr.Count; i++)
        {
            listAttr[i].Value = context.Request.Form[listAttr[i].Name].Trim();
        }
    }
 


}