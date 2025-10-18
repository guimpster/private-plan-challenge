# Clean Architecture Implementation

This project follows Clean Architecture principles as defined by Robert C. Martin (Uncle Bob). The architecture is organized into concentric layers with dependencies pointing inward.

## Architecture Layers

### 1. Domain Layer (`src/business/domain/`)
The innermost layer containing the core business logic and entities.

**Components:**
- **Entities**: Core business objects (`User`, `PrivatePlanAccount`, etc.)
- **Value Objects**: Immutable objects representing concepts (`Money`, `AccountId`, `UserId`)
- **Domain Services**: Business logic that doesn't belong to a single entity (`AccountDomainService`)
- **Domain Events**: Events that occur within the domain (`AccountDebitedEvent`, `InsufficientFundsEvent`)
- **Domain Event Dispatcher**: Infrastructure for handling domain events

**Key Principles:**
- No dependencies on external layers
- Contains pure business logic
- Framework-agnostic

### 2. Application Layer (`src/application/`)
Orchestrates the flow of data to and from the domain layer.

**Components:**
- **Application Services**: Coordinate domain objects to perform application tasks
- **DTOs/Commands/Queries**: Data transfer objects for the application layer

**Key Principles:**
- Depends only on the domain layer
- Contains application-specific business rules
- Orchestrates domain objects

### 3. Infrastructure Layer (`src/infrastructure/`)
Contains the implementation details of external concerns.

**Components:**
- **Repositories**: Concrete implementations of domain repository interfaces
- **Event Handlers**: Handle domain events for infrastructure concerns (logging, notifications)
- **External Services**: Database, messaging, file system implementations

**Key Principles:**
- Implements interfaces defined in inner layers
- Contains framework-specific code
- Handles external dependencies

### 4. Interface Adapters Layer (`src/ports/`)
Contains adapters that convert data between the use cases and external agencies.

**Components:**
- **Controllers**: Handle HTTP requests and responses
- **DTOs**: Data transfer objects for API boundaries
- **Presenters**: Format data for the UI
- **Gateways**: Interfaces for external services

### 5. CQRS Layer (`src/cqrs/`)
Implements Command Query Responsibility Segregation pattern.

**Components:**
- **Commands**: Represent write operations
- **Queries**: Represent read operations
- **Command/Query Handlers**: Process commands and queries
- **Events**: Represent domain events

## Dependency Rule

The fundamental rule of Clean Architecture is that **source code dependencies can only point inward**. 

- Domain layer has no dependencies
- Application layer depends only on Domain layer
- Infrastructure layer depends on Domain and Application layers
- Interface Adapters depend on Application and Domain layers
- CQRS layer depends on Application and Domain layers

## Key Benefits

1. **Independence**: The business rules are independent of frameworks, databases, and external agencies
2. **Testability**: Business logic can be tested without external dependencies
3. **Flexibility**: Easy to change external concerns without affecting business logic
4. **Maintainability**: Clear separation of concerns makes the code easier to understand and maintain

## Project Structure

```
src/
├── business/                 # Domain Layer
│   ├── domain/              # Core business entities and logic
│   │   ├── entities/        # Domain entities
│   │   ├── value-objects/   # Value objects
│   │   ├── events/          # Domain events
│   │   └── services/        # Domain services
│   ├── repository/          # Repository interfaces (ports)
│   └── errors/              # Domain-specific errors
├── application/             # Application Layer
│   └── services/            # Application services
├── infrastructure/          # Infrastructure Layer
│   ├── db/                  # Database implementations
│   │   ├── in-memory/       # In-memory database
│   │   └── sqlite/          # SQLite database
│   ├── event-handlers/      # Domain event handlers
│   ├── services/            # Infrastructure services
│   └── infrastructure.module.ts
├── cqrs/                    # CQRS Layer
│   ├── account/             # Account-related commands/queries
│   └── withdrawal/          # Withdrawal-related commands/queries
├── ports/                   # Interface Adapters Layer
│   ├── api/                 # REST API controllers
│   ├── webhooks/            # Webhook handlers
│   └── mail/                # Email adapters
├── repository/              # Infrastructure implementations
│   ├── in-memory/           # In-memory database implementations
│   ├── mongodb/             # MongoDB implementations
│   └── sqlite/              # SQLite implementations
└── config/                  # Configuration layer
```

## Usage Examples

### Domain Service Usage
```typescript
// Domain service handles business logic
const updatedAccount = await AccountDomainService.debitAccount(
  account, 
  amount, 
  withdrawalId
);
```

### Application Service Usage
```typescript
// Application service orchestrates domain objects
const account = await accountApplicationService.getAccount({
  userId: 'user123',
  accountId: 'account456'
});
```

### CQRS Usage
```typescript
// Controller uses QueryBus for read operations
const account = await this.queryBus.execute(
  new GetAccountByIdQuery(userId, accountId)
);
```

## Testing Strategy

- **Unit Tests**: Test domain logic in isolation
- **Integration Tests**: Test application services with real repositories
- **E2E Tests**: Test complete user workflows through the API

This architecture ensures that the business logic remains independent and testable while providing flexibility for changing external concerns.
