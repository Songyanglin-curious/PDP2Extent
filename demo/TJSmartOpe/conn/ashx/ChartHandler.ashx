<%@ WebHandler Language="C#" Class="ChartHandler" %>
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
using InfoSoftGlobal;

public class ChartHandler : ReportHandler
{
    public override string DoOperation(HttpContext context)
    {
        ActionOperation.Add("GetSearchBox", delegate()
        {
            foreach (Condition con in rptHelper.CurrentReportObject.Conditions.Values)
            {
                ListResult.Start();
                ListResult.Add("id", con.Id);
                ListResult.Add("type", con.Type);
                ListResult.End();
            }
            string[] strYData = rptHelper.CurrentReportObject.ChartConfig.YScaleData.Split(',');
            string strMin = "";
            string strMax = "";
            if (strYData.Length == 2)
            {
                strMin = strYData[0];
                strMax = strYData[1];
            }
            var varResult = new
            {               
                html = rptHelper.BuildSearchByCondition(),               
                ids = ListResult.Results,
                caption = rptHelper.CurrentReportObject.ChartConfig.Caption,
                subCaption = rptHelper.CurrentReportObject.ChartConfig.SubCaption,
                type = rptHelper.CurrentReportObject.ChartConfig.Type,
                xAxisName = rptHelper.CurrentReportObject.ChartConfig.XAxisName,
                pYAxisName = rptHelper.CurrentReportObject.ChartConfig.PYAxisName,
                sYAxisName = rptHelper.CurrentReportObject.ChartConfig.SYAxisName,
                yAxisMinValue = strMin,
                yAxisMaxValue = strMax
            }; 
            return JsonConvert.Parse(varResult);
        });

        ActionOperation.Add("Search", delegate()
        {
            ChartHelper chartHelper = new ChartHelper(ReqFormValue("pid").Empty(), rptHelper.CurrentReportObject, GetConditionDictionary(context, rptHelper));
            var varResult = new { chart = chartHelper.GenerateChartContent() };
            return JsonConvert.Parse(varResult);
        });
        
        ActionOperation.Add("GetOption", delegate()
        {
            return rptHelper.GetConditionSourceValue(ReqFormValue("pOut").Trim(), GetConditionDictionary(context, rptHelper));
        });
        
        ActionOperation.Add("GetChartData", delegate()
        {
            return JsonConvert.Parse(rptHelper.CurrentReportObject.ChartConfig);
        });

        ActionOperation.Add("SaveChart", delegate()
        {
            ChartEntity chartEntity = new ChartEntity();
            chartEntity.Caption = ReqFormValue("pCaption");
            chartEntity.SubCaption = ReqFormValue("pSubCaption");
            chartEntity.Type = ReqFormValue("pType");
            chartEntity.XAxisName = ReqFormValue("pXAxisName");
            chartEntity.PYAxisName = ReqFormValue("pPYAxisName");
            chartEntity.SYAxisName = ReqFormValue("pSYAxisName");
            chartEntity.XScaleSource = ReqFormValue("pXScaleSource");
            chartEntity.XScaleField = ReqFormValue("pXScaleField");
            chartEntity.YScaleData = ReqFormValue("pYScaleData");
            chartEntity.ChartSource = ReqFormValue("pChartDataSource");
            chartEntity.ChartField = ReqFormValue("pChartDataField");
            chartEntity.ChartColor = ReqFormValue("pChartDataColor");
            chartEntity.LabelStep = ReqFormValue("pChartLabelStep").Default("1");
            chartEntity.LineDataSource = ReqFormValue("pChartLineSource");
            chartEntity.LineDataField = ReqFormValue("pChartLineField");
            chartEntity.LineDataColor = ReqFormValue("pChartLineColor");
            chartEntity.ColumnDataSource = ReqFormValue("pChartColumnSource");
            chartEntity.ColumnDataField = ReqFormValue("pChartColumnField");
            chartEntity.ColumnDataColor = ReqFormValue("pChartColumnColor");           
            rptHelper.CurrentReportObject.SetReporttChart(chartEntity);
            return JsonConvert.GetJson(true, "Success！");
        });
        
        ActionOperation.Add("SetChart", delegate()
        {
            IList<ChartAttr> lstChartAttr = JsonConvert.Build<IList<ChartAttr>>(ReqFormValue("pAttrs"));
            rptHelper.CurrentReportObject.SetReporttChart(lstChartAttr);
            return JsonConvert.GetJson(true, "Success！");
        });
        ActionOperation.Add("GetChartAttrs", delegate()
        {
            Dictionary<string, string> attrs = rptHelper.CurrentReportObject.ChartConfig.Attributes;
            return JsonConvert.Parse(attrs);
        });
        ActionOperation.Add("GetChart", delegate()
        {
            Dictionary<string, string> attrs = rptHelper.CurrentReportObject.ChartConfig.Attributes;
            CommonChartHelper ch = new CommonChartHelper(attrs, ReqFormValue("pid").Empty(), rptHelper.CurrentReportObject, GetConditionDictionary(context, rptHelper));
            var varResult = new { chart = ch.GetChart() };
            return JsonConvert.Parse(varResult);
        });
                
        return base.DoOperation(context);
    }

    private Dictionary<string, Condition> GetConditionDictionary(HttpContext context, ReportHelper rptHelper)
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
    
}