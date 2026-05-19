"""
Adapter para a API football-data.org.

Usamos esta API apenas para CLASSIFICAÇÕES da temporada atual — o
plano gratuito da API-Football só libera até 2024, e o football-data.org
free dá acesso ao Brasileirão, Premier League, La Liga, Serie A,
Bundesliga e Ligue 1 da temporada vigente sem limite diário.

Princípio arquitetural: o restante do sistema (router, schemas,
frontend) não muda. Esse arquivo entrega o mesmo `list[Standing]`
que o service antigo entregava — só a fonte mudou.
"""
from typing import Any

import httpx

from app.config import settings
from app.schemas.standing import Standing
from app.schemas.team import Team


class FootballDataError(Exception):
    """Erro tratado da football-data.org (token faltando, quota etc.)."""


async def _request(path: str, params: dict[str, Any] | None = None) -> dict:
    if not settings.football_data_key:
        raise FootballDataError(
            "FOOTBALL_DATA_KEY não configurada. Adicione no .env."
        )

    headers = {"X-Auth-Token": settings.football_data_key}
    url = f"{settings.football_data_base_url}{path}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, headers=headers, params=params)

    if resp.status_code == 429:
        raise FootballDataError(
            "Limite de 10 requisições por minuto atingido. Aguarde 60s e tente de novo."
        )
    if resp.status_code in (401, 403):
        raise FootballDataError("Token da football-data.org inválido.")
    if resp.status_code == 404:
        raise FootballDataError("Competição não encontrada.")
    resp.raise_for_status()
    return resp.json()


def _parse_standing(raw: dict) -> Standing:
    """Converte uma linha da resposta para o nosso schema Standing."""
    team = raw["team"]
    return Standing(
        rank=raw["position"],
        team=Team(
            id=team["id"],
            name=team["name"],
            logo=team.get("crest"),
        ),
        points=raw["points"],
        played=raw["playedGames"],
        win=raw["won"],
        draw=raw["draw"],
        lose=raw["lost"],
        goals_for=raw["goalsFor"],
        goals_against=raw["goalsAgainst"],
        goals_diff=raw["goalDifference"],
        form=raw.get("form"),
    )


async def get_standings(competition_code: str) -> list[Standing]:
    """
    Tabela da temporada atual da competição.

    `competition_code` é a sigla da football-data.org:
      - BSA, PL, PD, SA, BL1, FL1, CL, ELC, PPL, DED, ...
    """
    data = await _request(f"/competitions/{competition_code}/standings")
    standings_groups = data.get("standings", [])
    # A resposta pode trazer várias tabelas (TOTAL, HOME, AWAY).
    # Queremos só a totalizada da temporada regular.
    total = next(
        (
            g for g in standings_groups
            if g.get("type") == "TOTAL" and g.get("stage") in (None, "REGULAR_SEASON")
        ),
        None,
    )
    if not total:
        return []
    return [_parse_standing(row) for row in total.get("table", [])]
