import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly _axios: AxiosInstance;
  private readonly _data: string;
  constructor() {
    this._axios = axios;
    this._data = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0';
  }
  async executeSeed() {
    const { data } = await this._axios.get<PokeResponse>(this._data);

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const pokemonNumber = +segments[segments.length - 2];

      console.log({name, pokemonNumber});
    });

    return data.results;
  }
}
