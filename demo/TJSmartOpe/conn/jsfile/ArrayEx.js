// JScript File -- Edit by Gud
if (typeof isArray == "undefined") {
    isArray = function (v) { return Object.prototype.toString.apply(v) === '[object Array]'; }
}

if (!Array.prototype.erase) {
    Array.prototype.erase = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                break;
        }
        if (i != this.length)
            this.splice(i, 1);
    }
}

if (!Array.prototype.insert) {
    Array.prototype.insert = function (index, arr) {
        if (arr.length == 0)
            return;
        if (index > this.length)
            index = this.length;
        var offsets = this.length - index;
        var offset = arr.length;
        var length0 = this.length;
        var length1 = this.length + arr.length;
        for (var i = 0; i < offsets; i++) {
            this[length1 - i - 1] = this[length0 - i - 1];
        }
        for (var i = 0; i < offset; i++) {
            this[index + i] = arr[i];
        }
    }
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                return i;
        }
        return -1;
    }
}

if (!Array.prototype.swap) {
    Array.prototype.swap = function (idx0, idx1) {
        var obj = this[idx0];
        this[idx0] = this[idx1];
        this[idx1] = obj;
    }
}

if (!Array.prototype.find) {
    Array.prototype.find = function (callback) {
        return callback && (this.filter(callback) || [])[0];
    };
}
if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return -1.
            return -1;
        }
    });
}
if (!Array.prototype.search) {
    Array.prototype.search = function (meetfunc) {
        for (var i = 0; i < this.length; i++) {
            if (meetfunc(this[i]))
                return i;
        }
        return -1;
    }
}

if (!Array.prototype.Find) {
    Array.prototype.Find = function (m, s, e) { if (typeof s == "undefined") s = 0; if (typeof e == "undefined") e = this.length - 1; if (s > e) return -1; for (var i = s; i <= e; i++) { if (m(this[i])) return i; } return -1; }
}

if (!Array.prototype.FindLast) {
    Array.prototype.FindLast = function (m, s, e) { if (typeof s == "undefined") s = 0; if (typeof e == "undefined") e = this.length - 1; if (s > e) return -1; for (var i = e; i >= s; i--) { if (m(this[i])) return i; } return -1; }
}

if (!Array.prototype.DoEach) {
    Array.prototype.DoEach = function (d, s, e) { if (typeof s == "undefined") s = 0; if (typeof e == "undefined") e = this.length - 1; if (s > e) return; for (var i = s; i <= e; i++) { d(this[i], i); } }
}

if (!Array.prototype.DoEachRev) {
    Array.prototype.DoEachRev = function (d, s, e) { if (typeof s == "undefined") s = 0; if (typeof e == "undefined") e = this.length - 1; if (s > e) return; for (var i = e; i >= s; i--) { d(this[i], i); } }
}

if (!Array.prototype.InsSkipSame) {
    Array.prototype.InsSkipSame = function (o) { if (this.indexOf(o) < 0) this.push(o); }
}
