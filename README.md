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
