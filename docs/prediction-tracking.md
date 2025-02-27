# Prediction Tracking System

This document provides an overview of the prediction tracking system implemented in BetGanji.

## Overview

The prediction tracking system allows users to:

1. Generate AI-powered predictions for soccer matches
2. Track the accuracy of these predictions over time
3. Analyze prediction performance by competition, confidence level, and time period
4. Visualize prediction results through interactive dashboards

## Key Components

### Data Provider

The `DataProvider` context manages the application's data flow, providing access to:

- Match data
- Prediction data
- Refresh operations
- Data loading states

### Data Refresher

The `DataRefresher` service handles data refreshing operations:

- Refreshing match data from API sources
- Refreshing prediction data and associated match data
- Checking for updates (matches that need score updates, predictions that need settlement)
- Initializing application data

### Data Controller

The `DataController` coordinates data operations:

- Refreshing matches and predictions
- Processing updates for completed matches
- Settling predictions for finished matches
- Initializing all application data at startup

### Accuracy Dashboard

The accuracy dashboard (`/dashboard/accuracy`) provides:

- Overall prediction accuracy metrics
- Breakdown by competition
- Analysis by confidence level
- Filtering by date range
- Data refresh controls

## API Routes

- `/api/initialize` - Initialize application data
- `/api/matches/refresh` - Refresh match data
- `/api/predictions/refresh` - Refresh prediction data and settle completed predictions

## Data Flow

1. User requests prediction for a match
2. AI prediction engine (DeepSeek R1) generates prediction with confidence level
3. Prediction is stored in database
4. When match completes, system automatically refreshes score data
5. Predictions are settled based on actual match results
6. Accuracy metrics are updated on dashboard

## Automated Updates

The system performs automated updates through:

- Automatic data refresh at regular intervals (hourly)
- Checking for match score updates on each refresh
- Settling predictions when match results become available

## Usage

1. Navigate to `/dashboard/accuracy` to view prediction performance
2. Use date filter to analyze specific time periods
3. Toggle between confidence and competition views
4. Click "Refresh Data" to manually update the dashboard

## Technical Details

- Built with Next.js App Router architecture
- Uses React Context for state management
- Implements real-time updates with React hooks
- Uses Recharts for data visualization
- Integrates with DeepSeek R1 API for AI predictions
