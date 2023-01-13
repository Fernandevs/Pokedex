import { IsInt, IsPositive, IsString, Min } from "class-validator";

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  pokemonNumber: number;

  @IsString()
  name: string;
}
