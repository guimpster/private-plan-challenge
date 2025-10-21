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

**Description**: Retrieve account details including balance, deposits, and withdrawals with their step history and notifications.

**Response Example**:
```json
{
  "id": "acc_123456789",
  "cashAvailableForWithdrawal": 1000.50,
  "cashBalance": 1500.75,
  "deposits": [
    {
      "id": "deposit_123",
      "amount": 500.00,
      "userCredited": true,
      "created_at": "2023-10-18T14:30:00.000Z",
      "updated_at": "2023-10-18T14:30:00.000Z"
    }
  ],
  "withdrawals": [
    {
      "id": "withdrawal_456",
      "amount": 200.00,
      "step": "COMPLETED",
      "stepHistory": [
        {
          "step": "CREATED",
          "stepRetrialCount": 0,
          "at": "2023-10-18T14:30:00.000Z"
        },
        {
          "step": "COMPLETED",
          "stepRetrialCount": 0,
          "at": "2023-10-18T14:35:00.000Z"
        }
      ],
      "notifications": [
        {
          "type": "email",
          "message": "Your withdrawal of $200.00 has been completed successfully",
          "sentAt": "2023-10-18T14:35:00.000Z"
        }
      ],
      "created_at": "2023-10-18T14:30:00.000Z",
      "updated_at": "2023-10-18T14:35:00.000Z"
    }
  ],
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
  "stepHistory": [
    {
      "step": "CREATED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:00.000Z"
    }
  ],
  "notifications": [],
  "created_at": "2023-10-18T14:30:00.000Z"
}
```

#### Get Withdrawal Status
```http
GET /api/v1/users/{userId}/accounts/{accountId}/withdrawals/{withdrawalId}
```

**Response**:
```json
{
  "id": "withdrawal_123456789",
  "userId": "user_123456789",
  "accountId": "acc_123456789",
  "bankAccountId": "bank_987654321",
  "amount": 500.00,
  "status": "COMPLETED",
  "stepHistory": [
    {
      "step": "CREATED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:00.000Z"
    },
    {
      "step": "DEBITING",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:05.000Z"
    },
    {
      "step": "SENDING_TO_BANK",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:10.000Z"
    },
    {
      "step": "RECEIVED_BANK_RESPONSE",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:15.000Z"
    },
    {
      "step": "COMPLETED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:20.000Z"
    }
  ],
  "notifications": [
    {
      "type": "email",
      "message": "Your withdrawal of $500.00 has been completed successfully",
      "sentAt": "2023-10-18T14:30:20.000Z"
    }
  ],
  "created_at": "2023-10-18T14:30:00.000Z"
}
```

### Job Management

#### Trigger Deposit Release Job
```http
POST /api/v1/jobs/deposit-release
```

**Description**: Manually trigger the deposit release job for a specific date.

**Request Body**:
```json
{
  "date": "2025-10-21"
}
```

**Response**:
```json
{
  "message": "Deposit release job completed successfully",
  "date": "2025-10-21"
}
```

#### Setup Test Data
```http
POST /api/v1/jobs/setup-test-data
```

**Description**: Setup test deposits for testing the daily job functionality.

**Response**:
```json
{
  "message": "Test data setup completed successfully",
  "depositsCount": 3
}
```

#### Get Test Deposits
```http
GET /api/v1/jobs/test-deposits
```

**Description**: Retrieve all test deposits with their current status.

**Response**:
```json
[
  {
    "id": "deposit_1",
    "userId": "19ca04c6-9c96-40f4-b7db-a55394b5a58d",
    "accountId": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
    "amount": 1000,
    "release_at": "2025-10-21T16:43:37.311Z",
    "userCredited": false,
    "destinationAccountId": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
    "comment": "Test deposit for today"
  }
]
```

### Webhook Endpoints

#### Bradesco Bank Webhook
```http
POST /bradesco
```

**Description**: Receives bank transfer notifications from Bradesco.

**Request Body**:
```json
{
  "userId": "{{user_id}}",
  "accountId": "{{account_id}}",
  "withdrawalId": "{{withdrawal_id}}",
  "success": true,
  "error": null
}
```

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
│   │   ├── entities/        # Domain entities (User, PrivatePlanAccount, PrivatePlanDeposit, etc.)
│   │   └── services/        # Domain services
│   ├── repository/          # Repository interfaces (ports)
│   └── errors/              # Domain-specific errors
├── cqrs/                    # CQRS Layer
│   ├── account/             # Account-related commands/queries (AccountCqrsModule)
│   └── withdrawal/          # Withdrawal-related commands/queries (WithdrawalCqrsModule)
├── jobs/                    # Scheduled Jobs Layer
│   ├── deposit-release.job.ts    # Daily deposit release job
│   ├── test-data-setup.ts        # Test data management
│   └── jobs.module.ts            # Jobs module configuration
├── ports/                   # Interface Adapters Layer (PortsModule)
│   ├── api/                 # REST API controllers
│   │   ├── account/         # Account management endpoints
│   │   ├── withdrawal/      # Withdrawal management endpoints
│   │   └── jobs/            # Job management endpoints
│   ├── webhooks/            # Webhook handlers
│   │   └── banks/           # Bank webhook integrations
│   ├── proxy/               # External service proxies
│   └── mail/                # Email adapters
├── infrastructure/          # Infrastructure implementations
│   └── db/                  # Database implementations
│       └── in-memory/       # In-memory database
├── repository/              # Repository implementations
│   └── in-memory/           # In-memory repository implementations
└── config/                  # Configuration management
```

## 🎯 Key Features

### Deposit Management
- **Scheduled Release**: Daily cron job automatically processes deposits on their release date
- **User & Account Tracking**: Deposits include `userId` and `accountId` for proper account management
- **Release Date Control**: Deposits have a `release_at` field to control when funds become available
- **Credit Tracking**: `userCredited` flag prevents double-crediting of deposits
- **Manual Testing**: Job endpoints allow manual triggering and test data setup

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