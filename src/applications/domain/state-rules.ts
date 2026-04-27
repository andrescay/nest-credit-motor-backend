import { HttpStatus } from '@nestjs/common';
import { ApplicationStatus } from './application-status.enum';
import { DomainException } from 'src/common/errors/domain.exception';
import { ErrorCode } from 'src/common/errors/error-codes';
import { Application } from './application.entity';

const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.IN_PROGRESS]: [
    ApplicationStatus.PENDING_VALIDATION,
    ApplicationStatus.ABANDONED,
    ApplicationStatus.FINALIZED,
  ],
  [ApplicationStatus.PENDING_VALIDATION]: [
    ApplicationStatus.ABANDONED,
    ApplicationStatus.FINALIZED,
  ],
  [ApplicationStatus.FINALIZED]: [],
  [ApplicationStatus.ABANDONED]: [],
};

export function assertCanEdit(status: ApplicationStatus): void {
  if (
    status === ApplicationStatus.FINALIZED ||
    status === ApplicationStatus.ABANDONED
  ) {
    throw new DomainException(
      HttpStatus.CONFLICT,
      ErrorCode.INVALID_STATE_TRANSITION,
      `Cannot edit application in status ${status}`,
    );
  }
}

export function assertTransition(
  from: ApplicationStatus,
  to: ApplicationStatus,
): void {
  if (!allowedTransitions[from].includes(to)) {
    throw new DomainException(
      HttpStatus.CONFLICT,
      ErrorCode.INVALID_STATE_TRANSITION,
      `Transition from ${from} to ${to} is not allowed`,
    );
  }
}

export function assertCanFinalize(application: Application): void {
  if (
    !application.customerDocument ||
    !application.customerName ||
    !application.product ||
    !application.requestedAmount ||
    !application.requestedTermMonths
  ) {
    throw new DomainException(
      HttpStatus.BAD_REQUEST,
      ErrorCode.FINALIZE_PRECONDITION_FAILED,
      'Application does not meet minimum data requirements to finalize',
    );
  }
}
