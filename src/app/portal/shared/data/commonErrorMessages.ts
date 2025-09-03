import { ErrorCode } from '@shared/types/ErrorCode'
import type { ErrorMessages } from '../types/ErrorMessages'

export const commonErrorMessages: ErrorMessages = {
  [ErrorCode.PermissionDenied]: {
    summary: 'Permiso denegado',
    message:
      'No tienes permiso de acceder a la información o realizar dicha acción.'
  },
  [ErrorCode.Unavailable]: {
    summary: 'Servicio no disponible',
    message:
      'El servicio no está disponible en este momento. Por favor, intenta más tarde.'
  },
  [ErrorCode.NotFound]: {
    summary: 'No encontrado',
    message: 'El recurso que estás buscando no existe o ha sido eliminado.'
  },
  [ErrorCode.InvalidArgument]: {
    summary: 'Datos inválidos',
    message:
      'Algunos de los datos proporcionados no son válidos. Revisa e intenta nuevamente.'
  },
  [ErrorCode.DeadlineExceeded]: {
    summary: 'Tiempo de espera agotado',
    message:
      'La operación tardó demasiado y fue cancelada. Intenta de nuevo más tarde.'
  },
  [ErrorCode.Aborted]: {
    summary: 'Operación cancelada',
    message: 'La operación fue interrumpida. Vuelve a intentarlo.'
  },
  [ErrorCode.Unauthenticated]: {
    summary: 'No autenticado',
    message: 'Debes iniciar sesión para realizar esta acción.'
  },
  [ErrorCode.Cancelled]: {
    summary: 'Solicitud cancelada',
    message: 'La solicitud fue cancelada antes de completarse.'
  },
  [ErrorCode.Internal]: {
    summary: 'Error interno',
    message:
      'Ocurrió un error inesperado en el servidor. Intenta nuevamente más tarde.'
  },
  [ErrorCode.ResourceExhausted]: {
    summary: 'Límite alcanzado',
    message:
      'Has superado el límite de uso permitido. Intenta más tarde o contacta soporte.'
  },
  [ErrorCode.AlreadyExists]: {
    summary: 'Ya existe',
    message: 'El recurso que intentas crear ya existe.'
  },
  [ErrorCode.DataLoss]: {
    summary: 'Pérdida de datos',
    message:
      'Se detectó una posible pérdida de datos. Es posible que la información esté incompleta.'
  },
  [ErrorCode.Unknown]: {
    summary: 'Error desconocido',
    message:
      'Ocurrió un error inesperado. Intenta nuevamente o contacta soporte si persiste.'
  },
  [ErrorCode.AuthInvalidEmail]: {
    summary: 'Correo electrónico inválido',
    message:
      'El correo ingresado no es válido. Verifica el formato e intenta nuevamente.'
  },
  [ErrorCode.AuthUserDisabled]: {
    summary: 'Usuario deshabilitado',
    message:
      'Tu cuenta ha sido deshabilitada. Contacta al soporte si crees que esto es un error.'
  },
  [ErrorCode.AuthTooManyRequests]: {
    summary: 'Demasiados intentos',
    message:
      'Has realizado demasiadas solicitudes en poco tiempo. Espera unos minutos antes de intentar de nuevo.'
  },
  [ErrorCode.AuthPermissionDenied]: {
    summary: 'Permiso denegado',
    message: 'No tienes los permisos necesarios para realizar esta acción.'
  },
  [ErrorCode.AuthInvalidCredential]: {
    summary: 'Credenciales incorrectas',
    message: 'Las credenciales no coinciden o son invalidas.'
  }
}
