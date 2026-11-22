from pathlib import Path
import json, zipfile, hashlib, re
from docx import Document
from lxml import etree
from pypdf import PdfReader
import pypdfium2 as pdfium
from contenu import ROOT, all_sprints

QA=ROOT/'outils/sprints-word/qa'
OUT=ROOT/'livrables/SimuEmploi_Sprints_Word_v01'
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def main():
    data=all_sprints()
    manifest=json.loads((QA/'manifest-structure.json').read_text(encoding='utf-8'))
    report={'documents':[],'renderer':{'canonical_attempt':'Failed before conversion','reason':'LibreOffice soffice.exe not found on PATH; no bundled LibreOffice in runtime inventory','word_pagination_verified':False,'independent_content_preview':'ReportLab from common content blocks; not DOCX conversion'}}
    assert len(list(OUT.glob('*.docx')))==27
    all_tasks=[]
    for item in manifest:
        path=OUT/item['file'];doc=Document(path)
        with zipfile.ZipFile(path) as z:
            root=etree.fromstring(z.read('word/document.xml'))
            styles=etree.fromstring(z.read('word/styles.xml'))
            for heading in root.xpath('//w:p[w:pPr/w:pStyle[@w:val="Title" or @w:val="Subtitle" or @w:val="Heading1" or @w:val="Heading2"]]',namespaces=NS):
                text=''.join(heading.xpath('.//w:t/text()',namespaces=NS))
                assert not re.search(r'[^\w\s]',text),(path.name,text)
            assert not root.xpath('//w:trHeight[@w:hRule="exact"]',namespaces=NS)
            assert not root.xpath('//w:pBdr',namespaces=NS)
            for tab in root.xpath('//w:tbl',namespaces=NS):
                assert len(tab.xpath('./w:tblPr/w:tblBorders/*',namespaces=NS))==6
                assert tab.xpath('./w:tr[1]/w:trPr/w:tblHeader',namespaces=NS)
            for st in styles.xpath('//w:style[@w:styleId="Title" or @w:styleId="Subtitle" or @w:styleId="Heading1" or @w:styleId="Heading2"]',namespaces=NS):
                assert st.xpath('./w:rPr/w:color/@w:val',namespaces=NS)==['000000']
        text='\n'.join(p.text for p in doc.paragraphs)
        tasks=re.findall(r'\b(?:S\d|AM\d|BF\d|PAY\d|EDU\d|REC\d|AES\d|MS\d)-D[1-5]-T\d{2}\b',text)
        assert len(tasks)==len(set(tasks)),(path.name,'duplicate task')
        all_tasks.extend(tasks)
        pdf=QA/(path.stem+'.pdf')
        reader=PdfReader(pdf)
        assert len(reader.pages)==item['planned_sections'],(path.name,len(reader.pages))
        assert all(len(page.extract_text().split())>100 for page in reader.pages)
        report['documents'].append({'file':path.name,'task_ids':len(tasks),'independent_preview_pages':len(reader.pages),'editable':True,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
    assert len(all_tasks)==520 and len(set(all_tasks))==520
    report.update(sprints=26,developer_packages=130,tasks=520,acceptance_cases=130)
    # Representative independent previews for visual density review.
    picks=[('00_Guide_Commun_Equipe_SimuEmploi',0),('00_Guide_Commun_Equipe_SimuEmploi',1),
           ('04_Sprint_S3_Session_texte_et_sauvegarde_fiable',2),
           ('05_Sprint_S4_Retour_IA_durable_et_explicable',6),
           ('11_Sprint_AM1_Audio_enregistre_et_transcription_fiable',7),
           ('20_Sprint_REC1_Preuves_revue_humaine_decisions_et_recours',8)]
    for stem,page in picks:
        pd=pdfium.PdfDocument(str(QA/(stem+'.pdf')))
        bitmap=pd[page].render(scale=1.5)
        bitmap.to_pil().save(QA/(stem+f'-page-{page+1}.png'))
        pd.close()
    (QA/'verification-finale.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k!='documents'},ensure_ascii=False))

if __name__=='__main__':main()
