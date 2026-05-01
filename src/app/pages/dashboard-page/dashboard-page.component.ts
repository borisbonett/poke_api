import { Component, inject, signal } from "@angular/core";
import { PokeApiService } from "../../services/poke_api.services";
import { forkJoin } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
    selector: "app-dashboard-page",
    templateUrl: "./dashboard-page.component.html",
    imports: [],
})
export default class DashboardPageComponent {

    private pokeApiService = inject(PokeApiService);

    pokemons = signal<any[]>([]);

    ngOnInit() {
        this.getAllPokemon();
    }

    getAllPokemon() {
        this.pokeApiService.getAllPokemon().pipe(
            switchMap((data: any) => {
                
                const requests = data.results.map((pokemon: any) => 
                    this.pokeApiService.getPokemonByUrl(pokemon.url)
                );

                return forkJoin(requests);
            })
        ).subscribe((pokemonDetails: any) => {
            console.log("All Pokemon Details:", pokemonDetails);
            this.pokemons.set(pokemonDetails);
        });
    }

}