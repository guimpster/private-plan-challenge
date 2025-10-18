#!/bin/bash

# Private Plan Challenge API Test Script
# This script tests the main API endpoints to verify they are working correctly

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
USER_ID="19ca04c6-9c96-40f4-b7db-a55394b5a58d"
ACCOUNT_ID="e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472"
BANK_ACCOUNT_ID="b61648ba-0323-4e9a-8046-413c88de1245"
WITHDRAWAL_ID="350408b1-822c-474b-9f26-24d17098ba07"

echo -e "${BLUE}🚀 Private Plan Challenge API Test Script${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local description=$3
    local expected_status=$4
    local data=$5
    
    echo -e "${YELLOW}Testing: ${description}${NC}"
    echo -e "${BLUE}${method} ${url}${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
    fi
    
    # Split response and status code
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ SUCCESS (${http_code})${NC}"
    else
        echo -e "${RED}❌ FAILED (Expected: ${expected_status}, Got: ${http_code})${NC}"
    fi
    
    # Pretty print JSON response
    if command -v jq &> /dev/null; then
        echo "$body" | jq . 2>/dev/null || echo "$body"
    else
        echo "$body"
    fi
    echo ""
}

# Check if server is running
echo -e "${YELLOW}Checking if API server is running...${NC}"
if curl -s "$BASE_URL/api/docs" > /dev/null; then
    echo -e "${GREEN}✅ API server is running${NC}"
else
    echo -e "${RED}❌ API server is not running. Please start it with: pnpm run start${NC}"
    exit 1
fi
echo ""

# Test API Documentation endpoints
echo -e "${BLUE}📚 Testing API Documentation${NC}"
echo -e "${BLUE}============================${NC}"
test_endpoint "GET" "$BASE_URL/api/docs" "Swagger UI Documentation" "200"
test_endpoint "GET" "$BASE_URL/api/docs-json" "OpenAPI JSON Specification" "200"

# Test Account Management endpoints
echo -e "${BLUE}🏦 Testing Account Management${NC}"
echo -e "${BLUE}=============================${NC}"
test_endpoint "GET" "$BASE_URL/api/v1/users/$USER_ID/accounts/$ACCOUNT_ID" "Get Account by ID" "200"
test_endpoint "GET" "$BASE_URL/api/v1/users/invalid_user/accounts/invalid_account" "Get Account with Invalid IDs" "404"

# Test Withdrawal Operations
echo -e "${BLUE}💰 Testing Withdrawal Operations${NC}"
echo -e "${BLUE}===============================${NC}"

# Test Create Withdrawal
withdrawal_data='{
  "userId": "'$USER_ID'",
  "accountId": "'$ACCOUNT_ID'",
  "bankAccountId": "'$BANK_ACCOUNT_ID'",
  "amount": 500.00
}'

test_endpoint "POST" "$BASE_URL/api/v1/users/$USER_ID/accounts/$ACCOUNT_ID/withdrawals" "Create Withdrawal" "201" "$withdrawal_data"

# Test Create Withdrawal with Invalid Data
invalid_withdrawal_data='{
  "userId": "'$USER_ID'",
  "accountId": "'$ACCOUNT_ID'",
  "bankAccountId": "'$BANK_ACCOUNT_ID'",
  "amount": 0.001
}'

test_endpoint "POST" "$BASE_URL/api/v1/users/$USER_ID/accounts/$ACCOUNT_ID/withdrawals" "Create Withdrawal with Invalid Amount" "400" "$invalid_withdrawal_data"

# Test Get Withdrawal
test_endpoint "GET" "$BASE_URL/api/v1/users/$USER_ID/accounts/$ACCOUNT_ID/withdrawals/$WITHDRAWAL_ID" "Get Withdrawal by ID" "200"

# Test Webhooks
echo -e "${BLUE}🔗 Testing Webhooks${NC}"
echo -e "${BLUE}==================${NC}"

# Test Bradesco Webhook
webhook_data='{
  "userId": "'$USER_ID'",
  "accountId": "'$ACCOUNT_ID'",
  "withdrawalId": "'$WITHDRAWAL_ID'",
  "success": true,
  "error": ""
}'

test_endpoint "POST" "$BASE_URL/bradesco" "Bradesco Bank Webhook" "200" "$webhook_data"

# Test Invalid Webhook Data
invalid_webhook_data='{
  "userId": "invalid_user",
  "accountId": "invalid_account",
  "withdrawalId": "invalid_withdrawal",
  "success": false,
  "error": "Invalid transfer"
}'

test_endpoint "POST" "$BASE_URL/bradesco" "Bradesco Webhook with Invalid Data" "400" "$invalid_webhook_data"

echo -e "${BLUE}🎉 Test Script Completed${NC}"
echo -e "${BLUE}=======================${NC}"
echo ""
echo -e "${YELLOW}Note: Tests now use real data from the fake-users.json file.${NC}"
echo -e "${YELLOW}This provides realistic testing scenarios with actual user and account data.${NC}"
echo ""
echo -e "${GREEN}For more comprehensive testing, use the Postman collection:${NC}"
echo -e "${GREEN}  - Import: Private-Plan-Challenge-API.postman_collection.json${NC}"
echo -e "${GREEN}  - Environment: Private-Plan-Challenge-Environment.postman_environment.json${NC}"
