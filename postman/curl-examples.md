# Private Plan Challenge API - cURL Examples

This file contains cURL command examples for testing the Private Plan Challenge API endpoints.

## 🚀 Prerequisites

Make sure the API server is running:

```bash
pnpm run start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Get Swagger UI Documentation
```bash
curl -X GET "http://localhost:3000/api/docs"
```

### Get OpenAPI JSON Specification
```bash
curl -X GET "http://localhost:3000/api/docs-json" | jq .
```

## 🏦 Account Management

### Get Account by ID
```bash
curl -X GET "http://localhost:3000/api/v1/users/19ca04c6-9c96-40f4-b7db-a55394b5a58d/accounts/e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472" \
  -H "Content-Type: application/json"
```

**Expected Response (200 - Account found):**
```json
{
  "id": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
  "cashAvailableForWithdrawal": 4183.94,
  "cashBalance": 5449.54,
  "created_at": "2025-08-17T23:15:03Z",
  "updated_at": "2025-10-11T23:15:03Z"
}
```

## 💰 Withdrawal Operations

### Create Withdrawal
```bash
curl -X POST "http://localhost:3000/api/v1/users/19ca04c6-9c96-40f4-b7db-a55394b5a58d/accounts/e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472/withdrawals" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "19ca04c6-9c96-40f4-b7db-a55394b5a58d",
    "accountId": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
    "bankAccountId": "b61648ba-0323-4e9a-8046-413c88de1245",
    "amount": 500.00
  }'
```

**Expected Response (201 - Withdrawal created):**
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

### Create Withdrawal with Invalid Amount (Validation Error)
```bash
curl -X POST "http://localhost:3000/api/v1/users/19ca04c6-9c96-40f4-b7db-a55394b5a58d/accounts/e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472/withdrawals" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "19ca04c6-9c96-40f4-b7db-a55394b5a58d",
    "accountId": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
    "bankAccountId": "b61648ba-0323-4e9a-8046-413c88de1245",
    "amount": 0.001
  }'
```

**Expected Response (400 - Validation Error):**
```json
{
  "statusCode": 400,
  "message": [
    "amount must not be less than 0.01"
  ],
  "error": "Bad Request",
  "timestamp": "2025-10-18T14:30:00.000Z",
  "path": "/api/v1/users/19ca04c6-9c96-40f4-b7db-a55394b5a58d/accounts/e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472/withdrawals"
}
```

### Get Withdrawal by ID
```bash
curl -X GET "http://localhost:3000/api/v1/users/19ca04c6-9c96-40f4-b7db-a55394b5a58d/accounts/e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472/withdrawals/350408b1-822c-474b-9f26-24d17098ba07" \
  -H "Content-Type: application/json"
```

**Expected Response (200 - Withdrawal found):**
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

## 🔗 Webhooks

### Bradesco Bank Webhook
```bash
curl -X POST "http://localhost:3000/bradesco" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "19ca04c6-9c96-40f4-b7db-a55394b5a58d",
    "accountId": "e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472",
    "withdrawalId": "350408b1-822c-474b-9f26-24d17098ba07",
    "success": true,
    "error": ""
  }'
```

**Expected Response (200 - Success):**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

### Bradesco Webhook with Invalid Data
```bash
curl -X POST "http://localhost:3000/bradesco" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "invalid_user",
    "accountId": "invalid_account",
    "withdrawalId": "invalid_withdrawal",
    "success": false,
    "error": "Invalid transfer"
  }'
```

**Expected Response (400 - Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Invalid webhook data",
  "error": "Bad Request",
  "timestamp": "2023-10-18T14:30:00.000Z",
  "path": "/bradesco"
}
```

## 🧪 Testing with Different Data

### Test with Different User ID
```bash
curl -X GET "http://localhost:3000/api/v1/users/different_user/accounts/different_account" \
  -H "Content-Type: application/json"
```

### Test with Different Withdrawal Amount
```bash
curl -X POST "http://localhost:3000/api/v1/users/user_123456789/accounts/acc_123456789/withdrawals" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123456789",
    "accountId": "acc_123456789",
    "bankAccountId": "bank_987654321",
    "amount": 1000.50
  }'
```

### Test with Different Bank Account
```bash
curl -X POST "http://localhost:3000/api/v1/users/user_123456789/accounts/acc_123456789/withdrawals" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123456789",
    "accountId": "acc_123456789",
    "bankAccountId": "bank_111111111",
    "amount": 250.75
  }'
```

## 🔍 Response Analysis

### Pretty Print JSON Responses
If you have `jq` installed, you can pretty print the JSON responses:

```bash
curl -X GET "http://localhost:3000/api/docs-json" | jq .
```

### Save Responses to Files
```bash
# Save API documentation
curl -X GET "http://localhost:3000/api/docs-json" -o api-spec.json

# Save account response
curl -X GET "http://localhost:3000/api/v1/users/user_123456789/accounts/acc_123456789" -o account-response.json
```

### Verbose Output
Add `-v` flag for verbose output to see headers and connection details:

```bash
curl -v -X GET "http://localhost:3000/api/v1/users/user_123456789/accounts/acc_123456789"
```

## 🐛 Troubleshooting

### Check if Server is Running
```bash
curl -I "http://localhost:3000/api/docs"
```

### Test with Different Port
If the API is running on a different port:

```bash
curl -X GET "http://localhost:3001/api/v1/users/user_123456789/accounts/acc_123456789"
```

### Check Server Logs
Monitor the server logs while running cURL commands to see detailed error information.

## 📊 Expected Status Codes

| Endpoint | Method | Expected Status | Description |
|----------|--------|----------------|-------------|
| `/api/docs` | GET | 200 | Swagger UI |
| `/api/docs-json` | GET | 200 | OpenAPI JSON |
| `/api/v1/users/{userId}/accounts/{accountId}` | GET | 200 | Account found (using real data) |
| `/api/v1/users/{userId}/accounts/{accountId}/withdrawals` | POST | 201 | Withdrawal created successfully |
| `/api/v1/users/{userId}/accounts/{accountId}/withdrawals/{withdrawalId}` | GET | 200 | Withdrawal found (using real data) |
| `/bradesco` | POST | 200 | Webhook processed |

## 🎯 Next Steps

1. **Import Postman Collection**: Use the provided Postman collection for more comprehensive testing
2. **Add Test Data**: Create test data in the database to test successful scenarios
3. **Automated Testing**: Use the provided test script (`test-api.sh`) for automated testing
4. **Integration Testing**: Test the complete withdrawal flow end-to-end

---

**Happy Testing! 🚀**
