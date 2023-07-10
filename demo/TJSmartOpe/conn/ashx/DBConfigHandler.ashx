<%@ WebHandler Language="C#" Class="DBConfigHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Text;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Models;
using ReportEditer.Kernel.Common;
using Linger.Data;
public class DBConfigHandler : ReportHandler
{

    public override string DoOperation(HttpContext context)
    {
        ReportObject reportObject = ReportManage.Instance.Get(XmlFile);
        ActionOperation.Add("GetTables", delegate()
        {
            IEnumerable<DBTable> eMain = reportObject.DBTables.Values.Where<DBTable>(p => p.Type == Enum.GetName(typeof(EnumDBTableType), EnumDBTableType.Main));
            if (eMain.Count() == 0)
            {
                return JsonConvert.GetJson(true, "unCreateMain");
            }
            foreach (DBTable db in reportObject.DBTables.Values)
            {
                ListResult.Start();
                ListResult.Add("name", db.Name);
                ListResult.Add("type", db.Type);
                ListResult.Add("desc", db.Desc);
                ListResult.End();
            }
            return JsonConvert.Parse(ListResult.Results);
        });
        ActionOperation.Add("SaveTable", delegate()
        {
            IEnumerable<DBTable> eMain = reportObject.DBTables.Values.Where<DBTable>(p => p.Type == Enum.GetName(typeof(EnumDBTableType), EnumDBTableType.Main));
            if (eMain.Count() > 0)
            {
                DBTable dbTable = new DBTable();
                dbTable.Name = ReqFormValue("pFillName").Trim();
                dbTable.Type = Enum.GetName(typeof(EnumDBTableType), EnumDBTableType.Other);
                dbTable.Foreign = eMain.First().Foreign;
                dbTable.Desc = ReqFormValue("pDesc").Trim();
                if (reportObject.DBTables.ContainsKey(dbTable.Name))
                {
                    return JsonConvert.GetJson(false, "当前已经包含了此数据库表,不能完成添加！");
                }
                reportObject.CreateDBTable(dbTable);
                Log.Add("-99", "创建数据表", "TableName:" + dbTable.Name + "", LogType.DBConfig, UserName);
                return JsonConvert.GetJson(true, "数据表创建成功！");
            }
            else
            {
                return JsonConvert.GetJson(false, "当前报表还没有生成对应的数据表！");
            }
        });
        ActionOperation.Add("CreateMain", delegate() {
            DBAdapte.DBAdapter db = YshGrid.GetCurrDBManager().GetDBAdapter(ReportConfig.CommonDBName);
            DataSet ds = db.ExecuteDataSet(db.GetSQL("Select * From tb_Report Where FileName={0}", System.IO.Path.GetFileNameWithoutExtension(this.XmlFile)));
            if (ds.Tables[0].Rows.Count == 0)
            {
                return JsonConvert.GetJson(false, "没有找到当前报表的数据记录！");
            }
            DataRow r = ds.Tables[0].Rows[0];
            string strReportName = r["ReportName"].ToString().Trim();
            DBTable dbTable = new DBTable();
            dbTable.Name = System.IO.Path.GetFileNameWithoutExtension(reportObject.strFileName);
            dbTable.Type = Enum.GetName(typeof(EnumDBTableType), EnumDBTableType.Main);
            dbTable.Desc = strReportName;
            if (reportObject.DBTables.ContainsKey(dbTable.Name))
            {
                return JsonConvert.GetJson(false, "当前已经包含了此数据库表,不能完成添加！");
            }
            reportObject.CreateDBTable(dbTable);
            Log.Add("-99", "创建数据表", "TableName:" + dbTable.Name + "", LogType.DBConfig, UserName);
            return JsonConvert.GetJson(true, "数据表创建成功！");
        });
        return base.DoOperation(context);
    }

}