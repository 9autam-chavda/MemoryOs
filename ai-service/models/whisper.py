from faster_whisper import WhisperModel

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)


def transcribe(path):

    segments, info = model.transcribe(path)

    text = ""

    for segment in segments:
        text += segment.text + " "

    return text.strip()