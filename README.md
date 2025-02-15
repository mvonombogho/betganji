# BetGanji

A soccer prediction platform powered by AI.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL
- Redis (for caching)

### Installation

1. Clone the repository
```bash
git clone https://github.com/mvonombogho/betganji.git
cd betganji
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations
```bash
pnpm prisma migrate dev
```

5. Start the development server
```bash
pnpm dev
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Test Structure

- Unit tests are located next to the files they test with the `.test.ts` extension
- Integration tests are in the `__tests__` directory
- E2E tests use Cypress and are in the `cypress` directory

## API Documentation

API documentation is available in OpenAPI/Swagger format in `docs/api/openapi.yaml`.

To view the documentation:

1. Install `redoc-cli`:
```bash
pnpm add -g redoc-cli
```

2. Generate HTML documentation:
```bash
redoc-cli bundle docs/api/openapi.yaml -o docs/api/index.html
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write tests for your changes
4. Update documentation if needed
5. Submit a pull request

## License

MIT