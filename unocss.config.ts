import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  // transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'in_out': 'transition duration-300 ease-in-out',
    'text-h3': 'text-3xl font-semibold tracking-wider',
    'text-h4': 'text-2xl font-semibold tracking-wider',
    'text-h5': 'text-lg font-semibold tracking-wider',
    'btn': 'p2 rounded shadow-md cursor-pointer action-hover disabled:cursor-default disabled:opacity-50 text-h5',
    'icon-btn': 'op40 hover:op100 in_out',
    'bg-base': 'bg-bg-lit-b dark:bg-bg-drk-g',
    'bg-1': 'bg-bg-lit-a dark:bg-bg-drk-g',
    'bg-2': 'bg-bg-lit-a dark:bg-bg-drk-f',
    'bg-3': 'bg-bg-drk-c dark:bg-bg-drk-d',
    'text-norm': 'text-fg-lit-norm dark:text-fg-drk-norm',
    'text-subtle': 'text-fg-lit-subtle dark:text-fg-drk-subtle',
    'text-muted': 'text-fg-lit-muted dark:text-fg-drk-muted',
    'highlight': 'bg-fg-lit-muted dark:bg-fg-drk-muted text-fg-drk-norm dark:text-fg-lit-norm py1 px2 rounded-sm shadow-sm',
    'action-hover': 'op70 hover:op100 in_out',
    'border-base': 'border-fg-lit-subtle/40 dark:border-fg-drk-subtle/40',
    'input-base': 'bg-bg-lit-a  dark:bg-bg-drk-k',
    'btn-primary': 'bg-bg-lit-a dark:bg-bg-drk-g',
    'btn-active': 'bg-bg-drk-c text-fg-drk-norm',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Titillium Web',
        mono: 'Fira Code',
      },
    }),
  ],
  theme: {
    colors: {
      bgDrkA: '#18181B',
      bgDrkB: '#373737',
      bgDrkC: '#505050',
      bgDrkD: '#A1A1AA',
      bgDrkF: '#1D1D1D',
      bgDrkG: '#111111',
      bgDrkK: '#0B0B0B',
      bgLitA: '#FAFAFA',
      bgLitB: '#f4f4f5',
      bgLitC: '#e4e4e7',
      bgLitD: '#d4d4d8',
      bgLitF: '#a1a1aa',
      fgLitNorm: '#18181b',
      fgLitMuted: '#3f3f46',
      fgLitSubtle: '#71717a',
      fgDrkNorm: '#F9F9F9',
      fgDrkMuted: '#D4D4D4',
      fgDrkSubtle: '#A4A4A4',
    },
    fontFamily: {
      sans: 'Titillium Web',
      mono: 'Fira Code',
    },
    gridTemplateColumns: {
      workorderTable: '50px 20px 100px 150px auto 100px',
    },
  },
  // transformers: [
  //   transformerDirectives(),
  //   transformerVariantGroup(),
  // ],
})

