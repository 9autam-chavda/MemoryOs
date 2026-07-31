import os
from groq import Groq

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def transcribe(file_path: str) -> str:
    """
    Transcribe an audio/video file using Groq Whisper.
    Returns only the transcript text.
    """

    with open(file_path, "rb") as audio_file:
        response = client.audio.transcriptions.create(
            model="whisper-large-v3-turbo",
            file=audio_file,
            response_format="verbose_json",
            language="en"
        )

    return response.text