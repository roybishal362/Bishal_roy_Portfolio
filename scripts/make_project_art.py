# -*- coding: utf-8 -*-
"""
make_project_art.py: draws the hero illustration for each project card (public/projects/art/<id>.svg).

Each one is a small "product shot" in the project's accent colour: it shows what the project does, not a stock picture.
The numbers and labels in the drawings are illustrative UI, except where they repeat a fact from src/data/knowledge.ts.

Layout rule: the cards crop the image (a tall poster keeps only the middle ~48% of the width, and the top fades out
behind the title), so the main subject sits in the middle column, x 320-880, and below y 250.

Run:  python scripts/make_project_art.py
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "projects" / "art"
W, H = 1200, 800
SANS = "Inter, 'Segoe UI', system-ui, -apple-system, Arial, sans-serif"
MONO = "'JetBrains Mono', Consolas, 'Courier New', monospace"

def rgba(hex_, a):
    h = hex_.lstrip("#")
    return f"rgba({int(h[0:2],16)},{int(h[2:4],16)},{int(h[4:6],16)},{a})"

def doc(accent, body, glow=(600, 520)):
    gx, gy = glow
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#11111b"/><stop offset="1" stop-color="#07070c"/></linearGradient>
  <radialGradient id="g1" cx="{gx/W:.3f}" cy="{gy/H:.3f}" r="0.62"><stop offset="0" stop-color="{accent}" stop-opacity="0.42"/><stop offset="0.55" stop-color="{accent}" stop-opacity="0.10"/><stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2" cx="0.08" cy="0.05" r="0.6"><stop offset="0" stop-color="{accent}" stop-opacity="0.28"/><stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#ffffff" fill-opacity="0.07"/></pattern>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.09"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.03"/></linearGradient>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#dots)"/>
<rect width="{W}" height="{H}" fill="url(#g2)"/>
<rect width="{W}" height="{H}" fill="url(#g1)"/>
{body}
</svg>
'''

def panel(x, y, w, h, r=20, stroke=0.18, fill="url(#glass)"):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="#0b0b13" fill-opacity="0.72"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="#ffffff" stroke-opacity="{stroke}" stroke-width="1.4"/>')

def text(x, y, s, size=20, weight=600, fill="#ffffff", op=1.0, anchor="start", mono=False, spacing=0):
    fam = MONO if mono else SANS
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    return f'<text x="{x}" y="{y}" font-family="{fam}" font-size="{size}" font-weight="{weight}" fill="{fill}" fill-opacity="{op}" text-anchor="{anchor}"{ls}>{s}</text>'

def bar(x, y, w, h=10, fill="#ffffff", op=0.22, r=None):
    r = h / 2 if r is None else r
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" fill-opacity="{op}"/>'

def chip(x, y, label, color, size=15, padx=13, h=30, solid=False):
    w = int(len(label) * size * 0.62) + 2 * padx
    fill = color if solid else rgba(color, 0.16)
    tcol = "#0b0b13" if solid else color
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2}" fill="{fill}" stroke="{color}" stroke-opacity="0.55" stroke-width="1.2"/>'
            + text(x + w / 2, y + h / 2 + size * 0.36, label, size=size, weight=600, fill=tcol, anchor="middle", mono=True)), w

def arrow(x1, y1, x2, y2, color, op=0.9, w=2.4):
    ang = math.atan2(y2 - y1, x2 - x1)
    a1, a2 = ang + math.radians(152), ang - math.radians(152)
    hx1, hy1 = x2 + 12 * math.cos(a1), y2 + 12 * math.sin(a1)
    hx2, hy2 = x2 + 12 * math.cos(a2), y2 + 12 * math.sin(a2)
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-opacity="{op}" stroke-width="{w}" stroke-linecap="round"/>'
            f'<path d="M{hx1:.1f} {hy1:.1f} L{x2} {y2} L{hx2:.1f} {hy2:.1f}" fill="none" stroke="{color}" stroke-opacity="{op}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')

def arc(cx, cy, r, a0, a1, color, w=14, op=1.0):
    """Arc from angle a0 to a1 (degrees, 0 = right, clockwise in screen space)."""
    x0, y0 = cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0))
    x1, y1 = cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1))
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return f'<path d="M{x0:.1f} {y0:.1f} A{r} {r} 0 {large} 1 {x1:.1f} {y1:.1f}" fill="none" stroke="{color}" stroke-opacity="{op}" stroke-width="{w}" stroke-linecap="round"/>'

GREEN, AMBER, ORANGE, RED = "#34d399", "#fbbf24", "#fb923c", "#f87171"

# --------------------------------------------------------------------------- 1. Feedback Loop
def ik_platform(a):
    b = [panel(250, 236, 700, 500, r=24)]
    b.append(text(290, 286, "CLASS TIMELINE · 4 H · 8 WINDOWS", size=15, weight=500, op=0.6, mono=True, spacing=2))
    # eight 30-minute windows; two carry a flagged finding
    x0, wseg, gap = 290, 70, 8
    flagged = {2: a, 5: AMBER}
    for i in range(8):
        col, op = (flagged[i], 0.95) if i in flagged else ("#ffffff", 0.16)
        b.append(bar(x0 + i * (wseg + gap), 310, wseg, 16, fill=col, op=op))
    for i, ts in ((2, "01:12:40"), (5, "02:47:05")):
        cx = x0 + i * (wseg + gap) + wseg / 2
        col = flagged[i]
        b.append(f'<line x1="{cx}" y1="326" x2="{cx}" y2="352" stroke="{col}" stroke-width="2"/>')
        c, w = chip(cx - 52, 352, ts, col, size=14, padx=10, h=28)
        b.append(c)
    # a finding: quote + timestamp + a second pass that tries to refute it
    b.append(panel(290, 406, 400, 176, r=16, stroke=0.14))
    b.append(text(314, 452, "“", size=54, weight=700, fill=a))
    b.append(bar(350, 432, 300, 10, op=0.34)); b.append(bar(350, 454, 250, 10, op=0.22)); b.append(bar(350, 476, 280, 10, op=0.22))
    c, w = chip(314, 520, "quote + timestamp", a, size=14); b.append(c)
    c2, _ = chip(314 + w + 10, 520, "2nd pass: upheld", GREEN, size=14); b.append(c2)
    # the headline number
    cx, cy, r = 800, 494, 78
    b.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="12"/>')
    b.append(arc(cx, cy, r, -90, 150, a, w=12))
    b.append(text(cx, cy + 4, "~10 min", size=30, weight=800, anchor="middle"))
    b.append(text(cx, cy + 30, "4-hour class", size=14, weight=500, op=0.6, anchor="middle", mono=True))
    # the note a person approves
    b.append(panel(290, 606, 620, 96, r=16, stroke=0.14))
    b.append(text(314, 640, "INSTRUCTOR NOTE", size=13, weight=500, op=0.55, mono=True, spacing=2))
    b.append(bar(314, 658, 330, 10, op=0.28)); b.append(bar(314, 678, 250, 10, op=0.18))
    c, w = chip(704, 640, "approved by a person", GREEN, size=14); b.append(c)
    return doc(a, "\n".join(b), glow=(640, 480))

# --------------------------------------------------------------------------- 2. C-TRUST
def c_trust(a):
    b = []
    cx, cy, r = 600, 640, 190
    names = ["Safety", "Complete", "Query", "Coding", "Drift", "EDC", "Stability", "Evidence"]
    # eight rule-based agents feed one consensus
    for i, n in enumerate(names):
        ang = math.radians(200 + i * (140 / 7))
        nx, ny = cx + 340 * math.cos(ang) * 0.86, cy + 420 * math.sin(ang) * 0.9
        big = i == 0
        b.append(f'<line x1="{nx:.0f}" y1="{ny:.0f}" x2="{cx}" y2="{cy - 60}" stroke="{a}" stroke-opacity="{0.75 if big else 0.32}" stroke-width="{3 if big else 1.6}"/>')
        rr = 30 if big else 22
        b.append(f'<circle cx="{nx:.0f}" cy="{ny:.0f}" r="{rr + 8}" fill="{a}" fill-opacity="0.16" filter="url(#soft)"/>')
        b.append(f'<circle cx="{nx:.0f}" cy="{ny:.0f}" r="{rr}" fill="#0b0b13" stroke="{a}" stroke-opacity="{1 if big else 0.7}" stroke-width="{2.4 if big else 1.6}"/>')
        b.append(text(nx, ny + 5, "3.0×" if big else str(i + 1), size=15 if big else 14, weight=700, fill="#fff", anchor="middle", mono=True))
        b.append(text(nx, ny - rr - 10, n, size=13, weight=500, op=0.7, anchor="middle", mono=True))
    # the risk gauge, four bands
    for (s, e, col) in ((180, 222, GREEN), (226, 268, AMBER), (272, 314, ORANGE), (318, 360, RED)):
        b.append(arc(cx, cy, r, s, e, col, w=20, op=0.95))
    na = math.radians(242)
    b.append(f'<line x1="{cx}" y1="{cy}" x2="{cx + (r - 36) * math.cos(na):.0f}" y2="{cy + (r - 36) * math.sin(na):.0f}" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>')
    b.append(f'<circle cx="{cx}" cy="{cy}" r="12" fill="#ffffff"/>')
    b.append(text(cx, cy + 60, "weighted consensus → risk 0 to 100", size=17, weight=500, op=0.75, anchor="middle", mono=True))
    c, w = chip(cx - 118, cy + 80, "550+ passing tests", a, size=15); b.append(c)
    return doc(a, "\n".join(b), glow=(600, 560))

# --------------------------------------------------------------------------- 3. Amazon ML
def amazon_ml(a):
    b = []
    # a product: image + text
    b.append(panel(292, 300, 230, 330, r=18))
    b.append(f'<rect x="314" y="322" width="186" height="150" rx="12" fill="{a}" fill-opacity="0.14" stroke="{a}" stroke-opacity="0.5"/>')
    b.append(f'<path d="M332 452 L384 392 L420 430 L448 404 L482 452 Z" fill="{a}" fill-opacity="0.55"/><circle cx="458" cy="358" r="14" fill="{a}" fill-opacity="0.7"/>')
    b.append(bar(314, 494, 170, 11, op=0.34)); b.append(bar(314, 516, 186, 9, op=0.2)); b.append(bar(314, 536, 150, 9, op=0.2)); b.append(bar(314, 556, 170, 9, op=0.2))
    b.append(text(314, 606, "text + image", size=14, weight=500, op=0.55, mono=True))
    # three signals, fused into one model
    ys = (372, 448, 524)
    px, pw, ph = 566, 190, 34
    for y, lab in zip(ys, ("TF-IDF text", "EfficientNet image", "brand encoding")):
        b.append(arrow(526, y + ph / 2, px - 6, y + ph / 2, a, op=0.7, w=2))
        b.append(f'<rect x="{px}" y="{y}" width="{pw}" height="{ph}" rx="{ph / 2}" fill="{rgba(a, 0.16)}" stroke="{a}" stroke-opacity="0.55" stroke-width="1.2"/>')
        b.append(text(px + pw / 2, y + 22, lab, size=14, weight=600, fill=a, anchor="middle", mono=True))
        b.append(f'<line x1="{px + pw}" y1="{y + ph / 2}" x2="{px + pw + 22}" y2="{y + ph / 2}" stroke="{a}" stroke-opacity="0.6" stroke-width="2"/>')
    jx = px + pw + 22
    b.append(f'<line x1="{jx}" y1="{ys[0] + ph / 2}" x2="{jx}" y2="{ys[2] + ph / 2}" stroke="{a}" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/>')
    ty = ys[1] + ph / 2
    b.append(arrow(jx, ty, jx + 30, ty, a, op=0.9, w=2.4))
    # the predicted price
    tx = jx + 38
    b.append(f'<path d="M{tx} {ty} l34 -40 h96 a14 14 0 0 1 14 14 v52 a14 14 0 0 1 -14 14 h-96 z" fill="#0b0b13" stroke="{a}" stroke-width="2.4"/>')
    b.append(f'<circle cx="{tx + 30}" cy="{ty}" r="6" fill="none" stroke="{a}" stroke-width="2.4"/>')
    b.append(text(tx + 90, ty + 9, "$24.90", size=25, weight=800, anchor="middle"))
    b.append(text(tx + 72, ty + 70, "predicted price", size=14, weight=500, op=0.6, anchor="middle", mono=True))
    b.append(text(566, 606, "1,742 features \u2192 LightGBM + XGBoost", size=14, weight=500, op=0.62, mono=True))
    c, w = chip(tx + 26, ty + 92, "Top 8%", a, size=17, h=36, solid=True); b.append(c)
    return doc(a, "\n".join(b), glow=(640, 470))

# --------------------------------------------------------------------------- 4. Cricket scouting
def cricket(a):
    b = []
    cx, cy = 600, 500
    b.append(f'<ellipse cx="{cx}" cy="{cy}" rx="330" ry="232" fill="{a}" fill-opacity="0.07" stroke="{a}" stroke-opacity="0.75" stroke-width="2.4"/>')
    b.append(f'<ellipse cx="{cx}" cy="{cy}" rx="170" ry="120" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1.6" stroke-dasharray="8 8"/>')
    b.append(f'<rect x="{cx - 14}" y="{cy - 52}" width="28" height="104" rx="4" fill="#ffffff" fill-opacity="0.16" stroke="#ffffff" stroke-opacity="0.5"/>')
    # a wagon wheel: where the runs went
    shots = [(-158, 0.98, 1), (-128, 0.7, 0), (-98, 0.94, 1), (-62, 0.55, 0), (-30, 0.99, 1), (8, 0.62, 0), (38, 0.9, 1), (74, 0.46, 0), (118, 0.8, 0), (150, 0.97, 1), (196, 0.6, 0)]
    bx, by = cx, cy + 40
    for ang, dist, four in shots:
        ex = cx + 330 * dist * math.cos(math.radians(ang))
        ey = cy + 232 * dist * math.sin(math.radians(ang))
        b.append(f'<line x1="{bx}" y1="{by}" x2="{ex:.0f}" y2="{ey:.0f}" stroke="{a if four else "#ffffff"}" stroke-opacity="{0.95 if four else 0.35}" stroke-width="{2.6 if four else 1.5}" stroke-linecap="round"/>')
        b.append(f'<circle cx="{ex:.0f}" cy="{ey:.0f}" r="{6 if four else 4}" fill="{a if four else "#ffffff"}" fill-opacity="{1 if four else 0.6}"/>')
    b.append(f'<circle cx="{bx}" cy="{by}" r="8" fill="#ffffff"/>')
    # the ranked shortlist
    b.append(panel(676, 560, 220, 168, r=16))
    b.append(text(696, 592, "UNCAPPED · RANKED", size=13, weight=500, op=0.6, mono=True, spacing=1.5))
    for i, wv in enumerate((150, 126, 108, 84)):
        y = 610 + i * 27
        b.append(text(696, y + 11, str(i + 1), size=14, weight=700, op=0.8, mono=True))
        b.append(bar(718, y, wv, 12, fill=a, op=0.9 - i * 0.17))
    c, w = chip(318, 690, "602,992 deliveries", a, size=15); b.append(c)
    return doc(a, "\n".join(b), glow=(600, 500))

# --------------------------------------------------------------------------- 5. Child mental health
def piu(a):
    b = [panel(270, 250, 660, 250, r=20)]
    b.append(text(300, 292, "WRIST SENSOR · 3 AXES", size=14, weight=500, op=0.6, mono=True, spacing=2))
    for k, (col, op, ph, amp) in enumerate(((a, 0.95, 0.0, 34), ("#ffffff", 0.5, 1.7, 22), ("#2dd4bf", 0.7, 3.1, 16))):
        pts = []
        for i in range(0, 121):
            x = 300 + i * 5
            t = i / 120
            env = 0.35 + 0.65 * abs(math.sin(math.pi * (t * 2.2 + 0.15 * k)))
            y = 390 + 30 * (k - 1) + env * amp * math.sin(i * 0.55 + ph) * math.cos(i * 0.13 + ph * 2)
            pts.append(f"{x},{y:.1f}")
        b.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="{col}" stroke-opacity="{op}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>')
    # ordered severity 0-3, split by tuned cut-points
    b.append(panel(270, 524, 660, 216, r=20))
    b.append(text(300, 566, "SEVERITY · ORDERED 0 TO 3 · TUNED CUT-POINTS", size=14, weight=500, op=0.6, mono=True, spacing=2))
    base, x0 = 706, 320
    for i, hgt in enumerate((38, 66, 96, 124)):
        x = x0 + i * 150
        b.append(f'<rect x="{x}" y="{base - hgt}" width="110" height="{hgt}" rx="10" fill="{a}" fill-opacity="{0.28 + i * 0.22}"/>')
        b.append(text(x + 55, base - hgt - 10, str(i), size=22, weight=800, anchor="middle"))
        if i:
            b.append(f'<line x1="{x - 20}" y1="586" x2="{x - 20}" y2="{base + 8}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.6" stroke-dasharray="5 6"/>')
    return doc(a, "\n".join(b), glow=(600, 500))

# --------------------------------------------------------------------------- 6. RSNA knee MRI
def rsna_knee(a):
    b = []
    # a stack of MRI slices
    for i in range(5):
        x, y = 318 + i * 20, 262 + i * 18
        last = i == 4
        b.append(f'<rect x="{x}" y="{y}" width="330" height="330" rx="22" fill="#0b0b13" fill-opacity="{0.95 if last else 0.6}" stroke="{a}" stroke-opacity="{0.9 if last else 0.25 + i * 0.1}" stroke-width="{2.2 if last else 1.4}"/>')
    ox, oy = 398, 334
    # the top slice: femur above, tibia below, with the gap between them
    b.append(f'<path d="M{ox + 100} {oy + 18} C {ox + 96} {oy + 86}, {ox + 60} {oy + 120}, {ox + 84} {oy + 156} C {ox + 104} {oy + 184}, {ox + 150} {oy + 150}, {ox + 166} {oy + 168} C {ox + 190} {oy + 190}, {ox + 232} {oy + 172}, {ox + 232} {oy + 140} C {ox + 232} {oy + 100}, {ox + 206} {oy + 78}, {ox + 206} {oy + 18}" fill="#ffffff" fill-opacity="0.10" stroke="#ffffff" stroke-opacity="0.75" stroke-width="2.2"/>')
    b.append(f'<path d="M{ox + 92} {oy + 318} C {ox + 96} {oy + 260}, {ox + 70} {oy + 236}, {ox + 84} {oy + 212} C {ox + 96} {oy + 194}, {ox + 220} {oy + 194}, {ox + 232} {oy + 212} C {ox + 246} {oy + 236}, {ox + 212} {oy + 262}, {ox + 214} {oy + 318}" fill="#ffffff" fill-opacity="0.10" stroke="#ffffff" stroke-opacity="0.75" stroke-width="2.2"/>')
    fx, fy = ox + 120, oy + 190
    b.append(f'<circle cx="{fx}" cy="{fy}" r="34" fill="{a}" fill-opacity="0.22" filter="url(#soft)"/>')
    b.append(f'<circle cx="{fx}" cy="{fy}" r="26" fill="none" stroke="{a}" stroke-width="2.6"/>')
    b.append(f'<path d="M{fx - 40} {fy} h14 M{fx + 26} {fy} h14 M{fx} {fy - 40} v14 M{fx} {fy + 26} v14" stroke="{a}" stroke-width="2.6" stroke-linecap="round"/>')
    # twelve findings, each with its own probability
    b.append(panel(730, 290, 170, 400, r=16))
    b.append(text(748, 324, "12 FINDINGS", size=13, weight=500, op=0.6, mono=True, spacing=2))
    probs = (0.92, 0.18, 0.64, 0.09, 0.31, 0.77, 0.12, 0.05, 0.48, 0.22, 0.86, 0.15)
    for i, p in enumerate(probs):
        y = 342 + i * 28
        b.append(bar(748, y, 134, 10, op=0.12))
        b.append(bar(748, y, 134 * p, 10, fill=a if p > 0.5 else "#ffffff", op=0.95 if p > 0.5 else 0.4))
    c, w = chip(338, 694, "0.91 macro ROC-AUC", a, size=15); b.append(c)
    return doc(a, "\n".join(b), glow=(560, 480))

# --------------------------------------------------------------------------- 7. MedBuddy
def medbuddy(a):
    b = [panel(290, 248, 620, 300, r=20)]
    b.append(text(320, 292, "LAB REPORT", size=14, weight=500, op=0.6, mono=True, spacing=2))
    rows = (("Hemoglobin", "11.2 g/dL", 0.30, AMBER, "Borderline"), ("Glucose (fasting)", "92 mg/dL", 0.52, GREEN, "Normal"), ("TSH", "8.4 mIU/L", 0.90, RED, "Critical"))
    for i, (name, val, pos, col, flag) in enumerate(rows):
        y = 330 + i * 70
        b.append(text(320, y + 6, name, size=18, weight=600))
        b.append(text(320, y + 30, val, size=15, weight=500, op=0.6, mono=True))
        bx, bw = 520, 200
        b.append(bar(bx, y + 4, bw, 10, op=0.12))
        b.append(bar(bx + bw * 0.25, y + 4, bw * 0.4, 10, fill=GREEN, op=0.35))
        b.append(f'<circle cx="{bx + bw * pos:.0f}" cy="{y + 9}" r="9" fill="{col}" stroke="#0b0b13" stroke-width="3"/>')
        c, w = chip(752, y - 8, flag, col, size=14, padx=11, h=30); b.append(c)
    # the plain-words explanation, checked against its source
    b.append(panel(350, 574, 560, 150, r=20))
    b.append(f'<path d="M410 574 l-26 -24 l52 0 z" fill="#1a1a26" stroke="#ffffff" stroke-opacity="0.18"/>')
    b.append(text(380, 616, "In plain words", size=18, weight=700, fill=a))
    b.append(bar(380, 636, 430, 10, op=0.3)); b.append(bar(380, 658, 370, 10, op=0.2))
    c, w = chip(380, 682, "self-check: Verified or Flag", GREEN, size=14); b.append(c)
    return doc(a, "\n".join(b), glow=(600, 500))

# --------------------------------------------------------------------------- 8. Support copilot
def support_copilot(a):
    b = []
    tickets = ((("Connector", a), ("P0", RED), ("frustrated", ORANGE)), (("How-to", a), ("P2", GREEN), ("neutral", "#a6a5b2")), (("SSO", a), ("P1", AMBER), ("curious", "#a6a5b2")))
    for i, tags in enumerate(tickets):
        y = 270 + i * 150
        b.append(panel(290, y, 300, 126, r=16))
        b.append(bar(312, y + 26, 190, 10, op=0.34)); b.append(bar(312, y + 48, 240, 9, op=0.18))
        x = 312
        for lab, col in tags:
            c, w = chip(x, y + 76, lab, col, size=13, padx=9, h=28); b.append(c); x += w + 8
    # answered from the docs, with sources
    b.append(panel(660, 300, 250, 250, r=18))
    b.append(text(682, 340, "ANSWER", size=13, weight=500, op=0.6, mono=True, spacing=2))
    for j, wv in enumerate((200, 180, 204, 150)):
        b.append(bar(682, 358 + j * 22, wv, 10, op=0.3 if j == 0 else 0.2))
    b.append(text(682, 476, "sources", size=13, weight=500, op=0.6, mono=True))
    c, w = chip(682, 490, "docs/sso", a, size=13, padx=9, h=28); b.append(c)
    c2, _ = chip(682 + w + 8, 490, "docs/api", a, size=13, padx=9, h=28); b.append(c2)
    b.append(panel(660, 590, 250, 86, r=18))
    b.append(text(682, 626, "ROUTED", size=13, weight=500, op=0.6, mono=True, spacing=2))
    c, w = chip(682, 638, "to the right team", AMBER, size=13, padx=9, h=28); b.append(c)
    b.append(arrow(594, 333, 652, 400, a)); b.append(arrow(594, 483, 652, 440, a)); b.append(arrow(594, 633, 652, 633, AMBER))
    return doc(a, "\n".join(b), glow=(620, 480))

# --------------------------------------------------------------------------- 9. Assessment finder
def shl_rag(a):
    b = []
    b.append(panel(300, 252, 600, 62, r=31))
    b.append(f'<circle cx="340" cy="283" r="11" fill="none" stroke="{a}" stroke-width="2.6"/><line x1="348" y1="291" x2="357" y2="300" stroke="{a}" stroke-width="2.6" stroke-linecap="round"/>')
    b.append(text(372, 290, "java developer · team lead · 40 min", size=18, weight=500, op=0.85, mono=True))
    # the catalogue as points in embedding space; the query finds its three nearest
    pts = []
    seed = 7
    for i in range(70):
        seed = (seed * 1103515245 + 12345) % 2147483648
        x = 320 + (seed % 560)
        seed = (seed * 1103515245 + 12345) % 2147483648
        y = 350 + (seed % 250)
        pts.append((x, y))
    qx, qy = 560, 470
    near = sorted(pts, key=lambda p: (p[0] - qx) ** 2 + (p[1] - qy) ** 2)[:3]
    for x, y in pts:
        if (x, y) in near: continue
        b.append(f'<circle cx="{x}" cy="{y}" r="4.2" fill="#ffffff" fill-opacity="0.28"/>')
    b.append(f'<circle cx="{qx}" cy="{qy}" r="74" fill="{a}" fill-opacity="0.10" stroke="{a}" stroke-opacity="0.45" stroke-dasharray="6 7" stroke-width="1.6"/>')
    for x, y in near:
        b.append(f'<line x1="{qx}" y1="{qy}" x2="{x}" y2="{y}" stroke="{a}" stroke-width="2.2" stroke-opacity="0.9"/>')
        b.append(f'<circle cx="{x}" cy="{y}" r="8" fill="{a}"/>')
    b.append(f'<circle cx="{qx}" cy="{qy}" r="11" fill="#ffffff" stroke="{a}" stroke-width="4"/>')
    # top three
    for i, wv in enumerate((300, 250, 270)):
        y = 630 + i * 40
        b.append(panel(300, y - 6, 600, 34, r=12, stroke=0.12))
        b.append(text(318, y + 17, str(i + 1), size=15, weight=800, fill=a, mono=True))
        b.append(bar(346, y + 6, wv, 10, op=0.32 - i * 0.06))
        b.append(text(880, y + 17, ("0.83", "0.79", "0.74")[i], size=14, weight=500, op=0.7, anchor="end", mono=True))
    return doc(a, "\n".join(b), glow=(600, 470))

ART = {
    "ik-platform": ("#7C5CFF", ik_platform),
    "c-trust": ("#4C8DFF", c_trust),
    "amazon-ml": ("#F5A623", amazon_ml),
    "cricket": ("#EC6EA8", cricket),
    "piu": ("#9B7BFF", piu),
    "rsna-knee": ("#38BDF8", rsna_knee),
    "medbuddy": ("#F472B6", medbuddy),
    "support-copilot": ("#22D3EE", support_copilot),
    "shl-rag": ("#A3E635", shl_rag),
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for pid, (accent, fn) in ART.items():
        (OUT / f"{pid}.svg").write_text(fn(accent), encoding="utf-8")
        print("wrote", f"public/projects/art/{pid}.svg")
