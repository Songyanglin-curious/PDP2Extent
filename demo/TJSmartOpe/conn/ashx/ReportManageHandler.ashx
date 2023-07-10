<%@ WebHandler Language="C#" Class="ReportManageHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.IO;
//using Linger.Data;
using ReportEditer.Kernel;
using ReportEditer.Kernel.Common;

public class ReportManageHandler : ReportHandler
{
    public DBAdapte.DBAdapter db = null;
    
    public override string DoOperation(HttpContext context)
    {
        db = YshGrid.GetCurrDBManager().GetDBAdapter(ReportConfig.CommonDBName);
        ActionType = ReqQueryValue("postType").Trim();
        string strSql = "";
        string strContent = "";
        string strId = "";
        IList listSql = new ArrayList();
        ActionOperation.Add("InitData", delegate()
        {
            DataSet ds = db.ExecuteDataSet("Select * From tb_DirInfo Order By ParentId Asc");
            IList<object> listDir = new List<object>();
            foreach (DataRow r in ds.Tables[0].Select("ParentId = 0"))
            {
                CheckDir(listDir, r, ds);
            }
            ds = db.ExecuteDataSet("Select * From tb_Permission Order By PName Asc");
            foreach (DataRow r in ds.Tables[0].Rows)
            {
                ListResult.Start();
                ListResult.Add("id", r["PId"].ToString().Trim());
                ListResult.Add("name", r["PName"].ToString().Trim());
                ListResult.End();
            }
            var vResult = new { dir = listDir, permission = ListResult.Results, report = BuildReportData(string.Empty, string.Empty, string.Empty, UserName) };
            return JsonConvert.Parse(vResult);
        });
        ActionOperation.Add("SaveReport", delegate()
        {
            strId = ReqFormValue("pId").Trim();
            string strName = ReqFormValue("pName").Trim();
            string strFile = ReqFormValue("pReportFile").Trim();
            string strType = ReqFormValue("pType").Trim();
            string strDir = ReqFormValue("pDir").Trim();
            string strPm = ReqFormValue("pPm").Trim();
            string strDType = ReqFormValue("pDType").Trim();
            string strSaveData = ReqFormValue("pSd").Trim();
            string strEFile = ReqFormValue("pEFile").Trim();
            string strPrivBit = ReqFormValue("pPrivBit").Trim();
            if (ReportExist(strFile, strId) || (ExistFile(strFile) && string.IsNullOrEmpty(strId)))
            {
                return JsonConvert.GetJson(false, "当前系统已经包含了此报表文件,请更换报表文件名称后再进行保存！");
            }
            if (string.IsNullOrEmpty(strId))
            {
                if (strDType.Trim() == "1")
                {
                    strFile = DateTime.Now.Ticks.ToString();
                }
                strSql = db.GetSQL("Insert Into tb_Report (ReportName,FileName,ReportType,DirId,PermissionList,DesignType,SaveData,EFile,PrivBit) Values ({0},{1},{2},{3},{4},{5},{6},{7},{8})"
                    , strName, strFile, strType, strDir, strPm, strDType, strSaveData, strEFile, strPrivBit);
                strId = db.ExecuteInsertCommandGetID(strSql).ToString();
                Log.Add(strId, "创建报表", LogType.Report, UserName);
                CreateCllFile(strFile);
            }
            else
            {
                strContent = StringCommon.GetStringByTable(db.ExecuteDataSet(db.GetSQL("Select * From tb_Report Where ReportId={0}", strId)).Tables[0]);
                listSql = new ArrayList();
                strSql = db.GetSQL("Update tb_Report Set ReportName={0}, FileName={1}, ReportType={2},DirId={3},PermissionList ={4},DesignType={5},SaveData={6}, EFile={7}, PrivBit={8} Where ReportId={9}"
                        ,strName,strFile,strType,strDir,strPm,strDType,strSaveData,strEFile,strPrivBit,strId);
                listSql.Add(strSql);
                strSql = db.GetSQL("Insert Into tb_Process(ReportId,Title,Content,ProType,CreateTime,CreateUser)Values({0},{1},{2},{3},{4},{5})"
                    , strId, "修改报表", strContent, (int)LogType.ReportEdit, DateTime.Now, UserName);
                listSql.Add(strSql);
                db.TryExecuteHugeCommands(listSql,200);
            }
            return JsonConvert.GetJson(true, "报表数据保存成功！");
        });
        ActionOperation.Add("SearchReport", delegate()
        {
            string strName = ReqFormValue("pName").Trim();
            string strType = ReqFormValue("pType").Trim();
            string strDir = ReqFormValue("pDir").Trim();
            return JsonConvert.Parse(BuildReportData(strName, strType, strDir, UserName));
        });
        ActionOperation.Add("DeleteReport", delegate()
        {
            strId = ReqFormValue("pId").Trim();
            DataSet ds = db.ExecuteDataSet(db.GetSQL("Select * From tb_Report Where ReportId={0}", strId));
            if (ds.Tables[0].Rows.Count == 0){ return JsonConvert.GetJson(false, "没有找到要删除的报表数据！"); }
            string strTime = Linger.Common.Timer.getDateTime(DateTime.Now);
            string strFile = ds.Tables[0].Rows[0]["FileName"].ToString().Trim();
            strContent = StringCommon.GetStringByTable(ds.Tables[0]);
            listSql = new ArrayList();
            strSql = db.GetSQL("Delete From tb_Report Where ReportId={0}" , strId);
            listSql.Add(strSql);
            strSql = db.GetSQL("Insert Into tb_Process(ReportId,Title,Content,ProType,CreateTime,CreateUser)Values({0},{1},{2},{3},{4},{5})"
                , strId, "删除报表", strContent, (int)LogType.ReportEdit, DateTime.Now, UserName);
            listSql.Add(strSql);
            if (db.TryExecuteHugeCommands(listSql,200) == null)
            {
                DeleteCllFile(strFile, strId);
                DeleteXmlFile(strFile, strId);

            }
            return JsonConvert.GetJson(true, "报表数据删除成功！");
        });
        ActionOperation.Add("SaveDir", delegate()
        {
            strId = ReqFormValue("pId").Trim();
            string strName = ReqFormValue("pName").Trim();
            string strDir = ReqFormValue("pDir").Trim();
            if (string.IsNullOrEmpty(strId))
            {
                strSql = db.GetSQL("Insert Into tb_DirInfo (DirName,ParentId)Values({0},{1})", strName, strDir);
                strId = db.ExecuteInsertCommandGetID(strSql).ToString();
                Log.Add(strId, "创建目录", "目录ID:" + strId + "", LogType.Dir, UserName);
                db.TryExecuteHugeCommands(listSql,200);
            }
            else
            {
                strContent = StringCommon.GetStringByTable(db.ExecuteDataSet(db.GetSQL("Select * From tb_DirInfo Where DirId={0}", strId)).Tables[0]);
                listSql = new ArrayList();
                strSql = db.GetSQL("Update tb_DirInfo Set DirName={0}, ParentId={1} Where DirId={2}", strName, strDir, strId);
                listSql.Add(strSql);
                strSql = db.GetSQL("Insert Into tb_Process(ReportId,Title,Content,ProType,CreateTime,CreateUser)Values({0},{1},{2},{3},{4},{5})"
                    , strId, "修改目录", strContent, (int)LogType.Dir, DateTime.Now, UserName);
                listSql.Add(strSql);
                db.TryExecuteHugeCommands(listSql,200);
            }
            DataSet ds = db.ExecuteDataSet("Select * From tb_DirInfo Order By ParentId Asc");
            IList<object> listDir = new List<object>();
            foreach (DataRow r in ds.Tables[0].Select("ParentId = 0"))
            {
                CheckDir(listDir, r, ds);
            }
            var vResult = new { flag = 1, msg = "报表目录保存成功!", dir = listDir };
            return JsonConvert.Parse(vResult);
        });
        ActionOperation.Add("DelDir", delegate()
        {
            strId = ReqFormValue("pId").Trim();
            //判断是否存在报表文件
            DataSet ds = db.ExecuteDataSet(db.GetSQL("Select * From tb_Report Where DirId={0}", strId));
            if (ds.Tables[0].Rows.Count > 0)
            {
                return JsonConvert.GetJson(false, "当前目录存在报表文件,不能完成删除操作！");                
            }
            //判断是否存在子目录
            ds = db.ExecuteDataSet(db.GetSQL("Select * From tb_DirInfo Where ParentId={0}", strId));
            if (ds.Tables[0].Rows.Count > 0)
            {
                return JsonConvert.GetJson(false, "当前目录存在子目录,不能完成删除操作！");                
            }
            strContent = StringCommon.GetStringByTable(db.ExecuteDataSet(db.GetSQL("Select * From tb_DirInfo Where DirId={0}", strId)).Tables[0]);
            strSql = db.GetSQL("Delete From tb_DirInfo Where DirId={0}" , strId);
            listSql.Add(strSql);
            strSql = db.GetSQL("Insert Into tb_Process(ReportId,Title,Content,ProType,CreateTime,CreateUser)Values({0},{1},{2},{3},{4},{5})"
                , strId, "删除目录", strContent, (int)LogType.Dir, DateTime.Now, UserName);
            listSql.Add(strSql);
            db.TryExecuteHugeCommands(listSql,200);
            ds = db.ExecuteDataSet("Select * From tb_DirInfo Order By ParentId Asc");
            IList<object> listDir = new List<object>();
            foreach (DataRow r in ds.Tables[0].Select("ParentId = 0"))
            {
                CheckDir(listDir, r, ds);
            }
            var vResult = new { flag = 1, msg = "报表目录删除成功!", dir = listDir };
            return JsonConvert.Parse(vResult);
        });
        return base.DoOperation(context);
    }
    
    /// <summary>
    /// 生成报表数据
    /// </summary>
    /// <param name="strName"></param>
    /// <param name="strType"></param>
    /// <param name="strDir"></param>
    /// <returns></returns>
    private IList<object> BuildReportData(string strName, string strType, string strDir, string strUserNmae)
    {
            IList<object> listResult = new List<object>();
            string strSql = "Select * From tb_Report a Left Join tb_Process b On a.ReportId=b.ReportId And b.ProType = 1 Where 1=1 ";
            if (!string.IsNullOrEmpty(strName))
            {
                strSql += db.GetSQL(" And a.ReportName LIKE '%{0}%'", strName);
            }
            if (!string.IsNullOrEmpty(strType))
            {
                strSql += db.GetSQL(" And a.ReportType = '{0}'", strType);
            }
            if (!string.IsNullOrEmpty(strDir))
            {
                strSql += db.GetSQL(" And a.DirId IN ({{0}})", StringCommon.SubmitEndWith(",", GetDirByParentId(strDir)));
            }
            strSql += " Order By a.ReportId";
            DataSet ds = db.ExecuteDataSet(strSql);
            YshPrivHelper helper = new YshPrivHelper(YshGrid.GetUserPrivilege().GetUserNumbyID(strUserNmae));
            foreach (DataRow r in ds.Tables[0].Rows)
            {
                string strPriv = r["PrivBit"].ToString().Trim();
                if (!helper.Judge(strPriv))
                    continue;
                listResult.Add(new
                {
                    id = r["ReportId"].ToString().Trim(),
                    name = r["ReportName"].ToString().Trim(),
                    file = r["FileName"].ToString().Trim(),
                    type = r["ReportType"].ToString().Trim(),
                    dir = r["DirId"].ToString().Trim(),
                    pm = r["PermissionList"].ToString().Trim(),
                    ctime = r["CreateTime"].ToString().Trim(),
                    cuser = r["CreateUser"].ToString().Trim(),
                    dtype = r["DesignType"].ToString().Trim(),
                    sd = r["SaveData"].ToString().Trim(),
                    efile = r["EFile"].ToString().Trim(),
                    privbit = r["PrivBit"].ToString().Trim(),
                    user = UserName
                });
            }
            return listResult;
    }

    private string GetDirByParentId(string strParentId)
    {
        string strDirs = strParentId + ",";
        DataSet ds = db.ExecuteDataSet("Select * From tb_DirInfo  Order By ParentId");
        foreach (DataRow r in ds.Tables[0].Select("ParentId=" + strParentId + ""))
        {
            strDirs += GetDirId(r, ds);
        }
        return strDirs;
    }

    private string GetDirId(DataRow r, DataSet ds)
    {
        string strData = r["DirId"].ToString().Trim() + ",";        
        foreach (DataRow dr in ds.Tables[0].Select("ParentId = " + r["DirId"].ToString().Trim() + ""))
        {
            strData += GetDirId(dr, ds);
        }
        return strData;
    }
    
    /// <summary>
    /// 生成目录数据
    /// </summary>
    /// <param name="r"></param>
    /// <param name="ds"></param>
    /// <returns></returns>
    private void CheckDir(IList<object> listResult, DataRow r, DataSet ds)
    {
        var vItem = new { id = r["DirId"].ToString().Trim(), name = r["DirName"].ToString().Trim(), pgid = r["ParentId"].ToString().Trim() };
        listResult.Add(vItem);
        foreach (DataRow dr in ds.Tables[0].Select("ParentId = " + r["DirId"].ToString().Trim() + ""))
        {
            CheckDir(listResult, dr, ds);
        }
    }
    
    /// <summary>
    /// 判断数据库中是否存在同名报表文件
    /// </summary>
    /// <param name="strFileName"></param>
    /// <param name="strId"></param>
    /// <returns></returns>
    private bool ReportExist(string strFileName, string strId)
    {
        string strSql = db.GetSQL("Select * From tb_Report Where FileName={0}", strFileName);
        if (!string.IsNullOrEmpty(strId))
        {
            strSql += db.GetSQL(" And ReportId != {0}", strId);
        }
        DataSet ds = db.ExecuteDataSet(strSql);
        return ds.Tables[0].Rows.Count > 0;
    }
 
    /// <summary>
    /// 是否存在指定报表文件
    /// </summary>
    /// <param name="strFileName"></param>
    /// <returns></returns>
    private bool ExistFile(string strFileName)
    {
        return File.Exists(Path.Combine(ReportConfig.CllFilePath, strFileName + ".cll"));
    }
    /// <summary>
    /// 创建报表文件,将事先准备好的空文件复制过去。
    /// </summary>
    /// <param name="strFileName"></param>
    private void CreateCllFile(string strFileName)
    {
        File.Copy(ReportConfig.TempCllFile,Path.Combine(ReportConfig.CllFilePath, strFileName + ".cll"));        
    }

    /// <summary>
    /// 删除报表文件，将报表移至备份目录。
    /// </summary>
    /// <param name="strFile"></param>
    /// <param name="strId"></param>
    private void DeleteCllFile(string strFile , string strId)
    {
        string strBakPath = Path.Combine(ReportConfig.CllFilePath, "delbak");
        if (!Directory.Exists(strBakPath))
        {
            Directory.CreateDirectory(strBakPath);
        }
        if (ExistFile(strFile)) //处理对应的报表
        {
            string strCurFile = Path.Combine(ReportConfig.CllFilePath, strFile + ".cll");
            string strDeleteFile = Path.Combine(strBakPath, "" + strId + "-" + strFile + ".cll");
            File.Move(strCurFile, strDeleteFile);
        }
    }

    private void DeleteXmlFile(string strFile, string strId)
    {
        string strBakPath = Path.Combine(ReportConfig.ConfigFilePath, "delbak");
        if (!Directory.Exists(strBakPath))
        {
            Directory.CreateDirectory(strBakPath);
        }
        if (File.Exists(Path.Combine(ReportConfig.ConfigFilePath, strFile + ".xml"))) 
        {
            string strCurFile = Path.Combine(ReportConfig.ConfigFilePath, strFile + ".xml");
            string strDeleteFile = Path.Combine(strBakPath, "" + strId + "-" + strFile + ".xml");
            File.Move(strCurFile, strDeleteFile);
        }
    }

}