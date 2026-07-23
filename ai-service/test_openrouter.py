from ai.providers.openrouter_provider import OpenRouterProvider

provider = OpenRouterProvider()

prompt = """
MEMORY CONTEXT

React is a JavaScript library created by Meta.

USER QUESTION

What is React?
"""

print(provider.generate(prompt))