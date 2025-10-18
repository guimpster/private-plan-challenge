#!/bin/bash

# Private Plan Challenge API - Newman Test Runner
# This script runs the Postman collection using Newman (Postman CLI)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Private Plan Challenge API - Newman Test Runner${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo -e "${RED}❌ Newman is not installed. Please install it first:${NC}"
    echo -e "${YELLOW}npm install -g newman${NC}"
    echo -e "${YELLOW}or${NC}"
    echo -e "${YELLOW}pnpm add -g newman${NC}"
    exit 1
fi

# Check if collection file exists
if [ ! -f "Private-Plan-Challenge-API.postman_collection.json" ]; then
    echo -e "${RED}❌ Collection file not found: Private-Plan-Challenge-API.postman_collection.json${NC}"
    exit 1
fi

# Check if environment file exists
if [ ! -f "Private-Plan-Challenge-Environment.postman_environment.json" ]; then
    echo -e "${RED}❌ Environment file not found: Private-Plan-Challenge-Environment.postman_environment.json${NC}"
    exit 1
fi

# Check if API server is running
echo -e "${YELLOW}Checking if API server is running...${NC}"
if curl -s "http://localhost:3000/api/docs" > /dev/null; then
    echo -e "${GREEN}✅ API server is running${NC}"
else
    echo -e "${RED}❌ API server is not running. Please start it with: pnpm run start${NC}"
    exit 1
fi
echo ""

# Run Newman tests
echo -e "${YELLOW}Running Postman collection tests...${NC}"
echo ""

newman run Private-Plan-Challenge-API.postman_collection.json \
    -e Private-Plan-Challenge-Environment.postman_environment.json \
    --reporters cli,json \
    --reporter-json-export test-results.json \
    --verbose

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed!${NC}"
else
    echo ""
    echo -e "${RED}❌ Some tests failed. Check the output above for details.${NC}"
fi

echo ""
echo -e "${BLUE}Test results saved to: test-results.json${NC}"
echo -e "${BLUE}For more detailed testing, use the Postman GUI.${NC}"
