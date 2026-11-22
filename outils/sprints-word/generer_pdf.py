from pathlib import Path
import copy, json, re, hashlib, zipfile, subprocess
from xml.sax.saxutils import escape
from concurrent.futures import ThreadPoolExecutor
from PIL import Image as PILImage, ImageDraw
import pdfplumber
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DictionaryObject, NameObject, ArrayObject, FloatObject, TextStringObject, NumberObject, BooleanObject
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from contenu import ROOT, all_sprints
from generer import sprint_pages, guide_pages, setup_pdf, slug

OUT=ROOT/'output/pdf/SimuEmploi_Sprints_PDF_v01'
QA=ROOT/'tmp/pdfs/simuemploi-sprints-v01'
POPPLER=Path('C:/Users/OUOBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
ZIP=ROOT/'livrables/SimuEmploi_26_Sprints_PDF_v01.zip'
OUT.mkdir(parents=True,exist_ok=True); QA.mkdir(parents=True,exist_ok=True)
STYLE=setup_pdf()

def normalize(text):
    return text.replace('\u2011','-').replace('\u2013','-').replace('\u2014','-')

def render_pdf(pages,path,code,title):
    cellstyle=ParagraphStyle('cell',fontName='Arial',fontSize=10.5,leading=11.03,spaceAfter=2)
    headstyle=ParagraphStyle('headercell',parent=cellstyle,fontName='ArialBold')
    story=[]
    for pi,page in enumerate(pages):
        if pi: story.append(PageBreak())
        for block in page:
            kind=block['kind']
            if kind=='table':
                records=[block['headers']]+block['rows']
                rows=[[Paragraph(escape(normalize(str(x))),headstyle if ri==0 else cellstyle) for x in row] for ri,row in enumerate(records)]
                table=Table(rows,colWidths=[w*72 for w in block['widths']],repeatRows=1,hAlign='CENTER')
                table.setStyle(TableStyle([
                    ('GRID',(0,0),(-1,-1),.5,colors.HexColor('#D9D9D9')),
                    ('BACKGROUND',(0,0),(-1,0),colors.HexColor('#DCE6EF')),
                    ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
                    ('LEFTPADDING',(0,0),(-1,-1),4.5),('RIGHTPADDING',(0,0),(-1,-1),4.5),
                    ('TOPPADDING',(0,0),(-1,-1),4.5),('BOTTOMPADDING',(0,0),(-1,-1),4.5)]))
                story.extend([table,Spacer(1,5)])
                continue
            text=escape(normalize(block['text']))
            if kind=='bullet':text='• '+text
            if kind=='check':text='[  ] '+text
            story.append(Paragraph(text,STYLE[kind]))
    def frame(canvas,doc):
        canvas.setTitle(title);canvas.setAuthor('Équipe SimuEmploi')
        canvas.setSubject('Plan détaillé des sprints - version PDF de lecture et impression')
        canvas.setFont('Arial',9)
        canvas.drawString(54,letter[1]-23,'SimuEmploi  |  '+code+'  |  Référence équipe 1.0')
        canvas.drawRightString(letter[0]-54,20,f'Page {doc.page} sur {len(pages)}')
    SimpleDocTemplate(str(path),pagesize=letter,leftMargin=54,rightMargin=54,topMargin=.65*72,bottomMargin=.65*72).build(story,onFirstPage=frame,onLaterPages=frame)

def navigation(path,pages,links=None):
    reader=PdfReader(path);writer=PdfWriter()
    writer.clone_document_from_reader(reader)
    assert len(reader.pages)==len(pages),(path.name,len(reader.pages))
    for i,blocks in enumerate(pages):
        heading=next(b['text'] for b in blocks if b['kind'] in ('title','h'))
        writer.add_outline_item(heading,i)
    nlinks=0
    if links:
        with pdfplumber.open(path) as pdf:
            for pn in (1,2):
                for word in pdf.pages[pn].extract_words():
                    code=word['text']
                    if code not in links or word['x0']>105:continue
                    target=links[code]
                    annot=DictionaryObject({
                        NameObject('/Type'):NameObject('/Annot'),NameObject('/Subtype'):NameObject('/Link'),
                        NameObject('/Rect'):ArrayObject([FloatObject(word['x0']-2),FloatObject(792-word['bottom']-2),FloatObject(word['x1']+2),FloatObject(792-word['top']+2)]),
                        NameObject('/Border'):ArrayObject([NumberObject(0),NumberObject(0),NumberObject(0)]),
                        NameObject('/A'):DictionaryObject({NameObject('/S'):NameObject('/GoToR'),NameObject('/F'):TextStringObject(target),NameObject('/D'):ArrayObject([NumberObject(0),NameObject('/Fit')]),NameObject('/NewWindow'):BooleanObject(True)})})
                    writer.add_annotation(pn,annot);nlinks+=1
        assert nlinks==26,nlinks
    with path.open('wb') as handle:writer.write(handle)
    return nlinks

def validate(path,pages,s=None):
    reader=PdfReader(path)
    assert not reader.is_encrypted
    text='\n'.join(page.extract_text() for page in reader.pages)
    assert len(reader.pages)==9
    assert not any(t in text for t in ['Aperçu indépendant','\ufffd','\u25a0'])
    for i,page in enumerate(reader.pages,1):
        assert f'Page {i} sur 9' in page.extract_text()
        assert len(page.extract_text().split())>100
    if s:
        tasks=re.findall(r'\b'+re.escape(s['code'])+r'-D[1-5]-T\d{2}\b',text)
        assert len(tasks)==20 and len(set(tasks))==20,(path.name,tasks)
        for i in range(1,6):assert s['code']+f'-AC{i:02d}' in text
    # Check every page for out-of-page characters and body collisions with headers or footers.
    with pdfplumber.open(path) as pdf:
        for pn,page in enumerate(pdf.pages,1):
            for ch in page.chars:
                assert 0 <= ch['x0'] < ch['x1'] <= page.width+.5,(path.name,pn,ch)
                assert 0 <= ch['top'] < ch['bottom'] <= page.height+.5,(path.name,pn,ch)
            body=[ch for ch in page.chars if ch['top']>35 and ch['bottom']<755]
            assert body and min(ch['x0'] for ch in body)>=53,(path.name,pn)
    return dict(file=path.name,pages=len(reader.pages),bytes=path.stat().st_size,code=s['code'] if s else 'Guide',sha256=hashlib.sha256(path.read_bytes()).hexdigest())

def render_png(path):
    dest=QA/path.stem
    dest.mkdir(exist_ok=True)
    result=subprocess.run([str(POPPLER),'-r','100','-png',str(path),str(dest/'page')],capture_output=True,text=True)
    assert result.returncode==0,result.stderr
    pics=sorted(dest.glob('page-*.png'),key=lambda x:int(x.stem.split('-')[-1]))
    assert len(pics)==9
    # Overview includes every final PDF page; the selected pages below retain full resolution.
    sheet=PILImage.new('RGB',(1152,1536),'#dae0e5');draw=ImageDraw.Draw(sheet)
    for i,pic in enumerate(pics):
        img=PILImage.open(pic).convert('RGB');img.thumbnail((366,474))
        x=8+(i%3)*384;y=24+(i//3)*512
        draw.text((x,y-18),f'{path.name[:2]} / page {i+1}',fill='black')
        sheet.paste(img,(x,y))
    sheet.save(QA/(path.stem+'-ensemble.png'))
    return dict(file=path.name,rendered_pages=len(pics))

def main():
    sprints=all_sprints();manifest=[]
    links={s['code']:f'{i:02d}_Sprint_{s["code"]}_{slug(s["title"])}.pdf' for i,s in enumerate(sprints,1)}
    pages=copy.deepcopy(guide_pages(sprints))
    pages[0][2]['text']=pages[0][2]['text'].replace('26 dossiers Word','26 dossiers PDF')+' Les fichiers Word correspondants restent les sources modifiables ; ces PDF sont destinés à la lecture et à l’impression.'
    pages[0][4]['text']=pages[0][4]['text']
    # Add guidance within the existing first instruction rather than an extra page.
    for block in pages[0]:
        if block.get('kind')=='bullet' and block.get('text','').startswith('Attribuer D1'):
            block['text']+=' Les codes des deux tableaux suivants ouvrent les PDF correspondants dans un lecteur compatible. Garder les fichiers dans le même dossier.'
    guide=OUT/'00_Guide_Commun_Equipe_SimuEmploi.pdf'
    render_pdf(pages,guide,'Guide','SimuEmploi Guide des sprints')
    navigation(guide,pages,links);manifest.append(validate(guide,pages))
    for i,s in enumerate(sprints,1):
        path=OUT/links[s['code']];pages=sprint_pages(s,i)
        render_pdf(pages,path,s['code'],'SimuEmploi Sprint '+s['code']+' '+s['title'])
        navigation(path,pages);manifest.append(validate(path,pages,s))
        print(f'{s["code"]}: PDF contrôlé, 9 pages',flush=True)
    assert len(manifest)==27
    (QA/'manifest-pdf.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    with ThreadPoolExecutor(max_workers=3) as pool:
        renders=list(pool.map(render_png,sorted(OUT.glob('*.pdf'))))
    (QA/'rendu-pages.json').write_text(json.dumps(renders,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'pdf':27,'sprints':26,'pages':sum(x['pages'] for x in manifest),'guide_links':26,'all_pages_rendered':sum(x['rendered_pages'] for x in renders),'output':str(OUT)},ensure_ascii=False),flush=True)

if __name__=='__main__':main()
