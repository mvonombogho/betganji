# BetGanji

![CI](https://github.com/mvonombogho/betganji/workflows/CI/badge.svg)

AI-Powered Sports Prediction Platform

## Features

- AI-powered match predictions using Claude
- Real-time odds tracking
- Match statistics and analysis
- User authentication
- Responsive dashboard
- Dark mode support

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- MongoDB with Prisma
- Claude AI API
- Tailwind CSS
- Shadcn UI

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/mvonombogho/betganji.git
cd betganji
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will automatically use mock data services, no database setup required! You can toggle between mock and real services using the developer control panel in the bottom right corner (visible only in development mode).

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Mock Services

The application includes a comprehensive mock data implementation that allows you to develop and test the UI without requiring external services or databases:

- **Mock Match Data**: Pre-populated soccer matches with various statuses (scheduled, live, finished)
- **Mock Odds Data**: Realistic odds from multiple providers
- **Mock Prediction Data**: AI-generated predictions with insights
- **Mock User Authentication**: Login with email `user@example.com` and password `demo1234`

The mock data service is automatically enabled in development mode.

## Setting Up Real Services

If you want to use real data services instead of mock data:

1. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

2. Initialize the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

3. Ensure your environment variables are set correctly in `.env.local`:
```
DATABASE_URL=...
ANTHROPIC_API_KEY=...
```

4. Turn off mock services using the toggle in the developer control panel.

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
│   ├── (auth)/       # Authentication routes
│   ├── api/          # API endpoints
│   ├── dashboard/    # Dashboard pages
│   └── ...
├── components/       # React components
│   ├── ui/           # UI components (shadcn)
│   ├── matches/      # Match-related components
│   ├── predictions/  # Prediction-related components
│   └── dev/          # Development utilities
├── contexts/         # React contexts for state management
│   ├── ServiceContext.tsx # Service provider context
│   └── data-context.tsx   # Data management context
├── lib/              # Utilities and services
│   ├── ai/           # AI integration
│   │   ├── claude/   # Claude API integration
│   │   ├── deepseek/ # DeepSeek integration
│   │   └── prediction/ # Prediction engine
│   ├── data/         # Data providers and services
│   ├── mock/         # Mock data and services
│   └── utils/        # Utility functions
├── middleware/       # Request middleware
└── types/            # TypeScript type definitions
```

## Contributing

1. Create a new branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

Ensure all tests pass and code follows the project's style guide.

## License

MIT
