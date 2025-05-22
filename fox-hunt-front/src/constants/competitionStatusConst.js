export const STATUS_RUNNING = 'RUNNING';

export const STATUS_FINISHED = 'FINISHED';

export const STATUS_SCHEDULED = 'SCHEDULED';

export const STATUS_CANCELED = 'CANCELED';

export const allStatuses = [
  STATUS_SCHEDULED,
  STATUS_RUNNING,
  STATUS_FINISHED,
  STATUS_CANCELED,
];

export const allStatusesExceptCanceled = [
  STATUS_SCHEDULED,
  STATUS_RUNNING,
  STATUS_FINISHED,
];
