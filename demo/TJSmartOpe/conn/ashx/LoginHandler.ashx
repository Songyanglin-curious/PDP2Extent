<%@ WebHandler Language="C#" Class="LoginHandler" %>

using System;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Collections.Generic;

using Newtonsoft.Json;
using Linger.Common;
using System.Web.SessionState;
using Linger.Web;
using YshJWT;



public class LoginHandler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.Clear();
        context.Response.ContentEncoding = Encoding.UTF8;
        context.Response.ContentType = "application/json";
        Result result = new Result();
        result.code = "200";
        result.msg = "";
        result.data = "";
        string strUserID = context.Request.Form["userid"].Trim();
        string strUserPwd = context.Request.Form["userpwd"].Trim();
        string userId = "1fefc0183077ee2a87403e456bb8997d5c1dac78aaeaae295b396cf49a629430ec5099fd21c68e177ec293f311e7ab3fe7881d8080742aefed9792ae6e43856d58d044685c7ae63427adfaef7ed0ffa0c76d4b328554c18855d4858fa15bd33e9b8e6478ac";
        string userPwd = "1fefc0183077ee2a87403e456bb8997d5c1dac78aaeaae295b396cf49a629430ec5099fd21c68e177ec293f311e7ab3fe7881d8080742aefed9792ae6e43856d28861a25533cd8fdb8f6ad4b5d21b6a0ab4f0502835e9645b04a7dd2d957ddb410e055d0ab52e0ec";
        if (String.Equals(strUserID, userId) && String.Equals(strUserPwd, userPwd))
        {
            result.code = "200";
            result.msg = "登录成功";
            context.Session["userid"] = strUserID;
            context.Session["dcc"] = "0021990101";
        }
        else
        {
            result.code = "401";
            result.msg = "账号，密码错误";
        }
        context.Response.AddHeader("server-date", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        context.Response.Write(JsonConvert.SerializeObject(result));
        context.Response.Flush();
        context.Response.End();
    }
    //public void ProcessRequest(HttpContext context)
    //{
    //    context.Response.Clear();
    //    context.Response.ContentEncoding = Encoding.UTF8;
    //    context.Response.ContentType = "application/json";
    //    Result result = new Result();
    //    result.code = "200";
    //    result.msg = "";
    //    result.data = "";


    //    try
    //    {
    //        bool isLogin = false;
    //        if (NeedCheckLogin(context) && context.Request.Cookies["ysh_jwt"] != null)
    //        {
    //            //有登录信息
    //            string strToken = context.Request.Cookies["ysh_jwt"].Value;
    //            UserCheckResult user = JwtHelper.CheckUserToken(strToken);

    //            if (user.IsSuccess)
    //            {
    //                //有登录信息自动登录
    //                isLogin = true;
    //                result.data = new { isLogin = isLogin };
    //            }
    //        }
    //        if (!isLogin)
    //        {
    //            string strPostType = context.Request.Form["postType"].Trim();
    //            switch (strPostType)
    //            {
    //                case "login":
    //                    using (YshGrid.CreateDBManager())
    //                    {
    //                        result.msg = CheckLogin(context, result);
    //                        //检测版本号
    //                        if (context.Request.Form["appVersion"] != null)
    //                        {
    //                            var strAppVersion = Common.GetConfig("AppVersion").Trim();
    //                            result.data = new { appVersion = strAppVersion };
    //                        }
    //                    }
    //                    break;
    //                case "getLoginInfo":
    //                    List<string> lstLogin = GetLoginInfo(context);
    //                    if (lstLogin.Count > 0)
    //                    {
    //                        result.data = new { userid = lstLogin[0], cbpwd = lstLogin[2] == "1", userpwd = lstLogin[2] == "1" ? lstLogin[1] : "" };
    //                    }
    //                    break;
    //                case "logout":
    //                    YshWebUI.Logout();
    //                    break;
    //                default:
    //                    break;
    //            }
    //        }

    //    }
    //    catch (Exception ex)
    //    {
    //        result.code = "500";
    //        result.msg = ex.Message;
    //        GudUsing.Log.Add(ex.Message + "\r\n" + ex.StackTrace);
    //    }

    //    context.Response.AddHeader("server-date", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
    //    context.Response.Write(JsonConvert.SerializeObject(result));
    //    context.Response.Flush();
    //    context.Response.End();
    //}

    public bool IsReusable
    {
        get
        {
            return true;
        }
    }

    public bool NeedCheckLogin(HttpContext context)
    {
        return context.Request.Form["postType"].Trim() != "logout" && !IsDcloudLogin(context);
    }

    public bool IsDcloudLogin(HttpContext context)
    {
        return !string.IsNullOrEmpty(context.Request.Form["from"]) && context.Request.Form["from"].Trim() == "dcloud";
    }

    public List<string> GetLoginInfo(HttpContext context)
    {
        DBAdapte.DBAdapter db = YshGrid.GetDBAdapter("APPUSER");
        var helper = new XmlHelper("SignalData.xml");
        HttpRequest request = context.Request;
        string result = request.UserHostAddress;
        var strSql = db.GetSQL(helper.GetNodeValue("GetLoginInfoFirst"), result);
        List<string> lst = new List<string>();
        using (db.Open())
        {
            using (var reader = db.ExecuteReader(strSql))
            {
                if (reader.Read())
                {
                    // cbxPWD.Checked = true;
                    lst.Add(YshSM.SM2Utils.Decrypt(YshSM.SM2Utils.PRVK1, reader[0].ToString()));
                    lst.Add(YshSM.SM2Utils.Decrypt(YshSM.SM2Utils.PRVK1, reader[1].ToString()));
                    lst.Add(reader[2].ToString().ToLower());
                    lst.Add(reader[3].ToString().ToLower());
                }
            }
        }
        return lst;
    }

    public string CheckLogin(HttpContext context, Result result)
    {
        string strUserID = context.Request.Form["userid"].Trim();
        string strUserPwd = "";
        string strCbPwd = "";
        string strMsg = "";
        if (IsDcloudLogin(context))
        {
            if (string.IsNullOrEmpty(strUserID))
            {
                result.code = "302";
                result.data = new { loginUrl = Common.GetConfig("LoginUrl") };
                return "";
            }
            strMsg = YshWebUI.Login(null, strUserID, "", "", false);
        }
        else
        {
            strUserID = YshSM.SM2Utils.Decrypt(YshSM.SM2Utils.PRVK1, strUserID);
            strUserPwd = context.Request.Form["userpwd"].Trim();
            strUserPwd = YshSM.SM2Utils.Decrypt(YshSM.SM2Utils.PRVK1, strUserPwd);
            strCbPwd = context.Request.Form["cbpwd"].Trim();

            strMsg = YshWebUI.Login(null, strUserID, strUserPwd, "", true, true);
            if (strMsg.StartsWith("ysh_jwt:"))
            {
                result.data = new { token = strMsg.Replace("ysh_jwt:", "") };
                strMsg = "";
            }
        }
        if (string.IsNullOrEmpty(strMsg))
        {
            strMsg = EnsureLogin(strUserID, strUserPwd, "", "");
            //登录要记录登录信息
            HttpRequest request = HttpContext.Current.Request;
            string strHost = request.UserHostAddress;
            var db = YshGrid.GetDBAdapter("APPUSER");
            var helper = new XmlHelper("SignalData.xml");
            var strSql = db.GetSQL(helper.GetNodeValue("AddLoginInfo"), strHost, YshSM.SM2Utils.Encrypt(YshSM.SM2Utils.PUBK1, strUserID),
                YshSM.SM2Utils.Encrypt(YshSM.SM2Utils.PUBK1, strUserPwd), strCbPwd, "0");
            using (db.Open())
            {
                db.ExecuteCommand(strSql);
            }
        }
        //else if (strMsg.StartsWith("js:"))
        //    strMsg = WebUsing.ClientHelper.GetScriptString(strMsg);
        //else if (strMsg.StartsWith("jump:"))
        //{
        //    int idx = strMsg.IndexOf(',');
        //    string msg = "";
        //    string linkurl = "";
        //    if (idx > 0)
        //    {
        //        msg = strMsg.Substring(5, idx - 5);
        //        linkurl = strMsg.Substring(idx + 1);
        //    }
        //    strMsg = EnsureLogin(strUserID, strUserPwd, "", linkurl);
        //}

        return strMsg;
    }
    private string EnsureLogin(string userid, string userPwd, string msg, string linkurl)
    {
        if (string.IsNullOrEmpty(msg))
        {
            if (Common.CHECK_VERSION)
            {
                UserInfo uInfo = YshWebUI.GetUserInfo();
                //string userid = Linger.Web.Pager.getSession("userid");
                //string userPwd = (new YshEncode.EncryptClass()).Decrypt(Linger.Web.Pager.getSession("userpwd"), "1");
                if (YshWebUI.CheckPasswordStrangth(userid, userPwd) != 0)
                {
                    return JsHelper.AlertAndGo("密码过于简单，请修改密码！", "/s/Sys_User.aspx" + "?usernum=" + uInfo.UserNum /*(int)HttpContext.Current.Session["usernum"]*/);
                }
                UserPrivilege.UserCtrlClass ucc = YshGrid.GetUserPrivilege();
                object[,] arr = ucc.GetPasswdChangeRecords(uInfo.UserNum/*(int)HttpContext.Current.Session["usernum"]*/) as object[,];
                int count = arr.GetLength(0);
                if (count > 0)
                {
                    if (!arr[count - 1, 0].Equals(arr[count - 1, 2]))
                    {
                        return JsHelper.AlertAndGo("您的密码还没有经过修改，或者已经被管理员重置。请修改后再登录！", "/s/Sys_User.aspx" + "?usernum=" + (int)HttpContext.Current.Session["usernum"]);
                    }
                }
                int nDays = YshWebUI.GetPasswordOuttimeDays(uInfo.UserNum/*(int)HttpContext.Current.Session["usernum"]*/);
                if (nDays < 3 && nDays > 0)
                    msg = JsHelper.Alert("你的密码将在" + nDays + "天后过期，请及时修改密码！");
                else if (nDays == 0)
                {
                    msg = JsHelper.Alert("你的密码即将过期，请及时修改密码！");
                }
                else if (nDays < 0)
                {
                    return JsHelper.AlertAndGo("你的密码已过期，请修改密码！", "/s/Sys_User.aspx" + "?usernum=" + uInfo.UserNum /*(int)HttpContext.Current.Session["usernum"]*/);
                }
            }
        }
        if (string.IsNullOrEmpty(linkurl))
            linkurl = HttpContext.Current.Server.HtmlEncode(Linger.Web.Pager.getRequest("linkurl", ""));
        if (!string.IsNullOrEmpty(linkurl))
        {
            if (!string.IsNullOrEmpty(msg))
                msg += "&";
            else
                msg = "?";
            msg += "linkurl=" + linkurl;
        }
        //msg = Server.HtmlEncode(msg);

        //var db = YshGrid.GetCurrDBManager().GetDBAdapter("APPUSER");
        //XmlHelper xmlhelper = new XmlHelper("IEMSSql.xml");
        //string strUserId = (new UPReaderHelper()).GetEncryptUserId(Session["userid"].ToString());
        //object objPriv = db.GetSingleValue(db.GetSQL(xmlhelper.GetSqlString("GetUserPrivByUserId_OrgSta"), strUserId));

        //if (null == objPriv)
        //{
        //    throw new Exception("读取用户权限错误！");
        //}
        //string strPriv = objPriv.ToString();

        //string[] lstPriv = strPriv.Split(new string[] { "&" }, StringSplitOptions.RemoveEmptyEntries);

        //if (1 == lstPriv[0].Length && 1 == lstPriv[1].Length)
        //{
        return "";
        //}
        //else
        //{
        //Response.Write(JsHelper.getJs("location.href=\"Main.aspx" + msg + "\""));
        //}
    }
    public class Result
    {
        public string code;
        public string msg;
        public object data;
    }
}