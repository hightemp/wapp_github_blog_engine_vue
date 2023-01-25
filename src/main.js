import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import { createApp } from 'vue'
import App from './App.vue'

global._l = (...a) => { console.log.apply(console, a); return a[0]; }
global._s = () => { var o = new Error(); console.trace(o.stack.match(/at ([^\n]*)/g)[1]); }

createApp(App).mount('#app')
