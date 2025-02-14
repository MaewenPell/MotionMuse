import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const MotionMusePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#DAF2DA',
      100: '#B2E3B2',
      200: '#61B96A',
      300: '#3F9F45',
      400: '#1B5E20',
      500: '#17481B',
      600: '#113815',
      700: '#0C290F',
      800: '#081F0B',
      900: '#061507',
      950: '#030B04',
    },
  },
  // La configuration de colorScheme permet de définir des valeurs différentes pour le mode clair et le mode sombre.
  colorScheme: {
    light: {
      primary: {
        // Dans le mode clair, le principal est le Vert Forêt pour les éléments clés,
        // avec un texte inversé en Blanc Cassé (#F5F5F5).
        color: '#1B5E20',
        inverseColor: '#F5F5F5',
        // Pour l'état "hover" et "active", on utilise des variantes légèrement modifiées.
        hoverColor: '#2E7D32',
        activeColor: '#388E3C',
      },
      highlight: {
        // Pour mettre en avant certains éléments, on utilise Orange Énergie (#FF9800)
        // avec une nuance un peu plus foncée au focus.
        background: '#FF9800',
        focusBackground: '#F57C00',
        color: '#ffffff',
        focusColor: '#ffffff',
      },
    },
    dark: {
      primary: {
        // En mode sombre, on inverse les couleurs pour assurer une bonne lisibilité :
        // le texte utilise le Blanc Cassé et l'inverse devient le Vert Forêt.
        color: '#F5F5F5',
        inverseColor: '#1B5E20',
        // Les états "hover" et "active" utilisent des versions plus claires du vert.
        hoverColor: '#81C784',
        activeColor: '#66BB6A',
      },
      highlight: {
        // En mode sombre, on garde des valeurs plus neutres pour les highlights.
        background: 'rgba(250, 250, 250, .16)',
        focusBackground: 'rgba(250, 250, 250, .24)',
        color: 'rgba(255,255,255,.87)',
        focusColor: 'rgba(255,255,255,.87)',
      },
    },
  },
});

export default MotionMusePreset;
