from pathlib import Path
import json,zipfile,hashlib
from lxml import etree
from docx import Document
from contenu import ROOT

OUT=ROOT/'livrables/SimuEmploi_Sprints_Word_v01'
QA=ROOT/'outils/sprints-word/qa'
ZIP=ROOT/'livrables/SimuEmploi_26_Sprints_Word_Modifiables_v01.zip'
NS={'r':'http://schemas.openxmlformats.org/package/2006/relationships'}

def main():
    docs=sorted(OUT.glob('*.docx'));assert len(docs)==27
    for f in docs:
        with zipfile.ZipFile(f) as z:
            assert z.testzip() is None
            assert '\ufffd' not in z.read('word/document.xml').decode('utf-8')
    guide=OUT/'00_Guide_Commun_Equipe_SimuEmploi.docx'
    with zipfile.ZipFile(guide) as z:
        rel=etree.fromstring(z.read('word/_rels/document.xml.rels'))
        targets=rel.xpath('//r:Relationship[contains(@Type,"hyperlink")]/@Target',namespaces=NS)
        assert len(targets)==26
        assert all((OUT/t).is_file() for t in targets)
    note=OUT/'LIRE_AVANT_UTILISATION.txt'
    txt=note.read_text(encoding='utf-8')
    if 'LIENS DU GUIDE' not in txt:
        txt+='\n\nLIENS DU GUIDE\nLes codes dans les deux tableaux du guide ouvrent les 26 fichiers Word. Garder tous les DOCX dans le même dossier pour conserver ces liens relatifs.\n'
        note.write_text(txt,encoding='utf-8')
    files=docs+[note]
    with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for f in files:z.write(f,arcname='SimuEmploi_Sprints_Word_v01/'+f.name)
    with zipfile.ZipFile(ZIP) as z:
        assert len(z.namelist())==28
        assert z.testzip() is None
        assert len([n for n in z.namelist() if n.endswith('.docx')])==27
        assert not any(n.endswith(('.pdf','.png','.py','.json')) for n in z.namelist())
    report=json.loads((QA/'verification-finale.json').read_text(encoding='utf-8'))
    report['documents'][0]['sha256']=hashlib.sha256(guide.read_bytes()).hexdigest()
    report['guide_links']=26
    report['archive']={'file':ZIP.name,'bytes':ZIP.stat().st_size,'entries':28,'sha256':hashlib.sha256(ZIP.read_bytes()).hexdigest()}
    report['independent_preview_visual_review']='Six representative content pages inspected; not a DOCX rendering review.'
    (QA/'verification-finale.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'archive':str(ZIP),'bytes':ZIP.stat().st_size,'docx':len(docs),'guide_links':len(targets),'checks':'DOCX integrity editable content identifiers table formatting and ZIP integrity passed; Word pagination not verified'},ensure_ascii=False))

if __name__=='__main__':main()
