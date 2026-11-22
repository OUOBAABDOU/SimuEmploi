fetch('/video-chapters.json').then(response => {
  if (!response.ok) throw new Error('chapters');
  return response.json();
}).then(chapters => {
  const group = document.getElementById('chapter-navigation');
  chapters.forEach(chapter => {
    const button = document.createElement('button');
    const m = Math.floor(chapter.start / 60), s = Math.floor(chapter.start % 60);
    button.type = 'button'; button.className = 'button secondary';
    button.textContent = `${m}:${String(s).padStart(2, '0')} · ${chapter.title}`;
    button.onclick = () => {
      const video = document.getElementById('explainer-video');
      video.currentTime = chapter.start;
      video.play().catch(() => { document.getElementById('video-status').textContent = 'Appuyez sur Lecture pour continuer.'; });
    };
    group.append(button);
  });
}).catch(() => { document.getElementById('video-status').textContent = 'Vous pouvez parcourir la vidéo avec la barre du lecteur.'; });
