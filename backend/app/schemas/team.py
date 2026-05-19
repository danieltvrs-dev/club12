"""
Schemas compartilhados de Time, Liga, Jogador.
Usados em vários routers (fixtures, standings, teams).
"""
from pydantic import BaseModel


class Team(BaseModel):
    """Versão enxuta — usada em listagens e dentro de outros schemas."""
    id: int
    name: str
    logo: str | None = None


class TeamFull(BaseModel):
    """Versão completa — usada na página de detalhes do time."""
    id: int
    name: str
    code: str | None = None         # sigla curta (ex: "PAL")
    country: str | None = None
    founded: int | None = None      # ano de fundação
    logo: str | None = None
    venue_name: str | None = None   # estádio
    venue_city: str | None = None


class League(BaseModel):
    id: int
    name: str
    country: str | None = None
    logo: str | None = None
    season: int | None = None


class Player(BaseModel):
    id: int
    name: str
    age: int | None = None
    number: int | None = None       # camisa
    position: str | None = None     # Goalkeeper, Defender, Midfielder, Attacker
    photo: str | None = None
