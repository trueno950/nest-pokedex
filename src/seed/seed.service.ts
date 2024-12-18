import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const { acknowledged } = await this.pokemonService.removeMany();

    if (acknowledged) {
      const insertPromisesArray = [];

      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];

        insertPromisesArray.push(
          this.pokemonService.create({
            name,
            no,
          }),
        );
      });

      await Promise.all(insertPromisesArray);

      return 'Insert ok!!';
    } else {
      throw new InternalServerErrorException('Error to insert pokemons');
    }
  }
}
