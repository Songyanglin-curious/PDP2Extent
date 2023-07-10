"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalState = void 0;
// GlobalState.ts
class GlobalState {
    constructor() {
        // 定义全局状态变量
        this.isCommont = false;
    }
    static getInstance() {
        if (!GlobalState.instance) {
            GlobalState.instance = new GlobalState();
        }
        return GlobalState.instance;
    }
    // 设置和获取console状态
    setDebug(enabled) {
        this.isCommont = enabled;
    }
    getDebug() {
        return this.isCommont;
    }
}
exports.globalState = GlobalState.getInstance();
//# sourceMappingURL=GlobalState.js.map