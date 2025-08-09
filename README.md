# CryptoMind Analytics

A comprehensive cryptocurrency analytics platform with modern UI, technical analysis, and decision engine capabilities.

## Features

- **Modern UI**: Tailwind-based interface with sidebar navigation, dark mode, and responsive design
- **Technical Analysis**: Multiple signal indicators (RSI, MACD, EMA, Bollinger Bands, Volume Surge)
- **Decision Engine**: Weighted decision making based on technical, on-chain, and sentiment analysis
- **Portfolio Management**: Track and analyze cryptocurrency portfolios
- **Comparison Tools**: Compare multiple assets and their performance
- **Real-time Data**: WebSocket integration for live price updates
- **Backtesting**: Test trading strategies against historical data

## Architecture

- **Backend**: FastAPI with PostgreSQL database
- **Frontend**: React with TypeScript and Vite
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Containerization**: Docker and Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd cryptomind_analytics
```

2. Copy environment configuration:
```bash
cp .env.example .env
```

3. Update the `.env` file with your preferred settings (especially the database password)

4. Start the application:
```bash
docker-compose up --build
```

5. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- API Documentation: http://localhost:8080/docs

### Development

For development with hot reloading:

```bash
# Start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec frontend sh
```

## API Endpoints

- `GET /health` - Health check
- `GET /assets/seed` - Seed asset data
- `POST /data/backfill` - Backfill historical data
- `GET /data/ohlcv` - Get OHLCV data
- `POST /signals/{symbol}` - Run technical analysis signals
- `POST /decisions/{symbol}` - Get trading decisions
- `GET /portfolio` - Portfolio management
- `GET /compare` - Asset comparison
- `GET /reports/ohlcv.csv` - Export OHLCV data

## Testing

Run the test suite:

```bash
# Run tests in backend container
docker-compose exec backend pytest

# Run with coverage
docker-compose exec backend pytest --cov=app
```

## Configuration

Key environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGINS`: Allowed CORS origins for frontend
- `WEIGHT_TECHNICAL`: Weight for technical analysis (default: 0.6)
- `WEIGHT_ONCHAIN`: Weight for on-chain analysis (default: 0.2)
- `WEIGHT_SENTIMENT`: Weight for sentiment analysis (default: 0.2)

## Security

- Containers run as non-root users
- Environment variables for sensitive configuration
- CORS properly configured
- Strong default passwords (change in production)

## Development Workflow

1. Make changes to code
2. Containers automatically reload (development mode)
3. Run tests: `docker-compose exec backend pytest`
4. View logs: `docker-compose logs -f [service]`

## Production Deployment

For production deployment:

1. Update environment variables with production values
2. Use strong passwords and secure secrets
3. Configure proper CORS origins
4. Consider using Docker secrets for sensitive data
5. Set up proper backup strategy for PostgreSQL data

## Contributing

1. Follow PEP 8 for Python code
2. Use TypeScript for frontend development
3. Add tests for new features
4. Update documentation as needed

## License

See LICENSE file for details.
