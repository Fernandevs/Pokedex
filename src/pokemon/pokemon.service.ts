import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly _pokemonModel: Model<Pokemon>
  ) {
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      return await this._pokemonModel.create(createPokemonDto);
    } catch (e) {
      this.handleExceptions(e);
    }

    throw new InternalServerErrorException(`Can't create pokemon - Check server logs`);
  }

  findAll() {
    return this._pokemonModel;
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    if (!isNaN(+ id)) pokemon = await this._pokemonModel.findOne({ pokemonNumber: id });

    if (!pokemon && isValidObjectId(id)) pokemon = await this._pokemonModel.findById(id);

    if (!pokemon) pokemon = await this._pokemonModel.findOne({ name: id.toLowerCase() });

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or number ${ id } not found`);

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this._pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id "${ id }" not found`)

    return { status: "ok", id };
  }

  private handleExceptions (e: any) {
    console.log(e);

    if (e.code === 11000)
      throw new BadRequestException(`Pokemon already exists in db ${ JSON.stringify(e.keyValue) }`);
  }
}
