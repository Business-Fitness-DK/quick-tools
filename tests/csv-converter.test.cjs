// Run with: node --test tests/csv-converter.test.cjs
// Execute the actual inline converter script, with a minimal DOM for UI state tests.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup() {
  class Element {
    constructor() {
      this.children = []; this.listeners = {}; this.value = ''; this.textContent = '';
      const classes = new Set();
      this.classList = { add: value => classes.add(value), remove: value => classes.delete(value), contains: value => classes.has(value) };
    }
    addEventListener(name, fn) { this.listeners[name] = fn; }
    appendChild(child) { this.children.push(child); }
    replaceChildren(...children) { this.children = children; this.textContent = ''; }
  }
  const elements = new Map();
  const document = {
    getElementById(id) { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); },
    createElement() { return new Element(); },
  };
  const context = vm.createContext({ document, TextDecoder, Uint8Array, Blob, URL, setTimeout });
  const html = fs.readFileSync(new URL('../tools/csv-converter.html', `file://${__filename}`), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInContext(script, context);
  return {
    run: code => vm.runInContext(code, context),
    call: (name, ...args) => context[name](...args),
    el: id => document.getElementById(id),
    upload: (text, name = 'export.csv') => context.handleFile({ name, size: Buffer.byteLength(text), arrayBuffer: async () => Buffer.from(text) }),
    context,
  };
}
const cells = rows => JSON.parse(JSON.stringify(rows.map(row => row.cells)));

for (const [name, text, delimiter, start] of [
  ['normal semicolons', 'Name;Email\nAnna;anna@example.com', ';', 0],
  ['title and metadata', 'Client report\nExported 2026-10-26\n\nName;Email\nAnna;anna@example.com', ';', 3],
  ['commas in title', 'Report, October, all members\nName;Email\nAnna;a@b.dk\nBo;b@b.dk', ';', 1],
  ['Excel separator directive', '\ufeffsep=;\r\nName;Amount\r\nAnna;12,50', ';', 1],
  ['tabs', 'Members\rName\tEmail\rAnna\ta@b.dk', '\t', 1],
  ['already comma separated', 'Name,Email\nAnna,a@b.dk', ',', 0],
  ['decimal commas', 'Name;Amount\nAnna;12,50\nBo;10,00', ';', 0],
  ['no headers', 'Anna;a@b.dk\nBo;b@b.dk', ';', 0],
]) {
  test(`detects ${name}`, () => {
    const result = setup().call('detectFormat', text);
    assert.equal(result.delimiter, delimiter); assert.equal(result.start, start);
  });
}

test('quoted separators, quotes, multiline cells, trailing empties and Danish text round-trip exactly', () => {
  const app = setup();
  const source = 'Name;Notes;Amount;Empty\r\n"Ægir, Øster";"Use ; here and ""quotes""\r\nnext line";12,50;\r\n';
  const rows = app.call('parseCSV', source, ';');
  assert.deepEqual(cells(rows), [['Name', 'Notes', 'Amount', 'Empty'], ['Ægir, Øster', 'Use ; here and "quotes"\r\nnext line', '12,50', '']]);
  const output = app.call('serializeCSV', rows);
  assert.match(output, /"12,50"/);
  assert.deepEqual(cells(app.call('parseCSV', output, ',')), cells(rows));
});

test('detects quote errors and does not enable a corrupt download', async () => {
  const app = setup();
  await app.upload('Name;Note\nAnna;"not closed');
  assert.equal(app.el('downloadBtn').disabled, true);
  assert.match(app.el('alertArea').children[0].textContent, /not closed/);
  assert.equal(app.run('convertedContent'), '');
  assert.throws(() => app.call('parseCSV', 'Name;Note\nAnna;"a"bad', ';'), /closing quote/);
});

test('extra report row can be removed manually without changing data', async () => {
  const app = setup();
  await app.upload('Member report;October\nName;Email\nAnna;a@b.dk');
  assert.equal(app.el('startRowInput').value, 1);
  app.el('startRowInput').value = '2';
  app.el('startRowInput').listeners.input();
  assert.equal(app.run('convertedContent'), 'Name,Email\r\nAnna,a@b.dk\r\n');
  assert.equal(app.el('downloadBtn').disabled, false);
});

test('inconsistent rows block downloads and report source line', async () => {
  const app = setup();
  await app.upload('Title\nName;Email\nAnna;a@b.dk\nBo;b@b.dk;extra');
  assert.equal(app.el('downloadBtn').disabled, true);
  assert.match(app.el('alertArea').children[0].textContent, /Line 4 has 3 columns/);
  app.el('startRowInput').value = '0'; app.call('processFile');
  assert.equal(app.run('convertedContent'), '');
  assert.match(app.el('alertArea').children[0].textContent, /first row/);
});

test('manual delimiter and row changes recover after a wrong guess', async () => {
  const app = setup();
  await app.upload('Report\nName;Email\nAnna;a@b.dk');
  app.el('delimiterInput').value = ','; app.el('delimiterInput').listeners.change();
  assert.equal(app.el('startRowInput').value, 1);
  app.el('delimiterInput').value = ';'; app.el('delimiterInput').listeners.change();
  assert.equal(app.el('downloadBtn').disabled, true);
  app.el('startRowInput').value = '2'; app.call('processFile');
  assert.equal(app.run('convertedContent'), 'Name,Email\r\nAnna,a@b.dk\r\n');
});

test('empty files fail; uppercase extensions and single columns are supported', async () => {
  const app = setup();
  await app.upload(''); assert.equal(app.el('downloadBtn').disabled, true);
  await app.upload(' \n\n'); assert.equal(app.el('downloadBtn').disabled, true);
  await app.upload('Name\nAnna', 'CLIENT.CSV');
  assert.equal(app.el('downloadBtn').disabled, false);
  assert.equal(app.run('convertedContent'), 'Name\r\nAnna\r\n');
  assert.match(app.el('alertArea').children[0].textContent, /Only one column/);
});

test('UTF-8 BOM, UTF-16 BOMs and Windows-1252 preserve Danish characters', () => {
  const app = setup();
  for (const bytes of [Buffer.from('\ufeffÆØÅ'), Buffer.concat([Buffer.from([255, 254]), Buffer.from('ÆØÅ', 'utf16le')]), Buffer.from([254, 255, 0, 198, 0, 216, 0, 197]), Buffer.from([198, 216, 197])]) {
    assert.equal(app.call('decodeFile', bytes).text, 'ÆØÅ');
  }
  assert.match(app.call('decodeFile', Buffer.from([198])).note, /Windows-1252/);
});

test('blank lines are ignored and multiline source line errors are accurate', async () => {
  const app = setup();
  await app.upload('\nName;Notes\nAnna;"a\nb"\n\nBo;x;extra');
  assert.match(app.el('alertArea').children[0].textContent, /Line 6 has 3 columns/);
  await app.upload('\nName;Email\n\nAnna;a@b.dk\n');
  assert.equal(app.run('convertedContent'), 'Name,Email\r\nAnna,a@b.dk\r\n');
});

test('new uploads and reset invalidate old downloads; unsafe messages are plain text', async () => {
  const app = setup();
  await app.upload('Name;Email\nAnna;a@b.dk');
  await app.upload('ignored', 'file.xlsx');
  assert.equal(app.el('downloadBtn').disabled, true);
  assert.equal(app.run('convertedContent'), '');
  app.call('showAlert', '<img src=x onerror=alert(1)>', 'error');
  assert.equal(app.el('alertArea').children[0].textContent, '<img src=x onerror=alert(1)>');
  app.el('resetBtn').listeners.click();
  assert.equal(app.el('successSection').classList.contains('hidden'), true);
});

test('stale reads cannot overwrite a newer upload', async () => {
  const app = setup();
  let resolve;
  const old = app.call('handleFile', { name: 'old.csv', size: 10, arrayBuffer: () => new Promise(done => { resolve = done; }) });
  await app.upload('Name;Email\nNew;new@b.dk', 'new.csv');
  resolve(Buffer.from('Name;Email\nOld;old@b.dk')); await old;
  assert.equal(app.run('currentFileName'), 'new.csv');
  assert.match(app.run('convertedContent'), /New/);
});

test('oversized files and binary content fail without downloads', async () => {
  const app = setup();
  await app.call('handleFile', { name: 'large.csv', size: 21 * 1024 * 1024 });
  assert.match(app.el('alertArea').children[0].textContent, /20 MB/);
  await app.upload('Name\0Email');
  assert.match(app.el('alertArea').children[0].textContent, /binary/);
  assert.equal(app.el('downloadBtn').disabled, true);
});

test('a narrower multi-column header is retained and flagged, never silently discarded', async () => {
  const app = setup();
  await app.upload('Name;Email\nAnna;a@b.dk;extra\nBo;b@b.dk;extra\nChris;c@b.dk;extra');
  assert.equal(app.el('startRowInput').value, 1);
  assert.equal(app.el('downloadBtn').disabled, true);
  assert.match(app.el('alertArea').children[0].textContent, /Line 2 has 3 columns; the first kept row has 2/);
});

test('a stale failed read cannot replace a newer successful upload with an error', async () => {
  const app = setup();
  let reject;
  const old = app.call('handleFile', { name: 'old.csv', size: 10, arrayBuffer: () => new Promise((_, fail) => { reject = fail; }) });
  await app.upload('Name;Email\nNew;new@b.dk');
  reject(new Error('old file read failed')); await old;
  assert.equal(app.el('downloadBtn').disabled, false);
  assert.doesNotMatch(app.el('alertArea').children[0].textContent, /old file read failed/);
});
