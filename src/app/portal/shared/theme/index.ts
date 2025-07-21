import { definePreset } from '@primeng/themes'
import Aura from '@primeng/themes/aura'
import { getContrastColor } from '../utils/getContrastColor'

export const gowThemeConfig = {
  semantic: {
    primary: {
      50: '#FFF4E9',
      100: '#FFE5CD',
      200: '#FED1A6',
      300: '#FFC184',
      400: '#FFAB58',
      500: '#FF9E3F',
      600: '#EF953D',
      700: '#D28437',
      800: '#B77432',
      900: '#875728',
      950: '#875728',
      contrastColor: getContrastColor('#FF9E3F')
    },
    danger: {
      50: '#FFF0EF',
      100: '#FFD4D0',
      200: '#FF9F98',
      300: '#FF7F76',
      400: '#F85D52',
      500: '#D95046',
      600: '#B13F36',
      700: '#812F29',
      800: '#692621',
      900: '#3D1714',
      950: '#3D1714',
      contrastColor: getContrastColor('#D95046')
    },
    info: {
      50: '#EEFEFF',
      100: '#B4F8FF',
      200: '#96F6FF',
      300: '#78F3FF',
      400: '#6DDAE5',
      500: '#63C5CF',
      600: '#52A2AA',
      700: '#44848B',
      800: '#336166',
      900: '#214043',
      950: '#214043',
      contrastColor: getContrastColor('#63C5CF')
    },
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#05382B',
      950: '#05382B',
      contrastColor: getContrastColor('#10B981')
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#78350F',
      contrastColor: getContrastColor('#F59E0B')
    },
    surface: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      950: '#121212'
    },
    primaryColor: '{primary.500}',
    surfaceGround: '#FDFDFD',

    textColor: '{surface.800}',
    mutedTextColor: '{surface.600}',

    borderColor: '{surface.300}',

    highlight: {
      background: '{surface.100}',
      textColor: '{surface.900}'
    },

    focusRing: {
      color: '{primary.500}',
      width: '2px',
      offset: '1px',
      shadow: '0 0 0 0.2rem {primary.200}'
    },

    disabledColor: '{surface.200}',
    disabledTextColor: '{surface.400}',

    maskBackground: 'rgba(0, 0, 0, 0.4)',

    hoverBackground: '{surface.100}',
    activeBackground: '{surface.200}'
  }
}

export const GoWTheme = definePreset(Aura, gowThemeConfig)
