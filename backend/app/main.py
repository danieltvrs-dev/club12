"""
Ponto de entrada do backend CLUB12.

Aqui:
1. Criamos a instância do FastAPI.
2. Configuramos CORS (permite o frontend chamar a API de outra porta).
3. Registramos uma rota simples /health para verificar que está vivo.

Rodar:
    uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import fixtures, standings, teams

app = FastAPI(
    title="CLUB12 API",
    description="Backend da plataforma de futebol CLUB12",
    version="0.1.0",
)

# --- CORS ---
# O navegador bloqueia chamadas JS de http://localhost:5173 para
# http://localhost:8000 por padrão (política same-origin).
# Esse middleware diz "tudo bem, libera o frontend".
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Routers ---
# Cada router agrupa rotas relacionadas. Aqui registramos o de fixtures.
app.include_router(fixtures.router)
app.include_router(standings.router)
app.include_router(teams.router)


@app.get("/health")
def health_check():
    """Endpoint de saúde — usado pra confirmar que o servidor responde."""
    return {"status": "ok", "service": "club12-api"}


@app.get("/")
def root():
    return {"message": "CLUB12 API — bem-vindo! Veja /docs para a documentação."}
