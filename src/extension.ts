import * as vscode from 'vscode';

// configration docs
// https://code.visualstudio.com/api/references/contribution-points#contributes.configuration

const myCommandId = 'csv-map-viewer.show';

let myStatusBarItem: vscode.StatusBarItem;
let extentionsSettingsMapObject: any;
let enableUpdateStatusBarItem = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const extentionsSettings = vscode.workspace.getConfiguration('csv-map-viewer');
	extentionsSettingsMapObject = extentionsSettings.get<any>('map');

	let disposable = vscode.commands.registerCommand(myCommandId, () => {
		setUpdateStatusBarItem(true);
		const info = getCsvInformationByCursor(vscode.window.activeTextEditor);
		if (info) {
			vscode.window.showInformationMessage(`$(info) [${info.title ?? ''}] ${info.description ?? ''}`);
		} else {
			console.log('Not found CSV MAP information');
		}
	});
	context.subscriptions.push(disposable);

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	myStatusBarItem.command = myCommandId;
	context.subscriptions.push(myStatusBarItem);

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => setUpdateStatusBarItem(false)));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
}

// this method is called when your extension is deactivated
export function deactivate() {}

function setUpdateStatusBarItem(enable: boolean): void {
	enableUpdateStatusBarItem = enable;
	if (!enable) {
		myStatusBarItem.hide();
	}
}

function updateStatusBarItem(): void {
	if (!enableUpdateStatusBarItem) {
		return;
	}
	const info = getCsvInformationByCursor(vscode.window.activeTextEditor);
	if (info) {
		myStatusBarItem.text = `$(info) ${info.title}`;
		myStatusBarItem.show();
	} else {
		myStatusBarItem.hide();
	}
}

function getCsvInformationByCursor(editor: vscode.TextEditor | undefined): { title: string, description: string } | undefined {
	if (!editor?.selection.isEmpty) {
		return undefined;
	}
	const position = editor?.selection.active;
	const currentTextLine = editor.document.lineAt(position.line);
	const currentCsvPosition = getCsvPosition(currentTextLine, position);

	if (!extentionsSettingsMapObject) {
		return undefined;
	}
	const csvRowInformation = extentionsSettingsMapObject[currentCsvPosition.firstColumnTextAtLine];
	if (!csvRowInformation) {
		return undefined;
	}
	return csvRowInformation[currentCsvPosition.csvColumnIndex.toString()];
}

function getCsvPosition(lineText: vscode.TextLine, position: vscode.Position): { firstColumnTextAtLine: string, csvColumnIndex: number } {
	const csvColumnIndex = lineText.text.substring(0, position.character).match(/,/g)?.length ?? 0;
	let firstColumnTextAtLine = lineText.text;
	if (lineText.text.indexOf(',') >= 0) {
		firstColumnTextAtLine = lineText.text.substring(0, lineText.text.indexOf(','));
	}
	return {
		firstColumnTextAtLine: firstColumnTextAtLine,
		csvColumnIndex: csvColumnIndex,
	};
}