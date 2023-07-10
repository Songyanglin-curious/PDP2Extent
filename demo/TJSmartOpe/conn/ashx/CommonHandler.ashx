<%@ WebHandler Language="C#" Class="CommonHandler" %>

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
using ReportEditer.Kernel.Generate;

public class CommonHandler : ReportHandler
{
    public override string DoOperation(HttpContext context)
    {
        
        ActionOperation.Add("GetReportCourse", delegate()
        {
            ReportObject reportObject = ReportManage.Instance.Get(XmlFile);
            var vResult = new { Course = reportObject.IsNewCourse };
            return JsonConvert.Parse(vResult);
        });
        
        ActionOperation.Add("GetDataBase", delegate()
        {
            string strConnFile = Path.Combine(ReportConfig.PhysicalApplicationPath, "bin", "ConnCfg.xml");
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(strConnFile);
            XmlNode xmlNode = xmlDoc.SelectSingleNode("ROOT");
            for (int i = 0; i < xmlNode.ChildNodes.Count; i++)
            {
                if (xmlNode.ChildNodes[i].Attributes["Name"] != null)
                {
                    ListResult.Start();
                    ListResult.Add("key", xmlNode.ChildNodes[i].Name);
                    ListResult.Add("name", xmlNode.ChildNodes[i].Attributes["Name"].Value);
                    ListResult.End();
                }
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("GetTables", delegate()
        {
            DataSet ds = DBInfo.GetTablesInfo(ReqFormValue("pDb").Trim());
            foreach (DataRow r in ds.Tables[0].Rows)
            {
                ListResult.Start();
                ListResult.Add("name", r["name"].ToString().Trim());
                ListResult.Add("memo", (r["memo"].ToString().Trim().Length == 0 ? r["name"].ToString().Trim() : r["memo"].ToString().Trim()) + " (" + r["name"].ToString().Trim() + ")");
                ListResult.End();
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("GetTableColumns", delegate()
        {
            ReportObject reportObject = ReportManage.Instance.Get(XmlFile);
            string strTable1 = ReqFormValue("pTable1").Trim();
            string strTable2 = ReqFormValue("pTable2").Trim();
            IList<Dictionary<string, string>> dicTable1 = new List<Dictionary<string, string>>();
            IList<Dictionary<string, string>> dicTable2 = new List<Dictionary<string, string>>();
            DataSet dsColumn = null;
            if (ReportViewAdapter.IsView(strTable1))
            {
                strTable1 = ReportViewAdapter.GetViewId(strTable1);
                IList<string> listColumns = GenerateUtil.GetViewColumns(ReqFormValue("pTable1").Trim(), ReqFormValue("pDb").Trim(), reportObject);
                foreach (string strCol in listColumns)
                {
                    ListResult.Start();
                    ListResult.Add("name", strCol);
                    ListResult.Add("memo", strCol);
                    ListResult.End();
                }
            }
            else
            {
                dsColumn = DBInfo.GetTableColumns(ReqFormValue("pTable1").Trim(), ReqFormValue("pDb").Trim());
                foreach (DataRow r in dsColumn.Tables[0].Rows)
                {
                    ListResult.Start();
                    ListResult.Add("name", r["name"].ToString().Trim());
                    ListResult.Add("memo", (r["memo"].ToString().Trim().Length == 0 ? r["name"].ToString().Trim() : r["memo"].ToString().Trim()));
                    ListResult.End();
                }
            }
            dicTable1 = ListResult.Results;
            ListResult.Init();
            if (ReportViewAdapter.IsView(strTable2))
            {
                strTable2 = ReportViewAdapter.GetViewId(strTable2);
                IList<string> listColumns = GenerateUtil.GetViewColumns(ReqFormValue("pTable2").Trim(), ReqFormValue("pDb").Trim(), reportObject);
                foreach (string strCol in listColumns)
                {
                    ListResult.Start();
                    ListResult.Add("name", strCol);
                    ListResult.Add("memo", strCol);
                    ListResult.End();
                }
            }
            else
            {
                dsColumn = DBInfo.GetTableColumns(context.Request.Form["pTable2"].Trim(), ReqFormValue("pDb").Trim());
                foreach (DataRow r in dsColumn.Tables[0].Rows)
                {
                    ListResult.Start();
                    ListResult.Add("name", r["name"].ToString().Trim());
                    ListResult.Add("memo", (r["memo"].ToString().Trim().Length == 0 ? r["name"].ToString().Trim() : r["memo"].ToString().Trim()));
                    ListResult.End();
                }
            }
            dicTable2 = ListResult.Results;
            var varResult = new { table1 = strTable1, columns1 = dicTable1, table2 = strTable2, columns2 = dicTable2 };
            return JsonConvert.Parse(varResult);
        });  
        return base.DoOperation(context);
    }

}