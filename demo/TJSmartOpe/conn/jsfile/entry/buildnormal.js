var sf_mess_tween = {
	init: function () {
		var mbBody = sf_mess_lib.getElement(SF_MESS_BODY_ID);
		this.min = 0;
		this.max = mbBody.offsetHeight;
	},
	initTween: function () {
		if (!sf_mess_tween.initHeight) {
			sf_mess_tween.initHeight = 1;
		}
		var mbBody = sf_mess_lib.getElement(SF_MESS_BODY_ID);
		mbBody.style.display = '';
		mbBody.style.height = sf_mess_tween.initHeight + 'px';
		sf_mess_tween.initHeight += 2;
		if (window.attachEvent && (!sf_mess_browser.higherThanIE6 || sf_mess_browser.onQuirkMode) && (!window.opera)) {
			sf_mess_layout.fixMessageBoardPosition();
		}

		if (sf_mess_tween.initHeight > sf_mess_tween.max) {
			sf_mess_lib.getElement(SF_MESS_HEAD_ID).onclick = function (e) {sf_mess_tween.doTween();};
			sf_mess_lib.getElement(SF_MESS_HEAD_ICON_ID).className = SF_MESS_ICON_CLOSE_CLASS;
		} else {
			setTimeout(sf_mess_tween.initTween, 0);
		}
	},
	duration: 30,
	easeIn: function (step, duration) {
		return Math.pow(step/duration, 2);
	},
	easeOut: function (step, duration) {
		var c = step/duration;
		return -c * (c - 2);
	},
	doTween: function () {
		var from, to;
		var mbBody = sf_mess_lib.getElement(SF_MESS_BODY_ID);
		if (mbBody.style.display == 'none') {
			from = this.min;
			to = this.max;
		} else {
			from = this.max;
			to = this.min;
		}

		var step = 0, chg = to - from;
		function fixPosition() {
			if (window.attachEvent && (!sf_mess_browser.higherThanIE6 || sf_mess_browser.onQuirkMode) && (!window.opera)) {
				sf_mess_layout.fixMessageBoardPosition();
			}
		}
		function doTweenStep () {
			var offset = sf_mess_tween.easeIn(step++, sf_mess_tween.duration);
			var hei = from + Math.floor(chg * offset);
			if (hei > 0) {
				mbBody.style.height = hei + 'px';
				mbBody.style.display = '';
			} else {
				mbBody.style.display = 'none';
			}
			
			if (step > sf_mess_tween.duration) {
				clearInterval(interval);
				sf_mess_lib.getElement(SF_MESS_HEAD_ICON_ID).className = mbBody.style.display == 'none' ? SF_MESS_ICON_OPEN_CLASS : SF_MESS_ICON_CLOSE_CLASS;
			}
			fixPosition();
		}
		var interval = setInterval(doTweenStep, 10);
	}
}

var sf_mess_layout = {
	module: null,
	getModule: function () {
		return sf_mess_layout_mod.join('');
	},

	createLayout: function () {
		document.write(this.getModule().replace(/\$\{[.\w]+\}/g, this.__layoutVarReplacer));
		this.mbWrap = sf_mess_lib.getElement(SF_MESS_WRAP_ID);
	},
	
	__layoutVarReplacer: function (str) {
		if (str.indexOf('$') == 0) {
			try {
				return eval(str.substr(2, str.length - 3));
			} catch(e) {
				return '';
			}
		}
		return str;
	},
	
	initFormStyle: function() {
		var mbBody = sf_mess_lib.getElement(SF_MESS_BODY_ID);
		sf_mess_tween.init();
		
		mbBody.style.overflow = 'hidden';
		mbBody.style.display = 'none';
		this.mbWrap.style.top = document.documentElement.clientHeight - this.mbWrap.clientHeight + 'px';
		
	
		if (window.addEventListener || sf_mess_browser.higherThanIE6 && (!sf_mess_browser.onQuirkMode)) {
			this.mbWrap.style.top = '';
			this.mbWrap.style.bottom = '0';
			this.mbWrap.style.position = 'fixed';
		} else {
			window.attachEvent('onscroll', this.fixMessageBoardPosition);
			window.attachEvent('onresize', this.fixMessageBoardPosition);
			this.fixMessageBoardPosition();
		}

		sf_mess_tween.initTween();
	},
	
	fixMessageBoardPosition: function () {
		var self = sf_mess_layout;
		var page = document.body;
		if (!sf_mess_browser.onQuirkMode) {
			page = page.parentNode;
		}
		self.mbWrap.style.top = parseInt(page.clientHeight) + parseInt(page.scrollTop) - self.mbWrap.offsetHeight + 'px';
	}
}

sf_mess_layout.createLayout();
setTimeout(function(){sf_mess_layout.initFormStyle();}, 10);