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

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. Initialize the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
├── components/       # React components
├── lib/              # Utilities and services
│   ├── services/     # Business logic
│   ├── auth/         # Authentication
│   └── utils/        # Helper functions
└── types/           # TypeScript types
```

## Contributing

1. Create a new branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

Ensure all tests pass and code follows the project's style guide.