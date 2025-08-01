# Billieball - Billie Eilish Concert Prediction Game

## Overview

Billieball is a full-stack web application that allows two players to compete by making predictions about Billie Eilish concerts during her "HIT ME HARD AND SOFT" World Tour. Players answer questions about various aspects of the show (what she'll wear, song choices, etc.) and earn points based on the accuracy of their predictions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between client, server, and shared components:

- **Frontend**: React-based single-page application built with Vite
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with a custom Billie Eilish theme
- **TanStack Query** for efficient server state management and caching
- **Wouter** for lightweight client-side routing

### Backend Architecture
- **Express.js** REST API server with TypeScript
- **Drizzle ORM** for type-safe database operations
- **Neon Database** (PostgreSQL) for cloud-hosted database
- **Zod** for runtime type validation
- Centralized error handling and request logging middleware

### Database Schema
The database consists of five main tables:
- `shows`: Concert information (venue, city, country, date)
- `players`: Player profiles with unique names
- `games`: Individual game instances between two players
- `predictions`: Player answers stored as JSON objects
- `correctAnswers`: Admin-set correct answers for scoring

### Authentication & Authorization
- Simple password-based admin authentication for setting correct answers
- No user authentication required for gameplay

## Data Flow

1. **Game Setup**: Players enter names, system creates player records
2. **Show Selection**: Players choose from available tour dates
3. **Game Creation**: System creates game record linking players and show
4. **Predictions**: Each player submits answers to 7 prediction questions
5. **Scoring**: Admin sets correct answers, system calculates scores automatically
6. **Results**: Leaderboard displays scores and winners

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components for accessibility
- **wouter**: Lightweight React router
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing

### Database Configuration
- Uses Drizzle Kit for schema management and migrations
- Configured for PostgreSQL with Neon serverless driver
- Environment variable `DATABASE_URL` required for connection

## Deployment Strategy

The application is structured for deployment on platforms like Replit:

- **Development**: `npm run dev` starts both Vite dev server and Express API
- **Build**: `npm run build` creates optimized client bundle and server bundle
- **Production**: `npm start` runs the production Express server serving static files
- **Database**: Uses `npm run db:push` to sync schema changes

The server serves static files in production while providing API endpoints under `/api/*`. The Vite configuration includes Replit-specific plugins for development environment integration.

## Special Features

- **Real-time Updates**: Leaderboard polls for updates every 5 seconds
- **Custom Theming**: Billie Eilish-inspired color scheme with gradient effects
- **Responsive Design**: Works on desktop and mobile devices
- **Question Scoring**: Different point values for each prediction question
- **Game History**: Tracks completed games and final scores
- **Admin Panel**: Secure interface for setting correct answers and calculating scores