import { BASE_URL, createCachedService } from './api.js';

const URL = `${BASE_URL}/modelo`;

export const modeloService = createCachedService(URL);
