import json
import math
import os
import random
import time
from io import BytesIO
from urllib.parse import quote

import requests
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
IMG_DIR = os.path.join(ASSETS_DIR, "img")
POSTER_DIR = os.path.join(ASSETS_DIR, "posters")
WORK_DIR = os.path.join(BASE_DIR, "tmp", "asset_sources")
SOURCE_JSON = os.path.join(ASSETS_DIR, "asset-sources.json")

USER_AGENT = "CopadomundoEducationalAssetBuilder/1.0 (local development)"
WIDE = (1024, 576)
FLAG_CARD = (1024, 692)
JERSEY = (1024, 1288)
SQUARE = (1024, 1024)


COMMONS = {
    "maracana": {
        "title": "Estádio do Maracanã - panorama.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Est%C3%A1dio_do_Maracan%C3%A3_-_panorama.jpg",
        "license": "Public domain",
        "author": "Agência Brasil",
        "source_page": "https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_do_Maracan%C3%A3_-_panorama.jpg",
    },
    "centenario_1930": {
        "title": "Estadio Centenario 1930.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/4/43/Estadio_Centenario_1930.jpg",
        "license": "Public domain",
        "author": "Unknown",
        "source_page": "https://commons.wikimedia.org/wiki/File:Estadio_Centenario_1930.jpg",
    },
    "stabile_1930": {
        "title": "Stabile goal v uruguay 1930.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Stabile_goal_v_uruguay_1930.jpg",
        "license": "Public domain",
        "author": "Unknown",
        "source_page": "https://commons.wikimedia.org/wiki/File:Stabile_goal_v_uruguay_1930.jpg",
    },
    "brazil_1970": {
        "title": "Brazil national team 1970.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Brazil_national_team_1970.jpg",
        "license": "Public domain",
        "author": "Unknown",
        "source_page": "https://commons.wikimedia.org/wiki/File:Brazil_national_team_1970.jpg",
    },
    "rose_bowl_1994": {
        "title": "FEMA - 282 - Photograph by FEMA News Photo taken on 06-17-1994 in California.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/d/de/FEMA_-_282_-_Photograph_by_FEMA_News_Photo_taken_on_06-17-1994_in_California.jpg",
        "license": "Public domain",
        "author": "FEMA News Photo",
        "source_page": "https://commons.wikimedia.org/wiki/File:FEMA_-_282_-_Photograph_by_FEMA_News_Photo_taken_on_06-17-1994_in_California.jpg",
    },
    "yokohama_2002": {
        "title": "NISSANSTADIUM20080608.JPG",
        "url": "https://upload.wikimedia.org/wikipedia/commons/1/11/NISSANSTADIUM20080608.JPG",
        "license": "Public domain",
        "author": "Kakidai",
        "source_page": "https://commons.wikimedia.org/wiki/File:NISSANSTADIUM20080608.JPG",
    },
    "tunnel": {
        "title": "Players Tunnel - Wembley - geograph.org.uk - 4624479.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Players_Tunnel_-_Wembley_-_geograph.org.uk_-_4624479.jpg",
        "license": "CC BY-SA 2.0",
        "author": "Stephen Craven",
        "source_page": "https://commons.wikimedia.org/wiki/File:Players_Tunnel_-_Wembley_-_geograph.org.uk_-_4624479.jpg",
    },
    "trophy": {
        "title": "Jules Rimet trophy replica.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/0/07/Jules_Rimet_trophy_replica.jpg",
        "license": "Public domain",
        "author": "Sean Murray",
        "source_page": "https://commons.wikimedia.org/wiki/File:Jules_Rimet_trophy_replica.jpg",
    },
    "ball": {
        "title": "Soccer (122717889).jpeg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/1/13/Soccer_%28122717889%29.jpeg",
        "license": "CC BY-SA 3.0",
        "author": "Robert Couse-Baker",
        "source_page": "https://commons.wikimedia.org/wiki/File:Soccer_(122717889).jpeg",
    },
}


CHAMPIONS = [
    {
        "nome": "Brasil",
        "flag": "Flag_of_Brazil.svg",
        "titles": 5,
        "years": "1958, 1962, 1970, 1994, 2002",
        "code": "BRA",
        "color": "#159447",
    },
    {
        "nome": "Alemanha",
        "flag": "Flag_of_Germany.svg",
        "titles": 4,
        "years": "1954, 1974, 1990, 2014",
        "code": "GER",
        "color": "#121212",
    },
    {
        "nome": "Itália",
        "flag": "Flag_of_Italy.svg",
        "titles": 4,
        "years": "1934, 1938, 1982, 2006",
        "code": "ITA",
        "color": "#108247",
    },
    {
        "nome": "Argentina",
        "flag": "Flag_of_Argentina.svg",
        "titles": 3,
        "years": "1978, 1986, 2022",
        "code": "ARG",
        "color": "#58bde9",
    },
    {
        "nome": "França",
        "flag": "Flag_of_France.svg",
        "titles": 2,
        "years": "1998, 2018",
        "code": "FRA",
        "color": "#204aa0",
    },
    {
        "nome": "Uruguai",
        "flag": "Flag_of_Uruguay.svg",
        "titles": 2,
        "years": "1930, 1950",
        "code": "URU",
        "color": "#6ec8f0",
    },
    {
        "nome": "Espanha",
        "flag": "Flag_of_Spain.svg",
        "titles": 1,
        "years": "2010",
        "code": "ESP",
        "color": "#c72522",
    },
    {
        "nome": "Inglaterra",
        "flag": "Flag_of_England.svg",
        "titles": 1,
        "years": "1966",
        "code": "ENG",
        "color": "#eef2f7",
    },
]


FUTURE_HOST_FLAGS = [
    ("Canadá", "Flag_of_Canada.svg", "2026"),
    ("México", "Flag_of_Mexico.svg", "2026"),
    ("EUA", "Flag_of_the_United_States.svg", "2026"),
    ("Marrocos", "Flag_of_Morocco.svg", "2030"),
    ("Portugal", "Flag_of_Portugal.svg", "2030"),
    ("Espanha", "Flag_of_Spain.svg", "2030"),
    ("Arábia Saudita", "Flag_of_Saudi_Arabia.svg", "2034"),
]


FACT_SOURCES = {
    "fifa_2026": {
        "title": "FIFA World Cup 2026 host countries and cities",
        "url": "https://www.fifa.com/en/articles/fifa-world-cup-2026-hosts-cities-dates-usa-mexico-canada",
        "facts": [
            "2026: Canadá, México e Estados Unidos",
            "16 cidades-sede",
            "11 de junho a 19 de julho de 2026",
        ],
    },
    "fifa_2030_2034": {
        "title": "Hosts appointed for 2030 and 2034 FIFA World Cups",
        "url": "https://www.fifa.com/en/tournaments/mens/worldcup/articles/2030-2034-host-nations-confirmed",
        "facts": [
            "2030: Marrocos, Portugal e Espanha, com jogos do centenário na América do Sul",
            "2034: Arábia Saudita",
        ],
    },
    "world_cup_titles": {
        "title": "FIFA World Cup all-time winners summary",
        "url": "https://en.wikipedia.org/wiki/FIFA_World_Cup",
        "facts": [
            "Brasil 5; Alemanha e Itália 4; Argentina 3; França e Uruguai 2; Inglaterra e Espanha 1",
        ],
    },
}


def ensure_dirs():
    for path in [IMG_DIR, POSTER_DIR, WORK_DIR, os.path.join(IMG_DIR, "campeoes"), os.path.join(IMG_DIR, "camisas"), os.path.join(IMG_DIR, "mascotes")]:
        os.makedirs(path, exist_ok=True)


def font(size, bold=False):
    names = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for name in names:
        if os.path.exists(name):
            return ImageFont.truetype(name, size=size)
    return ImageFont.load_default()


F_TITLE = font(54, True)
F_H1 = font(42, True)
F_H2 = font(32, True)
F_BODY = font(25)
F_SMALL = font(18)
F_TINY = font(15)


def download(url):
    last_error = None
    for attempt in range(4):
        r = requests.get(url, headers={"User-Agent": USER_AGENT, "Accept": "image/*,*/*;q=0.8"}, timeout=60)
        if r.status_code != 429:
            r.raise_for_status()
            return r.content
        last_error = r
        time.sleep(2 + attempt * 3)
    last_error.raise_for_status()
    return b""


def commons_render_url(title, width=1200):
    return f"https://commons.wikimedia.org/wiki/Special:Redirect/file/{quote(title)}?width={width}"


def commons_image(key, width=1200):
    meta = COMMONS[key]
    return cached_image(key, commons_render_url(meta["title"], width))


def cached_image(key, url):
    ext = os.path.splitext(url.split("?")[0])[1].lower() or ".img"
    safe_key = "".join(c if c.isalnum() or c in "-_" else "_" for c in key)
    path = os.path.join(WORK_DIR, safe_key + ext)
    if os.path.exists(path) and os.path.getsize(path) == 0:
        os.remove(path)
    if not os.path.exists(path):
        with open(path, "wb") as fh:
            fh.write(download(url))
    try:
        img = Image.open(path)
    except Exception:
        os.remove(path)
        with open(path, "wb") as fh:
            fh.write(download(url))
        img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    return img.convert("RGBA")


def flag_image(file_name, width=1024):
    url = f"https://commons.wikimedia.org/wiki/Special:Redirect/file/{quote(file_name)}?width={width}"
    key = "flag_" + file_name.replace(".svg", "").replace(" ", "_")
    return cached_image(key, url), {
        "title": file_name,
        "url": f"https://commons.wikimedia.org/wiki/File:{quote(file_name)}",
        "license": "Public domain flag artwork / Wikimedia Commons file",
    }


def fit_cover(img, size, focus=(0.5, 0.5)):
    img = img.convert("RGBA")
    sw, sh = size
    iw, ih = img.size
    scale = max(sw / iw, sh / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    fx, fy = focus
    left = int(max(0, min(nw - sw, nw * fx - sw / 2)))
    top = int(max(0, min(nh - sh, nh * fy - sh / 2)))
    return img.crop((left, top, left + sw, top + sh))


def fit_contain(img, size, fill=(255, 255, 255, 255), padding=0):
    sw, sh = size
    canvas = Image.new("RGBA", size, fill)
    max_w = sw - padding * 2
    max_h = sh - padding * 2
    img = img.convert("RGBA")
    scale = min(max_w / img.width, max_h / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.alpha_composite(resized, ((sw - nw) // 2, (sh - nh) // 2))
    return canvas


def add_vignette(img, strength=150):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    pix = overlay.load()
    w, h = img.size
    cx, cy = w / 2, h / 2
    max_d = math.sqrt(cx * cx + cy * cy)
    for y in range(h):
        for x in range(w):
            d = math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / max_d
            alpha = int(max(0, d - 0.38) / 0.62 * strength)
            pix[x, y] = (0, 0, 0, alpha)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def gradient_overlay(img, top=(0, 0, 0, 140), bottom=(0, 0, 0, 20)):
    w, h = img.size
    overlay = Image.new("RGBA", img.size)
    pix = overlay.load()
    for y in range(h):
        t = y / max(1, h - 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(4))
        for x in range(w):
            pix[x, y] = color
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def draw_text(draw, xy, text, fill, font_obj, anchor=None):
    draw.text(xy, text, fill=fill, font=font_obj, anchor=anchor)


def wrap_text(text, font_obj, max_width):
    words = text.split()
    lines = []
    line = ""
    probe = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    for word in words:
        candidate = (line + " " + word).strip()
        width = probe.textbbox((0, 0), candidate, font=font_obj)[2]
        if width <= max_width or not line:
            line = candidate
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def text_block(draw, x, y, text, max_width, font_obj, fill, line_gap=8):
    for line in wrap_text(text, font_obj, max_width):
        draw.text((x, y), line, font=font_obj, fill=fill)
        y += font_obj.size + line_gap
    return y


def panel_base(photo_key, size=WIDE, focus=(0.5, 0.5), dark=0.78):
    meta = COMMONS[photo_key]
    img = commons_image(photo_key, width=1200)
    bg = fit_cover(img, size, focus)
    bg = ImageEnhance.Color(bg).enhance(0.9)
    bg = ImageEnhance.Contrast(bg).enhance(1.05)
    overlay = Image.new("RGBA", size, (4, 10, 20, int(255 * dark)))
    bg = Image.alpha_composite(bg, overlay)
    return add_vignette(bg, 120)


def save_rgb(img, path, quality=92):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.convert("RGB").save(path, quality=quality, optimize=True)


def save_png(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, optimize=True)


def title_band(draw, title, subtitle=None, accent="#ffd45a", y=48):
    draw.rounded_rectangle((42, y, 982, y + 116), radius=16, fill=(5, 12, 24, 176), outline=accent, width=3)
    draw.text((72, y + 24), title, font=F_H1, fill="#ffffff")
    if subtitle:
        draw.text((74, y + 74), subtitle, font=F_BODY, fill=accent)


def draw_source_tag(draw, text):
    draw.rounded_rectangle((36, 526, 988, 558), radius=10, fill=(0, 0, 0, 150))
    draw.text((512, 543), text, font=F_TINY, fill=(223, 231, 239), anchor="mm")


def create_wide_panel(out_name, photo_key, title, subtitle, bullets, focus=(0.5, 0.5), accent="#ffd45a"):
    img = panel_base(photo_key, WIDE, focus, dark=0.55)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((38, 42, 986, 534), radius=22, outline=accent, width=3, fill=(0, 0, 0, 84))
    draw.text((70, 78), title, font=F_TITLE, fill="#ffffff")
    draw.text((74, 144), subtitle, font=F_H2, fill=accent)
    y = 218
    for bullet in bullets:
        draw.ellipse((78, y + 7, 94, y + 23), fill=accent)
        y = text_block(draw, 112, y, bullet, 800, F_BODY, "#f8fafc", 7) + 12
    draw_source_tag(draw, COMMONS[photo_key]["title"])
    save_rgb(img, os.path.join(IMG_DIR, out_name))


def create_photo_showcase(out_name, photo_key, title, subtitle, facts, focus=(0.5, 0.5), accent="#ffd45a"):
    img = panel_base(photo_key, WIDE, focus, dark=0.28)
    img = gradient_overlay(img, top=(0, 0, 0, 170), bottom=(0, 0, 0, 58))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((46, 54, 978, 522), radius=18, outline=(255, 255, 255, 70), width=2)
    draw.text((74, 84), title, font=F_TITLE, fill="#ffffff")
    draw.text((76, 150), subtitle, font=F_H2, fill=accent)
    x, y = 72, 414
    for fact in facts:
        draw.rounded_rectangle((x, y, x + 280, y + 54), radius=14, fill=(0, 0, 0, 160), outline=accent, width=2)
        draw.text((x + 140, y + 28), fact, font=F_SMALL, fill="#ffffff", anchor="mm")
        x += 298
    draw_source_tag(draw, COMMONS[photo_key]["title"])
    save_rgb(img, os.path.join(IMG_DIR, out_name))


def create_flag_card(country):
    flag, _ = flag_image(country["flag"], width=1400)
    bg = fit_cover(flag.filter(ImageFilter.GaussianBlur(10)), FLAG_CARD)
    bg = ImageEnhance.Contrast(bg).enhance(0.85)
    bg = Image.alpha_composite(bg, Image.new("RGBA", FLAG_CARD, (0, 0, 0, 94)))
    draw = ImageDraw.Draw(bg)
    draw.rounded_rectangle((38, 38, 986, 654), radius=24, fill=(255, 255, 255, 36), outline=country["color"], width=6)

    flag_panel = fit_contain(flag, (760, 390), fill=(255, 255, 255, 255), padding=18)
    shadow = Image.new("RGBA", FLAG_CARD, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((128, 78, 896, 476), radius=18, fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    bg = Image.alpha_composite(bg, shadow)
    bg.alpha_composite(flag_panel, (132, 80))

    draw = ImageDraw.Draw(bg)
    draw.rounded_rectangle((92, 492, 932, 630), radius=18, fill=(4, 10, 22, 210))
    draw.text((132, 512), country["nome"], font=F_H1, fill="#ffffff")
    draw.text((132, 568), f"{country['titles']} título(s)", font=F_BODY, fill="#ffd45a")
    draw.text((890, 536), country["code"], font=font(70, True), fill=(255, 255, 255, 70), anchor="rm")
    draw.text((540, 603), country["years"], font=F_SMALL, fill="#dbeafe", anchor="mm")
    save_png(bg, os.path.join(IMG_DIR, "campeoes", country["nome"].lower().replace("á", "a").replace("é", "e").replace("ç", "c") + ".png"))


def draw_flag_tile(canvas, file_name, label, x, y, w, h, footer=None):
    flag, _ = flag_image(file_name, width=800)
    tile = fit_cover(flag, (w, h))
    draw = ImageDraw.Draw(canvas)
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x + 4, y + 4, x + w + 4, y + h + 4), radius=10, fill=(0, 0, 0, 115))
    shadow = shadow.filter(ImageFilter.GaussianBlur(7))
    canvas.alpha_composite(shadow)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=10, fill=255)
    canvas.paste(tile, (x, y), mask)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=10, outline=(255, 255, 255, 120), width=2)
    draw.rounded_rectangle((x, y + h - 30, x + w, y + h), radius=10, fill=(0, 0, 0, 155))
    draw.text((x + w / 2, y + h - 15), label, font=F_TINY, fill="#ffffff", anchor="mm")
    if footer:
        draw.text((x + w / 2, y + h + 20), footer, font=F_TINY, fill="#cbd5e1", anchor="mm")


def create_flags_overview():
    img = panel_base("maracana", WIDE, focus=(0.5, 0.6), dark=0.58)
    draw = ImageDraw.Draw(img)
    title_band(draw, "Bandeiras da Copa", "Campeões mundiais e próximas sedes", "#38bdf8", 32)

    x = 62
    y = 194
    for c in CHAMPIONS:
        draw_flag_tile(img, c["flag"], c["code"], x, y, 106, 72, f"{c['titles']}x")
        x += 116

    draw.text((62, 348), "Sedes confirmadas", font=F_H2, fill="#ffffff")
    x = 62
    for label, flag, year in FUTURE_HOST_FLAGS:
        draw_flag_tile(img, flag, label, x, 402, 118, 78, year)
        x += 132

    draw_source_tag(draw, "Bandeiras: Wikimedia Commons. Dados: FIFA / lista histórica de campeões.")
    save_png(img, os.path.join(IMG_DIR, "bandeiras-copa.png"))


def create_ranking():
    img = Image.new("RGBA", WIDE, "#07111f")
    draw = ImageDraw.Draw(img)
    for i in range(22):
        y = i * 31
        color = (12 + i * 2, 24 + i, 38 + i * 3, 255)
        draw.rectangle((0, y, 1024, y + 31), fill=color)

    draw.text((54, 38), "Ranking de Campeões", font=F_TITLE, fill="#ffffff")
    draw.text((56, 104), "Títulos da Copa do Mundo FIFA até 2022", font=F_BODY, fill="#ffd45a")

    max_titles = max(c["titles"] for c in CHAMPIONS)
    y = 166
    for c in CHAMPIONS:
        flag, _ = flag_image(c["flag"], width=420)
        thumb = fit_cover(flag, (74, 48))
        img.alpha_composite(thumb, (60, y + 4))
        draw.rounded_rectangle((152, y, 896, y + 56), radius=14, fill=(255, 255, 255, 32))
        draw.text((172, y + 28), c["nome"], font=F_BODY, fill="#ffffff", anchor="lm")
        bar_w = int(390 * c["titles"] / max_titles)
        draw.rounded_rectangle((378, y + 15, 378 + bar_w, y + 41), radius=9, fill=c["color"])
        draw.text((800, y + 28), f"{c['titles']} título(s)", font=F_BODY, fill="#ffd45a", anchor="mm")
        draw.text((934, y + 28), c["years"].split(",")[-1].strip(), font=F_SMALL, fill="#cbd5e1", anchor="mm")
        y += 60

    draw_source_tag(draw, "Dados: campeões de 1930 a 2022. Argentina venceu em 2022 e chegou a 3 títulos.")
    save_png(img, os.path.join(IMG_DIR, "ranking-campeoes.png"))


def create_campo_tatico():
    img = Image.new("RGBA", WIDE, "#0b3d22")
    draw = ImageDraw.Draw(img)
    for i in range(12):
        color = "#16733f" if i % 2 else "#126336"
        draw.rectangle((48 + i * 78, 76, 48 + (i + 1) * 78, 500), fill=color)
    draw.rounded_rectangle((48, 76, 976, 500), radius=18, outline="#f8fafc", width=6)
    draw.line((512, 76, 512, 500), fill="#f8fafc", width=4)
    draw.ellipse((432, 208, 592, 368), outline="#f8fafc", width=4)
    draw.ellipse((500, 276, 524, 300), fill="#f8fafc")
    for left in [True, False]:
        x0, x1 = (48, 198) if left else (826, 976)
        draw.rectangle((x0, 186, x1, 390), outline="#f8fafc", width=4)
        x0s, x1s = (48, 112) if left else (912, 976)
        draw.rectangle((x0s, 232, x1s, 344), outline="#f8fafc", width=4)
        px = 154 if left else 870
        draw.ellipse((px - 7, 288 - 7, px + 7, 288 + 7), fill="#f8fafc")

    positions = [
        ("GOL", 110, 288, "#facc15"),
        ("LD", 250, 150, "#60a5fa"), ("ZAG", 260, 260, "#60a5fa"), ("ZAG", 260, 318, "#60a5fa"), ("LE", 250, 426, "#60a5fa"),
        ("VOL", 420, 288, "#34d399"), ("MEI", 510, 210, "#34d399"), ("MEI", 510, 366, "#34d399"),
        ("PD", 740, 160, "#fb7185"), ("CA", 790, 288, "#fb7185"), ("PE", 740, 416, "#fb7185"),
    ]
    for label, x, y, color in positions:
        draw.ellipse((x - 30, y - 30, x + 30, y + 30), fill=color, outline="#ffffff", width=3)
        draw.text((x, y + 1), label, font=F_TINY, fill="#07111f", anchor="mm")

    for x1, y1, x2, y2 in [(420, 288, 650, 230), (510, 210, 740, 160), (510, 366, 740, 416), (650, 230, 790, 288)]:
        draw.line((x1, y1, x2, y2), fill="#ffd45a", width=5)
        draw.polygon([(x2, y2), (x2 - 18, y2 - 8), (x2 - 9, y2 + 16)], fill="#ffd45a")

    draw.rounded_rectangle((44, 22, 980, 64), radius=12, fill=(0, 0, 0, 132))
    draw.text((512, 43), "Campo tático realista: linhas oficiais, zonas e modelo 4-3-3", font=F_BODY, fill="#ffffff", anchor="mm")
    save_png(img, os.path.join(IMG_DIR, "campo-tatico.png"))


def create_mapa_estadio():
    img = Image.new("RGBA", WIDE, "#111827")
    draw = ImageDraw.Draw(img)
    draw.text((48, 36), "Mapa do Estádio", font=F_TITLE, fill="#ffffff")
    draw.text((52, 104), "Fluxo de público, setores, campo e serviços", font=F_BODY, fill="#93c5fd")

    cx, cy = 512, 312
    for r, color in [(270, "#334155"), (235, "#475569"), (196, "#64748b")]:
        draw.ellipse((cx - r, cy - int(r * 0.62), cx + r, cy + int(r * 0.62)), fill=color, outline="#cbd5e1", width=3)
    draw.rounded_rectangle((346, 230, 678, 394), radius=14, fill="#166534", outline="#ffffff", width=4)
    draw.line((512, 230, 512, 394), fill="#ffffff", width=2)
    draw.ellipse((476, 276, 548, 348), outline="#ffffff", width=2)
    sectors = [
        ("Acesso Norte", 512, 118, "#ffd45a"),
        ("Museu", 230, 312, "#38bdf8"),
        ("Bilheteria", 794, 312, "#f97316"),
        ("Túnel", 512, 506, "#22c55e"),
    ]
    for label, x, y, color in sectors:
        draw.rounded_rectangle((x - 92, y - 22, x + 92, y + 22), radius=14, fill=color)
        draw.text((x, y), label, font=F_SMALL, fill="#08111f", anchor="mm")
        draw.line((x, y + (28 if y < cy else -28), cx, cy), fill=color, width=3)
    draw_source_tag(draw, "Mapa esquemático próprio para navegação da experiência.")
    save_png(img, os.path.join(IMG_DIR, "mapa-estadio.png"))


def create_curiosidades():
    img = panel_base("maracana", WIDE, focus=(0.5, 0.46), dark=0.45)
    draw = ImageDraw.Draw(img)
    draw.text((54, 42), "Estádios e Sedes", font=F_TITLE, fill="#ffffff")
    draw.text((56, 108), "Dados reais para contextualizar a experiência", font=F_BODY, fill="#ffd45a")

    cards = [
        ("2026", "Canadá, México e EUA recebem a primeira Copa com 48 seleções.", "#38bdf8"),
        ("16", "cidades-sede confirmadas para a edição de 2026.", "#22c55e"),
        ("2030", "Marrocos, Portugal e Espanha coorganizam a edição do centenário.", "#f97316"),
        ("2034", "Arábia Saudita foi selecionada para sediar a Copa.", "#facc15"),
    ]
    x, y = 58, 190
    for idx, (num, text, color) in enumerate(cards):
        tx = x + (idx % 2) * 468
        ty = y + (idx // 2) * 150
        draw.rounded_rectangle((tx, ty, tx + 430, ty + 116), radius=18, fill=(0, 0, 0, 172), outline=color, width=3)
        draw.text((tx + 32, ty + 58), num, font=font(54, True), fill=color, anchor="lm")
        text_block(draw, tx + 128, ty + 28, text, 260, F_SMALL, "#ffffff", 4)
    draw_source_tag(draw, "Fontes dos dados: FIFA 2026, 2030 e 2034.")
    save_png(img, os.path.join(IMG_DIR, "curiosidades-estadios.png"))


def create_poster(out_path, photo_key, title, subtitle, accent="#ffd45a", focus=(0.5, 0.5)):
    img = panel_base(photo_key, WIDE, focus=focus, dark=0.35)
    img = gradient_overlay(img, top=(0, 0, 0, 100), bottom=(0, 0, 0, 175))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((48, 48, 976, 528), radius=24, outline=accent, width=4)
    draw.text((512, 236), title, font=font(66, True), fill="#ffffff", anchor="mm")
    draw.text((512, 310), subtitle, font=F_H2, fill=accent, anchor="mm")
    draw.rectangle((276, 360, 748, 366), fill=accent)
    draw.text((512, 416), "Clique para abrir o conteúdo", font=F_BODY, fill="#e5e7eb", anchor="mm")
    save_rgb(img, out_path)


def create_art_boards():
    for name, title, subtitle, photo, accent in [
        ("copa-arte-01.jpg", "O Mundo em Campo", "Futebol, cultura e torcida", "ball", "#22c55e"),
        ("copa-arte-02.jpg", "Noite de Decisão", "Luz, grama e arquibancada", "maracana", "#38bdf8"),
    ]:
        img = panel_base(photo, WIDE, focus=(0.48, 0.54), dark=0.38)
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle((56, 58, 968, 518), radius=20, fill=(0, 0, 0, 116), outline=accent, width=4)
        draw.text((90, 112), title, font=font(62, True), fill="#ffffff")
        draw.text((94, 184), subtitle, font=F_H2, fill=accent)
        for i, c in enumerate(CHAMPIONS[:5]):
            draw_flag_tile(img, c["flag"], c["code"], 94 + i * 160, 332, 136, 92)
        save_rgb(img, os.path.join(IMG_DIR, name))


def create_trophy_panel():
    src = commons_image("trophy", width=1200)
    bg = fit_cover(src.filter(ImageFilter.GaussianBlur(6)), SQUARE, focus=(0.5, 0.45))
    bg = Image.alpha_composite(bg, Image.new("RGBA", SQUARE, (0, 0, 0, 142)))
    trophy = fit_contain(src, (610, 780), fill=(0, 0, 0, 0), padding=20)
    shadow = Image.new("RGBA", SQUARE, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((300, 812, 724, 900), fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    bg.alpha_composite(shadow)
    bg.alpha_composite(trophy, (207, 86))
    draw = ImageDraw.Draw(bg)
    draw.text((512, 70), "Troféu Jules Rimet", font=F_H1, fill="#ffffff", anchor="mm")
    draw.text((512, 950), "réplica histórica", font=F_BODY, fill="#ffd45a", anchor="mm")
    save_png(bg, os.path.join(IMG_DIR, "taca-copa.png"))


def draw_jersey_texture(size, color1, color2):
    base = Image.new("RGBA", size, color1)
    noise = Image.effect_noise(size, 24).convert("L")
    noise = ImageEnhance.Contrast(noise).enhance(0.7)
    tint = Image.new("RGBA", size, color2)
    tint.putalpha(noise.point(lambda p: int(p * 0.26)))
    return Image.alpha_composite(base, tint)


def create_jersey(name, title, palette, pattern):
    img = Image.new("RGBA", JERSEY, "#101827")
    draw = ImageDraw.Draw(img)
    for i in range(32):
        y = i * 44
        draw.rectangle((0, y, JERSEY[0], y + 44), fill=(15 + i, 22 + i, 35 + i, 255))
    draw.ellipse((-120, 110, 1144, 1380), fill=(255, 255, 255, 18))

    mask = Image.new("L", JERSEY, 0)
    md = ImageDraw.Draw(mask)
    body = [(330, 255), (694, 255), (764, 386), (692, 476), (692, 1064), (332, 1064), (332, 476), (260, 386)]
    md.polygon(body, fill=255)
    md.polygon([(260, 386), (128, 492), (220, 620), (344, 486)], fill=255)
    md.polygon([(764, 386), (896, 492), (804, 620), (680, 486)], fill=255)
    md.ellipse((420, 218, 604, 376), fill=0)

    texture = draw_jersey_texture(JERSEY, palette[0], palette[1])
    if pattern == "stripes":
        pd = ImageDraw.Draw(texture)
        for x in range(342, 700, 82):
            pd.rectangle((x, 255, x + 42, 1064), fill=palette[2])
    if pattern == "sash":
        pd = ImageDraw.Draw(texture)
        pd.polygon([(326, 255), (448, 255), (704, 1064), (586, 1064)], fill=palette[2])
    if pattern == "gold":
        pd = ImageDraw.Draw(texture)
        for i in range(11):
            pd.arc((285 - i * 34, 320 + i * 18, 730 - i * 14, 1060 + i * 20), 250, 345, fill=palette[2], width=4)

    img.alpha_composite(Image.composite(texture, Image.new("RGBA", JERSEY, (0, 0, 0, 0)), mask))
    draw = ImageDraw.Draw(img)
    draw.line((338, 480, 338, 1062), fill=(255, 255, 255, 58), width=4)
    draw.line((686, 480, 686, 1062), fill=(0, 0, 0, 64), width=4)
    draw.arc((420, 218, 604, 376), 0, 180, fill=palette[3], width=22)
    draw.line((328, 255, 262, 386), fill=palette[3], width=18)
    draw.line((696, 255, 762, 386), fill=palette[3], width=18)
    draw.rounded_rectangle((92, 76, 932, 172), radius=20, fill=(0, 0, 0, 150))
    draw.text((512, 124), title, font=F_H1, fill="#ffffff", anchor="mm")
    draw.text((512, 1146), "Modelo autoral sem escudos oficiais", font=F_BODY, fill="#cbd5e1", anchor="mm")
    save_png(img, os.path.join(IMG_DIR, "camisas", name))


def create_mascot(name, title, body, accent, pose):
    img = Image.new("RGBA", SQUARE, "#122033")
    draw = ImageDraw.Draw(img)
    for r in range(470, 80, -32):
        alpha = max(12, int((470 - r) / 470 * 84))
        draw.ellipse((512 - r, 512 - r, 512 + r, 512 + r), fill=(255, 255, 255, alpha))
    draw.rounded_rectangle((72, 54, 952, 948), radius=34, fill=(255, 255, 255, 30), outline=accent, width=5)

    shadow = Image.new("RGBA", SQUARE, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((280, 790, 760, 900), fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(shadow)

    # Body
    draw.ellipse((332, 334, 692, 754), fill=body, outline="#ffffff", width=6)
    draw.ellipse((360, 150, 664, 454), fill="#f3c58f", outline="#ffffff", width=6)
    draw.ellipse((412, 252, 444, 284), fill="#101827")
    draw.ellipse((580, 252, 612, 284), fill="#101827")
    draw.arc((426, 300, 598, 380), 20, 160, fill="#101827", width=8)
    draw.pieslice((450, 324, 574, 446), 0, 180, fill="#ffffff")
    draw.rectangle((450, 324, 574, 384), fill="#f3c58f")

    if pose == "energy":
        arms = [(342, 446, 180, 274), (682, 448, 838, 256)]
    elif pose == "dribble":
        arms = [(342, 450, 214, 560), (682, 450, 810, 520)]
    else:
        arms = [(342, 446, 208, 350), (682, 448, 828, 352)]
    for x1, y1, x2, y2 in arms:
        draw.line((x1, y1, x2, y2), fill=body, width=46)
        draw.ellipse((x2 - 28, y2 - 28, x2 + 28, y2 + 28), fill="#f3c58f", outline="#ffffff", width=4)
    draw.line((438, 710, 392, 842), fill=body, width=58)
    draw.line((586, 710, 632, 842), fill=body, width=58)
    draw.rounded_rectangle((324, 834, 446, 888), radius=24, fill="#f8fafc")
    draw.rounded_rectangle((578, 834, 700, 888), radius=24, fill="#f8fafc")

    if pose == "dribble":
        draw.ellipse((724, 704, 846, 826), fill="#ffffff", outline="#111827", width=5)
        for a in range(0, 360, 60):
            x = 785 + math.cos(math.radians(a)) * 38
            y = 765 + math.sin(math.radians(a)) * 38
            draw.line((785, 765, x, y), fill="#111827", width=3)
    else:
        draw.ellipse((118, 716, 238, 836), fill="#ffffff", outline="#111827", width=5)
        draw.text((178, 776), "⚽", font=font(62), fill="#111827", anchor="mm")

    draw.text((512, 92), title, font=F_H1, fill="#ffffff", anchor="mm")
    draw.text((512, 928), "Mascote autoral da experiência", font=F_SMALL, fill="#dbeafe", anchor="mm")
    save_png(img, os.path.join(IMG_DIR, "mascotes", name))


def create_svg_assets():
    timeline = """<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576" viewBox="0 0 1024 576">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07111f"/><stop offset="1" stop-color="#123a54"/></linearGradient>
  </defs>
  <rect width="1024" height="576" fill="url(#bg)"/>
  <rect x="38" y="42" width="948" height="492" rx="24" fill="rgba(0,0,0,.32)" stroke="#ffd45a" stroke-width="4"/>
  <text x="512" y="102" text-anchor="middle" font-family="Arial" font-size="48" font-weight="700" fill="#fff">Linha do Tempo das Copas</text>
  <line x1="112" y1="292" x2="912" y2="292" stroke="#ffd45a" stroke-width="8" stroke-linecap="round"/>
  <g font-family="Arial" text-anchor="middle" font-size="18" fill="#fff">
    <g><circle cx="142" cy="292" r="28" fill="#38bdf8"/><text x="142" y="352">1930</text><text x="142" y="382">Uruguai</text></g>
    <g><circle cx="298" cy="292" r="28" fill="#16a34a"/><text x="298" y="352">1970</text><text x="298" y="382">Brasil tri</text></g>
    <g><circle cx="456" cy="292" r="28" fill="#f97316"/><text x="456" y="352">1994</text><text x="456" y="382">pênaltis</text></g>
    <g><circle cx="614" cy="292" r="28" fill="#22c55e"/><text x="614" y="352">2002</text><text x="614" y="382">Ásia</text></g>
    <g><circle cx="770" cy="292" r="28" fill="#60a5fa"/><text x="770" y="352">2026</text><text x="770" y="382">48 seleções</text></g>
    <g><circle cx="892" cy="292" r="28" fill="#ef4444"/><text x="892" y="352">2030+</text><text x="892" y="382">centenário</text></g>
  </g>
  <text x="512" y="464" text-anchor="middle" font-family="Arial" font-size="24" fill="#dbeafe">1930-2022: 22 edições concluídas. Próximas sedes confirmadas: 2026, 2030 e 2034.</text>
</svg>
"""
    frases = """<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576" viewBox="0 0 1024 576">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050b15"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs>
  <rect width="1024" height="576" fill="url(#g)"/>
  <rect x="58" y="58" width="908" height="460" rx="24" fill="rgba(255,255,255,.08)" stroke="#38bdf8" stroke-width="5"/>
  <text x="512" y="190" text-anchor="middle" font-family="Arial" font-size="64" font-weight="700" fill="#ffffff">ENTRE EM CAMPO</text>
  <text x="512" y="278" text-anchor="middle" font-family="Arial" font-size="38" fill="#ffd45a">Respire. Foque. Jogue.</text>
  <text x="512" y="368" text-anchor="middle" font-family="Arial" font-size="26" fill="#dbeafe">Da arquibancada ao gramado, cada passo aumenta a tensão do jogo.</text>
</svg>
"""
    with open(os.path.join(IMG_DIR, "linha-tempo-copas.svg"), "w", encoding="utf-8") as fh:
        fh.write(timeline)
    with open(os.path.join(IMG_DIR, "frases-copa.svg"), "w", encoding="utf-8") as fh:
        fh.write(frases)


def create_history_assets():
    create_photo_showcase(
        "copa-1930.jpg",
        "stabile_1930",
        "Copa de 1930",
        "Uruguai campeão na primeira edição",
        ["Montevidéu", "13 seleções", "Final: URU 4-2 ARG"],
        focus=(0.5, 0.44),
        accent="#38bdf8",
    )
    create_photo_showcase(
        "copa-1970.jpg",
        "brazil_1970",
        "Copa de 1970",
        "Brasil tricampeão no México",
        ["Final: BRA 4-1 ITA", "Jules Rimet definitivo", "Transmissão em cores"],
        focus=(0.55, 0.44),
        accent="#22c55e",
    )
    create_photo_showcase(
        "copa-1994.jpg",
        "rose_bowl_1994",
        "Copa de 1994",
        "Brasil campeão nos EUA",
        ["Final no Rose Bowl", "0-0 e pênaltis", "4º título brasileiro"],
        focus=(0.5, 0.56),
        accent="#facc15",
    )
    create_photo_showcase(
        "copa-2002.jpg",
        "yokohama_2002",
        "Copa de 2002",
        "Brasil penta no Japão/Coreia",
        ["Final em Yokohama", "BRA 2-0 GER", "Primeira Copa na Ásia"],
        focus=(0.5, 0.5),
        accent="#22c55e",
    )

    img = panel_base("centenario_1930", WIDE, focus=(0.5, 0.52), dark=0.34)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((44, 46, 980, 530), radius=24, fill=(0, 0, 0, 126), outline="#ffd45a", width=4)
    draw.text((70, 78), "História das Copas", font=F_TITLE, fill="#ffffff")
    text_block(
        draw,
        74,
        154,
        "A Copa do Mundo começou em 1930 no Uruguai. Desde então, oito seleções venceram o torneio masculino até 2022.",
        840,
        F_BODY,
        "#f8fafc",
    )
    timeline = [("1930", "Uruguai"), ("1970", "Brasil tri"), ("1994", "Brasil tetra"), ("2002", "Brasil penta"), ("2022", "Argentina tri")]
    x = 122
    for year, label in timeline:
        draw.ellipse((x - 30, 350 - 30, x + 30, 350 + 30), fill="#ffd45a")
        draw.text((x, 350), year, font=F_SMALL, fill="#07111f", anchor="mm")
        draw.text((x, 420), label, font=F_SMALL, fill="#ffffff", anchor="mm")
        if x < 820:
            draw.line((x + 34, 350, x + 150, 350), fill="#ffd45a", width=5)
        x += 185
    draw_source_tag(draw, "Base visual: Estadio Centenario 1930 / Wikimedia Commons.")
    save_rgb(img, os.path.join(IMG_DIR, "historia-copas.jpg"))


def create_timeline_panels():
    panels = [
        (
            "linha-1930-1950.jpg",
            "stabile_1930",
            "1930-1950",
            "Nascimento, pausa e Maracanã",
            ["1930: Uruguai inaugura o torneio", "1934/1938: Itália bicampeã", "1942/1946: edições canceladas pela guerra", "1950: Uruguai vence no Brasil"],
            "#38bdf8",
        ),
        (
            "linha-1960-1980.jpg",
            "brazil_1970",
            "1960-1980",
            "Expansão global e camisas lendárias",
            ["1962: Brasil bicampeão no Chile", "1966: Inglaterra campeã em casa", "1970: Brasil tricampeão", "1974/1978: Alemanha Ocidental e Argentina"],
            "#22c55e",
        ),
        (
            "linha-1990-2010.jpg",
            "rose_bowl_1994",
            "1990-2010",
            "Globalização, pênaltis e novas sedes",
            ["1990: Alemanha", "1994: Brasil nos EUA", "1998: França em casa", "2002: Brasil na Ásia", "2006: Itália", "2010: Espanha"],
            "#facc15",
        ),
        (
            "linha-2014-2022.jpg",
            "yokohama_2002",
            "2014-2022",
            "Era recente",
            ["2014: Alemanha vence no Brasil", "2018: França conquista o bi", "2022: Argentina chega ao tri", "2026: torneio passa para 48 seleções"],
            "#60a5fa",
        ),
    ]
    for out_name, photo, title, subtitle, bullets, accent in panels:
        create_wide_panel(out_name, photo, title, subtitle, bullets, accent=accent)


def create_all_assets():
    ensure_dirs()
    create_flags_overview()
    create_ranking()
    for country in CHAMPIONS:
        create_flag_card(country)

    create_history_assets()
    create_timeline_panels()
    create_campo_tatico()
    create_mapa_estadio()
    create_curiosidades()
    create_trophy_panel()
    create_art_boards()

    create_poster(os.path.join(POSTER_DIR, "poster-abertura.jpg"), "maracana", "Abertura da Copa", "Cerimônia, torcida e bandeiras", "#38bdf8", focus=(0.5, 0.42))
    create_poster(os.path.join(POSTER_DIR, "poster-tunel.jpg"), "tunnel", "Túnel dos Jogadores", "Luz, foco e entrada em campo", "#60a5fa", focus=(0.52, 0.54))
    create_poster(os.path.join(POSTER_DIR, "poster-taca.jpg"), "trophy", "Sala da Taça", "Memória, conquista e celebração", "#ffd45a", focus=(0.5, 0.42))
    create_wide_panel(
        "estadio-copa.jpg",
        "maracana",
        "Estádio da Copa",
        "Arquibancada, campo e atmosfera de jogo",
        ["Foto real de estádio brasileiro em formato panorâmico.", "Usado como painel de entrada para contextualizar a experiência.", "Sem marcas oficiais ou patrocínios no asset final."],
        focus=(0.5, 0.45),
        accent="#38bdf8",
    )

    create_jersey("camisa-01.png", "Camisa clássica", ("#f5d742", "#1a7d36", "#1f4aa8", "#15803d"), "sash")
    create_jersey("camisa-02.png", "Camisa moderna", ("#eef8ff", "#68c7ef", "#72d0f4", "#38bdf8"), "stripes")
    create_jersey("camisa-03.png", "Camisa comemorativa", ("#1b1b1f", "#40340c", "#d4af37", "#d4af37"), "gold")
    create_jersey("camisa-04.png", "Camisa reserva", ("#f8fafc", "#dbeafe", "#2563eb", "#1d4ed8"), "sash")

    create_mascot("mascote-01.png", "Mascote Energia", "#f97316", "#fdba74", "energy")
    create_mascot("mascote-02.png", "Mascote Drible", "#22c55e", "#86efac", "dribble")
    create_mascot("mascote-03.png", "Mascote Gol", "#38bdf8", "#93c5fd", "goal")
    create_svg_assets()

    sources = {
        "generated_at": "2026-06-08",
        "notes": "Assets generated for the local World Cup app. Flags are Wikimedia Commons file renderings; historical/stadium base photos are Commons files. Jersey and mascot panels are original generated compositions with no official crests/logos.",
        "commons_media": COMMONS,
        "fact_sources": FACT_SOURCES,
        "flag_files": sorted({c["flag"] for c in CHAMPIONS} | {f for _, f, _ in FUTURE_HOST_FLAGS}),
        "champion_data": CHAMPIONS,
    }
    with open(SOURCE_JSON, "w", encoding="utf-8") as fh:
        json.dump(sources, fh, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    random.seed(20260608)
    create_all_assets()
    print(f"Assets written under {ASSETS_DIR}")
    print(f"Sources written to {SOURCE_JSON}")
