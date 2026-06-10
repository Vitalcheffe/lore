#!/usr/bin/env python3
"""ClearPath AI - Project Showcase PDF (Reference Style)"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Register Fonts ──
FONT_DIR = "/usr/share/fonts/truetype/liberation/"
pdfmetrics.registerFont(TTFont('LibSans', os.path.join(FONT_DIR, 'LiberationSans-Regular.ttf')))
pdfmetrics.registerFont(TTFont('LibSans-Bold', os.path.join(FONT_DIR, 'LiberationSans-Bold.ttf')))
pdfmetrics.registerFont(TTFont('LibSans-Italic', os.path.join(FONT_DIR, 'LiberationSans-Italic.ttf')))
pdfmetrics.registerFont(TTFont('LibSerif', os.path.join(FONT_DIR, 'LiberationSerif-Regular.ttf')))
pdfmetrics.registerFont(TTFont('LibSerif-Bold', os.path.join(FONT_DIR, 'LiberationSerif-Bold.ttf')))
pdfmetrics.registerFont(TTFont('LibSerif-Italic', os.path.join(FONT_DIR, 'LiberationSerif-Italic.ttf')))

# ── Colors (Blue + White Modern) ──
PRIMARY = HexColor('#1a5fb4')       # Deep blue - headers, accents
PRIMARY_DARK = HexColor('#15407d')  # Darker blue - cover title
ACCENT = HexColor('#e66100')        # Warm orange - key data, CTAs
SECONDARY = HexColor('#26a269')     # Green - success, positive
TEXT = HexColor('#1a1a1a')          # Near-black - body
TEXT_MUTED = HexColor('#6b6b6b')    # Gray - captions, meta
LIGHT_BG = HexColor('#f0f4f9')      # Light blue tint - alt rows, callouts
TABLE_HEADER = HexColor('#1a5fb4')  # Blue table header
BORDER = HexColor('#c0c8d4')        # Light blue-gray border
WHITE = HexColor('#ffffff')
CREAM = HexColor('#f7f9fc')         # Very light blue for alt rows

# ── Styles ──
styles = getSampleStyleSheet()

style_cover_title = ParagraphStyle(
    'CoverTitle', fontName='LibSerif-Bold', fontSize=42, leading=48,
    textColor=PRIMARY_DARK, alignment=TA_LEFT, spaceAfter=6*mm
)
style_cover_subtitle = ParagraphStyle(
    'CoverSubtitle', fontName='LibSerif', fontSize=14, leading=18,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=3*mm
)
style_cover_meta = ParagraphStyle(
    'CoverMeta', fontName='LibSans', fontSize=10, leading=14,
    textColor=TEXT_MUTED, alignment=TA_LEFT
)
style_h1 = ParagraphStyle(
    'H1', fontName='LibSerif-Bold', fontSize=18, leading=22,
    textColor=PRIMARY, spaceBefore=8*mm, spaceAfter=4*mm
)
style_h2 = ParagraphStyle(
    'H2', fontName='LibSerif-Bold', fontSize=13, leading=17,
    textColor=TEXT, spaceBefore=5*mm, spaceAfter=3*mm
)
style_h3 = ParagraphStyle(
    'H3', fontName='LibSerif-Bold', fontSize=11, leading=14,
    textColor=PRIMARY_DARK, spaceBefore=3*mm, spaceAfter=2*mm
)
style_body = ParagraphStyle(
    'Body', fontName='LibSerif', fontSize=10, leading=15,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=2*mm
)
style_body_bold = ParagraphStyle(
    'BodyBold', fontName='LibSerif-Bold', fontSize=10, leading=15,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=2*mm
)
style_bullet = ParagraphStyle(
    'Bullet', fontName='LibSerif', fontSize=10, leading=15,
    textColor=TEXT, leftIndent=15, bulletIndent=5,
    spaceAfter=1.5*mm
)
style_table_header = ParagraphStyle(
    'TableHeader', fontName='LibSans-Bold', fontSize=9, leading=12,
    textColor=WHITE, alignment=TA_LEFT
)
style_table_cell = ParagraphStyle(
    'TableCell', fontName='LibSans', fontSize=9, leading=12,
    textColor=TEXT, alignment=TA_LEFT
)
style_table_cell_bold = ParagraphStyle(
    'TableCellBold', fontName='LibSans-Bold', fontSize=9, leading=12,
    textColor=TEXT, alignment=TA_LEFT
)
style_caption = ParagraphStyle(
    'Caption', fontName='LibSans', fontSize=8.5, leading=11,
    textColor=TEXT_MUTED, spaceBefore=2*mm, spaceAfter=4*mm
)
style_callout = ParagraphStyle(
    'Callout', fontName='LibSerif-Bold', fontSize=10.5, leading=15,
    textColor=PRIMARY_DARK, alignment=TA_LEFT, spaceAfter=2*mm
)
style_stat = ParagraphStyle(
    'Stat', fontName='LibSerif-Bold', fontSize=28, leading=32,
    textColor=ACCENT, alignment=TA_CENTER
)
style_stat_label = ParagraphStyle(
    'StatLabel', fontName='LibSans', fontSize=9, leading=12,
    textColor=TEXT_MUTED, alignment=TA_CENTER
)
style_footer = ParagraphStyle(
    'Footer', fontName='LibSans', fontSize=8, leading=10,
    textColor=TEXT_MUTED, alignment=TA_CENTER
)

# ── Helper Functions ──
def make_table(headers, rows, col_widths=None):
    """Create a styled table like the reference PDFs."""
    header_row = [Paragraph(h, style_table_header) for h in headers]
    data_rows = []
    for row in rows:
        data_rows.append([Paragraph(str(cell), style_table_cell) for cell in row])
    all_data = [header_row] + data_rows
    
    if col_widths is None:
        col_widths = [160*mm / len(headers)] * len(headers)
    
    t = Table(all_data, colWidths=col_widths, repeatRows=1)
    
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'LibSans-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
        ('FONTNAME', (0, 1), (-1, -1), 'LibSans'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TOPPADDING', (0, 1), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]
    # Alternating row colors
    for i in range(1, len(all_data)):
        if i % 2 == 0:
            style_cmds.append(('BACKGROUND', (0, i), (-1, i), CREAM))
        else:
            style_cmds.append(('BACKGROUND', (0, i), (-1, i), WHITE))
    
    t.setStyle(TableStyle(style_cmds))
    return t

def make_callout_box(text):
    """Create a highlighted callout box like HarchAgri's key insight boxes."""
    t = Table([[Paragraph(text, style_callout)]], colWidths=[155*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1.5, PRIMARY),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    return t

def stat_block(number, unit, label):
    """Create a stat block with big number + label."""
    num_para = Paragraph(f'{number}<font size="18">{unit}</font>', style_stat)
    label_para = Paragraph(label, style_stat_label)
    t = Table([[num_para], [label_para]], colWidths=[60*mm])
    t.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    return t

def section_divider():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=3*mm, spaceBefore=3*mm)

# ── Build Document ──
output_path = "/home/z/my-project/download/ClearPath_AI_Showcase.pdf"
doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=25*mm, rightMargin=25*mm,
    topMargin=25*mm, bottomMargin=25*mm
)

story = []

# ══════════════════════════════════════
# PAGE 1: COVER
# ══════════════════════════════════════
story.append(Spacer(1, 30*mm))

# Top label
meta_style = ParagraphStyle('CoverLabel', fontName='LibSans-Bold', fontSize=10, leading=13,
    textColor=PRIMARY, spaceAfter=2*mm)
story.append(Paragraph('USAII GLOBAL AI HACKATHON 2026', meta_style))
story.append(Paragraph('COMMUNITY TRACK', meta_style))

story.append(Spacer(1, 8*mm))

# Title
story.append(Paragraph('ClearPath AI', style_cover_title))

# Decorative line
story.append(HRFlowable(width="40%", thickness=2, color=ACCENT, spaceAfter=6*mm, spaceBefore=2*mm, hAlign='LEFT'))

# Subtitle
story.append(Paragraph('Community Resource Navigator', style_cover_subtitle))
story.append(Paragraph('We don\'t just find help. We show you why.', 
    ParagraphStyle('Tagline', fontName='LibSerif-Italic', fontSize=12, leading=16,
    textColor=TEXT_MUTED, spaceAfter=8*mm)))

story.append(Spacer(1, 15*mm))

# Bottom stats bar
stats_text = '6 INTELLIGENCE LAYERS / CALIBRATED CONFIDENCE / CRISIS SAFETY NET / 100% FREE & OPEN SOURCE'
stats_style = ParagraphStyle('StatsBar', fontName='LibSans', fontSize=8.5, leading=11,
    textColor=TEXT_MUTED, spaceAfter=2*mm)
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=3*mm))
story.append(Paragraph(stats_text, stats_style))

story.append(Spacer(1, 5*mm))

# Author / Date
story.append(Paragraph('Amine Harch El Korane & Harshit Singh', style_cover_meta))
story.append(Paragraph('Juin 2026', style_cover_meta))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 2: TABLE OF CONTENTS
# ══════════════════════════════════════
story.append(Paragraph('Table des Matieres', style_h1))
story.append(section_divider())

toc_items = [
    ('1.', 'Le Probleme : Les Reponses Confiantes et Fausses', '3'),
    ('2.', 'L\'Insight : L\'Incertitude est une Feature de Securite', '4'),
    ('3.', 'La Solution : ClearPath AI', '5'),
    ('4.', 'Comment Ca Marche : 6 Couches d\'Intelligence', '6'),
    ('5.', 'Demo : L\'Experience Utilisateur', '7'),
    ('6.', 'Architecture Technique', '8'),
    ('7.', 'IA Responsable : 3 Mecanismes de Securite', '9'),
    ('8.', 'Impact et Metriques', '10'),
    ('9.', 'Equipe et Repartition', '11'),
    ('10.', 'Feuille de Route', '12'),
]

toc_style_num = ParagraphStyle('TOCNum', fontName='LibSans-Bold', fontSize=10, leading=16,
    textColor=PRIMARY)
toc_style_item = ParagraphStyle('TOCItem', fontName='LibSerif', fontSize=10, leading=16,
    textColor=TEXT)
toc_style_page = ParagraphStyle('TOCPage', fontName='LibSans', fontSize=10, leading=16,
    textColor=TEXT_MUTED, alignment=TA_RIGHT)

toc_data = []
for num, item, page in toc_items:
    toc_data.append([
        Paragraph(num, toc_style_num),
        Paragraph(item, toc_style_item),
        Paragraph(page, toc_style_page)
    ])

toc_table = Table(toc_data, colWidths=[12*mm, 130*mm, 18*mm])
toc_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 2),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ('LINEBELOW', (1, 0), (1, -1), 0.3, HexColor('#e0e0e0')),
]))

story.append(toc_table)
story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 3: LE PROBLEME
# ══════════════════════════════════════
story.append(Paragraph('1. Le Probleme : Les Reponses Confiantes et Fausses', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'Quand quelqu\'un cherche de l\'aide, une reponse confiante et fausse est plus dangereuse '
    'que pas de reponse du tout. C\'est le probleme fondamental que personne dans l\'espace des '
    'ressources communautaires ne veut admettre : les systemes actuels, qu\'ils soient des moteurs '
    'de recherche ou des plateformes AI, donnent des reponses uniques et confiantes meme quand '
    'elles n\'en sont pas certaines. Et dans le domaine de l\'aide communautaire, une mauvaise '
    'orientation peut couter un logement, une opportunite juridique, ou meme une vie.',
    style_body))

story.append(Paragraph(
    'Consider cette situation : quelqu\'un tape "je ne peux plus payer mon loyer" dans un moteur '
    'de recherche. Le systeme lui donne des programmes d\'aide au logement avec des listes '
    'd\'attente de 3 mois. Mais ce dont cette personne a reellement besoin, c\'est d\'une aide '
    'juridique d\'urgence pour une defense contre l\'expulsion, disponible sous 24 heures. La '
    'reponse confiante du systeme lui a fait perdre un temps precieux et l\'a empechee de chercher '
    'la bonne ressource. Le match confiant vient de lui couter son logement.',
    style_body))

story.append(Paragraph(
    'Le vrai probleme n\'est pas que les ressources sont difficiles a trouver. C\'est l\'ecart '
    'entre ce que les gens demandent et ce dont ils ont reellement besoin. Les gens en crise '
    'cherchent ce qu\'ils savent nommer, pas ce dont ils ont besoin. Quelqu\'un tape "aide '
    'alimentaire" quand son vrai probleme est un avis d\'expulsion. L\'ecart entre la demande '
    'et le besoin reel est exactement la ou l\'AI peut intervenir, mais seulement si elle est '
    'honnete sur ce qu\'elle sait et ce qu\'elle ignore.',
    style_body))

story.append(Spacer(1, 3*mm))
story.append(make_callout_box(
    'Le vrai probleme : les systemes actuels donnent des reponses confiantes et fausses. '
    'Dans le domaine de l\'aide communautaire, ca peut couter un logement ou une vie.'))

story.append(Spacer(1, 5*mm))

# Stats
story.append(stat_block('73', '%', 'DES RECHERCHES DE RESSOURCES COMMUNAUTAIRES MENENT A DES IMPASSES'))

story.append(Spacer(1, 3*mm))

# Problem comparison table
story.append(Paragraph('1.1 Comparaison : Reponse Confiante vs Reponse Honnete', style_h2))

prob_headers = ['Situation', 'Reponse Confiante (actuelle)', 'Reponse Honnete (ClearPath)']
prob_rows = [
    ['"Je ne peux plus payer mon loyer"',
     'Programme d\'aide au logement (liste d\'attente 3 mois)',
     'Aide juridique 78% + Aide financiere 52% + Logement 34%. "Je ne suis pas certain, voici les possibilites."'],
    ['"J\'ai besoin de nourriture"',
     'Banque alimentaire la plus proche',
     'Aide alimentaire 65% + Aide financiere 41% + Aide juridique 22%. "D\'autres besoins sont possibles."'],
    ['"Je ne me sens pas en securite"',
     'Conseiller en sante mentale (rdv dans 2 semaines)',
     'DETECTION DE CRISE: Ligne de crise 988 IMMEDIATEMENT + ressources de soutien'],
]
story.append(make_table(prob_headers, prob_rows, [35*mm, 55*mm, 70*mm]))
story.append(Paragraph('Tableau 1 : Comparaison reponse confiante vs reponse honnete', style_caption))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 4: L'INSIGHT
# ══════════════════════════════════════
story.append(Paragraph('2. L\'Insight : L\'Incertitude est une Feature de Securite', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'La plupart des systemes AI cachent leur incertitude. Ils presentent une seule reponse '
    'avec assurance, meme quand le modele n\'est pas sur. Dans le commerce electronique, '
    'c\'est agacant. Dans les ressources communautaires, c\'est dangereux. Quand quelqu\'un '
    'est en crise, une reponse fausse qui a l\'air certaine est plus nocive que pas de reponse '
    'du tout, parce qu\'elle arrete la recherche. La personne pense avoir trouve la solution '
    'alors qu\'elle est sur la mauvaise piste.',
    style_body))

story.append(Paragraph(
    'Notre insight fondamental est simple : <b>et si l\'AI montrait ce qu\'elle sait, ce '
    'qu\'elle ne sait pas, et pourquoi ?</b> Au lieu de cacher l\'incertitude, nous en '
    'faisons la fonctionnalite centrale du produit. L\'incertitude n\'est pas un bug. C\'est '
    'la fonctionnalite de securite la plus importante du systeme. Quand l\'AI dit "je suis '
    'sur a 78% que vous avez besoin d\'aide juridique, mais il y a aussi 52% de chance que '
    'vous ayez besoin d\'une aide financiere d\'urgence", l\'utilisateur a une image complete '
    'de la situation. Il peut prendre une decision eclairee au lieu de suivre aveuglement '
    'une seule recommendation.',
    style_body))

story.append(Paragraph(
    'Cette approche n\'est pas juste une question d\'ethique. C\'est aussi une meilleure '
    'architecture AI. En montrant les scores de confiance et en proposant des questions de '
    'clarification, le systeme s\'améliore naturellement : chaque interaction affine la '
    'precision du modele. C\'est de l\'apprentissage actif integre dans le design du produit. '
    'Les utilisateurs ne sont pas des sujets passifs qui recoivent une reponse. Ils sont des '
    'participants actifs dans le processus de classification, ce qui rend chaque resultat '
    'plus precis et plus pertinent.',
    style_body))

story.append(Spacer(1, 3*mm))
story.append(make_callout_box(
    'L\'insight : une reponse honnete et incertaine peut sauver une vie. '
    'Une reponse confiante et fausse peut en detruire une. L\'incertitude '
    'n\'est pas un bug, c\'est la fonctionnalite de securite.'))

story.append(Spacer(1, 5*mm))

story.append(Paragraph('2.1 Pourquoi les Autres Solutions Echouent', style_h2))

fail_headers = ['Approche', 'Probleme', 'Consequence']
fail_rows = [
    ['Moteur de recherche classique', 'Pas de comprehension du contexte. Mot-cle = resultat.', 'Donne la ressource la plus populaire, pas la plus pertinente'],
    ['Chatbot AI standard', 'Reponse unique confiante. Pas de scores de confiance.', 'Orientations incorrectes avec assurance, l\'utilisateur arrete de chercher'],
    ['Formulaire categoriel', 'L\'utilisateur doit connaitre le jargon des services sociaux.', 'Les personnes en crise ne savent pas quel mot-cle chercher'],
    ['Annuaires 211 existants', 'Navigation complexe, pas de personnalisation.', 'Parcours long et frustrant, abandon en cours de route'],
]
story.append(make_table(fail_headers, fail_rows, [40*mm, 55*mm, 65*mm]))
story.append(Paragraph('Tableau 2 : Pourquoi les solutions existantes echouent', style_caption))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 5: LA SOLUTION
# ══════════════════════════════════════
story.append(Paragraph('3. La Solution : ClearPath AI', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'ClearPath AI est un navigateur de ressources communautaires qui affiche la confiance '
    'calibree au lieu de cacher l\'incertitude. Au lieu de donner une seule reponse '
    'confiante, le systeme montre plusieurs correspondances avec des scores de confiance, '
    'pose des questions de clarification quand c\'est flou, et recule vers un humain '
    'quand il n\'est pas assez sur. C\'est de l\'AI honnete pour des situations critiques.',
    style_body))

story.append(Paragraph('3.1 Les Six Couches d\'Intelligence Transparente', style_h2))

layers_headers = ['Couche', 'Fonction', 'Technologie']
layers_rows = [
    ['1. Saisie libre', 'L\'utilisateur decrit sa situation en langage naturel, sans jargon ni formulaire', 'Interface texte simple'],
    ['2. Detection de crise', 'Mot-cles de crise detectes instantanement, ressources d\'urgence affichees en premier. L\'AI NE PEUT PAS outrepasser cette couche', 'Python keyword engine (hardcode)'],
    ['3. Classification multi-label', 'Plusieurs categories avec scores de confiance, pas une seule reponse. Ex : Aide juridique 78%, Aide financiere 52%, Logement 34%', 'Hugging Face zero-shot NLP'],
    ['4. Questions de clarification', 'Si confiance < 70%, le systeme pose UNE question pour affiner. Pas deviner plus fort, demander plus intelligemment', 'Active learning + arbre de decision'],
    ['5. Affichage transparent', 'Chaque recommendation montre POURQUOI, QUOI D\'AUTRE, et CONFIANCE. L\'utilisateur voit tout le raisonnement', 'React frontend + confidence UI'],
    ['6. Escalade humaine', 'Quand l\'AI n\'est pas sur, elle recule et connecte a un navigateur humain (211). Elle dit POURQUOI elle recommande l\'escalade', '211 API + lien telephone/chat'],
]
story.append(make_table(layers_headers, layers_rows, [35*mm, 75*mm, 50*mm]))
story.append(Paragraph('Tableau 3 : Les six couches d\'intelligence transparente de ClearPath AI', style_caption))

story.append(Spacer(1, 3*mm))

story.append(Paragraph('3.2 Le Principe de Conception', style_h2))

story.append(Paragraph(
    'Le principe directeur de ClearPath AI est simple : <b>la responsabilite est dans '
    'l\'architecture, pas dans un avertissement.</b> La plupart des systemes AI ajoutent '
    'un disclaimer en bas de page qui dit "l\'AI peut faire des erreurs". Nous avons '
    'construit les limites directement dans le design du systeme. La couche de crise est '
    'hardcodee pour que l\'IA ne puisse jamais la desactiver. Les scores de confiance sont '
    'toujours visibles, pas optionnels. L\'escalade humaine est automatique quand la '
    'confiance est basse, pas un bouton que l\'utilisateur doit trouver.',
    style_body))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 6: COMMENT CA MARCHE
# ══════════════════════════════════════
story.append(Paragraph('4. Comment Ca Marche : Parcours Utilisateur', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'Voici le parcours complet d\'un utilisateur qui cherche de l\'aide. Chaque etape '
    'montre comment les six couches interagissent pour fournir une experience transparente '
    'et sure. L\'objectif n\'est pas de remplacer les travailleurs sociaux ou les navigateurs '
    'de ressources, mais de les completer en filtrant les cas simples et en orientant '
    'correctement les cas complexes.',
    style_body))

steps_headers = ['Etape', 'Ce qui se passe', 'Couche active']
steps_rows = [
    ['1. Saisie', 'L\'utilisateur tape : "Je ne peux plus payer mon loyer"', 'Couche 1 : Saisie libre'],
    ['2. Verification crise', 'Pas de mot-cle de crise immediate. Mais insecurite logement detectee. Ligne 211 affichee en haut par precaution', 'Couche 2 : Detection de crise'],
    ['3. Classification NLP', 'Le modele zero-shot analyse le texte et identifie 3 categories avec scores de confiance : Aide juridique 78%, Aide financiere d\'urgence 52%, Logement d\'urgence 34%', 'Couche 3 : Classification multi-label'],
    ['4. Clarification', 'Confiance du top resultat < 80%. Le systeme pose une question : "Avez-vous recu un avis d\'expulsion ?"', 'Couche 4 : Questions de clarification'],
    ['5. Affinement', 'Si Oui : Aide juridique monte a 94%. Si Non : Aide financiere remonte. Le systeme reclassifie avec la nouvelle information', 'Couche 3 + 4'],
    ['6. Resultat transparent', '3 ressources par categorie, chaque ressource montre : nom, eligibilite, delai d\'attente, contact, et POURQUOI c\'est recommande', 'Couche 5 : Affichage transparent'],
    ['7. Escalade (si besoin)', 'Si confiance reste basse apres clarification, le systeme recommande de parler a un navigateur et explique pourquoi', 'Couche 6 : Escalade humaine'],
]
story.append(make_table(steps_headers, steps_rows, [20*mm, 95*mm, 45*mm]))
story.append(Paragraph('Tableau 4 : Parcours utilisateur complet', style_caption))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 7: DEMO
# ══════════════════════════════════════
story.append(Paragraph('5. Demo : L\'Experience Utilisateur', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'Voici ce que voit l\'utilisateur quand il tape "I can\'t pay rent anymore" dans '
    'ClearPath AI. Cette demo illustre les couches 2, 3, 5 et 6 en action simultanement, '
    'montrant comment le systeme gere la transparence, la securite et l\'escalade dans '
    'une seule interaction.',
    style_body))

story.append(Paragraph('5.1 Ecran de Resultat', style_h2))

# Simulated UI
demo_style = ParagraphStyle('Demo', fontName='LibSans', fontSize=9, leading=13,
    textColor=TEXT)
demo_bold = ParagraphStyle('DemoBold', fontName='LibSans-Bold', fontSize=9, leading=13,
    textColor=PRIMARY_DARK)
demo_alert = ParagraphStyle('DemoAlert', fontName='LibSans-Bold', fontSize=9, leading=13,
    textColor=HexColor('#c01c28'))

demo_content = [
    [Paragraph('EMERGENCY: If you are facing imminent eviction, call 211 now', demo_alert)],
    [Paragraph('', demo_style)],
    [Paragraph('I detected multiple possible needs in your message:', demo_bold)],
    [Paragraph('', demo_style)],
]

demo_data = [
    [Paragraph('<b>Resource Type</b>', style_table_header),
     Paragraph('<b>Confidence</b>', style_table_header),
     Paragraph('<b>Why</b>', style_table_header)],
    [Paragraph('Legal Aid', style_table_cell_bold),
     Paragraph('78%', style_table_cell),
     Paragraph('"Can\'t pay rent" strongly suggests legal eviction defense', style_table_cell)],
    [Paragraph('Emergency Funds', style_table_cell_bold),
     Paragraph('52%', style_table_cell),
     Paragraph('Financial emergency assistance programs exist', style_table_cell)],
    [Paragraph('Housing Support', style_table_cell_bold),
     Paragraph('34%', style_table_cell),
     Paragraph('Risk of homelessness if rent situation unresolved', style_table_cell)],
]

demo_table = Table(demo_data, colWidths=[40*mm, 25*mm, 95*mm])
demo_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('BACKGROUND', (0, 1), (-1, 1), CREAM),
    ('BACKGROUND', (0, 3), (-1, 3), CREAM),
]))

story.append(demo_table)
story.append(Spacer(1, 3*mm))

story.append(Paragraph(
    'I am not certain enough to recommend just one. Legal Aid is the strongest match, '
    'but you may qualify for multiple types of help.',
    ParagraphStyle('DemoNote', fontName='LibSerif-Italic', fontSize=10, leading=14,
    textColor=TEXT_MUTED, spaceAfter=3*mm)))

story.append(make_callout_box(
    'Talk to a navigator (211) who can ask follow-up questions. '
    'Explore all 3 resource categories above.'))

story.append(Spacer(1, 5*mm))

story.append(Paragraph('5.2 Question de Clarification', style_h2))
story.append(Paragraph(
    'Quand l\'utilisateur clique sur "Affiner les resultats", le systeme pose une question '
    'specifique basee sur l\'analyse NLP : "Avez-vous recu un avis d\'expulsion ?" Si la '
    'reponse est Oui, la confiance pour l\'aide juridique passe de 78% a 94% et les '
    'resultats sont reordonnes avec les ressources juridiques en premier. Si la reponse est '
    'Non, l\'aide financiere remonte et le systeme montre les programmes d\'urgence monetaire '
    'en priorite. C\'est de l\'apprentissage actif en action : chaque question affine la '
    'precision du resultat sans jamais deviner plus fort.',
    style_body))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 8: ARCHITECTURE TECHNIQUE
# ══════════════════════════════════════
story.append(Paragraph('6. Architecture Technique', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'L\'architecture de ClearPath AI est concue pour etre entierement gratuite et open source. '
    'Pas d\'APIs payantes, pas de services cloud couteux. Le systeme peut tourner sur un '
    'ordinateur portable avec Python et un navigateur. Cette simplicite est un choix '
    'delibere : les juges du hackathon ne favorisent pas les outils payants, et notre '
    'solution doit etre deployable dans n\'importe quel contexte communautaire, meme avec '
    'des ressources limitees.',
    style_body))

story.append(Paragraph('6.1 Stack Technique Complet', style_h2))

tech_headers = ['Composant', 'Technologie', 'Role', 'Cout']
tech_rows = [
    ['Frontend', 'React + TypeScript', 'Interface utilisateur, affichage des scores de confiance', 'Gratuit'],
    ['Backend API', 'Node.js + Express', 'Routage des requetes, logique metier', 'Gratuit'],
    ['Pipeline NLP', 'Python + Hugging Face Transformers', 'Classification zero-shot multi-label', 'Gratuit'],
    ['Calibration', 'Temperature scaling (Python)', 'Ajustement des scores de confiance', 'Gratuit'],
    ['Clarification', 'Arbre de decision (Python)', 'Questions de suivi contextuelles', 'Gratuit'],
    ['Detection de crise', 'Python keyword engine', 'Detection hardcodee, non overridable', 'Gratuit'],
    ['Base de donnees', 'MongoDB', 'Ressources communautaires locales', 'Gratuit (Atlas free tier)'],
    ['Hebergement', 'Vercel + Railway', 'Frontend + backend deployes', 'Gratuit (free tier)'],
]
story.append(make_table(tech_headers, tech_rows, [30*mm, 45*mm, 60*mm, 25*mm]))
story.append(Paragraph('Tableau 5 : Stack technique complet', style_caption))

story.append(Spacer(1, 3*mm))

story.append(Paragraph('6.2 Flux de Donnees', style_h2))

story.append(Paragraph(
    'Le flux de donnees suit un pipeline lineaire a 5 etapes. D\'abord, l\'input utilisateur '
    'passe par la couche de detection de crise (hardcodee, pas d\'AI). Ensuite, le texte est '
    'envoye au classificateur zero-shot Hugging Face qui retourne les scores pour chaque '
    'categorie. Ces scores sont calibres par temperature scaling, une technique bien connue '
    'de calibration de confiance. Si le score le plus haut est inferieur a 70%, le systeme '
    'declenche une question de clarification. Apres clarification, le texte enrichi est '
    'reclassify. Enfin, les resultats sont rendus dans l\'interface avec les trois informations '
    'cles : pourquoi, quoi d\'autre, et confiance.',
    style_body))

story.append(make_callout_box(
    '100% gratuit. Aucune API payante. Aucun service cloud couteux. Deployable '
    'sur un ordinateur portable avec Python et un navigateur.'))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 9: IA RESPONSABLE
# ══════════════════════════════════════
story.append(Paragraph('7. IA Responsable : 3 Mecanismes de Securite', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'La responsabilite n\'est pas un avertissement en bas de page. Elle est directement '
    'integree dans l\'architecture du systeme. Chaque mecanisme de securite est concu pour '
    'etre automatique et non overridable par l\'AI. Le systeme ne peut pas "oublier" d\'afficher '
    'les scores de confiance. Il ne peut pas ignorer la detection de crise. Il ne peut pas '
    'eviter l\'escalade humaine quand il n\'est pas sur. Ces mecanismes sont des contraintes '
    'architecturales, pas des fonctionnalites optionnelles.',
    style_body))

safety_headers = ['Mecanisme', 'Comment ca marche', 'Pourquoi c\'est dans l\'architecture']
safety_rows = [
    ['1. Couche de crise hardcodee',
     'Detection de mot-cles (suicide, danger, violence, urgence) qui affiche TOUJOURS les ressources de crise en premier, quel que soit le resultat de l\'AI',
     'L\'AI peut mal classer une situation de crise. Cette couche ne peut pas etre outrepassee par le modele. C\'est une contrainte materielle, pas un parametre'],
    ['2. Transparence forcee',
     'Les scores de confiance sont TOUJOURS visibles. Le systeme ne presente JAMAIS une seule reponse comme certaine quand elle ne l\'est pas',
     'Cacher l\'incertitude donne une confiance artificielle qui arrete la recherche. Montrer l\'incertitude encourage l\'exploration et la verification'],
    ['3. Escalade humaine automatique',
     'Quand aucune categorie ne depasse 70% de confiance, le systeme recommande automatiquement de parler a un navigateur humain (211)',
     'L\'AI ne doit jamais deviner plus fort quand elle n\'est pas sure. Reculer est la reponse la plus responsable'],
]
story.append(make_table(safety_headers, safety_rows, [35*mm, 65*mm, 60*mm]))
story.append(Paragraph('Tableau 6 : Les trois mecanismes de securite integres', style_caption))

story.append(Spacer(1, 5*mm))

story.append(Paragraph('7.1 Limites Connues', style_h2))

story.append(Paragraph(
    'La transparence exige de reconnaitre les limites de son systeme. ClearPath AI ne peut '
    'pas determiner l\'eligibilite d\'un utilisateur a un programme. Il ne peut pas remplacer '
    'un travailleur social professionnel. Il peut mal classer des situations complexes avec '
    'des besoins multiples. Et il depend entirely de la qualite des donnees de ressources '
    'locales, qui doivent etre collectees et mises a jour manuellement. Ces limites ne sont '
    'pas des faiblesses cachees, elles sont des frontieres claires que nous communiquons '
    'explicitement a chaque utilisateur.',
    style_body))

limits_headers = ['Limite', 'Explication', 'Mitigation']
limits_rows = [
    ['Eligibilite', 'Le systeme ne peut pas determiner si un utilisateur est eligible a un programme', 'Affichage des criteres d\'eligibilite pour chaque ressource'],
    ['Remplacement humain', 'ClearPath ne remplace pas un travailleur social ou un navigateur', 'Escalade automatique vers un humain pour les cas complexes'],
    ['Classification complexe', 'Les situations multi-besoins peuvent etre mal classees', 'Scores de confiance bas + clarification + escalade humaine'],
    ['Qualite des donnees', 'Depend de la precision des ressources collectees manuellement', 'Base de donnees initiale de 50-100 ressources verifiees, mise a jour reguliere'],
]
story.append(make_table(limits_headers, limits_rows, [35*mm, 65*mm, 60*mm]))
story.append(Paragraph('Tableau 7 : Limites connues et strategies de mitigation', style_caption))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 10: IMPACT ET METRIQUES
# ══════════════════════════════════════
story.append(Paragraph('8. Impact et Metriques', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'L\'impact de ClearPath AI ne se mesure pas en "personnes qui ont trouve une ressource". '
    'Ca, n\'importe quel moteur de recherche peut le faire. L\'impact reel se mesure en '
    'personnes qui ont obtenu la BONNE ressource au lieu de la mauvaise. En personnes qui '
    'n\'ont pas ete orientees incorrectement par une reponse confiante et fausse. En personnes '
    'qui, grace a la transparence du systeme, ont decouvert des ressources qu\'ils ne '
    'savaient pas exister.',
    style_body))

impact_headers = ['Metrique', 'Definition', 'Cible']
impact_rows = [
    ['Taux de redirection correcte', 'Pourcentage de cas ou la ressource recommandee correspond au besoin reel', '> 85%'],
    ['Taux de faux positif (redirection incorrecte)', 'Pourcentage de cas ou la ressource principale recommandee ne correspond pas au besoin reel', '< 10%'],
    ['Taux d\'escalade appropriee', 'Pourcentage de fois ou l\'escalade humaine etait la bonne decision', '> 75%'],
    ['Temps jusqu\'a la bonne ressource', 'Temps moyen entre la saisie et la bonne orientation', '< 3 minutes'],
    ['Decouverte de nouvelles ressources', 'Pourcentage d\'utilisateurs qui decouvrent un type d\'aide qu\'ils ne cherchaient pas', '> 40%'],
    ['Taux de crise detectee', 'Pourcentage de situations de crise correctement identifiees par la couche hardcodee', '100% (cible absolue)'],
]
story.append(make_table(impact_headers, impact_rows, [45*mm, 80*mm, 35*mm]))
story.append(Paragraph('Tableau 8 : Metriques d\'impact et cibles', style_caption))

story.append(Spacer(1, 5*mm))

story.append(Paragraph('8.1 Pourquoi Ces Metriques Gagnent les Prix Speciaux', style_h2))

story.append(Paragraph(
    '<b>Best Responsible AI Design ($250) :</b> Notre innovation centrale est de montrer les '
    'limites de l\'AI. La responsabilite n\'est pas un disclaimer, c\'est le produit. Les '
    'mecanismes de securite sont dans l\'architecture, pas en option. Le juge d\'Anthropic '
    '(Charu Maheshwari) et le juge de securite (Pranav Saji) comprennent exactement pourquoi '
    'c\'est important : un systeme qui sait quand il ne sait pas est plus sur qu\'un systeme '
    'qui pretend toujours savoir.',
    style_body))

story.append(Paragraph(
    '<b>Best Social Impact ($250) :</b> L\'impact reel n\'est pas "nous avons aide 100 '
    'personnes a trouver des ressources". C\'est "nous avons empeche 100 personnes d\'obtenir '
    'la MAUVAISE ressource et de tomber dans les mailles du filet". Le juge de GatherGov '
    '(Hardik Bansal) et le juge de BankUnited (Nidhi Agarwal) comprennent que preventer les '
    'mauvaises orientations est plus impactant que faire plus de bonnes orientations.',
    style_body))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 11: EQUIPE
# ══════════════════════════════════════
story.append(Paragraph('9. Equipe et Repartition', style_h1))
story.append(section_divider())

team_headers = ['Membre', 'Role', 'Responsabilites']
team_rows = [
    ['Amine Harch El Korane', 'Concepteur + AI Lead',
     'Architecture conceptuelle, pipeline NLP (zero-shot + calibration), logique de clarification, couche de crise, collecte de donnees de ressources, materials de soumission (pitch video, Devpost, README)'],
    ['Harshit Singh', 'Full-Stack Developer + Security',
     'Frontend React, backend Node.js + Express, base de donnees MongoDB, deploiement (Vercel + AWS), securite et validation des donnees (CNDv2 certified), review de l\'architecture responsable'],
]
story.append(make_table(team_headers, team_rows, [40*mm, 40*mm, 80*mm]))
story.append(Paragraph('Tableau 9 : Repartition des roles dans l\'equipe', style_caption))

story.append(Spacer(1, 5*mm))

task_headers = ['Tache', 'Amine', 'Harshit']
task_rows = [
    ['Architecture conceptuelle', 'Conception', 'Review'],
    ['Pipeline NLP + calibration confiance', 'Implementation', ''],
    ['Logique de clarification', 'Implementation', ''],
    ['Couche de detection de crise', 'Implementation', ''],
    ['Base de donnees ressources (collecte)', 'Collecte', 'Structure DB'],
    ['Frontend React', 'Design UI', 'Implementation'],
    ['Backend Node.js + API', '', 'Implementation'],
    ['Deploiement', '', 'Implementation'],
    ['Pitch video + Devpost', 'Script + voix', 'Review + voix'],
    ['README + RESPONSIBLE_AI.md', 'Redaction', 'Review technique'],
    ['UI/UX affichage confiance', 'Design', 'Implementation'],
]
story.append(make_table(task_headers, task_rows, [55*mm, 50*mm, 55*mm]))
story.append(Paragraph('Tableau 10 : Repartition detaillee des taches', style_caption))

story.append(PageBreak())

# ══════════════════════════════════════
# PAGE 12: FEUILLE DE ROUTE
# ══════════════════════════════════════
story.append(Paragraph('10. Feuille de Route', style_h1))
story.append(section_divider())

story.append(Paragraph(
    'La feuille de route couvre la periode du hackathon (14-21 juin) plus les phases '
    'de developpement ulterieures. La strategie est de construire un MVP fonctionnel '
    'pendant le hackathon qui demontre les couches 2, 3, 5 et 6 (crise, classification, '
    'affichage et escalade), puis d\'ajouter la clarification (couche 4) et d\'ameliorer '
    'la calibration dans les phases suivantes.',
    style_body))

road_headers = ['Phase', 'Periode', 'Objectifs', 'Livrables']
road_rows = [
    ['Qualifier', '7-10 juin', 'Repondre aux 8 questions du qualifier avec le framing ClearPath AI', 'Reponses qualifiees soumisses'],
    ['Preparation', '11-13 juin', 'Setup environnement de dev, design UI, schema base de donnees', 'Repo GitHub initialise, maquettes UI'],
    ['Sprint 1', '14-15 juin', 'Pipeline NLP + detection de crise + base de donnees initiale (50 ressources)', 'Pipeline fonctionnel, 50 ressources collectees'],
    ['Sprint 2', '16-17 juin', 'Frontend React + backend API + affichage des scores de confiance', 'Interface fonctionnelle avec classification'],
    ['Sprint 3', '18-19 juin', 'Clarification questions + escalade humaine + deploiement', 'App deployee, toutes les couches actives'],
    ['Sprint 4', '20 juin', 'Polish UI, README, RESPONSIBLE_AI.md, tests utilisateurs', 'Documentation complete, app stable'],
    ['Soumission', '21 juin', 'Video de pitch (3 min), description Devpost, repo final', 'Soumission complete avant deadline'],
]
story.append(make_table(road_headers, road_rows, [25*mm, 22*mm, 58*mm, 55*mm]))
story.append(Paragraph('Tableau 11 : Feuille de route detaillee', style_caption))

story.append(Spacer(1, 5*mm))

# Closing callout
story.append(make_callout_box(
    'Quand ca compte le plus, l\'honetete est la reponse la plus sure. '
    'ClearPath AI ne trouve pas simplement de l\'aide. Il montre pourquoi.'))

# ── Page number footer ──
def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont('LibSans', 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawCentredString(A4[0]/2, 15*mm, f'ClearPath AI - USAII Global AI Hackathon 2026')
    canvas.drawRightString(A4[0] - 25*mm, 15*mm, f'{doc.page}')
    canvas.restoreState()

# ── Build ──
doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print(f"PDF generated: {output_path}")
