"""
Schemas (Pydantic) que descrevem o FORMATO dos dados que nossa API
devolve para o frontend.

Por que não devolver direto o JSON da API-Football?
- A resposta deles é gigante e cheia de campos que não usamos.
- Se eles mudarem o formato, todo o frontend quebra.
- Definindo nossos próprios schemas, criamos uma "fachada" estável.
"""
from datetime import datetime

from pydantic import BaseModel

from app.schemas.team import League, Team


class Fixture(BaseModel):
    """Uma partida de futebol."""
    id: int
    date: datetime          # data e hora do kickoff (UTC)
    status: str             # NS=not started, 1H, HT, 2H, FT, LIVE, etc.
    minute: int | None = None  # minuto atual se estiver ao vivo
    league: League
    home: Team
    away: Team
    score_home: int | None = None
    score_away: int | None = None
