from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application configuration settings loaded from environment variables."""
    
    # Database configuration
    DATABASE_URL: str = "postgresql+psycopg2://cryptouser:SecureP@ssw0rd2024!@postgres:5432/cryptomind"
    
    # CORS configuration for frontend access
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    
    # Decision engine weights (must sum to 1.0)
    WEIGHT_TECHNICAL: float = 0.6  # Technical analysis weight
    WEIGHT_ONCHAIN: float = 0.2    # On-chain metrics weight
    WEIGHT_SENTIMENT: float = 0.2  # Sentiment analysis weight

    class Config:
        env_file = ".env.example"

# Global settings instance
settings = Settings()
