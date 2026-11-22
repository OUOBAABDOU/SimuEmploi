"""Decode the delivered video and extract visual checks, without candidate data."""

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path(__file__).parent
sys.path.insert(0, str(ROOT / ".tooling" / "video" / "python"))
import imageio_ffmpeg

video = ROOT / "livrables" / "SimuEmploi_Demonstration_Commentee_v01.mp4"
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
result = subprocess.run(
    [
        ffmpeg,
        "-hide_banner",
        "-i",
        str(video),
        "-af",
        "volumedetect",
        "-f",
        "null",
        "-",
    ],
    check=False,
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="replace",
)
if result.returncode:
    raise RuntimeError(result.stderr[-2000:])
log = result.stderr
selected = [12, 95, 198, 265, 322, 354]
work = ROOT / ".tooling" / "video" / "verification"
work.mkdir(parents=True, exist_ok=True)
sheet = Image.new("RGB", (1440, 900), "#edf2e7")
d = ImageDraw.Draw(sheet)
face = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
for index, second in enumerate(selected):
    target = work / f"frame-{second}.png"
    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-ss",
            str(second),
            "-i",
            str(video),
            "-frames:v",
            "1",
            "-vf",
            "scale=700:394",
            str(target),
        ],
        check=True,
    )
    x, y = 20 + index % 2 * 710, 10 + index // 2 * 295
    thumb = Image.open(target).convert("RGB")
    thumb.thumbnail((700, 262))
    sheet.paste(thumb, (x, y))
    d.text(
        (x, y + 265),
        f"{second // 60:02d}:{second % 60:02d} — image extraite du MP4",
        font=face,
        fill="#185b49",
    )
sheet.save(SOURCE / "verification-montage.jpg", quality=90)
data = video.read_bytes()
duration = re.search(r"Duration: ([0-9:.]+)", log)
mean = re.search(r"mean_volume: ([\-0-9.]+) dB", log)
maximum = re.search(r"max_volume: ([\-0-9.]+) dB", log)
report = {
    "decode_exit_code": result.returncode,
    "duration": duration.group(1) if duration else None,
    "h264": "Video: h264" in log,
    "aac": "Audio: aac" in log,
    "resolution_1080p": "1920x1080" in log,
    "mean_volume_db": float(mean.group(1)) if mean else None,
    "max_volume_db": float(maximum.group(1)) if maximum else None,
    "faststart": 0 < data.find(b"moov") < data.find(b"mdat"),
    "size_mib": round(len(data) / 1024 / 1024, 2),
    "sha256": hashlib.sha256(data).hexdigest(),
    "frames_inspected_seconds": selected,
    "candidate_evidence_created": False,
}
(SOURCE / "verification-video.json").write_text(
    json.dumps(report, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps(report, indent=2))
