# Star Wars API

A NestJS-based REST API for managing Star Wars characters with full CRUD operations, built with TypeScript and PostgreSQL.

## Features

- **Full CRUD Operations** for Star Wars characters
- **PostgreSQL Database** with Drizzle ORM
- **Docker Support** for local development
- **Strict TypeScript** configuration
- **Comprehensive Testing** setup with coverage reporting
- **GitHub Actions CI/CD** pipeline with automated testing
- **API Documentation** with Swagger

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Container:** Docker & Docker Compose
- **Testing:** Jest

## Quick Start

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker & Docker Compose

### 1. Clone and Install

```bash
git clone https://github.com/radekrzepka/star-wars-api
cd star-wars-api
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory, for local development you can copy and paste environmental variables from `.env.example`

### 3. Database Setup

Start the PostgreSQL database:

```bash
pnpm run docker:db:up
```

Run database migrations:

```bash
pnpm run db:migrate
```

Seed the database:

```bash
pnpm run db:seed
```

### 4. Start Development

```bash
pnpm run start:dev
```

## API Documentation

API documentation is available at `/api/docs` when the application is running.

## Available Scripts

### Development

- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run start:debug` - Start with debugging enabled
- `pnpm run build` - Build for production
- `pnpm run start:prod` - Start production server

### Database

- `pnpm run docker:db:up` - Start PostgreSQL container
- `pnpm run docker:db:down` - Stop PostgreSQL container
- `pnpm run db:generate` - Generate database migrations
- `pnpm run db:migrate` - Run database migrations
- `pnpm run db:push` - Push schema changes to database
- `pnpm run db:studio` - Open Drizzle Studio (database GUI)
- `pnpm run db:seed` - Seed database with sample data

### Code Quality

- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm run test:cov` - Run tests with coverage

## Testing

The project uses Jest for testing with comprehensive coverage reporting and database integration:

### Test Configuration

- **Coverage thresholds** set at 80% for branches, functions, lines, and statements
- **Test database** configured via environment variables
- **Simplified test setup** using existing seed script

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run with coverage report
pnpm run test:cov

# Run e2e tests
pnpm run test:e2e
```

## CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that:

### **Automated Testing**

- Sets up PostgreSQL test database
- Runs linting and type checking
- Builds application to verify compilation
- Executes tests with coverage reporting
- Generates coverage reports with 80% threshold

### **Build Process**

- Validates TypeScript compilation
- Ensures build succeeds before testing
- Creates production build artifacts

### **Quality Gates**

- ESLint with strict type-aware rules
- TypeScript strict mode validation
- Test coverage requirements
- Build success validation

## Code Quality

- **Strict TypeScript config**
- **ESLint** with comprehensive type-aware rules
- **Prettier** for consistent code formatting
- **Conventional Commits** for clear git history

## Development Choices

### Database Design

- **PostgreSQL** chosen for reliability and JSON support for episodes array
- **Drizzle ORM** for type-safe database operations and excellent TypeScript integration

### Architecture Decisions

- **Modular structure** following NestJS best practices
- **Global database module** for dependency injection
- **Strict TypeScript** configuration for maximum type safety
- **Docker containerization** for consistent development environment

## Why I Chose REST over GraphQL

While the requirements mentioned either GraphQL or RESTful API, I deliberately chose REST for this Star Wars character management system. Here's my reasoning:

**Simplicity & Development Speed**

- For CRUD operations on characters, REST's resource-based approach is more intuitive
- Less boilerplate code compared to GraphQL resolvers, schemas, and type definitions
- Faster initial development and easier onboarding for team members
- Standard HTTP status codes provide clear API contract

**Caching Strategy**

- CDN integration is straightforward for GET endpoints
- Database query patterns are predictable and easier to optimize

**Performance Considerations**

- For this use case, over-fetching isn't a significant concern
- Character data is relatively lightweight (name, planet, episodes)
- Pagination is simpler to implement and reason about
- Database queries are straightforward without complex join resolvers

That said, I'd consider GraphQL for:

- Frontend-heavy applications with complex data requirements
- Mobile apps where bandwidth optimization is critical
- Systems with many different client types needing different data shapes

## My Production Deployment Ideas

Based on my experience with TypeScript backends, here are the key areas I'd focus on for production deployment:

**Security & Configuration**

- Implement proper secret management (AWS Secrets Managert)
- Add rate limiting (express-rate-limit) and request throttling
- Configure CORS properly for frontend domains
- Implement API key authentication for public endpoints

**Database Strategy**

- Set up automated database migrations in deployment pipeline
- Configure connection pooling
- Implement read replicas for scaling read operations
- Set up automated daily backups with point-in-time recovery
- Add database query monitoring and slow query alerts

**Observability & Monitoring**

- Set up health check endpoints (/health, /ready) for load balancers
- Add application metrics with Prometheus/Grafana
- Implement error tracking (Sentry) with proper error boundaries
- Create alerting for critical metrics (response time, error rate, DB connections)

**Performance & Scaling**

- Add Redis caching layer for frequently accessed character data
- Configure horizontal scaling with multiple API instances

**Deployment Pipeline**

- Set up blue-green deployments for zero-downtime updates
- Add security scanning for dependencies and containers
- Configure proper resource limits and auto-scaling policies
