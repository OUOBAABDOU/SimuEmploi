from pathlib import Path
from datetime import datetime
import json, re, zipfile, hashlib, unicodedata
from xml.sax.saxutils import escape
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import letter
from contenu import ROOT, all_sprints

OUT=ROOT/'livrables/SimuEmploi_Sprints_Word_v01'
QA=ROOT/'outils/sprints-word/qa'
OUT.mkdir(parents=True,exist_ok=True)
QA.mkdir(parents=True,exist_ok=True)
REV={'D1':'D2','D2':'D3','D3':'D4','D4':'D5','D5':'D1'}
ROLE={'D1':'Identité compte et autorisations','D2':'Catalogue sessions et orchestration métier','D3':'Évaluation transcription et traitements','D4':'Expérience utilisateur rapports et parcours','D5':'Données livraison et exploitation'}
SOURCES=[
'docs/candidat/02_SPRINTS_CINQ_DEVELOPPEURS.md',
'docs/candidat/06_LOTS_AUDIO_VIDEO_CINQ_DEVELOPPEURS.md',
'docs/candidat/01_MAQUETTES_ET_PARCOURS.md',
'docs/candidat/03_MODULES_ET_CONTRATS.md',
'docs/candidat/04_AJUSTEMENTS_UX_ET_VISUELS.md',
'docs/candidat/05_MAQUETTES_AUDIO_VIDEO.md',
'docs/conception/07_REVUE_ET_PRECISIONS_AVANT_DEVELOPPEMENT.md',
'docs/conception/04_PLAN_ETUDE_ET_VALIDATION.md',
'docs/CAHIER_DES_CHARGES_REVISE.md']

def clean_heading(s):
    return re.sub(r'\s+',' ',re.sub(r'[^\w\s]',' ',s)).strip()
def slug(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode('ascii')
    return re.sub(r'[^a-zA-Z0-9]+','_',s).strip('_')
def b(kind,text=None,**kw):
    return dict(kind=kind,text=text,**kw)
def p(t): return b('p',t)
def h(t): return b('h',clean_heading(t))
def sub(t): return b('sub',clean_heading(t))
def table(headers,rows,widths): return b('table',headers=headers,rows=rows,widths=widths)
def label(t,v): return p(t+' : '+v)
def bullet(t): return b('bullet',t)

def implementation_note(task,s,d,index):
    t=task.lower()
    if s['code']=='S0':
        return ['Décrire le parcours nominal et les erreurs, puis faire relire les règles par le responsable concerné. Conserver exemples et décisions dans le dépôt de conception.',
                'Produire une spécification courte avec données minimales, états, limites et responsabilités. Marquer chaque point encore à décider avec un responsable.',
                'Relier les livrables aux écrans et contrats concernés. Les relire avec les autres développeurs avant de chiffrer le travail de S1.'][index%3]
    if any(x in t for x in ['tester','test ','éprouver','recette','mesurer','observer','corpus','relire']):
        return 'Préparer les données autorisées et le protocole avant exécution. Noter versions, cas observés, résultat attendu, résultat obtenu et limites ; toute anomalie devient un ticket avec responsable.'
    if any(x in t for x in ['contrat','modél','modèl','migrat','données','registre','snapshot','versions']):
        return 'Écrire les invariants et les exemples valides ou invalides, puis réaliser modèle, contrat et migration utiles. Vérifier concurrence, propriété et compatibilité avec les données déjà présentes.'
    if any(x in t for x in ['écran','interface','capture','lecteur','formulaire','composant','maquette','navigation','aide']):
        return 'Partir du parcours reçu, réutiliser les composants communs et brancher les états du serveur. Vérifier mobile, clavier, erreurs et reprise ; une confirmation visuelle exige un état réel.'
    if any(x in t for x in ['fournisseur','worker','adaptateur','asr','dialogue','analyse','outbox','broker']):
        return 'Isoler la dépendance derrière son contrat, appliquer délais et tentatives bornés, puis contrôler entrée, droits et version avant tout résultat. Tester une panne et une sortie invalide avec effet métier vérifié.'
    return 'Décomposer cette tâche en petites tranches de 0,5 à 2 jours, fixer contrat et données d’essai, puis livrer une tranche frontend et backend intégrée. Vérifier le cas nominal et au moins un échec pertinent avant revue.'

def developer_page(s,d,pk):
    prefix=s['code']+'-'+d
    parts=[h(prefix+' '+pk['title']),
           label('Responsable','[Nom à renseigner] — '+d),
           label('Revue principale',REV[d]+' [Nom à renseigner] ; ajouter revue données ou métier lorsque nécessaire.'),
           p('Vous réalisez une tranche complète de votre périmètre : règle métier, contrat, données utiles, interface concernée et vérifications. La continuité du rôle facilite la coordination ; elle ne réserve personne au frontend ou au backend.'),
           sub('Travail à réaliser')]
    tasks=pk['tasks']
    for i,t in enumerate(tasks):
        parts.append(b('task',f'{prefix}-T{i+1:02d}  {t}'))
        parts.append(p(implementation_note(t,s,d,i)))
    tid=f'{prefix}-T{len(tasks)+1:02d}'
    parts.extend([b('task',tid+'  Vérifier intégrer et remettre le paquet'),
                  p('Écrire les tests significatifs de votre tranche, intégrer avant la revue de fin et corriger les défauts bloquants. Remettre lien de PR, preuve de démonstration, contrats ou migrations changés et limites connues. D5 ne prend pas en charge les tests des quatre autres développeurs.'),
                  sub('Critère de réception du paquet'),p(pk['accept']),
                  sub('Dépendances et coordination'),p(pk['dependencies']),
                  label('Charge','Hypothèse initiale 5 à 7 jours-personne pour ce paquet, vérifications comprises. Estimation équipe [___] ; disponibilité [___] ; découpage si dépassement.'),
                  label('Suivi','Statut [À faire / En cours / En revue / Terminé / Bloqué] ; PR ou décision [___] ; preuve [___].')])
    return parts

def sprint_pages(s,index):
    core=s['code'].startswith('S') and s['code'][1:].isdigit()
    first=[b('title','SimuEmploi Sprint '+s['code']),b('subtitle',clean_heading(s['title'])),
           p('Dossier de travail partagé entre cinq développeurs full stack. Construire SimuEmploi à partir de zéro, avec backend Python et expérience candidat en premier. Chaque paquet décrit le résultat attendu et les preuves à présenter avant réception.'),
           table(['Version','Cadence proposée','Statut de planification'],[['1.0 — 20 novembre 2026','10 jours ouvrés — 2 semaines','Socle à estimer' if core else 'Extension conditionnelle à estimer']],[1.65,2.1,3.25]),
           h('Objectif et résultat observable'),p(s['goal']),
           sub('Périmètre'),p(s['scope']),
           sub('Conditions de démarrage'),p(s['prereq']),
           sub('Capacité et engagement'),p('À disponibilité complète, cinq personnes représentent 50 jours-personne bruts. Réserver initialement environ 35 jours-personne à la réalisation et le reste aux revues, intégration, coordination et imprévus. Adapter à la disponibilité réelle. La préparation détaillée de ce sprint ne vaut pas engagement de date.'),
           p('J1, l’équipe estime les paquets et découpe les tâches de plus de deux jours. Si le total dépasse la capacité, réduire le périmètre ou scinder le sprint avant engagement. Les tests, droits et intégrité des données restent dans la réception.'),
           label('Champs à renseigner','Début [___] ; fin [___] ; porteur produit [___] ; responsable technique [___] ; référent métier [___] ; responsable données et exploitation [___].')]
    pages=[first]
    for i,pk in enumerate(s['packages']): pages.append(developer_page(s,f'D{i+1}',pk))
    integration=[h('Architecture contrats et intégration'),
                 p('Utiliser le contrat partagé avant de coder les tranches parallèles. Les routes proposées deviennent un OpenAPI relu et versionné ; les événements ont schémas et exemples. Chaque module possède ses données et passe par des services métier pour les opérations transversales.'),
                 sub('Contrats données et invariants de ce sprint')]
    integration.extend(bullet(x) for x in s['architecture'])
    integration.extend([sub('Points de coordination entre développeurs'),
        table(['Échange','Moment et résultat'],[
            ['D1 avec D2 et D5','J1 puis avant fusion : droits, transactions et contraintes de données.'],
            ['D2 avec D3','J1 puis J3 : entrée figée, versions, états et sortie de traitement.'],
            ['D4 avec D1 D2 D3','J2 puis J5 : contrats et états visibles, erreurs et reprise du parcours.'],
            ['D5 avec chaque domaine','Dès J1 : environnement migrations observabilité et recette des pannes.']],[2.05,4.95]),
        sub('Organisation proposée des dix jours'),
        table(['Période','Travail collectif et preuve'],[
          ['J1','Objectif capacité contrats données d’essai dépendances ; tickets estimés et décisions assignées.'],
          ['J2 à J4','Premières tranches intégrées ; exemples API ; revues fréquentes et tests de chaque auteur.'],
          ['J5','Démonstration interne du parcours déjà branché ; résoudre incompatibilités et risques de charge.'],
          ['J6 à J8','Fin des tranches reçues ; scénarios d’échec ; recette métier et corrections.'],
          ['J9','Démonstration produit et revue des preuves ; décision de réception ou limites explicitement acceptées.'],
          ['J10','Rétrospective mise à jour contrats maquettes décisions et préparation du prochain sprint.']],[1.0,6.0])])
    pages.append(integration)
    recipe=[h('Recette et démonstration'),p('Les résultats ci-dessous sont des attentes à vérifier. Renseigner protocole environnement version résultat observé et lien de preuve. Les tests de contrats utilisent des doubles isolés ; les fonctions réellement livrées se vérifient sur base stockage appareil ou transport réels quand concernés.'),sub('Scénarios prioritaires')]
    for i,(name,act,want) in enumerate(s['tests']):
        recipe.extend([b('task',f'{s["code"]}-AC{i+1:02d}  {name}'),label('Action',act),label('Attendu',want),label('Résultat','[Non exécuté / Conforme / Écart] ; preuve [___] ; ticket [___].')])
    recipe.extend([sub('Démonstration de fin de sprint'),p(s['demo']),
                  p('Utiliser deux comptes et des données d’essai autorisées lorsque les droits sont concernés. Présenter aussi un échec utile ; montrer l’état durable et les suites possibles. La réussite d’un appel ou d’une maquette ne suffit pas à recevoir le parcours complet.')])
    pages.append(recipe)
    close=[h('Risques réception et suivi'),sub('Risques et décisions à fermer')]
    close.extend(bullet(x) for x in s['risks'])
    close.extend([label('Registre','Risque [___] ; impact [___] ; décision [___] ; responsable [___] ; échéance [___].'),
                  sub('Conditions pour déclarer le sprint terminé')])
    for line in ['Les paquets D1 à D5 du périmètre engagé sont reçus ou le périmètre a été explicitement redéfini.',
                 'Chaque auteur a vérifié sa tranche et le pair a relu les changements ; défauts bloquants corrigés.',
                 'Le parcours de démonstration et les scénarios prioritaires applicables sont exécutés avec preuves.',
                 'Contrats migrations versions et documentation correspondent à la version intégrée.',
                 'Droits données rétention et budgets nécessaires au périmètre sont reçus par leurs responsables.',
                 'Les limites et tâches reportées ont motif responsable priorité et dépendance identifiés.',
                 'Déploiement ou activation externe concernés ont une décision du porteur sur preuves.']:
        close.append(b('check',line))
    close.extend([sub('Décision de revue'),
                  label('Décision','[Reçu / Reçu avec limites non bloquantes / À corriger / Reporté]'),
                  label('Périmètre reçu','[Version commit ou release et fonctions exactes]'),
                  label('Signataires','Produit [___] ; technique [___] ; métier [___] ; données exploitation [___] ; date [___].'),
                  sub('Amélioration du sprint suivant'),
                  label('Rétrospective','Ce qui aide [___] ; difficulté [___] ; action mesurable [___] ; responsable [___].'),
                  label('Report','Ticket [___] ; raison [___] ; priorité [___] ; nouvelle dépendance [___].'),
                  sub('Documents de référence'),
                  p('Le guide 00 explique les termes, la stack, les écrans et le mode de suivi. Références source dans le dépôt : docs/candidat pour S0 à S7 et AM0 à AM3 ; docs/conception et docs/CAHIER_DES_CHARGES_REVISE.md pour les extensions. Les propositions de routes et de seuils se qualifient avant leur implémentation ou publication.')])
    pages.append(close)
    return pages

def guide_pages(data):
    rows=[[s['code'],s['title'],s['phase']] for s in data]
    pages=[[
      b('title','SimuEmploi Guide des sprints'),b('subtitle','Organisation commune pour cinq développeurs full stack'),
      p('Ce guide accompagne 26 dossiers Word, un par sprint. Le lancement commence par le candidat texte au Burkina Faso. L’audio, la vidéo, les paiements, les établissements, les recruteurs, l’AES et l’extraction éventuelle d’un service suivent des conditions de démarrage propres.'),
      p('S0 à S7 reprennent le plan candidat de référence. AM0 à AM3 développent les lots médias conçus. Les quatorze autres dossiers détaillent les extensions connues afin de les préparer ; leur réalisation dépend de preuves, de partenaires et de décisions de périmètre.'),
      h('Comment utiliser ces fichiers'),
      bullet('Attribuer D1 à D5 à des personnes et compléter noms dates capacité et responsables. Conserver une seule version de référence partagée de chaque Word.'),
      bullet('Lire le cadrage et les contrats ensemble. Transformer les identifiants de tâches en tickets dans l’outil choisi ; le Word porte les règles et la recette, le tableau de tickets porte l’avancement quotidien.'),
      bullet('Estimer avant engagement. Décomposer une tâche de plus de deux jours et intégrer tôt. Une dépendance indisponible reste tracée ; poursuivre seulement les travaux indépendants.'),
      bullet('Mettre à jour contrats maquettes décisions et critères lorsqu’un changement est reçu. Relire les changements du Word comme ceux du code.'),
      bullet('À la revue, compléter résultats et preuves puis enregistrer décision et limites. Un dossier préparé ne signifie pas sprint exécuté ni logiciel livré.'),
      h('Construction neuve et responsabilités'),
      p('Créer un nouveau dépôt et de nouveaux composants frontend backend migrations et contrats. Les prototypes historiques servent uniquement de références de besoin ou de conception. D1 à D5 désignent cinq développeurs humains, tous full stack.'),
      p('Nommer également porteur produit, référent pédagogique ou RH, responsable données, finance quand nécessaire, support et exploitation. Ces personnes peuvent cumuler des rôles mais leurs décisions restent attribuées. Le développeur n’invente pas un contrat fournisseur ou une validation métier.'),
      label('Version du pack','1.0 — 20 novembre 2026 ; prochaine révision [___] ; responsable documentaire [___].')],
      [h('Catalogue des sprints'),p('Ordre de lecture conseillé. Les branches d’extension ne sont pas toutes obligatoires et leurs dépendances priment sur le numéro de fichier. Chaque sprint propose dix jours ouvrés à réestimer.'),table(['Code','Objet du sprint','Famille'],rows[:13],[0.62,4.0,2.38])],
      [h('Catalogue des extensions'),table(['Code','Objet du sprint','Famille'],rows[13:],[0.62,4.0,2.38]),p('Le pack couvre la feuille de route connue. Les imports CV, recommandations d’offres, applications mobiles natives, langues locales supplémentaires, mesures acoustiques avancées, certification, autres pays et infrastructure active sur plusieurs régions restent à étudier. Si retenus, créer un nouveau sprint après cadrage besoin droits coût et recette ; ne pas les ajouter gratuitement aux paquets existants.')],
      [h('Ordre dépendances et décisions de passage'),
       p('Tronc candidat : S0 → S1 → S2 → S3 → S4 → S5 → S6 → S7 → observation du pilote → BF0. L’estimation initiale de S0 à S7 correspond à seize semaines à deux semaines par sprint, sous hypothèse de disponibilité complète. Elle ne garantit pas la livraison ni la durée d’observation.'),
       table(['Branche','Conditions et séquence'],[
         ['Médias','AM0 peut réduire les risques après contrats de session. AM1 puis AM2 puis AM3 ; exposition pilote après socle reçu et conditions données appareils fournisseur.'],
         ['Paiements','BF0 et règles finance → PAY0 → PAY1. Accès sandbox puis production séparés selon lancement commercial reçu.'],
         ['Établissements','Partenaire et règles reçus → EDU0 → EDU1 → EDU2. PAY ne devient prérequis que si le pilote exige une fonction facturée.'],
         ['Recruteurs','Partenaire RH et matrice organisations adaptée → REC0 → REC1 → REC2. Validation parallèle avant usage pour sélection réelle.'],
         ['Ouverture Burkina','BF0 et recette de chaque fonction exposée → BF1. Toutes les branches ne sont pas nécessaires à l’ouverture candidat.'],
         ['AES','Burkina stable et partenaires → AES0 → AES1 Mali et AES2 Niger selon préparation locale. Décision distincte pour chaque pays.'],
         ['Microservice','MS0 uniquement après contrainte mesurée et ADR. Peut intervenir avant AES ; sinon garder modules bien séparés.']],[1.2,5.8]),
       sub('Capacité et calendrier'),p('26 sprints de deux semaines feraient 52 semaines si tous étaient exécutés successivement sans redécoupage. Ce calcul sert à illustrer la taille du périmètre ; il ne constitue pas un calendrier. Contrats, pilotes, absences et charges peuvent allonger le délai. Réaliser plusieurs sprints simultanément avec les mêmes cinq personnes exige de répartir la capacité, pas de la compter deux fois.'),
       p('Préparer une branche en parallèle signifie avancer sur des tâches indépendantes de contrats ou de recherche. Le développement doit rester compatible avec un objectif de sprint clair et une capacité totale réellement disponible.')],
      [h('Répartition revues et gestion des tickets'),
       table(['Place','Continuité principale','Pair de revue'],[[d,ROLE[d],REV[d]] for d in ROLE],[0.55,5.6,0.85]),
       p('Tous prennent interface contrat règle métier données et tests de leur tranche. D5 prépare environnement et exploitation mais ne termine pas les tests des autres. Une migration, un accès privilégié ou une règle financière peut exiger une seconde revue du spécialiste concerné.'),
       sub('Format de ticket à recopier'),
       table(['Champ','Valeur à renseigner'],[
        ['Identifiant','Exemple S3-D2-T01 ; conserver le même identifiant dans Word ticket PR et preuve.'],
        ['But','Action utilisateur ou opération métier et résultat observable.'],
        ['Sous tâches','Contrat modèle UI backend tests migration et documentation utiles.'],
        ['Dépendances','Ticket ou décision préalable, fournisseur et responsable.'],
        ['Estimation','Jours-personne disponibilité et découpage si plus de deux jours.'],
        ['Acceptation','Cas nominal erreur pertinente résultat attendu et données d’essai.'],
        ['Preuve','PR version environnement protocole résultat et capture ou rapport de test.'],
        ['Statut','À faire En cours En revue Terminé Bloqué ; blocage avec cause et prochaine action.']],[1.35,5.65]),
       p('Un ticket prêt a une portée, un contrat ou parcours, un critère observable et des dépendances. Un ticket terminé a une preuve sur version intégrée et revue du pair. Les tâches reportées sont visibles avec motif ; les seuils non testés restent des objectifs.')],
      [h('Stack et frontières de l’architecture'),
       table(['Domaine','Choix de référence et rôle'],[
        ['Frontend','React TypeScript neuf PWA ; composants communs, mobile, clavier et ressources publiques légères.'],
        ['Backend','Python FastAPI Pydantic ; services métier, validation et OpenAPI versionné.'],
        ['Données','PostgreSQL SQLAlchemy Alembic ; contraintes transactions et migrations reçues.'],
        ['Traitement différé','Celery RabbitMQ et outbox transactionnelle ; workers Linux et jobs persistés.'],
        ['Médias','MediaRecorder lecteur natif formats qualifiés ; stockage privé compatible S3 et envoi reprenable.'],
        ['Direct','Module realtime et transport fournisseur qualifié WebRTC ou WebSocket ; accès éphémère.'],
        ['Identité','Fournisseur OIDC reçu et compte UUID interne lié par issuer/subject.'],
        ['Livraison','Dépendances verrouillées Docker Linux CI ; Ruff typage pytest HTTPX TypeScript et tests navigateur.']],[1.25,5.75]),
       p('Les versions exactes drivers et modes sync ou async sont qualifiés en S0 S1 puis verrouillés. Les sessions SQLAlchemy ne sont pas partagées entre requêtes ou processus. Celery est exécuté et testé dans des images Linux sur les postes Windows.'),
       p('Modules initiaux identity profile catalog simulation evaluation reports usage data_rights processing operations. Ajouter media realtime organisations cohortes billing recruitment lorsque leurs branches sont reçues. Les processus API dispatcher workers peuvent partager initialement PostgreSQL ; cela ne constitue pas une séparation en microservices autonomes.'),
       p('Réponse puis réservation job outbox sont persistés avant IA. Le broker transporte des identifiants et versions, pas les médias bruts. Un résultat tardif ne remplace pas une version courante et un timeout fournisseur ne débite pas automatiquement deux fois le candidat.')],
      [h('Écrans et traçabilité du produit'),
       table(['Code','Écran ou parcours','Sprints principaux'],[
        ['C01 à C03','Découverte connexion objectif et préférences','S0 S1 S2 S6 S7'],
        ['C04 à C06','Accueil catalogue et préparation','S1 S2 S3 S7'],
        ['C07 à C09','Réponse retour pause et fin','S3 S4 S5 S6'],
        ['C10 à C12','Historique rapport et compte données','S5 S6 S7'],
        ['M01 à M03','Modalité appareils et question audio','AM0 AM1 AM2'],
        ['M04 à M07','Prise relecture envoi et transcription','AM1 AM2'],
        ['M08 M09','Retour et rapport multimodaux','AM1 AM2 AM3'],
        ['M10 à M12','Direct fin et secours texte','AM3 et transitions AM1 AM2'],
        ['E01 à E06','Maquettes établissement à concevoir avec partenaire','EDU0 puis EDU1 EDU2'],
        ['R01 à R06','Maquettes recruteur à concevoir avec RH','REC0 puis REC1 REC2']],[1.0,3.75,2.25]),
       p('Les maquettes candidat texte audio vidéo sont des références modifiables. Le produit retire leurs sélecteurs de démonstration données statiques et faux résultats. Les écrans E et R proposés ici doivent être conçus et relus au début de leurs branches.'),
       sub('Règles de présentation à conserver'),
       bullet('Une action principale par étape, labels visibles erreurs près des champs et statuts textuels. Illustrations légères utiles ou décoratives avec texte et commandes utilisables sans image.'),
       bullet('Parcours dès 320 px et essais sur appareils réels. Clavier focus lecteurs d’écran et clavier virtuel contrôlés ; aucune action vitale uniquement vocale ou visuelle.'),
       bullet('Question écrite toujours disponible. Caméra facultative, vidéo locale par défaut, transmission et conservation choisies séparément.'),
       bullet('Retour lié à extraits réels et version confirmée. Aucun score de secours émotion personnalité regard ou promesse d’embauche.')],
      [h('Recette et cibles mesurables'),
       p('Ces valeurs viennent du cadrage du projet et restent des cibles à qualifier. Chaque rapport précise version environnement taille des données mix de charge réseau appareil et dénominateurs. Une cible non mesurée ne devient pas une promesse publique.'),
       table(['Sujet','Cible proposée ou règle de recette'],[
        ['Accessibilité','Objectif WCAG 2.2 AA ; vérification manuelle clavier lecteur d’écran et appareils.'],
        ['Réseau faible','Protocole proposé 400 kbit/s latence 400 ms coupure 60 s ; reprise et unicité.'],
        ['Client','Bundle initial compressé cible moins de 500 Ko hors médias chargés à la demande.'],
        ['API et IA','API hors IA p95 moins de 500 ms ; interaction IA nominale p95 moins de 10 s et deadline proposée 20 s.'],
        ['Rapport','Nominal p95 moins de 60 s ; état différé explicite et reprise autorisée.'],
        ['Capacité','Pilote 50 sessions puis Burkina 200 puis AES cible 500 avec mix et appels fournisseur précisés.'],
        ['Sauvegarde','Pilote RPO 24 h puis ouverture 1 h ; RTO 4 h proposés et restauration exercée.'],
        ['Disponibilité','Cible API données 99,5 % par mois à ouverture ; IA suivie séparément et mesure sur durée.'],
        ['Qualité','Corpus de départ 100 à 200 réponses autorisées ou synthétiques ; relecture humaine et désaccords documentés.']],[1.15,5.85]),
       sub('Vérifications transversales prioritaires'),
       p('Accès A B et organisations A B ; coupure après commit ; doublon et conflit de clé ; dernière réponse ; JSON invalide ; ancien worker ; budget commun ; suppression pendant analyse ; restauration ; refus média ; transcription corrigée ; paiement répété ; revue humaine et recours lorsque ces modules sont reçus.'),
       p('Les tests servent les risques et le comportement livré. Ne pas viser un nombre arbitraire de tests ni écrire seulement des assertions qui recopient l’implémentation. L’auteur garde la preuve du cas nominal et de l’échec pertinent.')],
      [h('Glossaire et sources de conception'),
       table(['Terme','Sens dans ce projet'],[
         ['Sprint','Période de travail avec objectif et périmètre engagés ; dix jours ouvrés proposés.'],
         ['Full stack','Développeur capable de réaliser interface backend données et vérifications de sa tranche.'],
         ['OIDC','Protocole d’identité ; issuer et subject identifient ensemble le compte externe.'],
         ['Idempotence','Répéter la même opération ne crée pas un nouvel effet métier ; contenu incompatible traité en conflit.'],
         ['Outbox','Intention de publication persistée dans la transaction métier puis transportée avec reprise.'],
         ['Snapshot','Ensemble figé d’entrées et versions utilisé pour produire un rapport cohérent.'],
         ['ASR','Transcription de parole en texte ; texte corrigé et confirmé avant coaching.'],
         ['RPO et RTO','Perte maximale de données visée et durée de remise en service visée ; mesures par restauration.'],
         ['ADR','Décision d’architecture avec problème options choix motifs conséquences et responsable.'],
         ['Microservice','Service autonome possédant ses données contrats livraison et exploitation.']],[1.2,5.8]),
       sub('Sources dans le dépôt'),
       p('Plans candidat et médias, contrats modules maquettes et ajustements UX : docs/candidat. Viabilité architecture décisions diagrammes méthode de validation : docs/conception. Exigences reçues par lot à préciser : docs/CAHIER_DES_CHARGES_REVISE.md.'),
       p('Les dossiers S0 à S7 et AM0 à AM3 approfondissent ces références. Les dossiers BF PAY EDU REC AES MS constituent des propositions de travail détaillées pour leurs extensions. Les endpoints états seuils et choix prestataire sont finalisés et versionnés avant engagement du module.'),
       p('Les textes et archives de départ ne donnent pas d’autorisation supplémentaire : les décisions de construction neuve candidat d’abord Python et modules séparés guident ce pack. Les preuves terrain fournisseurs et exploitation doivent être obtenues dans les sprints concernés.'),
       label('Mise à jour','Décision [___] ; fichiers touchés [___] ; auteur [___] ; revue [___] ; date [___].')]
    ]
    return pages

def init_doc(title,code):
    doc=Document()
    sec=doc.sections[0]
    sec.page_width=Inches(8.5); sec.page_height=Inches(11)
    sec.top_margin=Inches(.65); sec.bottom_margin=Inches(.65)
    sec.left_margin=Inches(.75); sec.right_margin=Inches(.75)
    sec.header_distance=Inches(.25); sec.footer_distance=Inches(.25)
    for name in ['Normal','Title','Subtitle','Heading 1','Heading 2','Heading 3','List Bullet']:
        st=doc.styles[name]; st.font.name='Arial'; st.font.color.rgb=RGBColor(0,0,0)
        st.font.size=Pt(11)
        st.paragraph_format.line_spacing=1.05
        st.paragraph_format.space_after=Pt(5)
        st.paragraph_format.widow_control=True
        rp=st.element.get_or_add_rPr()
        fonts=rp.find(qn('w:rFonts'))
        if fonts is None: fonts=OxmlElement('w:rFonts'); rp.insert(0,fonts)
        for a in ['ascii','hAnsi','cs','eastAsia']: fonts.set(qn('w:'+a),'Arial')
        c=rp.find(qn('w:color'))
        if c is not None:
            for a in ['themeColor','themeTint','themeShade']: c.attrib.pop(qn('w:'+a),None)
        for pb in st.element.xpath('./w:pPr/w:pBdr'): pb.getparent().remove(pb)
    doc.styles['Title'].font.size=Pt(24); doc.styles['Title'].font.bold=True
    doc.styles['Title'].paragraph_format.space_after=Pt(10)
    doc.styles['Subtitle'].font.size=Pt(15);doc.styles['Subtitle'].paragraph_format.space_after=Pt(10)
    doc.styles['Heading 1'].font.size=Pt(17);doc.styles['Heading 1'].font.bold=True
    doc.styles['Heading 1'].paragraph_format.space_before=Pt(3)
    doc.styles['Heading 2'].font.size=Pt(12);doc.styles['Heading 2'].font.bold=True
    doc.styles['Heading 2'].paragraph_format.space_before=Pt(8)
    # Small identifying header and page field are useful in shared printed working dossiers.
    hp=sec.header.paragraphs[0];hp.text='SimuEmploi  |  '+code+'  |  Référence équipe 1.0'
    for run in hp.runs:run.font.size=Pt(9);run.font.color.rgb=RGBColor(0,0,0)
    fp=sec.footer.paragraphs[0];fp.alignment=WD_ALIGN_PARAGRAPH.RIGHT
    run=fp.add_run('Page ');run.font.size=Pt(9)
    fld=OxmlElement('w:fldSimple');fld.set(qn('w:instr'),'PAGE');fp._p.append(fld)
    doc.core_properties.title=title;doc.core_properties.subject='Plan détaillé de sprint SimuEmploi'
    doc.core_properties.author='Équipe SimuEmploi';doc.core_properties.keywords='sprint candidat Python Burkina AES'
    doc.core_properties.created=datetime(2026,11,20)
    doc.core_properties.modified=datetime(2026,11,20)
    lang=OxmlElement('w:lang');lang.set(qn('w:val'),'fr-FR');doc.styles['Normal'].element.get_or_add_rPr().append(lang)
    return doc

def add_table(doc,blk):
    tb=doc.add_table(rows=1,cols=len(blk['headers']));tb.alignment=WD_TABLE_ALIGNMENT.CENTER;tb.autofit=False
    for i,w in enumerate(blk['widths']): tb.columns[i].width=Inches(w)
    for i,c in enumerate(tb.rows[0].cells):c.text=blk['headers'][i];c.width=Inches(blk['widths'][i])
    repeat=OxmlElement('w:tblHeader');tb.rows[0]._tr.get_or_add_trPr().append(repeat)
    for row in blk['rows']:
        cells=tb.add_row().cells
        for i,t in enumerate(row): cells[i].text=str(t);cells[i].width=Inches(blk['widths'][i])
    borders=OxmlElement('w:tblBorders')
    for side in ['top','left','bottom','right','insideH','insideV']:
        edge=OxmlElement('w:'+side);edge.set(qn('w:val'),'single');edge.set(qn('w:sz'),'4');edge.set(qn('w:color'),'D9D9D9');borders.append(edge)
    tb._tbl.tblPr.append(borders)
    margins=OxmlElement('w:tblCellMar')
    for side in ['top','bottom','left','right']:
        m=OxmlElement('w:'+side);m.set(qn('w:w'),'90');m.set(qn('w:type'),'dxa');margins.append(m)
    tb._tbl.tblPr.append(margins)
    for rid,row in enumerate(tb.rows):
        # Do not split one short data record across pages. No fixed height.
        no=OxmlElement('w:cantSplit');row._tr.get_or_add_trPr().append(no)
        for ci,cell in enumerate(row.cells):
            cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            if rid==0:
                sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'DCE6EF');cell._tc.get_or_add_tcPr().append(sh)
            for par in cell.paragraphs:
                par.paragraph_format.space_after=Pt(2);par.paragraph_format.line_spacing=1.05
                if ci==0 and len(cell.text)<18:par.alignment=WD_ALIGN_PARAGRAPH.CENTER
                for r in par.runs:r.font.name='Arial';r.font.size=Pt(10.5);r.font.bold=(rid==0);r.font.color.rgb=RGBColor(0,0,0)
    doc.add_paragraph().paragraph_format.space_after=Pt(2)

def build_docx(pages,path,title,code):
    doc=init_doc(title,code)
    for pi,page in enumerate(pages):
        if pi:doc.add_page_break()
        for blk in page:
            k=blk['kind'];t=blk.get('text')
            if k=='table':add_table(doc,blk);continue
            style={'title':'Title','subtitle':'Subtitle','h':'Heading 1','sub':'Heading 2','bullet':'List Bullet'}.get(k,'Normal')
            par=doc.add_paragraph(style=style)
            if k=='check': t='[  ] '+t
            r=par.add_run(t)
            if k=='task':r.bold=True;par.paragraph_format.keep_with_next=True;par.paragraph_format.space_before=Pt(5)
            if k in ['h','sub','title','subtitle']:par.paragraph_format.keep_with_next=True
    if code=='Guide':
        links={s['code']:f'{i:02d}_Sprint_{s["code"]}_{slug(s["title"])}.docx' for i,s in enumerate(all_sprints(),1)}
        for tab in doc.tables[:2]:
            for row in tab.rows[1:]:
                par=row.cells[0].paragraphs[0]
                key=par.text
                if key not in links:continue
                for child in list(par._p):
                    if child.tag!=qn('w:pPr'):par._p.remove(child)
                rid=doc.part.relate_to(links[key],RELATIONSHIP_TYPE.HYPERLINK,is_external=True)
                hyperlink=OxmlElement('w:hyperlink');hyperlink.set(qn('r:id'),rid)
                run=OxmlElement('w:r');props=OxmlElement('w:rPr')
                color=OxmlElement('w:color');color.set(qn('w:val'),'000000');props.append(color)
                under=OxmlElement('w:u');under.set(qn('w:val'),'single');props.append(under)
                run.append(props);text=OxmlElement('w:t');text.text=key;run.append(text)
                hyperlink.append(run);par._p.append(hyperlink)
    doc.save(path)

def setup_pdf():
    pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
    pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
    pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
    base=dict(fontName='Arial',fontSize=11,leading=11.55,spaceAfter=5,textColor=colors.black)
    styles={k:ParagraphStyle(k,**base) for k in ['p','task','bullet','check']}
    styles['task'].fontName='ArialBold';styles['task'].spaceBefore=5;styles['task'].keepWithNext=True
    styles['bullet'].leftIndent=12;styles['bullet'].firstLineIndent=-9
    styles['check'].leftIndent=14;styles['check'].firstLineIndent=-14
    for k,fs in [('title',24),('subtitle',15),('h',17),('sub',12)]:
        styles[k]=ParagraphStyle(k,fontName='Arial' if k=='subtitle' else 'ArialBold',fontSize=fs,leading=fs*1.1,spaceAfter=10 if k in ['title','subtitle'] else 5,spaceBefore=8 if k=='sub' else 3,textColor=colors.black,keepWithNext=True)
    return styles

def preview_pdf(pages,path,code):
    # Independent preview of the same content blocks, not a conversion of the DOCX.
    # This is useful for density checks only. It cannot certify Word pagination.
    styles=setup_pdf();story=[]
    cellstyle=ParagraphStyle('cell',fontName='Arial',fontSize=10.5,leading=11.03,spaceAfter=2)
    headstyle=ParagraphStyle('headcell',parent=cellstyle,fontName='ArialBold')
    for pi,page in enumerate(pages):
        if pi:story.append(PageBreak())
        for blk in page:
            k=blk['kind']
            if k=='table':
                rows=[[Paragraph(escape(str(x)),headstyle if ri==0 else cellstyle) for x in row] for ri,row in enumerate([blk['headers']]+blk['rows'])]
                tb=Table(rows,colWidths=[w*72 for w in blk['widths']],repeatRows=1,hAlign='CENTER')
                tb.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.5,colors.HexColor('#D9D9D9')),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#DCE6EF')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),4.5),('RIGHTPADDING',(0,0),(-1,-1),4.5),('TOPPADDING',(0,0),(-1,-1),4.5),('BOTTOMPADDING',(0,0),(-1,-1),4.5)]))
                story.extend([tb,Spacer(1,5)]);continue
            text=escape(blk['text'])
            if k=='bullet':text='• '+text
            if k=='check':text='[  ] '+text
            story.append(Paragraph(text,styles[k]))
    def chrome(canvas,doc):
        canvas.setFont('Arial',9);canvas.drawString(54,letter[1]-23,'SimuEmploi  |  '+code+'  |  Aperçu indépendant du contenu')
        canvas.drawRightString(letter[0]-54,20,'Page '+str(doc.page))
    SimpleDocTemplate(str(path),pagesize=letter,leftMargin=54,rightMargin=54,topMargin=.65*72,bottomMargin=.65*72).build(story,onFirstPage=chrome,onLaterPages=chrome)

def verify(path,pages,s=None):
    d=Document(path)
    assert all(sec.page_width==Inches(8.5) for sec in d.sections)
    with zipfile.ZipFile(path) as z:
        xml=z.read('word/document.xml').decode()
        settings=z.read('word/settings.xml').decode()
        assert '<w:documentProtection' not in settings
        assert xml.count('w:type="page"')==len(pages)-1
        assert not re.search('w:hRule="exact"',xml)
        assert '<w:tblHeader' in xml
    texts='\n'.join(p.text for p in d.paragraphs)
    if s:
        for i in range(1,6):
            prefix=s['code']+f'-D{i}'
            assert prefix+'-T01' in texts
            assert s['packages'][i-1]['accept'] in texts
        for i in range(1,len(s['tests'])+1):assert s['code']+f'-AC{i:02d}' in texts
    assert not any(x in texts for x in ['None','TODO','placeholder'])
    return dict(file=path.name,bytes=path.stat().st_size,planned_sections=len(pages),words=len(texts.split()),sha256=hashlib.sha256(path.read_bytes()).hexdigest())

def main():
    data=all_sprints();manifest=[]
    gp=guide_pages(data);guide=OUT/'00_Guide_Commun_Equipe_SimuEmploi.docx'
    build_docx(gp,guide,'SimuEmploi Guide des sprints','Guide');preview_pdf(gp,QA/'00_Guide_Commun_Equipe_SimuEmploi.pdf','Guide')
    manifest.append(verify(guide,gp))
    for i,s in enumerate(data,1):
        name=f'{i:02d}_Sprint_{s["code"]}_{slug(s["title"])}.docx'
        pages=sprint_pages(s,i);path=OUT/name
        build_docx(pages,path,s['title'],s['code'])
        preview_pdf(pages,QA/(path.stem+'.pdf'),s['code'])
        row=verify(path,pages,s);row.update(code=s['code'],title=s['title'],phase=s['phase'],tasks=sum(len(pk['tasks'])+1 for pk in s['packages']),acceptance_cases=len(s['tests']))
        manifest.append(row)
    (QA/'manifest-structure.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (QA/'contenu-sprints.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    readme=['SIMUEMPLOI — SPRINTS WORD MODIFIABLES','Version 1.0 du 20 novembre 2026','',
            '27 fichiers DOCX : 1 guide commun et 26 dossiers de sprint pour cinq développeurs full stack.',
            'Commencer par 00_Guide_Commun_Equipe_SimuEmploi.docx. Compléter noms dates capacité estimations décisions et liens de preuve.',
            'S0 à S7 : socle candidat texte. Les autres dossiers sont des extensions ou consolidations conditionnées par leurs prérequis.',
            'Cadence proposée 10 jours ouvrés. Réestimer et scinder avant engagement si la capacité est dépassée.',
            'Les fichiers ne sont pas protégés. Corps titres tableaux champs de suivi et critères sont modifiables.',
            '', 'LIMITES DE VERIFICATION',
            'Contenu identifiants tableaux styles et absence de protection contrôlés. Le moteur de conversion Word est absent ici ; la pagination finale DOCX n’a pas pu être vérifiée dans Word ou LibreOffice.',
            'Les aperçus PDF indépendants du contenu sont des éléments QA internes et ne certifient pas le rendu Word. Ils ne sont pas inclus dans le pack.',
            'À ouverture dans Word : mettre à jour les champs de page et vérifier les sauts de page après modifications.',
            '', 'FICHIERS']
    readme.extend(m['file'] for m in manifest)
    (OUT/'LIRE_AVANT_UTILISATION.txt').write_text('\n'.join(readme),encoding='utf-8')
    print(json.dumps(dict(docx=len(manifest),sprints=len(data),packages=5*len(data),tasks=sum(m.get('tasks',0) for m in manifest),acceptance_cases=sum(m.get('acceptance_cases',0) for m in manifest),output=str(OUT)),ensure_ascii=False))

if __name__=='__main__':main()
