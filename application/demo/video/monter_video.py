"""Create a narrated MP4 from actual UI captures, with chapters and subtitles."""

import json
import math
import subprocess
import sys
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path(__file__).parent
WORK = ROOT / ".tooling" / "video" / "montage"
OUTPUT = ROOT / "livrables"
sys.path.insert(0, str(ROOT / ".tooling" / "video" / "python"))
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
FONT = "C:/Windows/Fonts/segoeui.ttf"
BOLD = "C:/Windows/Fonts/segoeuib.ttf"
GREEN = "#185b49"
INK = "#243c31"
MUTED = "#5c7063"


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)


def wrap(text, face, width):
    lines, line = [], ""
    for word in text.split():
        new = (line + " " + word).strip()
        if face.getlength(new) > width and line:
            lines.append(line)
            line = word
        else:
            line = new
    if line:
        lines.append(line)
    return lines


def paragraph(draw, text, xy, face, width, fill, leading=1.3):
    x, y = xy
    for line in wrap(text, face, width):
        draw.text((x, y), line, font=face, fill=fill)
        y += face.size * leading
    return y


def compose(scene, number, total):
    canvas = Image.new("RGB", (1920, 1080), "#f8f9f5")
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((64, 42, 120, 102), radius=17, fill=GREEN)
    draw.text((79, 46), "S", font=font(40, True), fill="white")
    draw.text((139, 50), "SimuEmploi", font=font(34, True), fill=INK)
    draw.text((1470, 58), "DÉMONSTRATION · S0", font=font(23, True), fill=MUTED)
    draw.line((65, 123, 1855, 123), fill="#d9e2d7", width=2)
    draw.text((75, 174), f"{number:02d} / {total:02d}", font=font(27, True), fill=GREEN)
    y = paragraph(draw, scene["chapter"].upper(), (75, 232), font(23, True), 450, GREEN)
    y = paragraph(draw, scene["title"], (75, y + 23), font(55, True), 460, INK, 1.16)
    draw.rounded_rectangle((75, y + 28, 524, y + 33), radius=2, fill="#c79359")
    y = paragraph(draw, scene["takeaway"], (75, y + 63), font(29), 448, MUTED, 1.35)
    draw.text(
        (75, max(y + 45, 739)), "Exemples fictifs", font=font(23, True), fill=GREEN
    )
    draw.text(
        (75, max(y + 78, 772)),
        "Aucun essai candidat déclaré",
        font=font(21),
        fill=MUTED,
    )
    image = Image.open(SOURCE / "captures" / scene["image"]).convert("RGB")
    image.thumbnail((1226, 692), Image.Resampling.LANCZOS)
    x, top = 610 + (1226 - image.width) // 2, 173 + (692 - image.height) // 2
    draw.rounded_rectangle((590, 151, 1856, 879), radius=20, fill="#e4eadf")
    canvas.paste(image, (x, top))
    draw.rounded_rectangle((66, 905, 1854, 1035), radius=20, fill="#172e26")
    draw.rectangle((65, 1062, 1855, 1068), fill="#d9e2d7")
    draw.rectangle((65, 1062, 65 + round(1790 * number / total), 1068), fill=GREEN)
    return canvas


def cue_chunks(text):
    chunks, line = [], ""
    for word in text.split():
        new = (line + " " + word).strip()
        if len(new) > 110 and line:
            chunks.append(line)
            line = word
        else:
            line = new
    if line:
        chunks.append(line)
    return chunks


def ass_time(seconds):
    centiseconds = round(seconds * 100)
    h, rem = divmod(centiseconds, 360000)
    m, rem = divmod(rem, 6000)
    s, cs = divmod(rem, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def subtitle_time(seconds, comma=False):
    ms = round(seconds * 1000)
    h, rem = divmod(ms, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{',' if comma else '.'}{ms:03d}"


def make_ass(cues):
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,Segoe UI,36,&H00FFFFFF,&H00FFFFFF,&H00172E26,&H00172E26,0,0,0,0,100,100,0,0,1,0,0,2,100,100,68,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
    return header + "\n".join(
        f"Dialogue: 0,{ass_time(start)},{ass_time(end)},Default,,0,0,0,,"
        + text.replace("{", "").replace("}", "").replace("\\", "")
        for start, end, text in cues
    )


def run(args, log):
    with open(log, "w", encoding="utf-8") as output:
        subprocess.run(
            [FFMPEG, "-hide_banner", "-y", *args],
            cwd=WORK,
            stdout=output,
            stderr=subprocess.STDOUT,
            check=True,
        )


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    OUTPUT.mkdir(exist_ok=True)
    scenario = json.loads((SOURCE / "scenario.json").read_text(encoding="utf-8"))
    all_cues, timeline, elapsed, concat = [], [], 0.0, []
    fps = 15
    for i, scene in enumerate(scenario["scenes"], 1):
        audio = ROOT / ".tooling" / "video" / "audio" / f"{i:02d}.wav"
        with wave.open(str(audio)) as wav:
            spoken = wav.getnframes() / wav.getframerate()
        duration = math.ceil((spoken + 0.65) * fps) / fps
        chunks = cue_chunks(scene["narration"])
        total_weight = sum(len(c) for c in chunks)
        cues, position = [], 0.0
        for c in chunks:
            end = position + spoken * len(c) / total_weight
            cues.append((position, end, c))
            all_cues.append((elapsed + position, elapsed + end, c))
            position = end
        (WORK / f"{i:02d}.ass").write_text(make_ass(cues), encoding="utf-8-sig")
        frame = compose(scene, i, len(scenario["scenes"]))
        frame.save(WORK / f"{i:02d}.png")
        if i == 1:
            poster = frame.copy()
            d = ImageDraw.Draw(poster)
            paragraph(
                d,
                "Comprendre la démo et réaliser un test",
                (110, 932),
                font(39, True),
                1660,
                "white",
            )
            poster.save(SOURCE / "poster.png")
        run(
            [
                "-loop",
                "1",
                "-framerate",
                str(fps),
                "-i",
                f"{i:02d}.png",
                "-i",
                str(audio),
                "-vf",
                f"subtitles={i:02d}.ass,fade=t=in:st=0:d=0.3,fade=t=out:st={duration - 0.3:.3f}:d=0.3,format=yuv420p",
                "-af",
                "apad=pad_dur=1",
                "-t",
                f"{duration:.6f}",
                "-c:v",
                "libx264",
                "-preset",
                "veryfast",
                "-tune",
                "stillimage",
                "-crf",
                "23",
                "-c:a",
                "aac",
                "-b:a",
                "96k",
                "-ar",
                "24000",
                "-movflags",
                "+faststart",
                f"{i:02d}.mp4",
            ],
            WORK / f"{i:02d}.log",
        )
        concat.append(f"file '{i:02d}.mp4'")
        timeline.append(
            {
                "scene": i,
                "chapter": scene["chapter"],
                "title": scene["title"],
                "start": round(elapsed, 3),
                "duration": round(duration, 3),
            }
        )
        elapsed += duration
        print(
            f"Montage : scène {i}/{len(scenario['scenes'])}, {elapsed:.1f} s assemblées",
            flush=True,
        )
    (WORK / "concat.txt").write_text("\n".join(concat), encoding="ascii")
    metadata = [
        ";FFMETADATA1",
        "title=SimuEmploi — comprendre la démo et réaliser un test",
        "comment=Montage de captures réelles, narration synthétique française, exemples fictifs.",
    ]
    previous = None
    for scene in timeline:
        if scene["chapter"] != previous:
            if previous is not None:
                metadata[-1] = f"END={round(scene['start'] * 1000)}"
            metadata.extend(
                [
                    "[CHAPTER]",
                    "TIMEBASE=1/1000",
                    f"START={round(scene['start'] * 1000)}",
                    f"title={scene['chapter']}",
                    "END=0",
                ]
            )
            previous = scene["chapter"]
    metadata[-1] = f"END={round(elapsed * 1000)}"
    (WORK / "chapters.txt").write_text("\n".join(metadata), encoding="utf-8")
    video = OUTPUT / "SimuEmploi_Demonstration_Commentee_v01.mp4"
    run(
        [
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            "concat.txt",
            "-i",
            "chapters.txt",
            "-map",
            "0:v",
            "-map",
            "0:a",
            "-map_metadata",
            "1",
            "-map_chapters",
            "-1",
            "-c",
            "copy",
            "-movflags",
            "+faststart",
            str(video),
        ],
        WORK / "assemblage.log",
    )
    (SOURCE / "sous-titres.vtt").write_text(
        "WEBVTT\n\n"
        + "\n\n".join(
            f"{subtitle_time(a)} --> {subtitle_time(b)}\n{text}"
            for a, b, text in all_cues
        )
        + "\n",
        encoding="utf-8",
    )
    (SOURCE / "sous-titres.srt").write_text(
        "\n\n".join(
            f"{i}\n{subtitle_time(a, True)} --> {subtitle_time(b, True)}\n{text}"
            for i, (a, b, text) in enumerate(all_cues, 1)
        )
        + "\n",
        encoding="utf-8",
    )
    (SOURCE / "montage.json").write_text(
        json.dumps(
            {
                "duration_seconds": round(elapsed, 3),
                "resolution": [1920, 1080],
                "fps": fps,
                "voice": scenario["voice"],
                "subtitle_cues": len(all_cues),
                "timeline": timeline,
                "video_mib": round(video.stat().st_size / 1024 / 1024, 2),
                "synthetic_demonstration": True,
                "candidate_tests_completed": 0,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(
        f"Vidéo terminée : {elapsed:.1f} s, {video.stat().st_size / 1024 / 1024:.2f} Mo",
        flush=True,
    )


def chapter_index():
    data = json.loads((SOURCE / "montage.json").read_text(encoding="utf-8"))
    chapters, previous = [], None
    for scene in data["timeline"]:
        if scene["chapter"] != previous:
            chapters.append({"title": scene["chapter"], "start": scene["start"]})
            previous = scene["chapter"]
    (SOURCE / "chapitres.json").write_text(
        json.dumps(chapters, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    if "--remux-only" in sys.argv:
        target = OUTPUT / "SimuEmploi_Demonstration_Commentee_v01.mp4"
        run(
            [
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                "concat.txt",
                "-i",
                "chapters.txt",
                "-map",
                "0:v",
                "-map",
                "0:a",
                "-map_metadata",
                "1",
                "-map_chapters",
                "-1",
                "-c",
                "copy",
                "-movflags",
                "+faststart",
                str(target),
            ],
            WORK / "assemblage.log",
        )
    else:
        main()
    chapter_index()
