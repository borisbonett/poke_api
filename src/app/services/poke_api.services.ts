
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";

@Injectable({ providedIn: 'root' })
export class PokeApiService {

    private http = inject(HttpClient);

    getAllPokemon() {
        return this.http.get(environment.pokeApiUrl)
    }

    getPokemonByUrl(url: string) {
        return this.http.get(url);
    }

}