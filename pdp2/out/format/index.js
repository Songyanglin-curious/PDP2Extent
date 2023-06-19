"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.designFormat = void 0;
const cssformat_1 = require("./cssformat");
const jsformat_1 = require("./jsformat");
function designFormat() {
    (0, jsformat_1.default)();
    (0, cssformat_1.default)();
}
exports.designFormat = designFormat;
//# sourceMappingURL=index.js.map