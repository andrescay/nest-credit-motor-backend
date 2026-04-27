# Requested Technical Stories

## 1) API and Business Rules

**As** a digital origination microsite  
**I want** to create, update, simulate, finalize, or abandon applications through clear REST contracts  
**So that** we can operate a traceable and controlled unsecured credit flow.

### Acceptance Criteria

- The API exposes endpoints for create, list, detail, update, simulate, finalize, abandon, and events.
- Inputs are validated through DTOs, and invalid payloads are rejected.
- Invalid status transitions return consistent functional errors.
- A finalized or abandoned application cannot be edited.
- Finalization requires the minimum mandatory business data.

### Security Considerations

- Enforce strict payload validation with property whitelisting.
- Return sanitized errors without exposing internal implementation details.
- Support `x-request-id` to preserve end-to-end traceability.

## 2) Persistence and State Transitions

**As** the backend team  
**I want** a decoupled persistence layer with explicit state rules  
**So that** the solution remains maintainable and can evolve to production-grade storage.

### Acceptance Criteria

- Application and event repositories are separated by responsibility.
- A working in-memory implementation is provided, with interfaces ready for MongoDB adapters.
- Minimum supported statuses: `IN_PROGRESS`, `PENDING_VALIDATION`, `FINALIZED`, `ABANDONED`.
- Every relevant state transition generates a domain event.

### Security Considerations

- Entities in terminal states cannot be mutated.
- Critical state changes remain auditable through event logs.

## 3) Microsite-Core Mock Integration

**As** the origination backend  
**I want** to call an external mock simulation and distinguish successful, not-viable, and technical-error outcomes  
**So that** the frontend receives clear responses and the platform keeps robust traceability.

### Acceptance Criteria

- The mock adapter returns the three required outcomes.
- The simulation result is persisted in the application aggregate.
- A simulation event is always recorded, including technical failures.
- The microsite can retrieve both the latest simulation result and the event history.

### Security Considerations

- Adapter internals are not exposed in consumer-facing errors.
- Correlation is preserved with `requestId` for support and auditing.
