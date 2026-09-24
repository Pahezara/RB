#!/usr/bin/env python3
"""make-fonts.py

Builds the display face from the Fontsource package, slimmed to what the site
actually sets.

Newsreader ships with two variation axes: weight 200-800 and optical size 6-72.
Headings on this site run from about 22px (h4 is set in the text face, so the
smallest display size is an h3) up to about 92px (the home hero), and are only
ever set between 300 and 600. Pinning the axes to that band keeps every glyph
the site renders and drops the masters it never reaches:

    normal  128 KB -> ~87 KB
    italic  143 KB -> ~97 KB

The italic is only requested when an accent word asks for it, so most pages
never download it at all.

Requires fontTools (pip install fonttools brotli). Run after upgrading the
@fontsource-variable/newsreader package:

    python scripts/make-fonts.py
"""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = 'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-{}.woff2'
OUT = 'public/fonts/newsreader-display-{}.woff2'
AXES = {'opsz': (20, 72), 'wght': (300, 600)}

for style in ('normal', 'italic'):
    font = TTFont(SRC.format(style))
    slim = instancer.instantiateVariableFont(font, AXES)
    slim.flavor = 'woff2'
    slim.save(OUT.format(style))
    before = os.path.getsize(SRC.format(style)) // 1024
    after = os.path.getsize(OUT.format(style)) // 1024
    print(f'  newsreader {style:<6} {before} KB -> {after} KB  opsz {AXES["opsz"]}  wght {AXES["wght"]}')
