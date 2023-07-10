//txt 控件名
//arrstr 数据源字符串
//splitstr 分隔符
//IsPinYin 是否要拼音首字母索引,bool，空为不要（数据大时客户端比较卡）

function Getdivtxt(txt, arrstr, splitstr, IsPinYin, nonestr,selectfunc) {
    if (!nonestr) {
        nonestr = '#';
    }
    (autoComplete = {
        pop_len: 10,
        pop_cn: 'autoDis',
        hover_cn: 'cur',
        source: arrstr.split(splitstr),
        sourcepy: GetArrPinYin(arrstr.split(splitstr), nonestr),
        init: function () {
            this.setDom();
            return this;
        },
        bind: function (x) {
            if (x.getAttribute('type') != 'text' || x.nodeName != 'INPUT')
                return null;
            var self = this;
            x.onkeyup = function (e) {
                e = e || window.event;
                var hidText = document.getElementById(this.id.replace("txt", "hid"));
                var lis = self.pop.getElementsByTagName('li'), lens = self.pop.getElementsByTagName('li').length, n = lens, temp;
                if (e.keyCode == 38) { //键盘up键被按下 
                    if (self.pop.style.display != 'none') {
                        for (var i = 0; i < lens; i++) { //遍历结果数据，判断是否被选中 
                            if (lis[i].className)
                                temp = i;
                            else
                                n--;
                        }
                        if (n == 0) { //如果没有被选中的li元素，则选中最后一个 
                            lis[lens - 1].className = self.hover_cn;
                            this.value = SetDepTxtValues(lis[lens - 1]);
                            hidText.value = SetDepHidValues(lis[lens - 1]);
                        } else { //如果有被选中的元素，则选择上一个元素并赋值给input 
                            if (lis[temp] == lis[0]) { //如果选中的元素是第一个孩子节点则跳到最后一个选中 
                                lis[lens - 1].className = self.hover_cn;
                                this.value = SetDepTxtValues(lis[lens - 1]);
                                hidText.value = SetDepHidValues(lis[lens - 1]);
                                lis[temp].className = '';
                            } else {
                                lis[temp - 1].className = self.hover_cn;
                                this.value = SetDepTxtValues(lis[lens - 1]);
                                hidText.value = SetDepHidValues(lis[lens - 1]);
                                lis[temp].className = '';
                            }
                        }
                    } else //如果弹出层没有显示则执行插入操作，并显示弹出层 
                        self.insert(this);
                } else if (e.keyCode == 40) { //down键被按下，原理同up键 
                    if (self.pop.style.display != 'none') {
                        for (var i = 0; i < lens; i++) {
                            if (lis[i].className)
                                temp = i;
                            else
                                n--;
                        }
                        if (n == 0) {
                            lis[0].className = self.hover_cn;
                            this.value = SetDepTxtValues(lis[0]);
                            hidText.value = SetDepHidValues(lis[0]);
                        } else {
                            if (lis[temp] == lis[lens - 1]) {
                                lis[0].className = self.hover_cn;
                                this.value = SetDepTxtValues(lis[0]);
                                hidText.value = SetDepHidValues(lis[0]);
                                lis[temp].className = '';
                            } else {
                                lis[temp + 1].className = self.hover_cn;
                                this.value = SetDepTxtValues(lis[temp + 1]);
                                hidText.value = SetDepHidValues(lis[temp + 1]);
                                lis[temp].className = '';
                            }
                        }
                    } else
                        self.insert(this);
                } else //如果按下的键既不是up又不是down那么直接去匹配数据并插入 
                    self.insert(this);
            };
            x.onblur = function () { //这个延迟处理是因为如果失去焦点的时候是点击选中数据的时候会发现先无法触发点击事件 
                setTimeout(function () { self.pop.style.display = 'none'; }, 300);
            };
            return this;
        },
        setDom: function () {
            var self = this;
            var dom = document.createElement('div'), frame = document.createElement('iframe'), ul = document.createElement('ul');
            document.body.appendChild(dom);
            with (frame) { //用来在ie6下遮住select元素 
                setAttribute('frameborder', '0');
                setAttribute('scrolling', 'no');
                style.cssText = 'z-index:-1;position:absolute;left:0;top:0;visibility: inherit;height:100%;',
                style.filter = "progid:dximagetransform.microsoft.alpha(style=0,opacity=0)"
            }
            with (dom) { //对弹出层li元素绑定onmouseover，onmouseover 
                className = this.pop_cn;
                appendChild(frame);
                ul.style.borderStyle = "solid";
                ul.style.borderColor = "#D4D0C8";
                ul.style.borderWidth = "1px";
                appendChild(ul);
                onmouseover = function (e) { //在li元素还没有加载的时候就绑定这个方法，通过判断target是否是li元素进行处理 
                    e = e || window.event;
                    var target = e.srcElement || e.target;
                    if (target.tagName == 'LI') { //添加样式前先把所有的li样式去掉，这里用的是一种偷懒的方式，没有单独写removeClass方法 
                        for (var i = 0, lis = self.pop.getElementsByTagName('li'); i < lis.length; i++)
                            lis[i].className = '';
                        target.className = self.hover_cn; //也没有写addClass方法，直接赋值了 
                    }
                };
                onmouseout = function (e) {
                    e = e || window.event;
                    var target = e.srcElement || e.target;
                    if (target.tagName == 'LI')
                        target.className = '';
                };
            }
            this.pop = dom;
        },
        insert: function (self) {
            var bak = [], baks = [], s, li = [], left = 0, top = 0, val = self.value;
            if (val.length == 0) {
                for (var i = 0, leng = this.source.length; i < leng; i++) { //判断input的数据是否与数据源里的数据一致 
                    var arr = this.source[i].split(nonestr);
                    var itemText = arr[0];
                    var itemKey = (arr.length > 1) ? arr[1] : arr[0];
                    bak.push(itemText + "<span style='display:none'>" + itemKey + "</span>");
                    baks.push(itemText);
                }
            }
            else {
                for (var i = 0, leng = this.source.length; i < leng; i++) { //判断input的数据是否与数据源里的数据一致 
                    if (!!val && val.length <= this.source[i].length) {
                        if (IsPinYin) {
                            if ((this.sourcepy[i].substr(0, val.length).toLowerCase() == val.toLowerCase()) || (this.source[i].substr(0, val.length).toLowerCase() == val.toLowerCase())) {
                                bak.push(this.source[i].split(nonestr)[0] + "<span style='display:none'>" + this.source[i].split(nonestr)[1] + "</span>");
                                baks.push(this.source[i].split(nonestr)[0]);
                            }
                        }
                        else {
                            if (this.source[i].substr(0, val.length).toLowerCase() == val.toLowerCase()) {
                                bak.push(this.source[i].split(nonestr)[0] + "<span style='display:none'>" + this.source[i].split(nonestr)[1] + "</span>");
                                baks.push(this.source[i].split(nonestr)[0]);
                            }
                        }
                    }
                }
            }
            this.pop.scrollTop = 0;
            if (bak.length == 0) { //如果没有匹配的数据则隐藏弹出层 
                this.pop.style.display = 'none';
                return false;
            } //这个弹出层定位方法之前也是用循环offsetParent，但发现ie跟ff下差别很大（可能是使用方式不当），所以改用这个getBoundingClientRect 
            left = self.getBoundingClientRect().left + document.documentElement.scrollLeft;
            top = self.getBoundingClientRect().top + document.documentElement.scrollTop + self.offsetHeight;
            with (this.pop) {
                style.cssText = 'width:' + self.offsetWidth + 'px;' + 'position:absolute;left:' + left + 'px;top:' + top + 'px;display:none;';
                getElementsByTagName('iframe')[0].setAttribute('width', self.offsetWidth);
                getElementsByTagName('iframe')[0].style.height = (28 * (autoComplete.source + "").split(',').length) + "px";
                onclick = function (e) {
                    e = e || window.event;
                    e.cancelBubble = true;
                    var target = e.srcElement || e.target;
                    if (target.tagName == 'LI') {
                        self.value = SetDepTxtValues(target);
                        document.getElementById(self.id.replace("txt", "hid")).value = SetDepHidValues(target);
                        self.focus();
                        self.select();
                    }
                    this.style.display = 'none';
                    if (selectfunc)
                        selectfunc();
                };
            }
            s = bak.length; // bak.length > this.pop_len ? this.pop_len : bak.length;
            for (var i = 0; i < s; i++)
                li.push('<li title="' + baks[i] + '">' + bak[i] + '</li>');
            this.pop.getElementsByTagName('ul')[0].innerHTML = li.join('');
            this.pop.style.display = 'block';
            this.pop.style.height = ((s > 10 ? 10 : s) * 25) + 'px';
            this.pop.style.overflowY = s > 10 ? 'scroll' : '';
        }
    }).init().bind(document.getElementById(txt));
}
function SetDepTxtValues(lis) {
    return lis.innerHTML.substring(0, lis.innerHTML.indexOf('<'));
}
function SetDepHidValues(lis) {
    return lis.getElementsByTagName("span")[0].innerText;
}
//汉字取拼音
var HanziToPinyin = new function () {
    this.key = "吖哎安肮凹八挀扳邦勹陂奔伻皀边灬憋汃冫癶峬嚓偲参仓撡冊嵾噌叉犲辿伥抄车抻阷吃充抽出膗巛刅吹旾踔呲从凑粗汆镩蹿崔邨搓咑呆丹当刀恴揼灯仾嗲敁刁爹丁丟东吺剢耑叾吨多妸奀鞥仒发帆匚飞分丰覅仏垺夫旮侅干冈皋戈给根更工勾估瓜乖关光归丨呙妎咍兯夯茠诃黒拫亨乊叿齁乎花怀欢巟灰昏吙丌加戋江艽阶巾坕冂丩凥姢噘军咔开刊忼尻匼肎劥空廤扝夸蒯宽匡亏坤扩垃来兰啷捞仂雷塄唎俩嫾簗蹽咧厸伶溜咯龙娄噜驴孪掠抡捋嘸妈埋颟牤猫庅呅椚掹踎宀喵乜民名谬摸哞某母拏腉囡囔孬疒娞嫩莻妮拈娘鸟捏脌宁妞农羺奴女疟奻硸噢妑拍眅乓抛呸喷匉丕片剽氕姘乒钋剖仆七掐千呛悄切亲靑宆丘区峑炔夋亽呥穣荛惹人扔日戎厹嶿堧桵闰挼仨毢三桒掻色杀筛山伤弰奢申升尸収书刷衰闩双谁妁厶忪凁苏狻夊孙唆他囼坍汤仐忑膯剔天旫怗厅囲偷凸湍推吞乇屲歪乛尣危塭翁挝乌夕呷仙乡灱些忄兴凶休戌吅疶坃丫咽央幺倻膶一乚应哟佣优扜囦曰蒀帀災兂牂傮啫贼怎曽吒夈沾张佋蜇贞凧之中州朱抓拽专妆隹宒卓仔孖宗邹租劗厜尊昨".split("");
    this.pinyin = "AAiAnAngAoBaBaiBanBangBaoBeiBenBengBiBianBiaoBieBinBingBoBuCaCaiCanCangCaoCeCenCengChaChaiChanChangChaoCheChenChengChiChongChouChuChuaiChuanChuangChuiChunChuoCiCongCouCuCuanChuanCuanCuiCunCuoDaDaiDanDangDaoDeDenDengDiDiaDianDiaoDieDingDiuDongDouDuDuanDuiDunDuoEEnEngErFaFanFangFeiFenFengFiaoFoFouFuGaGaiGanGangGaoGeGeiGenGengGongGouGuGuaGuaiGuanGuangGuiGunGuoHaHaiHanHangHaoHeHeiHenHengHoHongHouHuHuaHuaiHuanHuangHuiHunHuoJiJiaJianJiangJiaoJieJinJingJiongJiuJuJuanJueJunKaKaiKanKangKaoKeKenKengKongKouKuKuaKuaiKuanKuangKuiKunKuoLaLaiLanLangLaoLeLeiLengLiLiaLianLiangLiaoLieLinLingLiuLoLongLouLuLvLuanLveLunLuoMMaMaiManMangMaoMeMeiMenMengMiMianMiaoMieMinMingMiuMoMouMeiMuNaNaiNanNangNaoNeNeiNenNNiNianNiangNiaoNieNinNingNiuNongNouNuNvNveNuanNuoOuPaPaiPanPangPaoPeiPenPengPiPianPiaoPiePinPingPoPouPuQiQiaQianQiangQiaoQieQinQingQiongQiuQuQuanQueQunRaRanRangRaoReRenRengRiRongRouRuRuanRuiRunRuoSaSaiSanSangSaoSeShaShaiShanShangShaoSheShenShengShiShouShuShuaShuaiShuanShuangShuiShuoSiSongSouSuSuanSuiSunSuoTaTaiTanTangTaoTeTengTiTianTiaoTieTingTongTouTuTuanTuiTunTuoWaWaiWanWangWeiWenWengWoWuXiXiaXianXiangXiaoXieXinXingXiongXiuXuXuanXueXunYaYanYangYaoYeYenYiYinYingYoYongYouYuYuanYueYunZaZaiZanZangZaoZeZeiZenZengZhaZhaiZhanZhangZhaoZheZhenZhengZhiZhongZhouZhuZhuaZhuaiZhuanZhuangZhuiZhunZhuoZaiZiZongZouZuZuanZuiZunZuo".split(/(?=[A-Z])/g);
    this.cache = {};
    this.tree = [];
    this.walk = function (a, b) {
        var c = Math.floor((a + b) / 2);
        if (c == b && b < a) {
            this.tree.push("r='", this.pinyin[c], "';");
            return;
        }
        this.tree.push("if(w.localeCompare('", this.key[c], "')<0)");
        this.walk(a, c - 1);
        this.tree.push("else ");
        this.walk(c + 1, b);
    }
    this.Create = function () {
        this.tree.push("var r=HanziToPinyin.cache[w];if(r) return r;");      //检查缓存  
        this.walk(0, this.key.length - 1);                              //-递归生成源码  
        this.tree.push("return HanziToPinyin.cache[w]=r;");                //-写入缓存  
        return new Function("w", this.tree.join(""));    //编译  
    }
}

var cov = HanziToPinyin.Create();
//汉字的首拼音字母和字符串对比，bool
function GetPinYin(val, str_) {

    var str = "";
    if (/^[\u4e00-\u9fa5]{0,}$/.test(str_)) {
        for (var i = 0; i < str_.length; i++) {
            str += cov(str_.substr(i, 1)).substr(0, 1);
        }
        if (str.toLowerCase() == val) {
            return true;
        }
        return false;
    }
    return false;
}
//返回数组中汉字的首字母
function GetArrPinYin(arr_, nonestr) {
    var arrpy = new Array();
    for (var i = 0; i < arr_.length; i++) {
        if (/^[\u4e00-\u9fa5]{0,}$/.test(arr_[i].split(nonestr)[0])) {
            arrpy.push(GetPinYinStr(arr_[i].split(nonestr)[0]));
        }
        else {
            arrpy.push(arr_[i]);
        }
    }
    return arrpy;
}

//汉字字符串转首字母字符串
function GetPinYinStr(str_) {
    var str = '';
    for (var i = 0; i < str_.length; i++) {
        str += cov(str_.substr(i, 1)).substr(0, 1);
    }
    return str.toLowerCase();
}