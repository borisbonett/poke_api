import { Component, inject, signal } from "@angular/core";
import { PokeApiService } from "../../services/poke_api.services";
import { forkJoin } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
    selector: "app-dashboard-page",
    templateUrl: "./dashboard-page.component.html",
    styleUrls: ['./dashboard-page.component.scss'],
    imports: [],
})
export default class DashboardPageComponent {

    private pokeApiService = inject(PokeApiService);

    pokemons = signal<any[]>([]);
    isLoading = signal<boolean>(false);
    offset = signal<number>(0);
    limit = 20;

    typeColors: { [key: string]: string } = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };

    ngOnInit() {
        this.loadPokemonPage();
    }

    loadPokemonPage() {
        this.isLoading.set(true);
        // Limpiamos los pokemons actuales para que se muestre el loading si lo deseas
        this.pokemons.set([]); 
        
        this.pokeApiService.getAllPokemon(this.offset(), this.limit).pipe(
            switchMap((data: any) => {
                const requests = data.results.map((pokemon: any) => 
                    this.pokeApiService.getPokemonByUrl(pokemon.url)
                );
                return forkJoin(requests);
            })
        ).subscribe((pokemonDetails: any) => {
            this.pokemons.set(pokemonDetails);
            this.isLoading.set(false);
        });
    }

    nextPage() {
        this.offset.update(v => v + this.limit);
        this.loadPokemonPage();
    }

    prevPage() {
        if (this.offset() >= this.limit) {
            this.offset.update(v => v - this.limit);
            this.loadPokemonPage();
        }
    }

    getTypeColor(type: string): string {
        return this.typeColors[type] || '#777';
    }

}