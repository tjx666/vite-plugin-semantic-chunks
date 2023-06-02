import _ from 'lodash';
import { createApp } from 'vue';

import App from './app.vue';
import MyWorker from './worker?worker';

const app = createApp(App);
app.mount('#root');

import('./dynamic-mod1');
import('./dynamic-mod2');

// eslint-disable-next-line no-new
new MyWorker();
console.log(_);
