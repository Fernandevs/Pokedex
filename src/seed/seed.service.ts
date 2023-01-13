import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly _data: string;
  private readonly _http: AxiosAdapter;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly _pokemonModel: Model<Pokemon>
  ) {
    this._data = 'https://pokeapi.co/api/v2/pokemon?limit=1200';
  }

  async executeSeed() {
    await this._pokemonModel.deleteMany({});

    const data: PokeResponse = await this._http.get<PokeResponse>(this._data);
    const pokemonToInsert: { name: string, pokemonNumber: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const pokemonNumber = + segments[segments.length - 2];

      pokemonToInsert.push({ name, pokemonNumber });
    });

    await this._pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}
