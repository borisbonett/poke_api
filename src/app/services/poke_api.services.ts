
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";

@Injectable({ providedIn: 'root' })
export class PokeApiService {

    private http = inject(HttpClient);

    getAllPokemon(offset: number = 0, limit: number = 20) {
        return this.http.get(`${environment.pokeApiUrl}?offset=${offset}&limit=${limit}`);
    }

    getPokemonByUrl(url: string) {
        return this.http.get(url);
    }

}