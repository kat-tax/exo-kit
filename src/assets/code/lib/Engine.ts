import {createOnigurumaEngine} from 'shiki/engine-oniguruma.mjs';

export default createOnigurumaEngine(import('shiki/wasm'));
