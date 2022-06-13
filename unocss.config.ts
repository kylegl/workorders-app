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
    'btn-primary': 'px-4 py-1 rounded bg-bg-b cursor-pointer hover:bg-bg-c disabled:cursor-default disabled:bg-bg-d disabled:opacity-50',
    'icon-btn': 'op40 hover:op100 in_out',
    'bg-base': 'bg-bg-h dark:bg-bg-g',
    'bg-1': 'bg-bg-h dark:bg-bg-g',
    'bg-2': 'bg-bg-l dark:bg-bg-f',
    'text-norm': 'text-fg-norm dark:text-fg-norm-d',
    'text-subtle': 'text-fg-subtle dark:text-fg-subtle-d',
    'text-muted': 'text-fg-muted dark:text-fg-muted-d',
    'action-hover': 'op70 hover:op100 in_out',
    'border-base': 'border-fg-subtle/40 dark:border-fg-subtle-d/40',
    'input-base': 'bg-bg-j  dark:bg-bg-k',
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
      bgA: '#222222',
      bgB: '#373737',
      bgC: '#505050',
      bgD: '#A1A1AA',
      bgF: '#1D1D1D',
      bgG: '#111111',
      bgH: '#FAFAFA',
      bgJ: '#F6F6F6',
      bgK: '#0B0B0B',
      bgL: '#EDEDED',
      fgNorm: '#18181B',
      fgMuted: '#404040',
      fgSubtle: '#737373',
      fgNormD: '#F9F9F9',
      fgMutedD: '#D4D4D4',
      fgSubtleD: '#A4A4A4',
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
