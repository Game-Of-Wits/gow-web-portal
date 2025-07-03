export enum ErrorCode {
  PermissionDenied = 'permission-denied',
  Unavailable = 'unavailable',
  NotFound = 'not-found',
  InvalidArgument = 'invalid-argument',
  DeadlineExceeded = 'deadline-exceeded',
  Aborted = 'aborted',
  Unauthenticated = 'unauthenticated',
  Cancelled = 'cancelled',
  Internal = 'internal',
  ResourceExhausted = 'resource-exhausted',
  AlreadyExists = 'already-exists',
  DataLoss = 'data-loss',
  Unknown = 'unknown',
  AuthInvalidEmail = 'auth/invalid-email',
  AuthUserDisabled = 'auth/user-disabled',
  AuthTooManyRequests = 'auth/too-many-requests',
  AuthPermissionDenied = 'auth/permission-denied'
}
