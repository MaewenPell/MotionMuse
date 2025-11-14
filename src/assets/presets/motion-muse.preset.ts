import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const MotionMusePreset = definePreset(Aura, {
  /* Warm “sunset” primary to match the new background */
  semantic: {
    primary: {
      50: '#FFF4E6',
      100: '#FFE4BF',
      200: '#FFD399',
      300: '#FFC074',
      400: '#FFAE57',
      500: '#FFA23E', // golden amber
      600: '#F08F2F',
      700: '#D97B22',
      800: '#B96317',
      900: '#8E470D',
      950: '#462306',
    },
  },

  colorScheme: {
    light: {
      primary: {
        color: '#FFA23E', // text/icon on primary
        inverseColor: '#101114', // for chips/badges on amber
        hoverColor: '#FFAE57',
        activeColor: '#F08F2F',
      },
      highlight: {
        background: '#FFD189', // warm highlight for tags/rows
        focusBackground: '#FFC36A',
        color: '#1E1E1E',
        focusColor: '#1E1E1E',
      },
    },
    dark: {
      primary: {
        color: '#FFD39A', // brighter in dark
        inverseColor: '#201610',
        hoverColor: '#FFC36A',
        activeColor: '#FFAE57',
      },
      highlight: {
        background: 'rgba(255, 210, 137, .18)',
        focusBackground: 'rgba(255, 210, 137, .26)',
        color: 'rgba(255,255,255,.92)',
        focusColor: 'rgba(255,255,255,.92)',
      },
    },
  },

  /* Buttons = frosted glass with warm tint (works on the new bg) */
  components: {
    button: {
      root: {
        borderRadius: '999px',
        paddingX: '1.1rem',
        paddingY: '0.55rem',
        gap: '0.5rem',
        label: { fontWeight: '600' },
        transitionDuration: '0.2s',
        raisedShadow: '0 8px 22px rgba(20, 12, 6, 0.18)',

        /* same glass treatment for all severities */
        primary: {
          background: 'rgba(255, 174, 87, 0.36)', // amber glass
          hoverBackground: 'rgba(255, 174, 87, 0.46)',
          activeBackground: 'rgba(255, 174, 87, 0.54)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBorderColor: 'rgba(255,255,255,0.42)',
          activeBorderColor: 'rgba(255,255,255,0.42)',
          color: 'rgba(255,255,255,0.96)',
          hoverColor: 'rgba(255,255,255,0.98)',
          activeColor: 'rgba(255,255,255,1)',
          focusRing: {
            color: 'rgba(255, 193, 112, 0.55)', // warm focus halo
            shadow: '0 0 0 3px rgba(255, 193, 112, 0.25)',
          },
        },

        /* reuse for all severities so login page stays consistent */
        secondary: {
          background: 'rgba(255, 174, 87, 0.36)',
          hoverBackground: 'rgba(255, 174, 87, 0.46)',
          activeBackground: 'rgba(255, 174, 87, 0.54)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBorderColor: 'rgba(255,255,255,0.42)',
          activeBorderColor: 'rgba(255,255,255,0.42)',
          color: 'rgba(255,255,255,0.96)',
          hoverColor: 'rgba(255,255,255,0.98)',
          activeColor: 'rgba(255,255,255,1)',
          focusRing: {
            color: 'rgba(255, 193, 112, 0.55)',
            shadow: '0 0 0 3px rgba(255, 193, 112, 0.25)',
          },
        },
        success: {
          background: 'rgba(255, 174, 87, 0.36)',
          hoverBackground: 'rgba(255, 174, 87, 0.46)',
          activeBackground: 'rgba(255, 174, 87, 0.54)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBorderColor: 'rgba(255,255,255,0.42)',
          activeBorderColor: 'rgba(255,255,255,0.42)',
          color: 'rgba(255,255,255,0.96)',
          hoverColor: 'rgba(255,255,255,0.98)',
          activeColor: 'rgba(255,255,255,1)',
          focusRing: {
            color: 'rgba(255, 193, 112, 0.55)',
            shadow: '0 0 0 3px rgba(255, 193, 112, 0.25)',
          },
        },
        info: {
          background: 'rgba(255, 174, 87, 0.36)',
          hoverBackground: 'rgba(255, 174, 87, 0.46)',
          activeBackground: 'rgba(255, 174, 87, 0.54)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBorderColor: 'rgba(255,255,255,0.42)',
          activeBorderColor: 'rgba(255,255,255,0.42)',
          color: 'rgba(255,255,255,0.96)',
          hoverColor: 'rgba(255,255,255,0.98)',
          activeColor: 'rgba(255,255,255,1)',
          focusRing: {
            color: 'rgba(255, 193, 112, 0.55)',
            shadow: '0 0 0 3px rgba(255, 193, 112, 0.25)',
          },
        },
        warn: {
          background: 'rgba(255, 174, 87, 0.36)',
          hoverBackground: 'rgba(255, 174, 87, 0.46)',
          activeBackground: 'rgba(255, 174, 87, 0.54)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBorderColor: 'rgba(255,255,255,0.42)',
          activeBorderColor: 'rgba(255,255,255,0.42)',
          color: 'rgba(255,255,255,0.96)',
          hoverColor: 'rgba(255,255,255,0.98)',
          activeColor: 'rgba(255,255,255,1)',
          focusRing: {
            color: 'rgba(255, 193, 112, 0.55)',
            shadow: '0 0 0 3px rgba(255, 193, 112, 0.25)',
          },
        },
        help: {
          background: 'rgba(255, 174, 87, 0.36)',
          hoverBackground: 'rgba(255, 174, 87, 0.46)',
          activeBackground: 'rgba(255, 174, 87, 0.54)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBorderColor: 'rgba(255,255,255,0.42)',
          activeBorderColor: 'rgba(255,255,255,0.42)',
          color: 'rgba(255,255,255,0.96)',
          hoverColor: 'rgba(255,255,255,0.98)',
          activeColor: 'rgba(255,255,255,1)',
          focusRing: {
            color: 'rgba(255, 193, 112, 0.55)',
            shadow: '0 0 0 3px rgba(255, 193, 112, 0.25)',
          },
        },
        danger: {
          background: 'rgba(255, 174, 87, 0.36)',
          hoverBackground: 'rgba(255, 174, 87, 0.46)',
          activeBackground: 'rgba(255, 174, 87, 0.54)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBorderColor: 'rgba(255,255,255,0.42)',
          activeBorderColor: 'rgba(255,255,255,0.42)',
          color: 'rgba(255,255,255,0.96)',
          hoverColor: 'rgba(255,255,255,0.98)',
          activeColor: 'rgba(255,255,255,1)',
          focusRing: {
            color: 'rgba(255, 193, 112, 0.55)',
            shadow: '0 0 0 3px rgba(255, 193, 112, 0.25)',
          },
        },
        contrast: {
          background: 'rgba(255, 174, 87, 0.36)',
          hoverBackground: 'rgba(255, 174, 87, 0.46)',
          activeBackground: 'rgba(255, 174, 87, 0.54)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBorderColor: 'rgba(255,255,255,0.42)',
          activeBorderColor: 'rgba(255,255,255,0.42)',
          color: 'rgba(255,255,255,0.96)',
          hoverColor: 'rgba(255,255,255,0.98)',
          activeColor: 'rgba(255,255,255,1)',
          focusRing: {
            color: 'rgba(255, 193, 112, 0.55)',
            shadow: '0 0 0 3px rgba(255, 193, 112, 0.25)',
          },
        },
      },

      outlined: {
        primary: {
          color: 'rgba(255,255,255,0.96)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBackground: 'rgba(255,174,87,0.20)',
          activeBackground: 'rgba(255,174,87,0.28)',
        },
        secondary: {
          color: 'rgba(255,255,255,0.96)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBackground: 'rgba(255,174,87,0.20)',
          activeBackground: 'rgba(255,174,87,0.28)',
        },
        success: {
          color: 'rgba(255,255,255,0.96)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBackground: 'rgba(255,174,87,0.20)',
          activeBackground: 'rgba(255,174,87,0.28)',
        },
        info: {
          color: 'rgba(255,255,255,0.96)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBackground: 'rgba(255,174,87,0.20)',
          activeBackground: 'rgba(255,174,87,0.28)',
        },
        warn: {
          color: 'rgba(255,255,255,0.96)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBackground: 'rgba(255,174,87,0.20)',
          activeBackground: 'rgba(255,174,87,0.28)',
        },
        help: {
          color: 'rgba(255,255,255,0.96)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBackground: 'rgba(255,174,87,0.20)',
          activeBackground: 'rgba(255,174,87,0.28)',
        },
        danger: {
          color: 'rgba(255,255,255,0.96)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBackground: 'rgba(255,174,87,0.20)',
          activeBackground: 'rgba(255,174,87,0.28)',
        },
        contrast: {
          color: 'rgba(255,255,255,0.96)',
          borderColor: 'rgba(255,255,255,0.32)',
          hoverBackground: 'rgba(255,174,87,0.20)',
          activeBackground: 'rgba(255,174,87,0.28)',
        },
      },

      text: {
        primary: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
        secondary: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
        success: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
        info: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
        warn: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
        help: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
        danger: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
        contrast: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
        plain: {
          color: 'rgba(255,255,255,0.96)',
          hoverBackground: 'rgba(255,174,87,0.16)',
          activeBackground: 'rgba(255,174,87,0.22)',
        },
      },
    },
  },
});

export default MotionMusePreset;
