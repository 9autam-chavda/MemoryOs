CATEGORIES = {

    "Education": [
        "exam",
        "semester",
        "college",
        "student",
        "lecture",
        "university",
        "gtu",
        "assignment"
    ],

    "Finance": [
        "invoice",
        "payment",
        "amount",
        "receipt",
        "bank",
        "upi"
    ],

    "Coding": [
        "java",
        "react",
        "node",
        "python",
        "mongodb",
        "leetcode",
        "code"
    ],

    "Medical": [
        "doctor",
        "hospital",
        "medicine",
        "prescription",
        "patient"
    ]
}


def classify(text: str) -> str:

    lower = text.lower()

    for category, keywords in CATEGORIES.items():

        for keyword in keywords:

            if keyword in lower:
                return category

    return "Others"