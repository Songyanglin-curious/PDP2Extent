/*v=1.20.1126.1*/
var MapData = {
    _sData: null,
    _lData: null,
    create: function () {
        return {
            _data: {},
            _exist: function (item) {
                for (var app in this._data) {
                    var items = this._data[app];
                    for (var i = 0; i < items.length; i++) {
                        var itemi = items[i];
                        if (this.same(item, itemi))
                            return true;
                    }
                }
                return false;
            },
            _removeExist: function (items) {
                var ret = [];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (this._exist(item))
                        continue;
                    ret.push(item);
                }
                return ret;
            },
            same: function (item1, item2) { return item1 == item2; },
            add: function (app, items) {
                var ret = this._removeExist(items);
                this._data[app] = items;
                return ret;
            },
            remove: function (app) {
                var items = this._data[app];
                if (!items)
                    return [];
                delete this._data[app];
                return this._removeExist(items);
            },
            clear: function (app) {
                delete this._data[app];
            },
            all: function () {
                var ret = [];
                for (var app in this._data) {
                    var items = this._data[app];
                    for (var i = 0; i < items.length; i++) {
                        ret.push(items[i]);
                    }
                }
                return ret;
            }
        };
    },
    init: function () {
        if (!this._sData) {
            this._sData = MapData.create();
            this._sData.same = function (item1, item2) {
                return item1.ID == item2.ID;
            };
        }
        if (!this._lData) {
            this._lData = MapData.create();
            this._lData.same = function (item1, item2) {
                return item1.ID == item2.ID;
            };
        }
    }
}
MapData.init();