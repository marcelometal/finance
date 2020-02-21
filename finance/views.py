import logging

import gspread
from aiohttp import web
from oauth2client.service_account import ServiceAccountCredentials
from ujson import dumps

from .mock_current_data import CURRENT_DATA
from .mock_historical_daily_data import HISTORICAL_DAILY_DATA
from .mock_historical_weekly_data import HISTORICAL_WEEKLY_DATA


def get_historical_data(finance, symbol):
    # historical_data = finance.get_all_worksheet_values(symbol)
    historical_data = HISTORICAL_WEEKLY_DATA
    headers_historical = historical_data[0]
    response_historical = []
    for x in range(1, len(historical_data)):
        data_historical_data = historical_data[x]
        blah = []
        for i in range(len(headers_historical)):
            historical_key = headers_historical[i].strip()
            historical_value = (
                data_historical_data[i].strip().replace(",", ".")
            )
            try:
                historical_value = float(historical_value)
            except:
                pass
            blah.append({historical_key: historical_value})
        response_historical.append(blah)
    return response_historical


async def all_data(request):
    finance = request.app["finance"]
    # current_data = finance.get_all_worksheet_values("Prospection")
    current_data = CURRENT_DATA
    headers_current = current_data[0]
    response_obj = []
    for x in range(1, len(current_data)):
        data = current_data[x]
        line = {}
        for i in range(len(headers_current)):
            key = headers_current[i].strip()
            value = data[i].strip().replace(",", ".")
            try:
                value = float(value)
            except:
                pass
            line[key] = value
        symbol = data[0]
        line["lastFiveYearsData"] = get_historical_data(finance, symbol)
        response_obj.append(line)

    return web.Response(text=dumps(response_obj))
