import os

from groq import Groq

from utils.media import extract_audio, is_video


def transcribe(path: str) -> str:
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError("GROQ_API_KEY is missing.")

    client = Groq(
        api_key=api_key,
        timeout=120,
        max_retries=2,
    )

    audio_path = path
    generated_audio = False

    try:
        if is_video(path):
            audio_path = extract_audio(path)
            generated_audio = True

        with open(audio_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-large-v3-turbo",
                file=(os.path.basename(audio_path), audio_file.read()),
                response_format="verbose_json",
            )

        return response.text.strip()

    finally:
        if generated_audio and os.path.exists(audio_path):
            os.remove(audio_path)