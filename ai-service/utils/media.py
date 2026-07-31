import os
import shutil
import subprocess
import tempfile

# If FFMPEG_PATH is set, use it.
# Otherwise:
# - Windows -> C:\ffmpeg\bin\ffmpeg.exe
# - Linux/Docker -> ffmpeg (from PATH)

if os.name == "nt":
    DEFAULT_FFMPEG = r"C:\ffmpeg\bin\ffmpeg.exe"
else:
    DEFAULT_FFMPEG = "ffmpeg"

FFMPEG_PATH = os.getenv("FFMPEG_PATH", DEFAULT_FFMPEG)

VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
    ".flv",
    ".wmv",
    ".m4v",
}


def is_video(path: str) -> bool:
    return os.path.splitext(path)[1].lower() in VIDEO_EXTENSIONS


def extract_audio(video_path: str) -> str:
    """
    Extract audio from a video using FFmpeg.
    Returns path to temporary MP3.
    """

    # Make sure FFmpeg exists
    if shutil.which(FFMPEG_PATH) is None and not os.path.isfile(FFMPEG_PATH):
        raise RuntimeError(
            f"FFmpeg not found: {FFMPEG_PATH}"
        )

    output = tempfile.NamedTemporaryFile(
        suffix=".mp3",
        delete=False,
    ).name

    command = [
        FFMPEG_PATH,
        "-y",
        "-i",
        video_path,
        "-vn",
        "-ac",
        "1",
        "-ar",
        "16000",
        "-b:a",
        "64k",
        output,
    ]

    result = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    if result.returncode != 0:
        raise RuntimeError(result.stderr)

    return output