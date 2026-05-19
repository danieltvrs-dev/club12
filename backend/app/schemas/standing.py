"""
Schema de uma linha da tabela de classificação.
"""
from pydantic import BaseModel

from app.schemas.team import Team


class Standing(BaseModel):
    rank: int                    # posição (1, 2, 3, ...)
    team: Team
    points: int                  # pontos
    played: int                  # jogos disputados
    win: int
    draw: int
    lose: int
    goals_for: int               # gols marcados (GP)
    goals_against: int           # gols sofridos (GC)
    goals_diff: int              # saldo (SG)
    form: str | None = None      # últimos 5 jogos: "WWDLW"
