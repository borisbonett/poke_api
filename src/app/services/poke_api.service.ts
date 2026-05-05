import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class PokeApiService {
  private http = inject(HttpClient);
  private base = "https://pokeapi.co/api/v2";

  getAllPokemon(offset: number, limit: number): Observable<any> {
    return this.http.get(`${this.base}/pokemon?offset=${offset}&limit=${limit}`);
  }

  getPokemonByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }

  // Busca por nombre exacto o número
  getPokemonByName(nameOrId: string): Observable<any> {
    return this.http.get(`${this.base}/pokemon/${nameOrId}`);
  }

  // Trae todos los pokémon de un tipo
  getPokemonByType(type: string): Observable<any> {
    return this.http.get(`${this.base}/type/${type}`);
  }
}