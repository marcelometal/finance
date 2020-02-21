import gspread
from oauth2client.service_account import ServiceAccountCredentials

symbols = [
    "ABEV3",
    "ANIM3",
    "AZUL4",
    "BBDC4",
    "BKBR3",
    "BMGB4",
    "BRKM5",
    "CMIG4",
    "COGN3",
    "CYRE3",
    "ECOR3",
    "EZTC3",
    "GBIO33",
    "GGBR4",
    "IRBR3",
    "ITSA4",
    "ITUB4",
    "JBSS3",
    "JSLG3",
    "LEVE3",
    "LOGG3",
    "MOVI3",
    "MRVE3",
    "MYPK3",
    "NTCO3",
    "ODPV3",
    "PCAR4",
    "PFRM3",
    "PRIO3",
    "PSSA3",
    "PTBL3",
    "RENT3",
    "SANB11",
    "SAPR11",
    "SBSP3",
    "SHUL4",
    "SMLS3",
    "SUZB3",
    "TAEE11",
    "TIET11",
    "TPIS3",
    "TRPL4",
    "TUPY3",
    "USIM5",
    "VIVT4",
    "VVAR3",
    "WIZS3",
]

scope = ["https://spreadsheets.google.com/feeds"]
credentials = ServiceAccountCredentials.from_json_keyfile_name(
    "finance-270402-31826ed179a3.json", scope
)
gc = gspread.authorize(credentials)
wks = gc.open_by_key("1bq8WQ7C16_ozUKLZfjkxWb1yNV1b_C3VqWxeTYPz-Fk")
for symbol in symbols:
    print(f"Creating {symbol}")
    worksheet = wks.add_worksheet(title=symbol, rows="1", cols="1")
    worksheet.update_acell(
        "A1", f'=GOOGLEFINANCE("{symbol}"; "all"; TODAY()-(365*5); TODAY())'
    )
