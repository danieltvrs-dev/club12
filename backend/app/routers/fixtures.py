"""
Rotas HTTP relacionadas a partidas (fixtures).

Esta camada é "burra" de propósito: só recebe o request, chama o
service e devolve a resposta. Toda lógica de negócio fica no service.
"""
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, HTTPException

from app.schemas.fixture import Fixture
from app.services import api_football

router = APIRouter(prefix="/fixtures", tags=["fixtures"])


@router.get("/today", response_model=list[Fixture])
async def fixtures_today():
    """Lista as partidas do dia atual (UTC)."""
    today = datetime.now(timezone.utc).date()
    try:
        return await api_football.get_fixtures_by_date(today)
    except api_football.APIFootballError as exc:
        # 503 = Service Unavailable. Nosso backend está bem, mas o
        # provedor externo está indisponível ou mal configurado.
        raise HTTPException(status_code=503, detail=str(exc))
    except httpx.HTTPError as exc:
        # 502 = Bad Gateway. Erro de rede/HTTP ao falar com a API externa.
        raise HTTPException(status_code=502, detail=f"Erro consultando API-Football: {exc}")
