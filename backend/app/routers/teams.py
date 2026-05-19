"""
Rotas relacionadas a times.

GET /teams/search?q=...           → busca times por nome
GET /teams/{id}                   → detalhes completos
GET /teams/{id}/squad             → elenco
GET /teams/{id}/fixtures?last=N   → últimas N partidas
"""
import httpx
from fastapi import APIRouter, HTTPException, Query

from app.schemas.fixture import Fixture
from app.schemas.team import Player, Team, TeamFull
from app.services import api_football

router = APIRouter(prefix="/teams", tags=["teams"])


def _handle_external_errors(exc: Exception):
    """DRY: tradução padrão de erros externos pra HTTPException."""
    if isinstance(exc, api_football.APIFootballError):
        raise HTTPException(status_code=503, detail=str(exc))
    if isinstance(exc, httpx.HTTPError):
        raise HTTPException(status_code=502, detail=f"Erro consultando API-Football: {exc}")
    raise exc


@router.get("/search", response_model=list[Team])
async def search(q: str = Query(..., min_length=3, description="Termo de busca (mín. 3 letras)")):
    try:
        return await api_football.search_teams(q)
    except Exception as exc:
        _handle_external_errors(exc)


@router.get("/{team_id}", response_model=TeamFull)
async def team_detail(team_id: int):
    try:
        team = await api_football.get_team(team_id)
    except Exception as exc:
        _handle_external_errors(exc)
    if not team:
        raise HTTPException(status_code=404, detail="Time não encontrado")
    return team


@router.get("/{team_id}/squad", response_model=list[Player])
async def team_squad(team_id: int):
    try:
        return await api_football.get_team_squad(team_id)
    except Exception as exc:
        _handle_external_errors(exc)


@router.get("/{team_id}/fixtures", response_model=list[Fixture])
async def team_fixtures(
    team_id: int,
    season: int = Query(2023, description="Temporada (plano free: 2022-2024)"),
    limit: int = Query(10, ge=1, le=50),
):
    try:
        return await api_football.get_team_fixtures(team_id, season=season, limit=limit)
    except Exception as exc:
        _handle_external_errors(exc)
