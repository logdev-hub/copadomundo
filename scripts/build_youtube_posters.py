import os
import sys
from io import BytesIO

import requests
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
OUT_DIR = os.path.join(BASE_DIR, "assets", "posters", "youtube")
SIZE = (1280, 720)
USER_AGENT = "CopadomundoYoutubePosterBuilder/1.0"

VIDEOS = [
    ("curiosidades-museu", "J3q73ZQC0O4", "Curiosidades das Copas do Mundo", "Museu do Futebol"),
    ("historias-bizarras", "Ktsp-7PVRqk", "Histórias bizarras de Copa", "Zizao Fut"),
    ("80-fatos", "jtxRUOAu77A", "80 fatos que parecem fake", "SoccerJM"),
    ("curiosidades-malucas", "zd3RSakBaVw", "Curiosidades malucas", "Mega Curioso"),
    ("questionando-copas", "ma9ATBiC5oM", "Questionando todas as Copas", "Jozão Futebol"),
    ("copa-1930", "Tg-rBNdXVpw", "Copa de 1930", "Dicas Educação Física"),
    ("selecao-brasileira", "aa4jHoN7Pss", "Histórias absurdas da Seleção", "Brasil"),
    ("historia-18-min", "rqwUAj8SH_o", "Todas as Copas em 18 minutos", "Victorando Fut"),
    ("10-curiosidades", "nx4ecM7RmWc", "10 curiosidades da Copa", "Um Clubista"),
    ("copa-2018", "Vlc1liKqQwI", "História completa da Copa de 2018", "SoccerJM"),
    ("origem-ate-2018", "VplArlh1Htg", "Da origem até 2018", "Eurofut"),
    ("historia-educativo", "fTRB6bNd-4E", "A história da Copa do Mundo", "Vídeo educativo"),
    ("7-fatos", "TuUQV3ulRF4", "7 fatos curiosos", "Firula em Campo"),
    ("historia-atualizada", "fqVFXkjzC-g", "História da Copa atualizada", "Eurofut"),
    ("copa-1950", "wdA0PwLi8sk", "Copa de 1950", "Dicas Educação Física"),
    ("camisas-2022", "DhBH8uz9X5M", "Todas as camisas para a Copa 2022", "YouTube"),
    ("mascotes-copas", "r9OkZBizbIE", "Todos os mascotes das Copas", "YouTube"),
]


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


TITLE = font(62, True)
CHANNEL = font(34, True)
SMALL = font(24)


def download_thumbnail(video_id):
    urls = [
        f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
        f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
    ]
    for url in urls:
        response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
        if response.ok and len(response.content) > 6000:
            img = Image.open(BytesIO(response.content)).convert("RGB")
            if img.size[0] > 200 and img.size[1] > 120:
                return img
    raise RuntimeError(f"Could not download thumbnail for {video_id}")


def cover(img):
    sw, sh = SIZE
    scale = max(sw / img.width, sh / img.height)
    resized = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - sw) // 2
    top = (resized.height - sh) // 2
    return resized.crop((left, top, left + sw, top + sh)).convert("RGBA")


def wrap(draw, text, font_obj, max_width):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        candidate = (line + " " + word).strip()
        if draw.textbbox((0, 0), candidate, font=font_obj)[2] <= max_width or not line:
            line = candidate
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines[:2]


def poster(slug, video_id, title, channel):
    out_path = os.path.join(OUT_DIR, f"{slug}.jpg")
    if os.path.exists(out_path) and "--force" not in sys.argv:
        return out_path

    base = cover(download_thumbnail(video_id))
    base = ImageEnhance.Color(base).enhance(1.08)
    base = ImageEnhance.Contrast(base).enhance(1.05)

    bg = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(bg)
    for y in range(SIZE[1]):
        alpha = int(30 + (y / SIZE[1]) * 185)
        draw.line((0, y, SIZE[0], y), fill=(0, 0, 0, alpha))
    base.alpha_composite(bg)

    card = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle((56, 430, 1224, 660), radius=22, fill=(5, 12, 24, 220), outline=(255, 212, 90, 230), width=4)

    lines = wrap(draw, title, TITLE, 870)
    y = 462 if len(lines) == 1 else 446
    for line in lines:
        draw.text((96, y), line, font=TITLE, fill="#ffffff")
        y += 70
    draw.text((98, 610), channel, font=CHANNEL, fill="#ffd45a")

    cx, cy = 1080, 545
    draw.ellipse((cx - 72, cy - 72, cx + 72, cy + 72), fill=(220, 38, 38, 235), outline=(255, 255, 255, 210), width=4)
    draw.polygon([(cx - 22, cy - 38), (cx - 22, cy + 38), (cx + 46, cy)], fill="#ffffff")

    draw.rounded_rectangle((56, 48, 430, 102), radius=14, fill=(0, 0, 0, 160))
    draw.text((76, 75), "VIDEO INTERATIVO", font=SMALL, fill="#ffffff", anchor="lm")
    base.alpha_composite(card)

    base.convert("RGB").save(out_path, quality=91, optimize=True)
    return out_path


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for item in VIDEOS:
        path = poster(*item)
        print(path)


if __name__ == "__main__":
    main()
