// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import '~/styles.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library, dom } from '@fortawesome/fontawesome-svg-core'
import { faBars, faSearchLocation, faStar, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
dom.watch()
config.autoAddCss = false;
library.add(faBars, faSearchLocation, faStar, faExclamationCircle)

export default function (Vue, { router, head, isClient }) {
  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Merriweather+Sans|Merriweather&display=swap'
  })
 
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout);
  Vue.component('font-awesome', FontAwesomeIcon)
  Vue.use(require('vue-moment'));
}
