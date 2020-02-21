import os
import logging

DEBUG = os.environ.get("DEBUG", False)

# LOG
LOG_LEVEL = getattr(logging, os.environ.get("LOG_LEVEL", "DEBUG").upper())
INLINE_LOG = bool(os.environ.get("INLINE_LOG", False))

# FINANCE
WORKSHEET_KEY = "1bq8WQ7C16_ozUKLZfjkxWb1yNV1b_C3VqWxeTYPz-Fk"
KEY_FILE = "finance-270402-31826ed179a3.json"
SCOPE = ["https://spreadsheets.google.com/feeds"]
