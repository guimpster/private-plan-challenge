# Rollback Flow with ROLLING_BACK Step

## 🎯 Overview

This document demonstrates the rollback flow that occurs when Bradesco webhook receives an error, triggering the `ROLLING_BACK` step followed by `FAILED`.

## 🔄 Updated Withdrawal Flow with Rollback

### Complete Step Sequence (Success):
```
1. CREATED              → WithdrawalCreatedEvent
2. DEBITING             → WithdrawalDebitedEvent  
3. SENDING_TO_BANK      → WithdrawalSentToBankEvent
4. RECEIVED_BANK_RESPONSE → BankResponseReceivedEvent (SUCCESS)
5. COMPLETED            → BankTransferCompletedEvent
```

### Complete Step Sequence (Failure with Rollback):
```
1. CREATED              → WithdrawalCreatedEvent
2. DEBITING             → WithdrawalDebitedEvent  
3. SENDING_TO_BANK      → WithdrawalSentToBankEvent
4. RECEIVED_BANK_RESPONSE → BankResponseReceivedEvent (FAILURE)
5. ROLLING_BACK         → WithdrawalRollingBackEvent
6. FAILED               → WithdrawalFailedEvent
```

## 📋 Step History Examples

### 1. **Failed Withdrawal with Rollback Flow**
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
      "step": "ROLLING_BACK",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:20.000Z"
    },
    {
      "step": "FAILED",
      "stepRetrialCount": 0,
      "at": "2023-10-18T14:30:25.000Z"
    }
  ]
}
```

## 🏦 Bradesco Webhook Error Handling

### Webhook Request (Error)
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

### Webhook Response
```http
HTTP/1.1 200 OK
```

## 🔄 Saga Implementation

### Bradesco Controller Error Handling
```typescript
@Post('')
async findOne(@Body() dto: BradescoWebHookDto): Promise<void> {
  if (dto.success) {
    // Emit bank response event for successful transfer
    this.eventBus.publish(
      new BankResponseReceivedEvent(
        dto.withdrawalId,
        dto.userId,
        dto.accountId,
        `bradesco_${Date.now()}`,
        'SUCCESS',
        '200',
        'Transfer completed successfully',
        new Date()
      )
    );
  } else {
    // Emit rolling back event for failed transfer
    this.eventBus.publish(
      new WithdrawalRollingBackEvent(
        dto.withdrawalId,
        dto.userId,
        dto.accountId,
        dto.error,
        new Date()
      )
    );
  }
  // ... rest of implementation
}
```

### Rolling Back Saga
```typescript
@Saga()
withdrawalRollingBack = (events$: Observable<IEvent>): Observable<ICommand> => {
  return events$.pipe(
    ofType(WithdrawalRollingBackEvent),
    tap(async (event: WithdrawalRollingBackEvent) => {
      console.log('🔄 Withdrawal Saga: Starting rollback for withdrawal ID:', event.withdrawalId, 'Reason:', event.reason);
      await this.stepHistoryService.addStepToHistory(
        event.userId,
        event.accountId,
        event.withdrawalId,
        PrivatePlanWithdrawalStep.ROLLING_BACK
      );
    }),
    map((event: WithdrawalRollingBackEvent) => {
      console.log('🔄 Withdrawal Saga: Executing rollback command for withdrawal ID:', event.withdrawalId);
      return new RollbackWithdrawalCommand(
        event.withdrawalId,
        `Bank transfer failed: ${event.reason}`
      );
    })
  );
};
```

### Rollback Command Handler
```typescript
@CommandHandler(RollbackWithdrawalCommand)
export class RollbackWithdrawalHandler implements ICommandHandler<RollbackWithdrawalCommand> {
  async execute(command: RollbackWithdrawalCommand): Promise<void> {
    const { withdrawalId, reason } = command;

    try {
      console.log('🔄 Rollback Handler: Starting rollback for withdrawal ID:', withdrawalId);

      // Get the withdrawal to find user and account IDs
      const withdrawal = await this.findWithdrawalById(withdrawalId);
      
      // Rollback the account balance (credit back the amount)
      await this.rollbackAccountBalance(withdrawal);

      console.log('✅ Rollback Handler: Successfully rolled back withdrawal ID:', withdrawalId);

      // Emit withdrawal failed event to complete the saga
      this.eventBus.publish(
        new WithdrawalFailedEvent(
          withdrawalId,
          withdrawal.userId,
          withdrawal.accountId,
          reason,
          new Date()
        )
      );

    } catch (error) {
      console.error('❌ Rollback Handler: Failed to rollback withdrawal ID:', withdrawalId, 'Error:', error.message);
      
      // Even if rollback fails, we still need to mark the withdrawal as failed
      this.eventBus.publish(
        new WithdrawalFailedEvent(
          withdrawalId,
          'unknown',
          'unknown',
          `Rollback failed: ${error.message}`,
          new Date()
        )
      );
    }
  }
}
```

## 🎯 Event Structure

### WithdrawalRollingBackEvent
```typescript
export class WithdrawalRollingBackEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly reason: string,
    public readonly rollingBackAt: Date
  ) {}
}
```

## 📊 Step History Flow Summary

| Step | Trigger | Action | Next Step |
|------|---------|--------|-----------|
| CREATED | WithdrawalCreatedEvent | Create withdrawal | DEBITING |
| DEBITING | WithdrawalDebitedEvent | Debit account | SENDING_TO_BANK |
| SENDING_TO_BANK | WithdrawalSentToBankEvent | Send to bank | RECEIVED_BANK_RESPONSE |
| RECEIVED_BANK_RESPONSE | BankResponseReceivedEvent | Process bank response | COMPLETED or ROLLING_BACK |
| ROLLING_BACK | WithdrawalRollingBackEvent | Rollback account balance | FAILED |
| COMPLETED | BankTransferCompletedEvent | Finalize withdrawal | - |
| FAILED | WithdrawalFailedEvent | Mark as failed | - |

## 🧪 Testing the Rollback Flow

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

### 2. Simulate Bank Error Response
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

### 3. Check Withdrawal Status (Should show ROLLING_BACK and FAILED steps)
```bash
curl -X GET http://localhost:3000/api/v1/users/user_456/accounts/account_789/withdrawals/withdrawal_123
```

## 🚀 Benefits of the Rollback Flow

1. **💰 Account Balance Protection** - Ensures funds are returned to account
2. **📊 Complete Audit Trail** - Every step is tracked including rollback
3. **🔄 Automatic Recovery** - System automatically handles failed transfers
4. **🐛 Better Debugging** - Clear visibility into rollback process
5. **📈 Error Monitoring** - Track rollback frequency and reasons
6. **🔍 Compliance** - Maintains data integrity and financial accuracy

## 📋 Console Logs Example

```
🔄 Withdrawal Saga: Bank response received for withdrawal ID: withdrawal_123 Status: FAILURE
📝 Step History: Added RECEIVED_BANK_RESPONSE step for withdrawal withdrawal_123
🔄 Withdrawal Saga: Starting rollback for withdrawal ID: withdrawal_123 Reason: Insufficient funds
📝 Step History: Added ROLLING_BACK step for withdrawal withdrawal_123
🔄 Rollback Handler: Starting rollback for withdrawal ID: withdrawal_123
🔄 Rollback Handler: Crediting back amount: 500.00 to account
✅ Rollback Handler: Successfully rolled back withdrawal ID: withdrawal_123
🔄 Withdrawal Saga: Withdrawal failed for ID: withdrawal_123 Reason: Bank transfer failed: Insufficient funds
📝 Step History: Added FAILED step for withdrawal withdrawal_123
🔄 Withdrawal Saga: Withdrawal process completed with failure for ID: withdrawal_123
```

The rollback flow ensures that when bank transfers fail, the system automatically restores the account balance and provides complete visibility into the process! 🚀
