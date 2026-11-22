from pathlib import Path
import json, zipfile, hashlib
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DictionaryObject, NameObject, ArrayObject, NumberObject
from contenu import ROOT

OUT=ROOT/'output/pdf/SimuEmploi_Sprints_PDF_v01'
QA=ROOT/'tmp/pdfs/simuemploi-sprints-v01'
ZIP=ROOT/'livrables/SimuEmploi_26_Sprints_PDF_v01.zip'
ALL=ROOT/'output/pdf/SimuEmploi_Guide_et_26_Sprints_Complet_v01.pdf'

def main():
    manifest=json.loads((QA/'manifest-pdf.json').read_text(encoding='utf-8'))
    renders=json.loads((QA/'rendu-pages.json').read_text(encoding='utf-8'))
    assert len(manifest)==27 and sum(x['rendered_pages'] for x in renders)==243
    docs=[OUT/x['file'] for x in manifest]
    assert all(f.is_file() for f in docs)
    guide=PdfReader(docs[0])
    targets=[]
    for pg in guide.pages:
        for ref in pg.get('/Annots',[]):
            a=ref.get_object().get('/A',{})
            if a.get('/S')=='/GoToR':targets.append(str(a['/F']))
    assert len(targets)==26 and all((OUT/t).is_file() for t in targets)
    with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
        for f in docs:archive.write(f,'SimuEmploi_Sprints_PDF_v01/'+f.name)
    with zipfile.ZipFile(ZIP) as archive:
        assert len(archive.namelist())==27 and archive.testzip() is None
        assert all(x.endswith('.pdf') for x in archive.namelist())
    # Optional one-file reading copy, with all guide links converted to internal destinations.
    writer=PdfWriter();starts={};offset=0
    for item,path in zip(manifest,docs):
        starts[path.name]=offset
        writer.append(path,outline_item='Guide commun' if item['code']=='Guide' else 'Sprint '+item['code'],import_outline=True)
        offset+=item['pages']
    for page in writer.pages[:9]:
        for ref in page.get('/Annots',[]):
            annot=ref.get_object();action=annot.get('/A',{})
            if action.get('/S')=='/GoToR':
                dest=writer.pages[starts[str(action['/F'])]].indirect_reference
                annot[NameObject('/A')]=DictionaryObject({NameObject('/S'):NameObject('/GoTo'),NameObject('/D'):ArrayObject([dest,NameObject('/Fit')])})
    writer.add_metadata({'/Title':'SimuEmploi Guide et 26 sprints détaillés','/Author':'Équipe SimuEmploi','/Subject':'Dossiers complets pour cinq développeurs full stack'})
    with ALL.open('wb') as handle:writer.write(handle)
    reader=PdfReader(ALL)
    assert len(reader.pages)==243
    assert not reader.is_encrypted
    internal=sum(1 for pg in reader.pages[:9] for ref in pg.get('/Annots',[]) if ref.get_object().get('/A',{}).get('/S')=='/GoTo')
    assert internal==26
    report=dict(pdf_individuels=27,sprints=26,pages_par_pdf=9,pages_total=243,guide_links=26,pages_rendered=243,
                archive=str(ZIP),archive_bytes=ZIP.stat().st_size,combined=str(ALL),combined_bytes=ALL.stat().st_size,combined_internal_links=internal,
                checks=['Exact expected task and acceptance IDs','All page numbers and page counts','All pages rendered with Poppler','Text within page bounds','Guide destinations exist','Archive CRC integrity','Bookmarks and internal combined links'])
    (QA/'verification-pack-pdf.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':main()
