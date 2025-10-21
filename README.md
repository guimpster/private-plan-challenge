# Private Plan Challenge - Clean Architecture Financial API

A comprehensive financial operations API built with **NestJS** and **Clean Architecture** principles, implementing CQRS pattern and RESTful API best practices.

## 🏗️ Architecture Overview

This project demonstrates a production-ready implementation of Clean Architecture with the following key features:

- **Clean Architecture**: Proper layer separation with dependency inversion
- **CQRS Pattern**: Command Query Responsibility Segregation for scalable operations
- **Domain-Driven Design**: Rich domain models with business logic encapsulation
- **RESTful APIs**: Best practices for API design and documentation
- **Event-Driven Architecture**: Domain events for loose coupling
- **Type Safety**: Full TypeScript implementation with validation

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stay-challenge

# Install dependencies
pnpm install --frozen-lockfile
```

### Development

```bash
# Start in development mode with hot reload
pnpm run start

# Start in watch mode
pnpm run start:dev

# Build the project
pnpm run build

# Start in production mode
pnpm run start:prod
```

### Testing

```bash
# Run unit tests
pnpm run test

# Run e2e tests
pnpm run test:e2e

# Run tests with coverage
pnpm run test:cov
```

## 📚 API Documentation

The API documentation is defined in a centralized `openapi.yml` file using OpenAPI 3.0 specification. This approach provides:

- **Centralized Documentation**: All API specs in one YAML file
- **Clean Controllers**: No decorators cluttering the controller code
- **Version Control**: Easy to track documentation changes
- **Tool Compatibility**: Works with various OpenAPI tools

Once the application is running, you can access:

- **API Base URL**: `http://localhost:3000/api/v1`
- **Swagger Documentation**: `http://localhost:3000/api/docs`
- **OpenAPI JSON**: `http://localhost:3000/api/docs-json`
- **Health Check**: `http://localhost:3000/health`

### 🧪 Testing the API

We provide comprehensive testing resources in the `postman/` folder:

- **Postman Collection**: `postman/Private-Plan-Challenge-API.postman_collection.json`
- **Environment Variables**: `postman/Private-Plan-Challenge-Environment.postman_environment.json`
- **Test Script**: `postman/test-api.sh` (automated testing)
- **cURL Examples**: `postman/curl-examples.md` (command-line testing)
- **Setup Guide**: `postman/README.md` (detailed instructions)

**Quick Start with Postman:**
1. Import the collection and environment files
2. Select the "Private Plan Challenge Environment"
3. Start testing the API endpoints

## 🔧 API Endpoints

### Account Management

```http
GET /api/v1/users/{userId}/accounts/{accountId}
```

**Description**: Retrieve account details including balance and metadata.

**Response Example**:
```json
{
  "id": "acc_123456789",
  "cashAvailableForWithdrawal": 1000.50,
  "cashBalance": 1500.75,
  "created_at": "2023-10-18T14:30:00.000Z",
  "updated_at": "2023-10-18T15:45:00.000Z"
}
```

### Withdrawal Operations

#### Create Withdrawal
```http
POST /api/v1/users/{userId}/accounts/{accountId}/withdrawals
```

**Request Body**:
```json
{
  "userId": "user_123456789",
  "accountId": "acc_123456789",
  "bankAccountId": "bank_987654321",
  "amount": 500.00
}
```

**Response**:
```json
{
  "id": "withdrawal_123456789",
  "userId": "user_123456789",
  "accountId": "acc_123456789",
  "bankAccountId": "bank_987654321",
  "amount": 500.00,
  "status": "CREATED",
  "created_at": "2023-10-18T14:30:00.000Z"
}
```

#### Get Withdrawal Status
```http
GET /api/v1/users/{userId}/accounts/{accountId}/withdrawals/{withdrawalId}
```

### Webhook Endpoints

#### Bradesco Bank Webhook
```http
POST /api/v1/webhooks/bradesco
```

**Description**: Receives bank transfer notifications from Bradesco.

## 🏛️ Architecture Layers

### Domain Layer (`src/business/domain/`)
- **Entities**: Core business objects (`User`, `PrivatePlanAccount`)
- **Value Objects**: Immutable objects (`Money`, `AccountId`, `UserId`)
- **Domain Services**: Business logic (`AccountDomainService`)
- **Domain Events**: Business events (`AccountDebitedEvent`, `InsufficientFundsEvent`)

### Application Layer (`src/application/`)
- **Application Services**: Orchestrate domain objects
- **Commands/Queries**: Structured data transfer objects
- **Use Cases**: Application-specific business rules

### Infrastructure Layer (`src/infrastructure/`)
- **Repositories**: Data access implementations
- **Event Handlers**: Handle domain events
- **External Services**: Bank integrations, notifications

### Interface Adapters (`src/ports/`)
- **Controllers**: HTTP request/response handling
- **DTOs**: API boundary objects
- **Webhooks**: External service integrations

### CQRS Layer (`src/cqrs/`)
- **Commands**: Write operations
- **Queries**: Read operations
- **Command/Query Handlers**: Process operations
- **Sagas**: Orchestrate complex business processes

## 🔄 Data Flow

```
HTTP Request → Controller → QueryBus/CommandBus → Handler → ApplicationService → DomainService → Repository → Database
```

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Architecture**: Clean Architecture + CQRS
- **Database**: In-Memory (with support for SQLite, MongoDB, MySQL)
- **Validation**: class-validator + class-transformer
- **Documentation**: OpenAPI 3.0 (YAML-based)
- **Logging**: Pino (NestJS)
- **Package Manager**: pnpm

## 📁 Project Structure

```
├── openapi.yml              # OpenAPI 3.0 specification (YAML)
├── postman/                 # API testing resources
│   ├── Private-Plan-Challenge-API.postman_collection.json
│   ├── Private-Plan-Challenge-Environment.postman_environment.json
│   ├── test-api.sh
│   ├── curl-examples.md
│   └── README.md
src/
├── business/                 # Domain Layer
│   ├── common/              # Common base classes and utilities
│   ├── domain/              # Core business entities and logic
│   ├── repository/          # Repository interfaces (ports)
│   ├── service/             # Domain services
│   └── errors/              # Domain-specific errors
├── application/             # Application Layer
│   └── services/            # Application services
├── infrastructure/          # Infrastructure Layer
│   ├── event-handlers/      # Domain event handlers
│   └── services/            # External service implementations
├── cqrs/                    # CQRS Layer
│   ├── account/             # Account-related commands/queries (AccountCqrsModule)
│   └── withdrawal/          # Withdrawal-related commands/queries (WithdrawalCqrsModule)
├── ports/                   # Interface Adapters Layer (PortsModule)
│   ├── api/                 # REST API controllers
│   ├── webhooks/            # Webhook handlers
│   ├── proxy/               # External service proxies
│   └── mail/                # Email adapters
├── infrastructure/          # Infrastructure implementations
│   ├── db/                  # Database implementations
│   │   ├── in-memory/       # In-memory database
│   │   └── sqlite/          # SQLite database
│   ├── event-handlers/      # Domain event handlers
│   └── services/            # Infrastructure services
├── repository/              # Repository implementations
│   ├── in-memory/           # In-memory repository implementations
│   ├── mongodb/             # MongoDB repository implementations
│   └── sqlite/              # SQLite repository implementations
└── config/                  # Configuration management
```

## 🎯 Key Features

### Clean Architecture Benefits
- **Independence**: Business rules are independent of frameworks and databases
- **Testability**: Business logic can be tested without external dependencies
- **Flexibility**: Easy to change external concerns without affecting business logic
- **Maintainability**: Clear separation of concerns makes code easier to understand

### CQRS Benefits
- **Scalability**: Separate read and write models can be scaled independently
- **Performance**: Optimized queries for read operations
- **Complexity Management**: Clear separation between commands and queries
- **Event Sourcing Ready**: Foundation for event sourcing implementation

### REST API Benefits
- **Standards Compliance**: Follows REST principles and HTTP standards
- **Documentation**: Complete OpenAPI 3.0 documentation (YAML-based)
- **Validation**: Comprehensive input validation and error handling
- **Type Safety**: Full TypeScript support with proper typing
- **Error Handling**: Global exception filter for consistent error responses

## 🧪 Testing Strategy

- **Unit Tests**: Test domain logic in isolation
- **Integration Tests**: Test application services with real repositories
- **E2E Tests**: Test complete user workflows through the API
- **Contract Tests**: Ensure API contracts are maintained

## 🚀 Deployment

### Environment Variables

Create a `.env` file or use the provided `local.config-vars.json`:

```json
{
  "NODE_ENV": "local",
  "API_PORT": 3000,
  "API_HOST": "localhost"
}
```

### Production Deployment

```bash
# Build the application
pnpm run build

# Start in production mode
pnpm run start:prod
```

## 📖 Documentation

- **[Architecture Documentation](./ARCHITECTURE.md)**: Detailed clean architecture implementation
- **[API Documentation](http://localhost:3000/api/docs)**: Interactive Swagger documentation
- **[NestJS Documentation](https://docs.nestjs.com)**: Framework documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Robert C. Martin
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) - Eric Evans

---

**Built with ❤️ using Clean Architecture principles and modern TypeScript practices.**