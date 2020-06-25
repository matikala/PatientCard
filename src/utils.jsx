import * as axios from 'axios';

const axio = axios.create({
    baseURL: 'http://localhost:8080/baseR4/',
    timeout: 10000,
    headers: { 'Accept': 'application/fhir+json' }
});

export default axio;