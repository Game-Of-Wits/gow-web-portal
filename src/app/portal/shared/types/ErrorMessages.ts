import { ErrorCode } from '@shared/types/ErrorCode'

export type ErrorMessages = Record<
  ErrorCode | string,
  { summary: string; message: string }
>
