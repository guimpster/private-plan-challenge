# Step History Tracking Example

## 🎯 Overview

This document demonstrates how the withdrawal saga tracks each step in the withdrawal process and saves it to the `stepHistory` field.

## 📋 Step History Flow

### 1. **Withdrawal Created**
```json
{
  "id": "withdrawal_123",
  "userId": "user_456",
  "accountId": "account_789",
  "bankAccountId": "bank_101",
  "amount": 500.00,
  "status": "CREATED",
  "created_at": "2023-10-18T14:30:00.000Z",
  "stepHistory": [
    {
      "step": "CREATED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:00.000Z"
    }
  ]
}
```

### 2. **Account Debited**
```json
{
  "id": "withdrawal_123",
  "userId": "user_456",
  "accountId": "account_789",
  "bankAccountId": "bank_101",
  "amount": 500.00,
  "status": "DEBITING",
  "created_at": "2023-10-18T14:30:00.000Z",
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
    }
  ]
}
```

### 3. **Sent to Bank**
```json
{
  "id": "withdrawal_123",
  "userId": "user_456",
  "accountId": "account_789",
  "bankAccountId": "bank_101",
  "amount": 500.00,
  "status": "SENDING_TO_BANK",
  "created_at": "2023-10-18T14:30:00.000Z",
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
    }
  ]
}
```

### 4. **Completed Successfully**
```json
{
  "id": "withdrawal_123",
  "userId": "user_456",
  "accountId": "account_789",
  "bankAccountId": "bank_101",
  "amount": 500.00,
  "status": "COMPLETED",
  "created_at": "2023-10-18T14:30:00.000Z",
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
      "step": "COMPLETED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:15.000Z"
    }
  ]
}
```

### 5. **Failed with Retry**
```json
{
  "id": "withdrawal_123",
  "userId": "user_456",
  "accountId": "account_789",
  "bankAccountId": "bank_101",
  "amount": 500.00,
  "status": "FAILED",
  "created_at": "2023-10-18T14:30:00.000Z",
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
      "step": "SENDING_TO_BANK",
      "stepRetrialCount": 1,
      "at": "2023-10-18T14:30:15.000Z"
    },
    {
      "step": "FAILED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:20.000Z"
    }
  ]
}
```

## 🔄 Saga Implementation

### Step History Service
```typescript
// Adds a new step to the withdrawal's step history
await this.stepHistoryService.addStepToHistory(
  event.userId,
  event.accountId,
  event.withdrawalId,
  PrivatePlanWithdrawalStep.CREATED
);
```

### Saga Methods
Each saga method now includes step history tracking:

```typescript
@Saga()
withdrawalCreated = (events$: Observable<IEvent>): Observable<ICommand> => {
  return events$.pipe(
    ofType(WithdrawalCreatedEvent),
    tap(async (event: WithdrawalCreatedEvent) => {
      await this.stepHistoryService.addStepToHistory(
        event.userId,
        event.accountId,
        event.withdrawalId,
        PrivatePlanWithdrawalStep.CREATED
      );
    }),
    map((event: WithdrawalCreatedEvent) => {
      return new DebitAccountCommand(
        event.userId,
        event.accountId,
        event.withdrawalId
      );
    })
  );
};
```

## 📊 API Response

### GET /api/v1/users/{userId}/accounts/{accountId}/withdrawals/{withdrawalId}

```json
{
  "id": "withdrawal_123",
  "userId": "user_456",
  "accountId": "account_789",
  "bankAccountId": "bank_101",
  "amount": 500.00,
  "status": "COMPLETED",
  "created_at": "2023-10-18T14:30:00.000Z",
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
      "step": "COMPLETED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:15.000Z"
    }
  ]
}
```

## 🎯 Benefits

1. **Complete Audit Trail** - Every step is tracked with timestamps
2. **Retry Tracking** - `stepRetrialCount` shows how many times a step was retried
3. **Debugging** - Easy to see where the process failed or succeeded
4. **Monitoring** - Can track performance and identify bottlenecks
5. **Compliance** - Provides detailed history for regulatory requirements

## 🚀 Usage

The step history is automatically populated by the saga and returned in both:
- **Create Withdrawal** response
- **Get Withdrawal by ID** response

No additional API calls are needed - the step history is always included in withdrawal responses.
