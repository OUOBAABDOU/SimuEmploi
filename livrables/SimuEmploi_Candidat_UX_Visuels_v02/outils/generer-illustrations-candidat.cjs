/* Illustrations originales de conception, sans photographie ni contenu tiers.
 * Les scènes restent éditables ici ; Sharp exporte les sources SVG en WebP.
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/OUOBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const output = path.resolve(__dirname, '../docs/candidat/illustrations');
const palettes = {
  clair: { pale:'#d9ece3', paper:'#fffdf6', green:'#207367', deep:'#254c49', soft:'#9bc9b6', gold:'#e8b969', line:'#8fafaa' },
  sombre: { pale:'#2a4941', paper:'#354e50', green:'#83cfb5', deep:'#c4dfd6', soft:'#40695b', gold:'#d5a65e', line:'#759e95' }
};
const skin = '#a46140', skin2 = '#79503c', hair = '#2b282b';
const ellipse = (cx,cy,rx,ry,fill) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const rect = (x,y,w,h,r,fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const line = (d,color,width=5) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const face = (x,y,color) => `${ellipse(x,y,22,26,color)}${ellipse(x-6,y-3,1.5,2,hair)}${ellipse(x+7,y-3,1.5,2,hair)}${line(`M${x-4} ${y+9}q5 4 10 0`,hair,2)}`;
function plant(p,x=407,y=220) {
  return `${line(`M${x} ${y}V${y-78}`,p.line,4)}<path d="M${x} ${y-32}q-44-1-38-36q33 1 38 36M${x} ${y-49}q40-2 35-33q-30 0-35 33" fill="${p.green}"/>${rect(x-20,y,40,35,8,p.gold)}`;
}
function scene(name,p) {
  const backdrop = `${ellipse(250,154,197,124,p.pale)}${ellipse(249,281,183,10,p.soft)}${ellipse(69,65,14,14,p.gold)}${ellipse(427,89,8,8,p.soft)}`;
  let drawing = '';
  if(name==='preparer') drawing = `${rect(81,179,88,89,12,p.soft)}${rect(102,161,56,76,20,p.green)}${line('M127 229v48m-28 0h57',p.deep,8)}${rect(175,98,70,119,26,p.green)}${rect(194,88,18,24,8,skin)}${face(203,70,skin)}<path d="M180 64q-2-43 24-38q35 0 27 41l-12-17l-15 2l-16-7Z" fill="${hair}"/>${line('M186 135l-16 37l69 4',skin,15)}${line('M230 133l24 34l44 7',skin,15)}${rect(153,202,190,12,6,p.deep)}${rect(173,213,8,67,2,p.line)}${rect(323,213,8,67,2,p.line)}<path d="M233 137h93l-11 63h-91Z" fill="${p.paper}"/>${ellipse(276,166,6,6,p.soft)}${rect(219,198,105,6,3,p.line)}${line('M198 213l-4 59m30-59l22 59',hair,17)}${line('M188 274h22m31 0h21',p.deep,9)}${rect(330,57,64,61,9,p.paper)}${line('M343 72h32m-32 13h24m-24 13h29',p.line,4)}${plant(p)}`;
  if(name==='commerce') drawing = `${rect(88,186,307,77,10,p.soft)}${rect(80,178,323,12,6,p.deep)}${rect(122,119,67,61,21,p.green)}${rect(145,102,17,26,7,skin)}${face(153,86,skin)}<path d="M130 78q-1-38 29-31q25 1 21 34l-16-17l-25 4Z" fill="${hair}"/>${line('M137 141l50 24l42-3',skin,13)}${rect(305,123,58,55,22,p.gold)}${rect(326,106,16,26,7,skin2)}${face(335,90,skin2)}<path d="M312 89q-5-44 27-41q27 2 20 39l-20-21l-22 5Z" fill="${hair}"/>${line('M322 145l-34 17l-23 0',skin2,13)}${rect(217,130,58,47,5,p.gold)}${rect(242,130,8,47,1,p.paper)}${rect(206,51,82,42,14,p.paper)}<path d="M214 85l-8 16l24-12" fill="${p.paper}"/>${line('M226 65h39m-39 12h27',p.line,4)}${plant(p,420,235)}`;
  if(name==='organiser') drawing = `${rect(91,62,124,134,10,p.paper)}${line('M109 85h41m-41 23h77m-77 23h62m-62 23h68m-68 22h38',p.line,5)}${rect(256,119,75,108,23,p.green)}${rect(278,102,19,29,7,skin2)}${face(289,81,skin2)}<path d="M266 72q-7-42 21-35q36-1 29 41l-10-13l-26-11Z" fill="${hair}"/>${line('M273 147l-26 20l-40-2',skin2,14)}${line('M319 146l7 35l-38 5',skin2,14)}${rect(199,132,60,46,5,p.gold)}${line('M263 228l-4 45m51-45l5 45',hair,16)}${line('M248 276h24m36 0h25',p.deep,9)}${rect(84,206,157,11,4,p.deep)}${rect(94,216,8,60,2,p.line)}${rect(223,216,8,60,2,p.line)}${rect(114,185,88,20,4,p.soft)}${rect(122,165,88,18,4,p.gold)}${plant(p,401,239)}`;
  if(name==='progresser') drawing = `${rect(111,172,93,81,13,p.soft)}${rect(155,111,76,97,26,p.green)}${rect(182,96,16,27,7,skin)}${face(190,78,skin)}<path d="M168 75q-6-41 24-39q28-2 24 39l-18-17l-24 3Z" fill="${hair}"/>${line('M173 144l16 32l50-9',skin,14)}${line('M215 141l23 24l28-12',skin,14)}<path d="M223 148l35-8l26 10v41l-28-10l-33 8Z" fill="${p.paper}"/>${line('M257 143v34',p.line,3)}${line('M168 212l-15 62m48-62l14 62',hair,17)}${line('M146 277h23m42 0h25',p.deep,9)}${rect(311,48,87,108,10,p.paper)}${line('M328 67h53m-53 14h37m-34 31l13 13l26-30',p.green,5)}${plant(p,393,239)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><title>SimuEmploi — ${name}</title>${backdrop}${drawing}</svg>`;
}
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const assets=[];
  for(const name of ['preparer','commerce','organiser','progresser']) {
    for(const [theme,palette] of Object.entries(palettes)) {
      const svg=scene(name,palette);
      fs.writeFileSync(path.join(output,`${name}-${theme}.svg`),svg+'\n');
      const result=await sharp(Buffer.from(svg)).webp({quality:86}).toFile(path.join(output,`${name}-${theme}.webp`));
      assets.push({name,theme,file:`${name}-${theme}.webp`,width:result.width,height:result.height,bytes:result.size});
    }
  }
  fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({origin:'Scènes originales dessinées pour les maquettes ; aucune photographie ni génération IA',assets},null,2)+'\n');
  process.stdout.write(JSON.stringify(assets,null,2)+'\n');
})().catch(e=>{process.stderr.write(e.stack+'\n');process.exitCode=1;});
