import { Injectable, Inject } from '@nestjs/common';
import { PrivatePlanWithdrawal, PrivatePlanWithdrawalStep } from '../entities/private-plan-withdrawal';
import { PrivatePlanWithdrawalRepository } from '../../repository/private-plan-withdrawal.repository';

@Injectable()
export class WithdrawalStepHistoryService {
  constructor(
    @Inject('PrivatePlanWithdrawalRepository')
    private readonly withdrawalRepository: PrivatePlanWithdrawalRepository
  ) {}

  /**
   * Adds a new step to the withdrawal's step history
   */
  async addStepToHistory(
    userId: string,
    accountId: string,
    withdrawalId: string,
    step: PrivatePlanWithdrawalStep,
    stepRetrialCount: number = 0
  ): Promise<void> {
    const withdrawal = await this.withdrawalRepository.getById(userId, accountId, withdrawalId);
    
    if (!withdrawal) {
      throw new Error(`Withdrawal ${withdrawalId} not found`);
    }

    const newStepEntry = {
      step,
      stepRetrialCount,
      at: new Date()
    };

    const updatedStepHistory = [
      ...withdrawal.stepHistory,
      newStepEntry
    ];

    await this.withdrawalRepository.updateById(userId, accountId, withdrawalId, {
      step,
      stepRetrialCount,
      stepHistory: updatedStepHistory
    });

    console.log(`📝 Step History: Added ${step} step for withdrawal ${withdrawalId}`);
  }

  /**
   * Gets the current step from the step history
   */
  getCurrentStep(stepHistory: { step: PrivatePlanWithdrawalStep; stepRetrialCount: number; at: Date }[]): PrivatePlanWithdrawalStep {
    if (stepHistory.length === 0) {
      return PrivatePlanWithdrawalStep.CREATED;
    }
    return stepHistory[stepHistory.length - 1].step;
  }

  /**
   * Gets the step history for a withdrawal
   */
  async getStepHistory(
    userId: string,
    accountId: string,
    withdrawalId: string
  ): Promise<{ step: PrivatePlanWithdrawalStep; stepRetrialCount: number; at: Date }[]> {
    const withdrawal = await this.withdrawalRepository.getById(userId, accountId, withdrawalId);
    
    if (!withdrawal) {
      throw new Error(`Withdrawal ${withdrawalId} not found`);
    }

    return withdrawal.stepHistory;
  }
}
