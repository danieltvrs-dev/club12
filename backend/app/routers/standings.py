"""
Rotas relacionadas a tabelas de classificação.

GET /standings/leagues         → curadoria de ligas suportadas
GET /standings?league=<code>   → tabela da liga (temporada atual)

Implementação: usamos football-data.org como fonte de standings
porque o plano gratuito da API-Football limita às temporadas 2022-2024.
"""
import httpx
from fastapi import APIRouter, HTTPException, Query

from app.schemas.standing import Standing
from app.services import football_data

router = APIRouter(prefix="/standings", tags=["standings"])

# Curadoria editorial: ligas que vamos oferecer no dropdown.
# O `id` aqui é o código da football-data.org (BSA, PL, PD, ...).
SUPPORTED_LEAGUES = [
    {"id": "BSA", "name": "Brasileirão Série A",  "country": "Brazil"},
    {"id": "PL",  "name": "Premier League",       "country": "England"},
    {"id": "PD",  "name": "La Liga",              "country": "Spain"},
    {"id": "SA",  "name": "Serie A (Itália)",     "country": "Italy"},
    {"id": "BL1", "name": "Bundesliga",           "country": "Germany"},
    {"id": "FL1", "name": "Ligue 1",              "country": "France"},
]


@router.get("/leagues")
def supported_leagues():
    """Devolve a lista de ligas que o frontend deve oferecer no filtro."""
    return SUPPORTED_LEAGUES


@router.get("", response_model=list[Standing])
async def standings(
    league: str = Query(..., description="Código da liga na football-data.org (BSA, PL, ...)"),
):
    """Tabela de classificação da temporada atual da liga solicitada."""
    try:
        return await football_data.get_standings(league)
    except football_data.FootballDataError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erro consultando football-data.org: {exc}")
