"""Python sample: dataclasses, decorators, comprehensions, exceptions, and pattern matching."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from functools import wraps
from typing import Callable, Iterable, Protocol


class Notifier(Protocol):
    def send(self, subject: str, body: str) -> bool: ...


def trace(func: Callable[..., object]) -> Callable[..., object]:
    @wraps(func)
    def wrapper(*args: object, **kwargs: object) -> object:
        print(f"calling {func.__name__} with {len(args)} positional args")
        return func(*args, **kwargs)

    return wrapper


@dataclass(slots=True)
class Invoice:
    customer: str
    total: float
    tags: list[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def is_overdue(self) -> bool:
        return "overdue" in self.tags

    def apply_discount(self, percent: float) -> None:
        if not 0 <= percent <= 100:
            raise ValueError("percent must be between 0 and 100")
        self.total *= 1 - percent / 100


@trace
def summarize(invoices: Iterable[Invoice]) -> dict[str, float]:
    totals = {invoice.customer: round(invoice.total, 2) for invoice in invoices if invoice.total > 0}
    match len(totals):
        case 0:
            print("No billable invoices")
        case 1:
            print("One customer ready")
        case _:
            print(f"{len(totals)} customers ready")
    return totals
