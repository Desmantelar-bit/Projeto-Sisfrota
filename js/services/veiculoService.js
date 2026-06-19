import { BASE_URL, createCachedService } from './api.js';

const URL = `${BASE_URL}/ve_culo`;

export const veiculoService = createCachedService(URL);
