const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const source = 'C:/Users/OUOBA/.codex/visualizations/2026/11/20/01a1f789-baf8-7061-83a2-6d905aae83c4/simuemploi-candidat.html';
const illustrations = {};
for(const name of ['preparer','commerce','organiser','progresser']) {
  illustrations[name]={};
  for(const theme of ['clair','sombre']) {
    illustrations[name][theme]='data:image/webp;base64,'+fs.readFileSync(path.join(root,'docs/candidat/illustrations',`${name}-${theme}.webp`)).toString('base64');
  }
}
const current = fs.readFileSync(source,'utf8');
const script = fs.readFileSync(path.join(root,'maquettes/candidat-interactions.js'),'utf8').replace('/* ILLUSTRATION_DATA */','const illustrations = '+JSON.stringify(illustrations)+';');
const fragment = current.slice(0,current.indexOf('<script>'))+'<script>\n'+script+'</script>\n';
if(Buffer.byteLength(fragment)>1000000)throw Error('Fragment trop volumineux');
fs.writeFileSync(source,fragment);
fs.writeFileSync(path.join(root,'maquettes/simuemploi-candidat.fragment.html'),fragment);
process.stdout.write(JSON.stringify({bytes:Buffer.byteLength(fragment),illustrations:8})+'\n');
