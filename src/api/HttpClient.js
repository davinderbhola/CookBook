import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1',

  timeout: 100000,

  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;
