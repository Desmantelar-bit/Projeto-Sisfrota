import { BASE_URL, createCachedService } from './api.js';

const URL = `${BASE_URL}/marca`;

export const marcaService = createCachedService(URL);
