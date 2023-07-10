var sf_mess_lib = {
	loadCss: function (url) {
		var css = document.createElement('link');
		css.setAttribute('rel', 'stylesheet');
		css.setAttribute('type', 'text/css');
		css.setAttribute('href', url);
		document.getElementsByTagName('head')[0].appendChild(css);
	},
	
	getElement: function (id) {
		return document.getElementById(id);
	}
}

var sf_mess_browser = {};
sf_mess_browser.ieVersion = /msie (\d+)/.exec(navigator.userAgent.toLowerCase());
sf_mess_browser.higherThanIE6 = sf_mess_browser.ieVersion && parseInt(sf_mess_browser.ieVersion[1]) > 6;
sf_mess_browser.onQuirkMode = document.compatMode && document.compatMode.indexOf('Back') == 0;

if(sf_mess_browser.ieVersion && !(sf_mess_browser.higherThanIE6)) {
	document.execCommand("BackgroundImageCache", false, true);
}
var SF_MESS_WRAP_ID 			= "SfMessWrap";
var SF_MESS_HEAD_ID 			= "SfMessHead";
var SF_MESS_TITLE_ID			= "SfMessTitle";
var SF_MESS_HEAD_ICON_ID 		= "SfMessHeadIcon";
var SF_MESS_BODY_ID 			= "SfMessBody";
var SF_MESS_BODY_TOP_ID 		= "SfMessBodyTop";
var SF_MESS_BODY_MID_ID 		= "SfMessBodyMid";
var SF_MESS_BODY_BOTTOM_ID 		= "SfMessBodyBottom";
var SF_MESS_BODY_FOOT_ID 		= "SfMessBodyFoot"
var SF_MESS_TIP_CLASS 			= "SfMessTip";
var SF_MESS_ICON_OPEN_CLASS		= "SfMessIconOpen";
var SF_MESS_ICON_CLOSE_CLASS	= "SfMessIconClose";
var SF_MESS_PREFIX 				= "SfMess_";

var SF_MESS_THEME_PATH = '';

var sf_mess_layout_mod = [];
sf_mess_layout_mod.push('<div id="${SF_MESS_WRAP_ID}" style="top:1000px;right:0">',
'<form style="margin:0;" method="post">',
	'<div id="${SF_MESS_HEAD_ID}">',
		'<div id="${SF_MESS_TITLE_ID}">${sf_mess_cfg.title}</div>',
		'<div class="${SF_MESS_ICON_OPEN_CLASS}" id="${SF_MESS_HEAD_ICON_ID}"></div>',
	'</div>',
	'<div id="${SF_MESS_BODY_ID}">${sf_mess_cfg.body}</div>',
		'<div id="${SF_MESS_BODY_FOOT_ID}"></div>',
	'<input type="hidden" name="ownerid" value="${owner}"></div>',
'</form>',
'</div>');

var sf_mess_validate = {
	mustValidate: function (name, defaultValue) {
		var colValue = document.getElementById(SF_MESS_PREFIX + name).value.replace(/(^\s*)|(\s*$)/g, "");
		if (colValue.length <= 0 || 
			colValue == filtInnertip(defaultValue)) {
			return false;
		}
		return true;
	},
	messValidate: function () {
		var messVal = document[SF_MESS_FORM_NAME].getElementsByTagName('textarea')[0].value;
		var len = messVal.length;
		for (var i = 0, l = len; i < l; i++) {
			if (messVal.charCodeAt(i) > 127)
				len ++;
		}
		return len <= 2000;
	}
}

function filtInnertip (str) {
	return str.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&");
}

sf_mess_lib.loadCss('/conn/jsfile/entry/blue/style.css');
document.write('<script type="text/javascript" src="/conn/jsfile/entry/buildnormal.js"></script>');
