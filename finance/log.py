import logging

import aiotask_context
import structlog
from aiohttp.abc import AbstractAccessLogger

from .config import LOG_LEVEL, INLINE_LOG


finance_log = logging.getLogger("finance")


def filter_by_level(_, level, event_dict):
    if finance_log.isEnabledFor(getattr(logging, level.upper(), LOG_LEVEL)):
        return event_dict
    raise structlog.exceptions.DropEvent


def format_log(logger, level, event_dict):
    event_dict["logger"] = logger.name
    event_dict["log_level"] = level
    event_dict["msg"] = event_dict.pop("event")
    return event_dict


class LoggerFactory:
    def __call__(self, *args):
        logger = structlog.PrintLogger()
        logger.name = args[0] if args else "root"
        return logger


def config_log():
    processors = [filter_by_level]
    logging.basicConfig(
        level=logging.INFO,
        format=(
            '{"asctime":"%(asctime)s", "log_level": "%(levelname)s",'
            ' "name": "%(name)s","msg":"%(message)s"}'
        ),
    )
    finance_log.setLevel(LOG_LEVEL)

    if INLINE_LOG:
        processors.extend(
            [
                structlog.processors.TimeStamper(key="timestamp"),
                structlog.processors.format_exc_info,
                structlog.dev.ConsoleRenderer(),
            ]
        )
    else:
        processors.extend(
            [
                structlog.processors.TimeStamper(key="timestamp"),
                structlog.processors.format_exc_info,
                format_log,
                structlog.processors.JSONRenderer(sort_keys=True),
            ]
        )
    structlog.configure(processors=processors, logger_factory=LoggerFactory())


access_logger = structlog.get_logger("finance.log.AccessLogger")


class AccessLogger(AbstractAccessLogger):
    def log(self, request, response, time):
        access_logger.info(
            f"[{response.status}] {request.method} {request.path} {time}",
            method=request.method,
            request_uri=request.path,
            request_time=time,
            user_agent=request.headers.get("user-agent", "-"),
            status=response.status,
        )
