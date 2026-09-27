// The panel injects `boot` and `ui` (JSON) right before this script. Everything
// here runs against the DOM already parsed at the end of <body>.
const vscode = acquireVsCodeApi();
const $ = id => document.getElementById(id);
const state = vscode.getState() || {};

$('pattern').value = state.pattern ?? '';
$('flags').value = state.flags ?? 'g';
$('text').value = state.text ?? boot.sample;
$('replacement').value = state.replacement ?? '';

function persist() {
  vscode.setState({
    pattern: $('pattern').value,
    flags: $('flags').value,
    text: $('text').value,
    replacement: $('replacement').value,
  });
}

function fillSelect(select, values, labeler) {
  select.innerHTML = '<option value="">—</option>';
  values.forEach((value, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = labeler(value);
    select.appendChild(option);
  });
}
function renderHistory() { fillSelect($('history'), boot.history, p => p); }
function renderSaved() { fillSelect($('saved'), boot.saved, s => s.name); }

let timer;
function sendTest() {
  persist();
  vscode.postMessage({ type: 'test', pattern: $('pattern').value, flags: $('flags').value, text: $('text').value });
}
function schedule() { clearTimeout(timer); timer = setTimeout(sendTest, 200); }
['pattern', 'flags', 'text', 'replacement'].forEach(id => $(id).addEventListener('input', () => { persist(); schedule(); }));

$('history').addEventListener('change', () => {
  const item = boot.history[Number($('history').value)];
  if (!item) return;
  $('pattern').value = item;
  sendTest();
});
$('saved').addEventListener('change', () => {
  const item = boot.saved[Number($('saved').value)];
  if (!item) return;
  $('pattern').value = item.pattern;
  $('flags').value = item.flags;
  sendTest();
});
$('save').addEventListener('click', () => {
  const name = $('saveName').value.trim() || $('pattern').value;
  vscode.postMessage({ type: 'save', name, pattern: $('pattern').value, flags: $('flags').value });
});
$('deleteSaved').addEventListener('click', () => {
  const item = boot.saved[Number($('saved').value)];
  if (item) vscode.postMessage({ type: 'deleteSaved', name: item.name });
});
$('preview').addEventListener('click', () => {
  vscode.postMessage({ type: 'replace', pattern: $('pattern').value, flags: $('flags').value,
    text: $('text').value, replacement: $('replacement').value });
});
$('apply').addEventListener('click', () => {
  vscode.postMessage({ type: 'apply', pattern: $('pattern').value, flags: $('flags').value,
    replacement: $('replacement').value });
});
$('copy').addEventListener('click', () => {
  vscode.postMessage({ type: 'copy', text: $('text').value });
});

let activeMatch = -1;
function focusMatch(delta) {
  const marks = document.querySelectorAll('#highlights mark');
  if (marks.length === 0) return;
  marks.forEach(m => m.classList.remove('active'));
  activeMatch = (activeMatch + delta + marks.length) % marks.length;
  const target = marks[activeMatch];
  target.classList.add('active');
  target.scrollIntoView({ block: 'center' });
}
$('next').addEventListener('click', () => focusMatch(1));
$('previous').addEventListener('click', () => focusMatch(-1));

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    sendTest();
  }
});

window.addEventListener('message', event => {
  const message = event.data;
  if (message.type === 'result') {
    const result = $('result');
    const highlights = $('highlights');
    highlights.innerHTML = '';
    activeMatch = -1;
    if (message.error) { result.className = 'error'; result.textContent = message.error; return; }
    const matches = message.matches || [];
    result.className = 'muted';
    result.textContent = ui.matches.replace('{0}', matches.length);
    let last = 0;
    const source = $('text').value;
    for (const match of matches) {
      highlights.appendChild(document.createTextNode(source.slice(last, match.index)));
      const mark = document.createElement('mark');
      mark.textContent = match.match;
      const named = match.namedGroups && Object.keys(match.namedGroups).length
        ? ' ' + Object.entries(match.namedGroups).map(([k, v]) => k + '=' + v).join(', ')
        : '';
      if (named) mark.title = named.trim();
      highlights.appendChild(mark);
      last = match.index + match.match.length;
    }
    highlights.appendChild(document.createTextNode(source.slice(last)));
  } else if (message.type === 'replaceResult') {
    const result = $('result');
    result.className = message.error ? 'error' : 'muted';
    result.textContent = message.error ? message.error : ui.replaced.replace('{0}', message.count);
    $('text').value = message.result;
    persist();
  } else if (message.type === 'copied') {
    const result = $('result');
    result.className = 'muted';
    result.textContent = ui.copied;
  } else if (message.type === 'history') {
    boot.history = message.history;
    renderHistory();
  } else if (message.type === 'saved') {
    boot.saved = message.saved;
    renderSaved();
  }
});
renderHistory();
renderSaved();
sendTest();
