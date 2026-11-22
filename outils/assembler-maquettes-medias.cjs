const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source='C:/Users/OUOBA/.codex/visualizations/2026/11/20/01a1f789-baf8-7061-83a2-6d905aae83c4/simuemploi-entretiens-medias.html';
const illustrations={};
for(const name of ['preparer','progresser']){
  illustrations[name]={};
  for(const theme of ['clair','sombre'])illustrations[name][theme]='data:image/webp;base64,'+fs.readFileSync(path.join(root,'docs/candidat/illustrations',`${name}-${theme}.webp`)).toString('base64');
}
const script=fs.readFileSync(path.join(root,'maquettes/media-interactions.js'),'utf8').replace('/* MEDIA_ILLUSTRATIONS */','const illustrations='+JSON.stringify(illustrations)+';');
const original=fs.readFileSync(source,'utf8');
const fragment=original.slice(0,original.indexOf('<script>'))+'<script>\n'+script+'</script>\n';
new (require('node:vm').Script)(script);
if(Buffer.byteLength(fragment)>1000000)throw Error('Fragment trop volumineux');
fs.writeFileSync(source,fragment);
fs.writeFileSync(path.join(root,'maquettes/simuemploi-entretiens-medias.fragment.html'),fragment);
process.stdout.write(JSON.stringify({bytes:Buffer.byteLength(fragment),screens:12,modalities:2})+'\n');
