**Nuxt.js Project Setup Notes**

**Info**

- Can use bout CSR and Server Side Rendering (SSR) (return something on each request), SSG (Static Site Generation) (not dynamic, 
  already prerendered / static) and also Hybrid Rendering
- SEO => Search Engine Optimization: Should be SSR, not CSR

===============================================================================================================
**npm Commands**
- npx nuxi init name_of_the_project
- cd name_of_the_project
- npm install 
- npm run dev

===============================================================================================================
**Nuxt Project Configuration** // in nuxt.config.js

- export default defineNuxtConfig(          // this is inside nuxt.config.js
    devtools: { enabled: true },            // enable this overlay or disable it to get rid of nuxt-devtools-panel
    {css: ['~/assets/scss/styles.scss'],    // include all scss
  )
- Change project ports: // from package.json
  "dev": "nuxt dev --port 5000",

- Expose components globally (no need to import)
  components: {
    global: true, // they are going to be globally exposed.
    dirs: [{      // only the components in this dir are going to be exposed.
        path: '~/components',
        pattern: 'CodeBlock.vue'
      }]
  }
- The public folder is for static assets (files) that should be served "as-is" to the client.
    When accessing something with a (local) URL, use images: <img src="/images/cat.png" />, this is 
    actually this URL: http://localhost:3000/images/cat.png (uses file from	public/images/cat.png)

- The pages folder is for dynamic content (code that runs in the clien), it has .vue components 
    Used when importing  (inside .vue, .ts, .css, like <script setup> import catImage from '~/assets/images/cat.png' </script> 

- process.env.NODE_ENV is set by nuxt by default when doing:
    - npm run dev => 'development'
    - npm run build && npm run start => 'production'
    
===============================================================================================================
**Routing**

- Nuxt automatically generates routes based on the structure and names of the files inside /pages.
- [id].vue is a dynamic route. If we route to localhost:3000/1, then inside of [id].vue, the file will have id = 1
    {{ $route.params.id }} // here id will be equal to 1

- Active Routing:
  - <NuxtLink to="/about">About</NuxtLink>  // component
  - this.$router.push(`/about`);            // method

===============================================================================================================
**Layouts**
// this is inside layouts/default.vue which will render for a page by default.
- <template>
    <div> Bluh ... 
          <slot /> // Inside the slot, the page routed will render
    </div> 
  </template>

- to not render the default page you need to set this inside of the page itself:
  <script setup>
    definePageMeta({layout: "costum",});
  </script>

===============================================================================================================
**Plugins**
1.
import Clipboard from 'clipboard';    // Clipboard is a JavaScript library (clipboard.js library) for copying text to the clipboard.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('clipboard', Clipboard);}); // inject to the nuxtApp the clipboard plugin. Provide is putting this into global context  
// Use it:
import {useNuxtApp} from "#app";
const { $clipboard } = useNuxtApp();  // Give me access to the custom Nuxt plugin $clipboard that was injected into the Nuxt app.

// Clipboard:
function copyCode() { // clipboard.js is not persistent. Each time we click we new and then destroy the clipboard. This why we have to have to click events ...
    const clipboard = new $clipboard('.copy-button', {  // Attach the clipboard behavior to the element with this class,
                                                            when it's clicked, run the code below to determine what to copy.
      text: () => {   // With target, clipboard.js selects (blue highlighting) your actual DOM node to copy from → which causes the visible selection.
                      // With text, clipboard.js selects a temporary hidden node → you don't see anything.
        const el = document.querySelector(props.targetSelector);
        return el?.innerText || '';
      }
    });
} 
clipboard.on('success', () => { // listen to event `success` and do accordingly.
  clipboard.destroy();  // Remove event listeners and cleans memory at the end.
}); 

2. Prism
makes the code look like it belongs to one language 

===============================================================================================================
**Misc**
// #app is a special alias that refers to the Nuxt application instance.
import { useNuxtApp } from '#app'     // useNuxtApp() gives you access to Nuxt-specific features, plugins

- ls on Windows is dir