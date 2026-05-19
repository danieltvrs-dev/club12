"""
Configurações centralizadas do app.

Lemos as variáveis do arquivo .env (graças ao pydantic-settings) e
expomos um objeto `settings` que o resto do código importa.

Vantagem: nenhum lugar do código lê os.environ diretamente — tudo
passa por aqui. Isso evita typos e facilita testar.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Valores padrão (sobrescritos pelo .env quando existir)
    api_football_key: str = ""
    api_football_base_url: str = "https://v3.football.api-sports.io"

    football_data_key: str = ""
    football_data_base_url: str = "https://api.football-data.org/v4"

    frontend_origin: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
