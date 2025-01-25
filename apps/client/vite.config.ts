import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import deadFile from 'vite-plugin-deadfile'
import magicalSvg from 'vite-plugin-magical-svg'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
    magicalSvg({
      target: 'react',
      preserveWidthHeight: true,
    }),
    deadFile({ root: 'src' }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
})
