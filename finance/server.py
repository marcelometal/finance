import aiohttp_cors
from aiohttp import web

from .config import DEBUG
from .finance_api import FinanceAPI
from .log import config_log, AccessLogger
from .views import all_data


app = web.Application()
app["finance"] = FinanceAPI()
config_log()

# FIXME
if DEBUG:
    cors = aiohttp_cors.setup(
        app,
        defaults={
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True, expose_headers="*", allow_headers="*",
            )
        },
    )
    resource = cors.add(app.router.add_resource("/"))
    cors.add(resource.add_route("GET", all_data))
else:
    app.add_routes([web.get("/", all_data)])

web.run_app(
    app, reuse_port=True, reuse_address=True, access_log_class=AccessLogger
)
