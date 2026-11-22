# Vidéo de démonstration SimuEmploi — version 1

Montage des captures d’interactions réellement réalisées dans la démonstration S0, avec narration synthétique française, sous-titres intégrés et chapitres. La vidéo est explicative : elle ne représente pas un essai candidat ni un service IA opérationnel.

Le fichier final est `livrables/SimuEmploi_Demonstration_Commentee_v01.mp4`. Il est accessible hors ligne après téléchargement. Depuis le portail actif, ouvrir `/video` pour le lecteur et `/video-demo.mp4?download=true` pour le téléchargement. Le tunnel conserve ses limites de disponibilité.

**Export vérifié :** 6 min 19 s, 1920 × 1080, H.264/AAC, environ 6,96 Mo. Voix synthétique française Microsoft Hortense, 21 scènes et 61 blocs de sous-titres. Le MP4 a été intégralement décodé ; les images de contrôle sont regroupées dans `verification-montage.jpg`. Le lecteur Web charge la vidéo, démarre la lecture et change de chapitre sans erreur média. Les 14 tests du serveur passent, dont la lecture partielle HTTP, le téléchargement et les fichiers internes non exposés.

Les chapitres sont proposés par les boutons du lecteur Web, avec leurs titres dans le montage : découverte à 0:00, application actuelle à 0:37, parcours candidat à 1:45, audio/vidéo à 4:01, essai à 4:35, accès à distance à 5:37, conclusion à 5:58.

## Sources modifiables

- `scenario.json` : titres, messages et texte de narration de chaque scène.
- `narration.md` : transcription française lisible et modifiable.
- `captures/` : images des étapes réellement ouvertes, avec uniquement des données fictives.
- `narration.ps1` : voix française locale Windows, sans API vocale distante.
- `monter_video.py` : habillage, transitions, sous-titres, montage audio et encodage MP4.
- `sous-titres.srt` et `sous-titres.vtt` : texte complet, synchronisé à partir de la narration et des durées audio.
- `montage.json` : durées et début des scènes, caractéristiques de l’export.
- `chapitres.json` : index utilisé par les boutons de navigation du lecteur Web.

Les sous-titres sont découpés en phrases courtes. Leurs timings sont répartis sur les durées de narration ; ils ne proviennent pas d’un alignement phonétique mot par mot. Le montage utilise des captures et des transitions, sans prétendre être un enregistrement continu de l’écran.

Après modification du serveur de démonstration, `application/restart-demo-server.ps1` relance uniquement son processus enregistré et conserve le tunnel actif. Les PID, chemins et heures de démarrage sont contrôlés avant arrêt. Le script n’est pas nécessaire pour regarder ou télécharger la vidéo déjà disponible.

## Reproduire le montage sur Windows

Depuis la racine du projet, avec Python/Pillow, une voix Windows française disponible et `imageio-ffmpeg==0.6.0` installé dans `.tooling/video/python` :

```powershell
.\application\demo\video\narration.ps1 -OutputDirectory '.tooling/video/audio'
python .\application\demo\video\monter_video.py
```

Le runtime Python livré avec Codex dispose déjà de Pillow. Les fichiers audio, encodages intermédiaires, journaux et export de formulaire synthétique sont dans `.tooling/video`, hors Git. Les exemples de la vidéo ne sont jamais copiés dans `preuves-humaines.json`.
