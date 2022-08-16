import { writable } from 'svelte/store';

const storedApiKey  = localStorage.getItem('apiKey');
export const apiKey = writable(storedApiKey);
export const rollTime = writable(15);

apiKey.subscribe(v => {
  localStorage.setItem('apiKey', v || '');
});
