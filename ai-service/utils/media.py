import os
import subprocess
import tempfile

# Local Windows path
# On Render/Linux, set FFMPEG_PATH=ffmpeg
FFMPEG_PATH = os.getenv(
    "FFMPEG_PATH",
    r"C:\ffmpeg\bin\ffmpeg.exe"
)

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
    Extract and compress audio from a video.
    Returns temporary MP3 path.
    """

    output = tempfile.NamedTemporaryFile(
        suffix=".mp3",
        delete=False
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
        raise RuntimeError(
            f"FFmpeg failed:\n{result.stderr}"
        )

    return output