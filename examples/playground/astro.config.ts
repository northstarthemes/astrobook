import preact from '@astrojs/preact'
import react from '@astrojs/react'
import solid from '@astrojs/solid-js'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import astrobook from '@northstarthemes/astrobook'

// https://astro.build/config
export default defineConfig({
  server: {
    port: 4321,
  },

  // Enable many frameworks to support all different kinds of components.
  integrations: [
    react({ include: ['**/react/*'] }),
    preact({ include: ['**/preact/*'] }),
    solid({ include: ['**/solid/*'] }),
    svelte(),
    vue(),
    astrobook({ directory: 'src/components' }),
  ],
})
