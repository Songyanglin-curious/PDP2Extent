<%@ WebHandler Language="C#" Class="ReportEditerHandler" %>

using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using System.Web.Script.Serialization;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Models;
using ReportEditer.Kernel.Common;
using Linger.Data;
public class ReportEditerHandler : ReportHandler
{
    public override string DoOperation(HttpContext context)
    {
        ActionOperation.Add("GetSearchBox", delegate()
        {
            rptHelper.ExecSourceData += new ReportHelper.ExecDataEventHandler(rptHelper_ExecSourceData);
            foreach (Condition con in rptHelper.CurrentReportObject.Conditions.Values)
            {
                ListResult.Start();
                ListResult.Add("id", con.Id);
                ListResult.Add("type", con.Type);             
                ListResult.End();
            }            
            //
            IEnumerable<KeyValuePair<string, Field>> iEnumList = rptHelper.CurrentReportObject.Fields.Where(p => p.Value.St != string.Empty);
            IEnumerable<KeyValuePair<string, Field>> iEnumISrcs = rptHelper.CurrentReportObject.Fields.Where(p => p.Value.ISrc != string.Empty);
            var varResult = new { cll = rptHelper.CurrentReportObject.CllFile, html = rptHelper.BuildSearchByCondition(), store = iEnumList.Count() > 0, 
                                  init = iEnumISrcs.Count() > 0,
                                  ids = ListResult.Results,
                                  efile = GetEFile()
            }; 
            return JsonConvert.Parse(varResult);
        });
        ActionOperation.Add("Search", delegate()
        {
            rptHelper.ExecSourceData += new ReportHelper.ExecDataEventHandler(rptHelper_ExecSourceData);
            Dictionary<string, RetValue> dicRetValue = rptHelper.Search(GetConditionDictionary(context, rptHelper), ReqFormValue("pSearchType").Default("0"));
            IList<object> listSheet = new List<object>();
            foreach (string strSheet in rptHelper.CurrentSheets.Keys)
            {
                foreach (string strName in rptHelper.CurrentSheets[strSheet].Values)
                {
                    ListResult.Start();
                    ListResult.Add("sname", strName);
                    ListResult.End();
                }
                var item = new { name = strSheet, temp = rptHelper.CurrentReportObject.Sources[strSheet].Temp, value = ListResult.Results };                
                listSheet.Add(item);
                ListResult.Init();
            }
            var varResult = new { sheets = listSheet, fields = BuildReturnValue(dicRetValue) };
            return JsonConvert.Parse(varResult);
        });
        ActionOperation.Add("GetOption", delegate()
        {
            return rptHelper.GetConditionSourceValue(ReqFormValue("pOut").Trim(), GetConditionDictionary(context, rptHelper));
        });
        ActionOperation.Add("SaveData", delegate() {

            string strResult = ReqFormValue("data");
            string strBackFileName = ReqFormValue("pBackFileName");
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            IList<StoreResult> storeData = jsSerializer.Deserialize<IList<StoreResult>>(strResult);
            bool bSuccess = rptHelper.StoreSearchData(storeData, strBackFileName);
            return JsonConvert.GetJson(bSuccess, bSuccess ? "Save sucess!" : "Save failed!");
        });
        return base.DoOperation(context);
    }

    void rptHelper_ExecSourceData(DataOperation dataOperation)
    {
        if (dataOperation.SourceEquals("temp"))
        {
            for (int i = 0; i < dataOperation.DataCount; i++)
            {
                dataOperation.SetColumnValue(i, "V1", "wanglei Edit");
            }
        }
    }

    public override void SetParams()
    {
        SetSession("TEST", "STA000008");
        SetVirtual("ABC", "WL710");
        base.SetParams();
    }
  
    public string GetEFile()
    {
        try
        {
            DBAdapte.DBAdapter db = YshGrid.GetCurrDBManager().GetDBAdapter(ReportConfig.CommonDBName);
            DataSet ds = db.ExecuteDataSet(db.GetSQL("Select * From tb_Report Where FileName={0}", System.IO.Path.GetFileName(XmlFile)));
            return ds.Tables[0].Rows[0]["EFile"].ToString().Trim();
        }
        catch
        {
            return "";
        }
       
    }
  
    private Dictionary<string, Condition> GetConditionDictionary(HttpContext context , ReportHelper rptHelper)
    {
        Dictionary<string, Condition> dicSearchCondition = new Dictionary<string, Condition>();
        foreach (Condition con in rptHelper.CurrentReportObject.Conditions.Values)
        {
            if (context.Request.Form[con.Id] != null)
            {
                dicSearchCondition.Add(con.Id, con);
                dicSearchCondition[con.Id].CurValue = context.Request.Form[con.Id];
            }
        }
        return dicSearchCondition;
    }



    private IList<object> BuildReturnValue(Dictionary<string, RetValue> dicRetValue)
    {
        using (YshGrid.CreateDBManager())
        {
            IList<object> listValue = new List<object>();
            foreach (RetValue retValue in dicRetValue.Values)
            {
                IList<object> ltResult = new List<object>();
                switch (retValue.DType)
                {
                    case ResultTypeEnum.Text:
                        ltResult.Add(retValue.Value.ToString());
                        break;
                    case ResultTypeEnum.List:
                    case ResultTypeEnum.DoubleList:
                        ltResult = retValue.Value as IList<object>;
                        break;
                    default:
                        break;
                }
                int nPermission = 0;
                if (HttpContext.Current.Session["usernum"] == null)
                {
                    nPermission = string.IsNullOrEmpty(retValue.RealteField.Permission) ? 1 : 0;
                }
                else
                {
                    nPermission = YshGrid.GetUserPrivilege().GetBitIDPrivilege(int.Parse(HttpContext.Current.Session["usernum"].ToString()), retValue.RealteField.Permission);
                }
                var varResult = new
                {
                    id = retValue.Id,
                    dtype = retValue.DType,
                    stype = retValue.SourceType.ToString(),
                    sheet = retValue.SheetName,
                    result = ltResult,
                    store = retValue.StoreData,
                    permission = nPermission
                };
                listValue.Add(varResult);
            }
            return listValue;
        }
    }

}