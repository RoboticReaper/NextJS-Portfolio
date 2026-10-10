"""Regenerate the résumé SVG and its selectable text/link overlay from the PDF.

Requires pdfplumber and Poppler's pdftocairo. No PDF processing runs in the browser.
"""

import hashlib
import json
from pathlib import Path
import subprocess
from urllib.parse import urlparse

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "public/Baoren Liu Resume.pdf"


def generate():
    with pdfplumber.open(PDF, unicode_norm="NFKC") as document:
        if len(document.pages) != 1:
            raise ValueError("The résumé preview requires a one-page PDF.")
        page = document.pages[0]
        lines = []
        for line in page.extract_text_lines():
            # A multi-character ligature can appear twice in the line's character
            # map, pointing to the same PDF glyph. Extract each glyph only once.
            characters = list({id(char): char for char in line["chars"]}.values())
            words = pdfplumber.utils.extract_words(
                characters, extra_attrs=["fontname", "size"]
            )
            runs = []
            for index, word in enumerate(words):
                # Explicit spaces preserve readable copied text between PDF words.
                following = words[index + 1] if index + 1 < len(words) else None
                has_space = following and following["x0"] - word["x1"] > 0.5
                right = following["x0"] if has_space else word["x1"]
                runs.append({
                    "text": word["text"] + (" " if has_space else ""),
                    "x": round(word["x0"], 3),
                    "y": round(word["top"] + word["size"] * 0.8, 3),
                    "width": round(right - word["x0"], 3),
                    "size": round(word["size"], 3),
                    "bold": "BX" in word["fontname"],
                    "italic": "TI" in word["fontname"] or "SL" in word["fontname"],
                })
            lines.append(runs)

        links = []
        for link in page.hyperlinks:
            href = link.get("uri")
            if not href or urlparse(href).scheme not in {"http", "https", "mailto"}:
                continue
            bounds = (link["x0"], link["top"], link["x1"], link["bottom"])
            links.append({
                "href": href,
                "label": page.within_bbox(bounds).extract_text() or href,
                "x": round(link["x0"], 3),
                "y": round(link["top"], 3),
                "width": round(link["x1"] - link["x0"], 3),
                "height": round(link["bottom"] - link["top"], 3),
            })
        overlay = {
            "sourceSha256": hashlib.sha256(PDF.read_bytes()).hexdigest(),
            "width": page.width,
            "height": page.height,
            "lines": lines,
            "links": links,
        }

    subprocess.run(["pdftocairo", "-svg", str(PDF), str(ROOT / "public/resume.svg")], check=True)
    output = ROOT / "lib/generated/resume-overlay.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(overlay, ensure_ascii=False, indent=2) + "\n")
    print(f"Generated résumé preview: {len(lines)} text lines, {len(links)} links.")


if __name__ == "__main__":
    generate()
