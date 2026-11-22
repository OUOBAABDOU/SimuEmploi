// Diagnostic limité de l'archive, sans caméra, réseau ni fournisseur d'IA.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..', 'projet-source');
const audio = fs.readFileSync(path.join(root, 'src/hooks/useRealtimeAudio.ts'), 'utf8');
const line = audio.split(/\r?\n/).find(s => s.includes('const regex = new RegExp'));
const expression = line.match(/new RegExp\((.*), "gi"\)/)[1];
const pattern = vm.runInNewContext(`new RegExp(${expression}, "gi").source`, { filler: 'euh' }, { timeout: 100 });
const regex = new RegExp(pattern, 'gi');
const text = 'euh je cherche un emploi euh';
const sourceMetrics = (words, elapsedMs) => Math.max(90, Math.min(190, words * (60000 / Math.max(1, elapsedMs))));
const results = {
  scope: 'Exemples calculés à partir des expressions du code; aucun test de navigateur ou appel IA.',
  fillerWords: { sourceLine: line.trim(), regexSource: pattern, input: text, expectedOccurrences: 2, actualOccurrences: (text.match(regex) || []).length },
  wpmExamples: { noWords: sourceMetrics(0, 60000), fourWordsArrivingTogetherAfter10ms: sourceMetrics(4, 10), fourWordsAfter60s: sourceMetrics(4, 60000) },
  audioRecording: { cameraRequestAudio: false, recorderInput: 'videoStream', consequence: 'Le flux enregistré ne comporte pas de piste microphone dans ce parcours.' },
};
process.stdout.write(JSON.stringify(results, null, 2) + '\n');
