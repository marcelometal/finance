# https://console.cloud.google.com/apis/dashboard

# https://developers.google.com/sheets/api/quickstart/python
# https://www.linkedin.com/pulse/manipulando-planilhas-do-google-usando-python-renan-pessoa
# https://medium.com/datadriveninvestor/use-google-sheets-as-your-database-using-python-77d40009860f

# https://gspread.readthedocs.io/en/latest/user-guide.html#selecting-a-worksheet

import gspread
from oauth2client.service_account import ServiceAccountCredentials

from .config import WORKSHEET_KEY, KEY_FILE, SCOPE


class FinanceAPI(object):
    def __init__(self):
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            KEY_FILE, SCOPE
        )
        gc = gspread.authorize(credentials)
        self.wks = gc.open_by_key(WORKSHEET_KEY)

    def get_all_worksheet_values(self, worksheet):
        worksheet = self.wks.worksheet(worksheet)
        return worksheet.get_all_values()

    def create_worksheet(self, symbol, years=5):
        worksheet = self.wks.add_worksheet(title=symbol, rows="1", cols="1")
        formula = f'=GOOGLEFINANCE("{symbol}"; "all"; TODAY()-(365*{years}); TODAY())'
        worksheet.update_acell("A1", formula)
