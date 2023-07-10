var RichStringAdapte = {
    richString: function (_str, _type) {
        var s = { str: _str, type: _type || 0 }; return s;
    },
    adapte: function (str1, str2) {
        var maker = (function StringDiffMaker() {
            return {
                difference: function (s1, e1, s2, e2) {
                    var diff = { m_nStart: [0, 0], m_nEnd: [0, 0],
                        copy: function (src) {
                            for (var i = 0; i < 2; i++) {
                                this.m_nStart[i] = src.m_nStart[i];
                                this.m_nEnd[i] = src.m_nEnd[i];
                            }
                        },
                        setStartPos: function (nStrIndex, nPos) {
                            this.m_nStart[nStrIndex] = nPos;
                        },
                        setEndPos: function (nStrIndex, nPos) {
                            this.m_nEnd[nStrIndex] = nPos;
                        },
                        getStartPos: function (nStrIndex) {
                            return this.m_nStart[nStrIndex];
                        },
                        getEndPos: function (nStrIndex) {
                            return this.m_nEnd[nStrIndex];
                        }
                    };
                    if (s1 > e1) e1 = s1 - 1;
                    if (s2 > e2) e2 = s2 - 1;
                    diff.m_nStart[0] = s1;
                    diff.m_nStart[1] = s2;
                    diff.m_nEnd[0] = e1;
                    diff.m_nEnd[1] = e2;
                    return diff;
                },
                word: function (s, e) { return [s, e]; },
                wstart: function (w) { return w[0]; },
                wend: function (w) { return w[1]; },
                wlength: function (w) { return this.wend(w) + 1 - this.wstart(w); },
                m_pstr: ["", ""],
                m_words: [[], []],
                m_diffs: [],
                m_pDiffs: null,
                init: function (str1, str2) {
                    this.m_pstr[0] = str1;
                    this.m_pstr[1] = str2;
                    this.m_pDiffs = null;
                },
                getDiff: function () {
                    if (null == this.m_pDiffs) {
                        this.buildWordDiffList();
                        this.populateDiffs();
                    }
                    return this.m_pDiffs;
                },
                buildWordsArray: function (str, wdArray) {
                    wdArray.length = 0;
                    for (var i = 0; i < str.length; i++) {
                        wdArray.push(this.word(i, i));
                    }
                },
                buildWordDiffList: function () {
                    this.buildWordsArray(this.m_pstr[0], this.m_words[0]);
                    this.buildWordsArray(this.m_pstr[1], this.m_words[1]);
                    var w1 = { value: 0 }, w2 = { value: 0 };
                    for (; (w1.value != this.m_words[0].length) && (w2.value != this.m_words[1].length); ) {
                        this.getDiffFrom(w1, w2);
                    }
                    this.getLastDiff(w1, w2);
                },
                populateDiffs: function () {
                    this.m_pDiffs = [];
                    for (var i = 0; i < this.m_diffs.length; ++i) {
                        if (i + 1 < this.m_diffs.length) {
                            if (this.m_diffs[i].getEndPos(0) == this.m_diffs[i + 1].getStartPos(0)
                        && m_diffs[i].getEndPos(1) == this.m_diffs[i + 1].getStartPos(1)) {
                                this.m_diffs[i + 1].setStartPos(0, this.m_diffs[i].getStartPos(0));
                                this.m_diffs[i + 1].setStartPos(1, this.m_diffs[i].getStartPos(1));
                                continue;
                            }
                        }
                        this.m_pDiffs.push(this.m_diffs[i]);
                    }
                },
                findSync: function (w1, w2) {
                    var cw2 = this.moveToNextMatchWord(w1, 0, w2);
                    var cw1 = this.moveToNextMatchWord(w2, 1, w1);
                    if (cw1 < 0)//str1中没有m_words[1][w2]
                    {
                        if (cw2 < 0)//str2中没有m_words[1][w1]
                            return false;
                        w2.value = cw2;
                        return true;
                    }
                    if (cw2 < 0) {
                        w1.value = cw1;
                        return true;
                    }
                    if (this.wend(this.m_words[0][cw1]) - this.wstart(this.m_words[0][w1.value]) < this.wend(this.m_words[1][cw2]) - this.wstart(this.m_words[1][w2.value]))
                        w1.value = cw1;
                    else
                        w2.value = cw2;
                    return true;
                },
                getNextPos: function (wdarray, nIndex) {
                    return (nIndex >= 0) ? this.wend(wdarray[nIndex]) + 1 : 0;
                },
                getDiffFrom: function (w1, w2) {
                    if (this.areWordsSame(this.m_words[0][w1.value], 0, this.m_words[1][w2.value], 1))//当前单词是相同的，移到下一对
                    {
                        ++w1.value;
                        ++w2.value;
                        return;
                    }
                    var bw1 = w1.value;
                    var bw2 = w2.value;
                    var bFindNextSame = this.findSync(w1, w2); //找到下一对相同的单词，这两对之间就是不同的部分
                    var e1, e2;
                    if (bFindNextSame)//有下一对单词
                    {
                        e1 = this.wstart(this.m_words[0][w1.value]) - 1;
                        e2 = this.wstart(this.m_words[1][w2.value]) - 1;
                        ++w1.value;
                        ++w2.value;
                    }
                    else//没有下一对单词
                    {
                        e1 = this.wend(this.m_words[0][this.m_words[0].length - 1]);
                        e2 = this.wend(this.m_words[1][this.m_words[1].length - 1]);
                        w1.value = this.m_words[0].length;
                        w2.value = this.m_words[1].length;
                    }
                    this.m_diffs.push(this.difference(this.wstart(this.m_words[0][bw1]), e1, this.wstart(this.m_words[1][bw2]), e2));
                },
                getLastDiff: function (w1, w2) {
                    var i1 = this.getNextPos(this.m_words[0], w1.value - 1); // after end of word before w1
                    var i2 = this.getNextPos(this.m_words[1], w2.value - 1); // after end of word before w2
                    // Done, but handle trailing spaces
                    if (i1 != this.m_pstr[0].length || i2 != this.m_pstr[1].length) {
                        this.m_diffs.push(this.difference(i1, this.m_pstr[0].length - 1, i2, this.m_pstr[1].length - 1));
                    }
                },
                findNextMatchInWords: function (wd, nArray, nStartPos) {
                    var nOtherArray = 1 - nArray;
                    while (nStartPos < this.m_words[nOtherArray].length) {
                        if (this.areWordsSame(this.m_words[nOtherArray][nStartPos], nOtherArray, wd, nArray))
                            return nStartPos;
                        ++nStartPos;
                    }
                    return -1;
                },
                getSubstring: function (nStringIndex, start, length) {
                    return this.m_pstr[nStringIndex].substring(start, start + length);
                },
                areWordsSame: function (wd1, nArray1, wd2, nArray2) {
                    if (this.wlength(wd1) != this.wlength(wd2))
                        return false;
                    return this.getSubstring(nArray1, this.wstart(wd1), this.wlength(wd1)) == this.getSubstring(nArray2, this.wstart(wd2), this.wlength(wd2));
                },
                moveToNextMatchWord: function (w, nArray, wAnother) {
                    var cw = -1;
                    while (w.value < this.m_words[nArray].length) {
                        cw = this.findNextMatchInWords(this.m_words[nArray][w.value], nArray, wAnother.value);
                        if (cw >= 0)
                            break;
                        ++w.value;
                    }
                    return cw;
                }
            }
        })();
        maker.init(str1, str2);
        var vcDiff = maker.getDiff();
        var vcStr = [];
        var nStartIndex = 0;
        for (var i = 0; i < vcDiff.length; i++) {
            var diff = vcDiff[i];
            if (diff.getStartPos(0) > nStartIndex) {
                vcStr.push(this.richString(str1.substring(nStartIndex, diff.getStartPos(0))));
            }
            if (diff.getStartPos(0) <= diff.getEndPos(0)) {
                var str = this.richString(str1.substring(diff.getStartPos(0), diff.getEndPos(0) + 1), 1);
                vcStr.push(str);
            }
            if (diff.getStartPos(1) <= diff.getEndPos(1)) {
                var str = this.richString(str2.substring(diff.getStartPos(1), diff.getEndPos(1) + 1), 2);
                vcStr.push(str);
            }
            nStartIndex = diff.getEndPos(0) + 1;
        }
        if (nStartIndex < str1.length) {
            vcStr.push(this.richString(str1.substring(nStartIndex, str1.length)));
        }
        return vcStr;
    }
}