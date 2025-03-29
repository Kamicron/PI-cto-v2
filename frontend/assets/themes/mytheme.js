import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      hover: '#1c2938',
      light: '#c9d6e7',
      medium: '#8f9eb1',
      dark: '#3d556d'
    },
    dynamic: {
      500: '#28a745'
    },
    gray: {
      white: '#F4F6F8',
      light: '#c9d6e7',
      medium: '#6c757d',
      dark: '#2c3b4c',
    },
    error: {
      500: '#dc3545'
    },
    success: {
      500: '#28a745'
    },
    warning: {
      500: '#ffc107'
    },
    info: {
      500: '#17a2b8'
    },
    border: {
      radius: {
        medium: '10px 0 10px 0'
      },
      style: {
        light: "5px solid {semantic.primary.light}",
        medium: "10px solid {semantic.primary.medium}",
      }
    },
    shadow: {
      medium: "0px 4px 6px rgba(0, 0, 0, 0.5)"
    }
  },
  components: {
    button: {
      root: {
        borderRadius: '{semantic.border.radius.medium}',
        shadow: '{semantic.shadow.medium}',
        background: '{semantic.primary.dark}',
        color: '#ffffff'
      },
      hover: {
        background: '{semantic.primary.hover}',
        color: '#ffffff'
      },
      severity: {
        error: {
          background: '{semantic.error.500}',
          hover: {
            background: '#ff0000'
          }
        }
      },
      variants: {
        outline: {
          background: 'transparent',
          color: '{semantic.primary.dark}',
          border: '2px solid {semantic.primary.dark}',
          hover: {
            background: '{semantic.primary.dark}',
            color: '#ffffff',
            border: '2px solid {semantic.primary.dark}'
          }
        }
      },
      css: ({ dt }) => `
        .p-button {
          box-shadow: ${dt('button.root.shadow')};
          background: ${dt('button.root.background')};
          color: ${dt('button.root.color')};
          outline: none;
          border: 1px solid ${dt('button.root.background')};
        }
        
        .p-button:hover {
          background: ${dt('button.hover.background')} !important;
          color: ${dt('button.hover.color')} !important;
          outline: none !important;
          border: 1px solid ${dt('button.hover.background')} !important;
        }

        .p-button.p-button-error {
          background: ${dt('button.severity.error.background')};
          border: 1px solid ${dt('button.severity.error.background')};
        }

        .p-button.p-button-error:hover {
          background: ${dt('button.severity.error.hover.background')} !important;
          border: 1px solid ${dt('button.severity.error.hover.background')} !important;
        }

        .p-button.p-button-outline {
          background: ${dt('button.variants.outline.background')};
          color: ${dt('button.variants.outline.color')};
          border: ${dt('button.variants.outline.border')};
        }

        .p-button.p-button-outline:hover {
          background: ${dt('button.variants.outline.hover.background')} !important;
          color: ${dt('button.variants.outline.hover.color')} !important;
          border: ${dt('button.variants.outline.hover.border')} !important;
        }
      `
    }
  },
});

export default {
  preset: MyPreset,
  options: {
    darkModeSelector: false
  }
}