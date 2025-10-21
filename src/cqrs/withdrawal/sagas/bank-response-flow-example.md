# Bank Response Flow with RECEIVED_BANK_RESPONSE Step

## 🎯 Overview

This document demonstrates the updated withdrawal flow that includes the `RECEIVED_BANK_RESPONSE` step, which is triggered by the Bradesco webhook controller.

## 🔄 Updated Withdrawal Flow

### Complete Step Sequence:
```
1. CREATED              → WithdrawalCreatedEvent
2. DEBITING             → WithdrawalDebitedEvent  
3. SENDING_TO_BANK      → WithdrawalSentToBankEvent
4. RECEIVED_BANK_RESPONSE → BankResponseReceivedEvent (from Bradesco webhook)
5. COMPLETED            → BankTransferCompletedEvent
   OR
5. FAILED               → WithdrawalFailedEvent
```

## 📋 Step History Examples

### 1. **Successful Withdrawal Flow**
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
      "step": "RECEIVED_BANK_RESPONSE",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:15.000Z"
    },
    {
      "step": "COMPLETED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:20.000Z"
    }
  ]
}
```

### 2. **Failed Withdrawal Flow**
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
      "step": "RECEIVED_BANK_RESPONSE",
      "stepRetrialCount": 0,
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

## 🏦 Bradesco Webhook Integration

### Webhook Request
```http
POST /bradesco
Content-Type: application/json

{
  "userId": "user_456",
  "accountId": "account_789",
  "withdrawalId": "withdrawal_123",
  "success": true,
  "error": ""
}
```

### Webhook Response (Success)
```http
HTTP/1.1 200 OK
```

### Webhook Response (Failure)
```http
POST /bradesco
Content-Type: application/json

{
  "userId": "user_456",
  "accountId": "account_789",
  "withdrawalId": "withdrawal_123",
  "success": false,
  "error": "Insufficient funds"
}
```

## 🔄 Saga Implementation

### Bank Response Received Saga
```typescript
@Saga()
bankResponseReceived = (events$: Observable<IEvent>): Observable<ICommand> => {
  return events$.pipe(
    ofType(BankResponseReceivedEvent),
    tap(async (event: BankResponseReceivedEvent) => {
      console.log('🔄 Withdrawal Saga: Bank response received for withdrawal ID:', event.withdrawalId, 'Status:', event.status);
      await this.stepHistoryService.addStepToHistory(
        event.userId,
        event.accountId,
        event.withdrawalId,
        PrivatePlanWithdrawalStep.RECEIVED_BANK_RESPONSE
      );
    }),
    map((event: BankResponseReceivedEvent) => {
      if (event.status === 'SUCCESS') {
        console.log('🔄 Withdrawal Saga: Bank response successful, completing withdrawal for ID:', event.withdrawalId);
        return new CompleteWithdrawalCommand(
          event.withdrawalId,
          event.bankTransactionId
        );
      } else {
        console.log('🔄 Withdrawal Saga: Bank response failed, rolling back withdrawal for ID:', event.withdrawalId);
        return new RollbackWithdrawalCommand(
          event.withdrawalId,
          `Bank response failed: ${event.responseCode} - ${event.responseMessage}`
        );
      }
    })
  );
};
```

## 🎯 Event Structure

### BankResponseReceivedEvent
```typescript
export class BankResponseReceivedEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly bankTransactionId: string,
    public readonly status: 'SUCCESS' | 'FAILURE',
    public readonly responseCode: string,
    public readonly responseMessage: string,
    public readonly receivedAt: Date
  ) {}
}
```

## 📊 Bradesco Controller Implementation

```typescript
@Post('')
async findOne(@Body() dto: BradescoWebHookDto): Promise<void> {
  // Emit bank response event to trigger saga
  this.eventBus.publish(
    new BankResponseReceivedEvent(
      dto.withdrawalId,
      dto.userId,
      dto.accountId,
      `bradesco_${Date.now()}`, // Generate bank transaction ID
      dto.success ? 'SUCCESS' : 'FAILURE',
      dto.success ? '200' : '400',
      dto.success ? 'Transfer completed successfully' : dto.error,
      new Date()
    )
  );

  // Also execute the existing command for backward compatibility
  await this.commandBus.execute(
    new ReceiveBankTransferCommand(
      dto.userId,
      dto.accountId,
      dto.withdrawalId,
      dto.success,
      dto.error === 'Invalid transfer' ? new CouldNotTransferError(dto.error) : undefined,
    ),
  );

  return;
}
```

## 🚀 Benefits of the New Step

1. **📊 Better Tracking** - Clear visibility when bank responds
2. **🔄 Improved Flow** - More granular step tracking
3. **🐛 Enhanced Debugging** - Know exactly when bank response was received
4. **📈 Better Monitoring** - Track bank response times and success rates
5. **🔍 Audit Trail** - Complete history of bank interactions

## 🧪 Testing the Flow

### 1. Create Withdrawal
```bash
curl -X POST http://localhost:3000/api/v1/users/user_456/accounts/account_789/withdrawals \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_456",
    "accountId": "account_789",
    "bankAccountId": "bank_101",
    "amount": 500.00
  }'
```

### 2. Simulate Bank Response (Success)
```bash
curl -X POST http://localhost:3000/bradesco \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_456",
    "accountId": "account_789",
    "withdrawalId": "withdrawal_123",
    "success": true,
    "error": ""
  }'
```

### 3. Simulate Bank Response (Failure)
```bash
curl -X POST http://localhost:3000/bradesco \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_456",
    "accountId": "account_789",
    "withdrawalId": "withdrawal_123",
    "success": false,
    "error": "Insufficient funds"
  }'
```

### 4. Check Withdrawal Status
```bash
curl -X GET http://localhost:3000/api/v1/users/user_456/accounts/account_789/withdrawals/withdrawal_123
```

## 📋 Step History Flow Summary

| Step | Trigger | Action | Next Step |
|------|---------|--------|-----------|
| CREATED | WithdrawalCreatedEvent | Create withdrawal | DEBITING |
| DEBITING | WithdrawalDebitedEvent | Debit account | SENDING_TO_BANK |
| SENDING_TO_BANK | WithdrawalSentToBankEvent | Send to bank | RECEIVED_BANK_RESPONSE |
| RECEIVED_BANK_RESPONSE | BankResponseReceivedEvent | Process bank response | COMPLETED or FAILED |
| COMPLETED | BankTransferCompletedEvent | Finalize withdrawal | - |
| FAILED | WithdrawalFailedEvent | Rollback withdrawal | - |

The `RECEIVED_BANK_RESPONSE` step provides crucial visibility into the bank interaction phase of the withdrawal process! 🚀
