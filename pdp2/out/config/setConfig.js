"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPdp2Config = void 0;
const vscode = require("vscode");
const CONFIGS = {
    root: {
        type: "input",
        title: "网站根目录文件夹",
        placeHolder: '请输入网站根目录文件夹',
        key: "pdpConfig.root",
        func: "setByInput"
    },
    // searchCommon: ''
};
function setPdp2Config() {
    const options = {
        placeHolder: '设置pdp2插件config'
    };
    const items = [
        {
            label: 'root',
            description: '网站根目录文件夹'
        },
        {
            label: 'searchCommon',
            description: 'SQL模式名所在xml文件'
        }
    ];
    vscode.window.showQuickPick(items, options).then((value) => {
        if (!value) {
            return;
        }
        if (!value.label)
            return;
        const func = CONFIGS[value.label].func;
        if (!func)
            return;
        const title = CONFIGS[value.label].title;
        const placeHolder = CONFIGS[value.label].placeHolder;
        const key = CONFIGS[value.label].key;
        func(title, placeHolder, key);
    });
}
exports.setPdp2Config = setPdp2Config;
function setByInput(title, placeHolder, key) {
    const inputBox = vscode.window.createInputBox();
    inputBox.title = title;
    inputBox.prompt = placeHolder;
    inputBox.onDidAccept(() => {
        const value = inputBox.value;
        // 更新用户配置
        vscode.workspace.getConfiguration().update(key, value, vscode.ConfigurationTarget.Workspace);
        inputBox.hide();
    });
    inputBox.show();
}
function configureOption2() {
    const option2Config = vscode.workspace.getConfiguration('myPlugin').inspect('option2');
    const checkbox = vscode.window.createInputBox();
    checkbox.title = 'Configure Option 2';
    checkbox.value = option2Config?.workspaceValue ? 'true' : 'false';
    checkbox.ignoreFocusOut = true;
    checkbox.prompt = 'Enable or disable Option 2';
    checkbox.placeholder = 'Enter true or false';
    checkbox.onDidAccept(() => {
        const value = checkbox.value === 'true';
        // 更新用户配置
        vscode.workspace.getConfiguration().update('myPlugin.option2', value, vscode.ConfigurationTarget.Workspace);
        checkbox.hide();
    });
    checkbox.show();
}
//# sourceMappingURL=setConfig.js.map