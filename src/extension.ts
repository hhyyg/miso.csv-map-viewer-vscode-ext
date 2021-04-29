import { stringify } from 'node:querystring';
import * as vscode from 'vscode';

// configration docs
// https://code.visualstudio.com/api/references/contribution-points#contributes.configuration

const myCommandId_show = 'csv-map-viewer.show';
const myCommandId_output = 'csv-map-viewer.output';

let outputChannel: vscode.OutputChannel;
let myStatusBarItem: vscode.StatusBarItem;
let extentionsSettingsMapObject: any;
let enableUpdateStatusBarItem = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const extentionsSettings = vscode.workspace.getConfiguration('csv-map-viewer');
	extentionsSettingsMapObject = extentionsSettings.get<any>('map');
	outputChannel = vscode.window.createOutputChannel('CSV Map Viewer');

	context.subscriptions.push(vscode.commands.registerCommand(myCommandId_show, showInformationMessageCommand));
	context.subscriptions.push(vscode.commands.registerCommand(myCommandId_output, commandCsvMapToOutputWindow));

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	myStatusBarItem.command = myCommandId_show;
	context.subscriptions.push(myStatusBarItem);

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => setUpdateStatusBarItem(false)));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
}

// this method is called when your extension is deactivated
export function deactivate() {}

function showInformationMessageCommand(): void {
	setUpdateStatusBarItem(true);
	const info = getCsvInformationByCursor(vscode.window.activeTextEditor);
	if (info) {
		vscode.window.showInformationMessage(`[${info.title ?? ''}] ${info.description ?? ''}`);
	} else {
		console.log('Not found CSV MAP information');
	}
}

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
	const forwardColumnLength = lineText.text.substring(0, position.character).match(/,/g)?.length;
	const csvColumnIndex = forwardColumnLength ? forwardColumnLength : 0;
	let firstColumnTextAtLine = lineText.text;
	if (lineText.text.indexOf(',') >= 0) {
		firstColumnTextAtLine = lineText.text.substring(0, lineText.text.indexOf(','));
	}
	return {
		firstColumnTextAtLine: firstColumnTextAtLine,
		csvColumnIndex: csvColumnIndex,
	};
}

function commandCsvMapToOutputWindow(): void {
    outputChannel.appendLine('💻 Output');

	if (!extentionsSettingsMapObject) {
		return;
	}
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	const text = editor?.document.getText();
	if (!text) {
		return;
	}

	const results: {
		title: string,
		value: string,
	}[] = [];

	for (let lineIndex = 0; lineIndex < editor.document.lineCount; lineIndex++) {
		const textLine = editor.document.lineAt(lineIndex);
		const columns = textLine.text.split(',');
		if (columns.length === 0) {
			continue;
		}

		const rowMapInfo = extentionsSettingsMapObject[columns[0]];
		if (!rowMapInfo) {
			continue;
		}
		for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
			const mapInfo = rowMapInfo[columnIndex];
			if (!mapInfo) {
				continue;
			}
			results.push({ title: mapInfo.title, value: columns[columnIndex] });
		}
	}

	for (const item of results) {
		outputChannel.appendLine(`${item.title}: ${item.value}`);
	}
}