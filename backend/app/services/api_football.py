"""
Camada SERVICE — toda comunicação com a API-Football passa por aqui.

Por que isolar?
- Se trocarmos de provedor (ex: TheSportsDB), só este arquivo muda.
- Fica fácil mockar em testes.
- Erros da API externa são traduzidos para algo controlado.

httpx é usado em vez de requests porque suporta async/await,
combinando bem com FastAPI (que é assíncrono por baixo).
"""
from datetime import date as date_type
from typing import Any

import httpx

from app.config import settings
from app.schemas.fixture import Fixture
from app.schemas.standing import Standing
from app.schemas.team import League, Player, Team, TeamFull


class APIFootballError(Exception):
    """Erro tratado vindo da API-Football (chave faltando, quota, etc.)."""


async def _request(path: str, params: dict[str, Any] | None = None) -> dict:
    """Faz a requisição HTTP autenticada e devolve o JSON cru."""
    if not settings.api_football_key:
        raise APIFootballError(
            "API_FOOTBALL_KEY não configurada. Copie .env.example para .env "
            "e preencha sua chave."
        )

    headers = {"x-apisports-key": settings.api_football_key}
    url = f"{settings.api_football_base_url}{path}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, headers=headers, params=params)

    if resp.status_code == 429:
        raise APIFootballError("Cota diária da API-Football esgotada (100/dia no plano free).")
    if resp.status_code == 403:
        raise APIFootballError("Chave da API-Football inválida ou bloqueada.")
    resp.raise_for_status()

    data = resp.json()
    # A API às vezes devolve erros dentro do JSON com status 200.
    if data.get("errors") and isinstance(data["errors"], dict) and data["errors"]:
        raise APIFootballError(f"API-Football retornou erros: {data['errors']}")
    return data


def _parse_fixture(raw: dict) -> Fixture:
    """Converte um item bruto da API no nosso schema Fixture."""
    fix = raw["fixture"]
    league = raw["league"]
    teams = raw["teams"]
    goals = raw.get("goals", {})

    return Fixture(
        id=fix["id"],
        date=fix["date"],
        status=fix["status"]["short"],
        minute=fix["status"].get("elapsed"),
        league=League(
            id=league["id"],
            name=league["name"],
            country=league.get("country"),
            logo=league.get("logo"),
        ),
        home=Team(
            id=teams["home"]["id"],
            name=teams["home"]["name"],
            logo=teams["home"].get("logo"),
        ),
        away=Team(
            id=teams["away"]["id"],
            name=teams["away"]["name"],
            logo=teams["away"].get("logo"),
        ),
        score_home=goals.get("home"),
        score_away=goals.get("away"),
    )


async def get_fixtures_by_date(d: date_type) -> list[Fixture]:
    """Lista todas as partidas de uma data específica."""
    data = await _request("/fixtures", params={"date": d.isoformat()})
    return [_parse_fixture(item) for item in data.get("response", [])]


def _parse_standing(raw: dict) -> Standing:
    """Converte uma linha bruta da tabela no nosso schema Standing."""
    all_stats = raw.get("all", {})
    goals = all_stats.get("goals", {})
    return Standing(
        rank=raw["rank"],
        team=Team(
            id=raw["team"]["id"],
            name=raw["team"]["name"],
            logo=raw["team"].get("logo"),
        ),
        points=raw["points"],
        played=all_stats.get("played", 0),
        win=all_stats.get("win", 0),
        draw=all_stats.get("draw", 0),
        lose=all_stats.get("lose", 0),
        goals_for=goals.get("for", 0),
        goals_against=goals.get("against", 0),
        goals_diff=raw.get("goalsDiff", 0),
        form=raw.get("form"),
    )


async def search_teams(query: str) -> list[Team]:
    """Busca times por nome (ex: 'Palmeiras', 'Manchester')."""
    data = await _request("/teams", params={"search": query})
    return [
        Team(
            id=item["team"]["id"],
            name=item["team"]["name"],
            logo=item["team"].get("logo"),
        )
        for item in data.get("response", [])
    ]


async def get_team(team_id: int) -> TeamFull | None:
    """Detalhes completos de um time. None se não existir."""
    data = await _request("/teams", params={"id": team_id})
    items = data.get("response", [])
    if not items:
        return None
    item = items[0]
    team = item["team"]
    venue = item.get("venue") or {}
    return TeamFull(
        id=team["id"],
        name=team["name"],
        code=team.get("code"),
        country=team.get("country"),
        founded=team.get("founded"),
        logo=team.get("logo"),
        venue_name=venue.get("name"),
        venue_city=venue.get("city"),
    )


async def get_team_squad(team_id: int) -> list[Player]:
    """Elenco atual de um time."""
    data = await _request("/players/squads", params={"team": team_id})
    items = data.get("response", [])
    if not items:
        return []
    players_raw = items[0].get("players", [])
    return [
        Player(
            id=p["id"],
            name=p["name"],
            age=p.get("age"),
            number=p.get("number"),
            position=p.get("position"),
            photo=p.get("photo"),
        )
        for p in players_raw
    ]


async def get_team_fixtures(team_id: int, season: int = 2023, limit: int = 10) -> list[Fixture]:
    """
    Últimas N partidas de um time em uma temporada.

    Nota: o parâmetro `?last=N` da API-Football é restrito ao plano
    pago. Por isso pedimos a temporada inteira e ordenamos/limitamos
    aqui em Python. Trade-off: mais dados trafegando, mas zero custo
    extra de cota.
    """
    data = await _request("/fixtures", params={"team": team_id, "season": season})
    fixtures = [_parse_fixture(item) for item in data.get("response", [])]
    # Ordena do mais recente pro mais antigo e corta no limite.
    fixtures.sort(key=lambda f: f.date, reverse=True)
    return fixtures[:limit]


async def get_standings(league_id: int, season: int) -> list[Standing]:
    """
    Tabela de classificação de uma liga em uma temporada.

    A API devolve um array de listas (uma por grupo, ex: fase de grupos
    da Champions). Para o MVP achatamos: pegamos a primeira lista,
    que para ligas de pontos corridos é a tabela inteira.
    """
    data = await _request(
        "/standings",
        params={"league": league_id, "season": season},
    )
    response = data.get("response", [])
    if not response:
        return []
    standings_groups = response[0].get("league", {}).get("standings", [])
    if not standings_groups:
        return []
    # Achatar todos os grupos numa lista só (a maioria das ligas tem 1 grupo)
    flat = [row for group in standings_groups for row in group]
    return [_parse_standing(item) for item in flat]
