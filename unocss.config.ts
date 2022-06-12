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
  shortcuts: [
    ['in_out', 'transition duration-300 ease-in-out'],
    ['text-h3', 'text-3xl font-semibold tracking-wider'],
    ['text-h4', 'text-2xl font-semibold tracking-wider'],
    ['text-h5', 'text-lg font-semibold tracking-wider'],
    ['btn-primary', 'px-4 py-1 rounded bg-bg-b cursor-pointer hover:bg-bg-c disabled:cursor-default disabled:bg-bg-d disabled:opacity-50'],
    ['icon-btn', 'op30 hover:op100'],
  ],
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
      bgA: '#242424',
      bgB: '#373737',
      bgC: '#505050',
      bgD: '#A1A1AA',
      bgF: '#1D1D1D',
      fgNorm: '#F9F9F9',
      fgMuted: '#D4D4D4',
      fgSubtle: '#A4A4A4',
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
