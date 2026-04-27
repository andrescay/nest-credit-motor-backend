# Credit Motor Backend Study

NestJS backend study project for a digital loan origination flow.  
It provides a REST API to create, update, simulate offers, finalize, abandon, and audit credit applications.

## Tech Stack

- Node.js + TypeScript
- NestJS
- `class-validator` / `class-transformer` for DTO validation
- In-memory repositories (ready to be replaced by persistent adapters)
- Jest for unit and e2e tests

## Domain Scope

The service manages loan applications with explicit state transition rules and event logging.

Core statuses:

- `IN_PROGRESS`
- `PENDING_VALIDATION`
- `FINALIZED`
- `ABANDONED`

Core business constraints:

- Terminal states cannot be edited.
- Invalid transitions are rejected with domain errors.
- Finalization requires minimum business data.
- Simulation results are stored in the application and tracked as events.

## API Endpoints

Base path: `/applications`

- `POST /applications` - create application
- `GET /applications` - list applications (with filters)
- `GET /applications/:id` - get application detail
- `PATCH /applications/:id` - update editable fields
- `POST /applications/:id/simulate-offer` - run mock offer simulation
- `POST /applications/:id/finalize` - finalize application
- `POST /applications/:id/abandon` - abandon application
- `GET /applications/:id/events` - list application events

Use `x-request-id` header when available to improve traceability across events.

## Getting Started

```bash
npm install
```

## Run the Project

```bash
# development
npm run start

# watch mode
npm run start:dev

# debug mode
npm run start:debug

# production mode
npm run build
npm run start:prod
```

## Quality and Tests

```bash
# lint
npm run lint

# format
npm run format

# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## Architecture Notes

- `ApplicationsService` centralizes business use cases.
- Repositories and external integrations are injected using tokens and ports/adapters.
- Current persistence and simulation are mocked/in-memory for study purposes.
- The design is prepared to evolve to production adapters (for example, MongoDB and real simulation providers).
