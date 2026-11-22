import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {JSDOM}=require(path.join(root,'.tooling/conception-render/node_modules/jsdom'));
const dom=new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window=dom.window;globalThis.document=dom.window.document;
const {default:mermaid}=await import(pathToFileURL(path.join(root,'.tooling/conception-render/node_modules/mermaid/dist/mermaid.core.mjs')));
mermaid.initialize({startOnLoad:false,securityLevel:'loose'});
const doc=await fs.readFile(path.join(root,'docs/candidat/05_MAQUETTES_AUDIO_VIDEO.md'),'utf8');
const blocks=[...doc.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)].map(m=>m[1].trim());
if(blocks.length!==2)throw Error('Deux diagrammes attendus');
const names=['01-flux-prise-enregistree','02-dialogue-direct'];
const output=path.join(root,'docs/candidat/diagrammes-medias');await fs.mkdir(output,{recursive:true});
const results=[];
for(let i=0;i<blocks.length;i++){
  const parsed=await mermaid.parse(blocks[i]);
  results.push({name:names[i],valid:Boolean(parsed),type:parsed.diagramType});
  await fs.writeFile(path.join(output,names[i]+'.mmd'),blocks[i]+'\n');
}
await fs.writeFile(path.join(root,'docs/candidat/verification-diagrammes-medias.json'),JSON.stringify({scope:'Syntaxe Mermaid, sans rendu ni validation métier',results},null,2)+'\n');
process.stdout.write(JSON.stringify(results,null,2)+'\n');
