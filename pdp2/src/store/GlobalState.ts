// GlobalState.ts
class GlobalState {
    private static instance: GlobalState;

    // 定义全局状态变量
    private isCommont: boolean = false;

    private constructor() { }

    public static getInstance(): GlobalState {
        if (!GlobalState.instance) {
            GlobalState.instance = new GlobalState();
        }
        return GlobalState.instance;
    }

    // 设置和获取console状态
    public setDebug(enabled: boolean): void {
        this.isCommont = enabled;
    }

    public getDebug(): boolean {
        return this.isCommont;
    }
}

export const globalState = GlobalState.getInstance();