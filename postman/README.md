# Private Plan Challenge API - Postman Collection

This folder contains Postman collections and environment files for testing the Private Plan Challenge API.

## 📁 Files

- **`Private-Plan-Challenge-API.postman_collection.json`** - Complete Postman collection with all API endpoints
- **`Private-Plan-Challenge-Environment.postman_environment.json`** - Environment variables for the collection
- **`test-api.sh`** - Automated test script using cURL
- **`run-tests.sh`** - Newman (Postman CLI) test runner
- **`curl-examples.md`** - cURL command examples
- **`README.md`** - This documentation file

## 🚀 Quick Start

### 1. Import the Collection

1. Open Postman
2. Click **Import** button
3. Select **`Private-Plan-Challenge-API.postman_collection.json`**
4. Click **Import**

### 2. Import the Environment

1. In Postman, click the **Environments** tab
2. Click **Import**
3. Select **`Private-Plan-Challenge-Environment.postman_environment.json`**
4. Click **Import**
5. Select the **"Private Plan Challenge Environment"** from the environment dropdown

### 3. Start the Application

Make sure the Private Plan Challenge API is running:

```bash
# Start the application
pnpm run start

# The API will be available at http://localhost:3000
```

### 4. Alternative Testing Methods

#### Automated cURL Testing
```bash
# Run the automated test script
./test-api.sh
```

#### Newman CLI Testing
```bash
# Install Newman (Postman CLI)
npm install -g newman

# Run tests with Newman
./run-tests.sh
```

#### Manual cURL Testing
See `curl-examples.md` for detailed cURL command examples.

## 📚 Collection Overview

The collection is organized into the following folders:

### 🏦 Account Management
- **Get Account by ID** - Retrieve account details for a specific user and account

### 💰 Withdrawal Operations
- **Create Withdrawal** - Initiate a new withdrawal from an account
- **Get Withdrawal by ID** - Retrieve withdrawal details and status

### 🔗 Webhooks
- **Bradesco Bank Webhook** - Receive bank transfer notifications from Bradesco

### 📖 API Documentation
- **Get API Documentation** - Access Swagger UI documentation
- **Get OpenAPI JSON** - Get the OpenAPI specification in JSON format

## 🔧 Environment Variables

The collection uses the following environment variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:3000` | Base URL for the API |
| `user_id` | `19ca04c6-9c96-40f4-b7db-a55394b5a58d` | Real user ID (Alice Santos) from fake data |
| `account_id` | `e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472` | Real account ID from fake data |
| `bank_account_id` | `b61648ba-0323-4e9a-8046-413c88de1245` | Real bank account ID from fake data |
| `withdrawal_id` | `350408b1-822c-474b-9f26-24d17098ba07` | Real withdrawal ID from fake data |
| `api_port` | `3000` | API server port |
| `api_host` | `localhost` | API server host |

## 📝 Example Requests

### Get Account Information

```http
GET {{base_url}}/api/v1/users/{{user_id}}/accounts/{{account_id}}
```

**Response:**
```json
{
  "id": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
  "cashAvailableForWithdrawal": 4183.94,
  "cashBalance": 5449.54,
  "created_at": "2025-08-17T23:15:03Z",
  "updated_at": "2025-10-11T23:15:03Z"
}
```

### Create a Withdrawal

```http
POST {{base_url}}/api/v1/users/{{user_id}}/accounts/{{account_id}}/withdrawals
Content-Type: application/json

{
  "userId": "{{user_id}}",
  "accountId": "{{account_id}}",
  "bankAccountId": "{{bank_account_id}}",
  "amount": 500.00
}
```

**Response:**
```json
{
  "id": "350408b1-822c-474b-9f26-24d17098ba07",
  "userId": "19ca04c6-9c96-40f4-b7db-a55394b5a58d",
  "accountId": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
  "bankAccountId": "b61648ba-0323-4e9a-8046-413c88de1245",
  "amount": 500.00,
  "status": "CREATED",
  "created_at": "2025-10-03T23:15:03Z"
}
```

### Get Withdrawal Status

```http
GET {{base_url}}/api/v1/users/{{user_id}}/accounts/{{account_id}}/withdrawals/{{withdrawal_id}}
```

**Response:**
```json
{
  "id": "350408b1-822c-474b-9f26-24d17098ba07",
  "userId": "19ca04c6-9c96-40f4-b7db-a55394b5a58d",
  "accountId": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
  "bankAccountId": "b61648ba-0323-4e9a-8046-413c88de1245",
  "amount": 492.48,
  "status": "COMPLETED",
  "created_at": "2025-10-03T23:15:03Z"
}
```

## 🧪 Testing Scenarios

### 1. Happy Path Testing
- Use the provided sample IDs to test successful operations
- Verify response structures match the expected format
- Check that status codes are correct

### 2. Error Handling Testing
- Test with invalid IDs to verify 404 responses
- Test with invalid data to verify validation errors
- Test with insufficient funds scenarios

### 3. Edge Cases
- Test with minimum and maximum amounts
- Test with special characters in IDs
- Test with missing required fields

## 📊 Response Examples

The collection includes example responses for:

- ✅ **Success Responses** (200, 201)
- ❌ **Error Responses** (400, 404, 422)
- 🔍 **Validation Errors**
- 📝 **Detailed Error Messages**

## 🔄 Withdrawal Status Flow

The withdrawal process follows these statuses:

1. **CREATED** - Withdrawal request created
2. **DEBITING** - Account is being debited
3. **SENDING_TO_BANK** - Transfer being sent to bank
4. **COMPLETED** - Transfer completed successfully
5. **FAILED** - Transfer failed
6. **ROLLING_BACK** - Rolling back failed transaction
7. **INSUFFICIENT_FUNDS** - Account has insufficient funds

## 🛠️ Customization

### Modifying Environment Variables

You can modify the environment variables in Postman to:

- Change the base URL for different environments (dev, staging, prod)
- Use different test data IDs
- Adjust port numbers

### Adding New Requests

To add new requests to the collection:

1. Right-click on the appropriate folder
2. Select **Add Request**
3. Configure the request details
4. Use environment variables for dynamic values

## 📖 Additional Resources

- **API Documentation**: `http://localhost:3000/api/docs`
- **OpenAPI Specification**: `http://localhost:3000/api/docs-json`
- **Project README**: `../README.md`
- **Architecture Documentation**: `../ARCHITECTURE.md`

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure the API server is running (`pnpm run start`)
   - Check that the port (3000) is not in use by another application

2. **404 Errors**
   - Verify the base URL is correct
   - Check that the API endpoints are properly configured

3. **Validation Errors**
   - Ensure request body matches the expected schema
   - Check that required fields are provided
   - Verify data types are correct

### Getting Help

If you encounter issues:

1. Check the API server logs for error details
2. Verify the OpenAPI documentation at `/api/docs`
3. Review the project README for setup instructions
4. Check the architecture documentation for API design details

---

**Happy Testing! 🚀**
