import * as vscode from 'vscode';

const API_KEY_SECRET = 'ipgeolocation.apiKey';
const output = vscode.window.createOutputChannel('IPGeolocation');

const IP_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;

export function activate(context: vscode.ExtensionContext) {


  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ipgeolocation-inspector.setApiKey',
      async () => {
        const key = await vscode.window.showInputBox({
          prompt: 'Enter your ipgeolocation.io API key',
          password: true,
          ignoreFocusOut: true
        });

        if (!key) return;

        await context.secrets.store(API_KEY_SECRET, key);
        vscode.window.showInformationMessage('IPGeolocation API key saved securely');
      }
    )
  );


  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ipgeolocation-inspector.inspect',
      async (arg1?: any) => {

        const apiKey = await context.secrets.get(API_KEY_SECRET);
        if (!apiKey) {
          vscode.window.showWarningMessage(
            'API key not set. Run "IPGeolocation: Set API Key".'
          );
          return;
        }

        let ip: string | null = null;

        if (typeof arg1 === 'string') {
          ip = extractIp(arg1);
        }

        if (!ip) {
          const editor = vscode.window.activeTextEditor;

          if (editor) {
            const selectedText = editor.document.getText(editor.selection);
            ip = extractIp(selectedText);

            if (!ip) {
              ip = extractIpAtCursor(editor);
            }
          }
        }

        if (!ip) {
          ip = await vscode.window.showInputBox({
            prompt: 'Enter IP address'
          }) || null;
        }

        if (!ip) {
          vscode.window.showWarningMessage('No valid IP address found');
          return;
        }

        await inspectIp(apiKey, ip.trim());
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ipgeolocation-inspector.inspectClipboard',
      async () => {
        const text = await vscode.env.clipboard.readText();
        const ip = extractIp(text);

        if (!ip) {
          vscode.window.showWarningMessage('Clipboard does not contain a valid IP address');
          return;
        }

        vscode.commands.executeCommand(
          'ipgeolocation-inspector.inspect',
          ip
        );
      }
    )
  );


  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { scheme: '*', language: '*' },
      {
        provideHover(document, position) {
          const range = document.getWordRangeAtPosition(position, IP_REGEX);
          if (!range) return;

          const ip = document.getText(range);
          const md = new vscode.MarkdownString(
            `**IPGeolocation**  \n[Inspect IP](command:ipgeolocation-inspector.inspect?${encodeURIComponent(JSON.stringify([ip]))})`
          );
          md.isTrusted = true;

          return new vscode.Hover(md, range);
        }
      }
    )
  );
}

export function deactivate() {}


async function inspectIp(apiKey: string, ip: string) {

  const config = vscode.workspace.getConfiguration('ipgeolocation');
  const include = config.get<string>('include') || '';
  const fields = config.get<string>('fields') || '';
  const excludes = config.get<string>('excludes') || '';

  const params = new URLSearchParams({ apiKey, ip });
  if (include) params.append('include', include);
  if (fields) params.append('fields', fields);
  if (excludes) params.append('excludes', excludes);

  try {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch(`https://api.ipgeolocation.io/v2/ipgeo?${params.toString()}`);
    const data: any = await res.json();

    if (data.message) {
      vscode.window.showErrorMessage(data.message);
      return;
    }

    output.clear();
    output.appendLine('IP GEOLOCATION INSPECTOR');
    output.appendLine('────────────────────────────────────────────\n');

    const lines: string[] = [];

    renderPrimitive(lines, 'IP Address', data.ip);
    renderPrimitive(lines, 'Hostname', data.hostname);

    renderSection(lines, 'Location', data.location);
    renderSection(lines, 'Country Metadata', data.country_metadata);
    renderSection(lines, 'Network', data.network);
    renderSection(lines, 'Currency', data.currency);
    renderSection(lines, 'Security', data.security);
    renderSection(lines, 'Abuse', data.abuse);
    renderSection(lines, 'Time Zone', data.time_zone);
    renderSection(lines, 'User Agent', data.user_agent);

    output.appendLine(lines.join('\n'));
    output.show(true);

  } catch {
    vscode.window.showErrorMessage('Failed to fetch IPGeolocation data');
  }
}

function extractIp(text?: string): string | null {
  if (!text) return null;
  const match = text.match(IP_REGEX);
  return match ? match[0] : null;
}

function extractIpAtCursor(editor: vscode.TextEditor): string | null {
  const range = editor.document.getWordRangeAtPosition(
    editor.selection.active,
    IP_REGEX
  );
  if (!range) return null;
  return editor.document.getText(range);
}

function renderSection(out: string[], title: string, obj: any) {
  if (!obj || typeof obj !== 'object') return;

  out.push('');
  out.push(title.toUpperCase());
  out.push('────────────────');

  renderObject(out, obj, 2);
}

function renderObject(out: string[], obj: any, indent: number) {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined || value === '') continue;

    const label = prettifyKey(key);

    if (Array.isArray(value)) {
      if (value.length > 0) {
        out.push(`${pad(indent)}${label}: ${value.join(', ')}`);
      }
    } else if (typeof value === 'object') {
      out.push(`${pad(indent)}${label}`);
      renderObject(out, value, indent + 2);
    } else {
      out.push(`${pad(indent)}${label}: ${formatValue(value)}`);
    }
  }
}

function renderPrimitive(out: string[], label: string, value: any) {
  if (value !== undefined && value !== null && value !== '') {
    out.push(`${label}: ${value}`);
  }
}

function pad(n: number) {
  return ' '.repeat(n);
}

function prettifyKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatValue(value: any) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}
