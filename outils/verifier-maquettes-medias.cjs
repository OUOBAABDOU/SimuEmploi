const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/OUOBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const source='C:/Users/OUOBA/.codex/visualizations/2026/11/20/01a1f789-baf8-7061-83a2-6d905aae83c4/simuemploi-entretiens-medias.html';
let browser;
(async()=>{
  const fragment=fs.readFileSync(source,'utf8');
  assert(!/\b(getUserMedia|fetch)\s*\(|\bnew\s+(MediaRecorder|WebSocket|XMLHttpRequest)\b/.test(fragment),'La maquette ne doit pas capturer ni transmettre des médias');
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page=await browser.newPage({viewport:{width:1024,height:1100}});
  page.setDefaultTimeout(6000);
  const errors=[],network=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
  await page.setContent(fragment);
  await page.addStyleTag({content:'body{margin:0;color-scheme:light;}[hidden]{display:none!important;}'});
  const settle=()=>page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
  const show=async id=>{await page.evaluate(id=>document.querySelectorAll('[data-variant]').forEach(s=>{s.hidden=!s.querySelector('#'+id);}),id);await settle();};
  const screens=await page.locator('#sm-screen option').evaluateAll(nodes=>nodes.map(n=>n.value));
  assert.equal(screens.length,12);
  const layouts=[];
  for(const width of [320,360,736,1024]){
    await page.setViewportSize({width,height:1100});
    for(const id of ['sm-audio','sm-video']){
      await show(id);
      for(const screen of screens){
        await page.selectOption('#sm-screen',screen);await settle();
        const box=await page.locator('#'+id).evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,page:document.documentElement.clientWidth,pageScroll:document.documentElement.scrollWidth}));
        assert(box.scroll<=box.width+1&&box.pageScroll<=box.page+1,`Débordement ${id}/${screen}/${width}`);
        assert.equal(await page.locator('#'+id+' h1').count(),1,`Titre principal ${id}/${screen}`);
        assert(await page.locator('#'+id+' img').evaluateAll(nodes=>nodes.every(img=>img.complete&&img.naturalWidth>0&&img.hasAttribute('alt'))));
        layouts.push({width,id,screen});
      }
    }
  }
  await page.setViewportSize({width:1024,height:1100});
  for(const id of ['sm-audio','sm-video']){
    await show(id);const app=page.locator('#'+id);
    await page.selectOption('#sm-screen','prepare');
    await app.locator('[data-field="workflow"][value="turns"]').check();
    await app.locator('[data-action="go:setup"]').click();
    await page.selectOption('#sm-situation','permission-denied');
    await app.locator('[data-action="permission"]').click();
    assert(await app.locator('[data-action="begin"]').isDisabled());
    assert.match(await app.innerText(),/refusé/);
    await page.selectOption('#sm-situation','normal');
    await app.locator('[data-action="permission"]').click();
    await app.locator('[data-action="test"]').click();
    await app.locator('[data-action="begin"]').click();
    assert.match(await app.innerText(),/Écoutez ou lisez la question/);
    await app.locator('[data-action="listen"]').click();
    assert.match(await app.innerText(),/aucun son émis/);
    await app.locator('[data-action="go:record"]').click();
    await app.locator('[data-action="start-record"]').click();
    await page.waitForTimeout(1100);
    assert.notEqual(await app.locator('[data-duration]').innerText(),'0:00');
    await app.locator('[data-action="pause-record"]').click();
    const pausedTime=await app.locator('[data-duration]').innerText();await page.waitForTimeout(1100);
    assert.equal(await app.locator('[data-duration]').innerText(),pausedTime);
    await app.locator('[data-action="pause-record"]').click();
    await app.locator('[data-action="stop-record"]').click();
    await app.locator('[data-action="send"]').click();
    assert.match(await app.innerText(),/autorisation d’envoi/);
    await app.locator('[data-field="sendConsent"]').check();
    if(id==='sm-video')assert.equal(await app.locator('[data-field="sendVideo"]').isChecked(),false,'Vidéo non envoyée par défaut');
    await page.selectOption('#sm-situation','offline');
    await app.locator('[data-action="send"]').click();
    assert.match(await app.innerText(),/pas encore confirmé/);
    await app.locator('[data-action="retry-upload"]').click();
    await app.locator('[data-action="edit-transcript"]').waitFor();
    assert.equal(await app.locator('textarea').getAttribute('readonly'),'');
    await app.locator('[data-action="edit-transcript"]').click();
    await app.locator('textarea').fill('Je décris une expérience scolaire réelle et les actions que j’ai réalisées.');
    await app.locator('[data-action="edit-transcript"]').click();
    assert.equal(await app.locator('textarea').getAttribute('readonly'),'');
    assert.match(await app.innerText(),/Version de démonstration 2/);
    await app.locator('[data-action="analyze"]').click();
    assert.match(await app.innerText(),/Votre saisie n’est pas analysée/);
    await page.selectOption('#sm-situation','analysis-failed');
    await app.locator('[data-action="retry-analysis"]').click();
    await app.locator('[data-action="next"]').click();
    assert.match(await app.innerText(),/Question 2 sur 5/i);
    await page.selectOption('#sm-screen','review');
    await app.locator('[data-action="play"]').click();await page.waitForTimeout(1100);
    assert.match(await app.locator('[data-playtime]').innerText(),/0:01/);
    await app.locator('[data-action="play"]').click();
    await app.locator('[data-action="redo"]').click();
    await app.locator('[data-action="cancel-redo"]').click();
    assert.equal(await app.locator('[role="alertdialog"]').count(),0);
    await app.locator('[data-action="redo"]').click();await app.locator('[data-action="confirm-redo"]').click();
    assert.match(await app.innerText(),/Enregistrez votre réponse/);
    await page.selectOption('#sm-screen','prepare');
    await app.locator('[data-field="workflow"][value="live"]').check();
    await app.locator('[data-action="go:setup"]').click();
    await app.locator('[data-action="permission"]').click();await app.locator('[data-action="test"]').click();
    await app.locator('[data-action="begin"]').click();
    assert.match(await app.innerText(),/autorisez la transmission/);
    await app.locator('[data-field="liveConsent"]').check();
    assert.equal(await app.locator('[data-field="keepReplay"]').isChecked(),false);
    await app.locator('[data-action="begin"]').click();
    await app.locator('[data-action="mute"]').click();await app.locator('[data-action="turn"]').click();
    assert.match(await app.innerText(),/microphone est coupé/);
    await app.locator('[data-action="mute"]').click();await app.locator('[data-action="turn"]').click();
    assert.match(await app.innerText(),/À vous de répondre/);
    await app.locator('[data-action="next-live"]').click();
    assert.match(await app.innerText(),/Question 3 sur 5/i);
    await app.locator('[data-action="captions"]').click();
    assert(!/Sous-titres d’exemple/.test(await app.innerText()));
    await app.locator('[data-action="pause-live"]').click();
    assert.match(await app.innerText(),/Entretien en pause/);
    await app.locator('[data-action="resume-live"]').click();
    await page.selectOption('#sm-situation','offline');
    await app.locator('[data-action="fallback-turns"]').click();
    assert.match(await app.innerText(),/Question 3 sur 5/i);
    await page.selectOption('#sm-screen','live');await page.selectOption('#sm-situation','normal');
    await app.locator('[data-action="end-live"]').click();await app.locator('[data-action="cancel-end"]').click();
    assert.equal(await app.locator('[data-action="end-live"]').evaluate(el=>el===document.activeElement),true);
    await app.locator('[data-action="end-live"]').click();await app.locator('[data-action="confirm-end"]').click();
    assert.match(await app.innerText(),/Replay non conservé/);
    if(id==='sm-video'){
      await page.selectOption('#sm-screen','setup');await page.selectOption('#sm-situation','no-camera');
      assert(await app.locator('[data-action="begin"]').isDisabled());
      await app.locator('[data-action="fallback-audio"]').click();
      assert.match(await app.innerText(),/Audio · solution de secours/);
      assert.equal(await app.locator('.sm-camera').count(),0);
    }
    await page.selectOption('#sm-screen','text');
    await app.locator('[data-field="textAnswer"]').fill('Dans mon projet scolaire, j’ai organisé les tâches puis vérifié le résultat avec mon équipe.');
    await app.locator('[data-action="submit-text"]').click();
    assert.match(await app.innerText(),/aucun média ni texte transmis/);
  }
  const states=[];await page.setViewportSize({width:320,height:1100});
  for(const id of ['sm-audio','sm-video']){
    await show(id);
    for(const situation of ['permission-denied','no-mic','no-camera','noisy','offline','slow','upload-failed','processing','analysis-failed','partial']){
      await page.selectOption('#sm-situation',situation);
      for(const screen of ['setup','review','transfer','transcript','feedback','report','live']){
        await page.selectOption('#sm-screen',screen);await settle();
        assert(await page.locator('#'+id).evaluate(el=>el.scrollWidth<=el.clientWidth+1),`État débordant ${id}/${screen}/${situation}`);
        states.push({id,screen,situation,width:320});
      }
    }
  }
  const output=path.join(root,'docs/candidat/visuels-medias');fs.mkdirSync(output,{recursive:true});
  const captures=[
    {name:'audio-reglages-desktop',id:'sm-audio',screen:'setup',width:1024},
    {name:'video-reglages-desktop',id:'sm-video',screen:'setup',width:1024},
    {name:'audio-enregistrement-mobile',id:'sm-audio',screen:'record',width:360},
    {name:'video-enregistrement-desktop',id:'sm-video',screen:'record',width:1024},
    {name:'video-relecture-mobile',id:'sm-video',screen:'review',width:360},
    {name:'audio-direct-desktop',id:'sm-audio',screen:'live',width:1024},
    {name:'video-direct-desktop',id:'sm-video',screen:'live',width:1024},
    {name:'video-coupure-mobile',id:'sm-video',screen:'live',width:360,situation:'offline'}
  ];
  for(const c of captures){
    await page.setViewportSize({width:c.width,height:1100});await show(c.id);await page.selectOption('#sm-screen',c.screen);await page.selectOption('#sm-situation',c.situation||'normal');await settle();
    await page.locator('#'+c.id).screenshot({path:path.join(output,c.name+'.png')});
  }
  await page.emulateMedia({colorScheme:'dark'});await page.addStyleTag({content:'body{color-scheme:dark;}'});await page.setViewportSize({width:1024,height:1100});await page.selectOption('#sm-screen','live');await page.selectOption('#sm-situation','normal');await settle();
  await page.locator('#sm-video').screenshot({path:path.join(output,'video-direct-sombre.png')});
  assert.equal(errors.length,0,errors.join('\n'));assert.equal(network.length,0,'Aucun appel réseau attendu');
  const result={nature:'Maquettes uniquement ; aucun microphone, caméra, fichier réel ou fournisseur IA',screens:screens.length,modalities:2,layoutChecks:layouts.length,degradedStateChecks:states.length,widths:[320,360,736,1024],browserErrors:errors,networkRequests:network.length,interactions:['permission refusée et test simulé','enregistrement/pause/arrêt','consentement avant envoi','vidéo non transmise par défaut','envoi interrompu/reprise simulée','correction/version de transcription','échec analyse','nouvelle question','relecture et confirmation de remplacement','consentement dialogue direct','micro coupé et interruption du coach','sous-titres','pause et bascule après coupure','fin avec confirmation et focus','caméra absente vers audio','solution texte'],screenshots:[...captures.map(c=>c.name+'.png'),'video-direct-sombre.png']};
  fs.writeFileSync(path.join(root,'docs/candidat/verification-maquettes-medias.json'),JSON.stringify(result,null,2)+'\n');
  await browser.close();process.stdout.write(JSON.stringify(result,null,2)+'\n');
})().catch(async e=>{if(browser)await browser.close();process.stderr.write(e.stack+'\n');process.exitCode=1;});
