import { Component, inject, signal, effect } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PokeApiService } from "../../services/poke_api.services";
import { forkJoin, of } from "rxjs";
import { switchMap, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-dashboard-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.scss"],
  imports: [FormsModule],
})
export default class SearchPageComponent {
  private pokeApiService = inject(PokeApiService);

  pokemons = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  offset = signal<number>(0);
  limit = 40;

  searchQuery = signal<string>("");
  selectedType = signal<string>("");
  isFiltering = signal<boolean>(false);

  private searchSubject = new Subject<string>();

  types = [
    "normal","fire","water","electric","grass","ice","fighting","poison",
    "ground","flying","psychic","bug","rock","ghost","dragon",
    "dark","steel","fairy",
  ];

  typeColors: { [key: string]: string } = {
    normal:"#A8A77A", fire:"#EE8130", water:"#6390F0", electric:"#F7D02C",
    grass:"#7AC74C", ice:"#96D9D6", fighting:"#C22E28", poison:"#A33EA1",
    ground:"#E2BF65", flying:"#A98FF3", psychic:"#F95587", bug:"#A6B91A",
    rock:"#B6A136", ghost:"#735797", dragon:"#6F35FC", dark:"#705746",
    steel:"#B7B7CE", fairy:"#D685AD",
  };

  typeIcons: { [key: string]: string } = {
    normal:"⭐", fire:"🔥", water:"💧", electric:"⚡", grass:"🌿",
    ice:"❄️", fighting:"🥊", poison:"☠️", ground:"🌍", flying:"🦅",
    psychic:"🔮", bug:"🐛", rock:"🪨", ghost:"👻", dragon:"🐉",
    dark:"🌑", steel:"⚙️", fairy:"✨",
  };

  ngOnInit() {
    this.loadPokemonPage();

    // Debounce búsqueda por nombre
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((query) => {
      this.executeSearch(query);
    });
  }

  // Carga paginada normal (sin filtros)
  loadPokemonPage() {
    this.isLoading.set(true);
    this.pokemons.set([]);

    this.pokeApiService.getAllPokemon(this.offset(), this.limit).pipe(
      switchMap((data: any) => {
        const requests = data.results.map((p: any) =>
          this.pokeApiService.getPokemonByUrl(p.url)
        );
        return forkJoin(requests);
      })
    ).subscribe({
      next: (details: any) => {
        this.pokemons.set(details);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  // Búsqueda por nombre o id en la API
  executeSearch(query: string) {
    if (!query.trim()) {
      this.isFiltering.set(false);
      this.selectedType.set("");
      this.loadPokemonPage();
      return;
    }

    this.isFiltering.set(true);
    this.isLoading.set(true);
    this.pokemons.set([]);

    this.pokeApiService.getPokemonByName(query.trim().toLowerCase()).subscribe({
      next: (pokemon: any) => {
        this.pokemons.set([pokemon]);
        this.isLoading.set(false);
      },
      error: () => {
        this.pokemons.set([]);
        this.isLoading.set(false);
      },
    });
  }

  // Búsqueda por tipo desde la API
  filterByType(type: string) {
    if (this.selectedType() === type) {
      this.selectedType.set("");
      this.isFiltering.set(false);
      this.searchQuery.set("");
      this.loadPokemonPage();
      return;
    }

    this.selectedType.set(type);
    this.searchQuery.set("");
    this.isFiltering.set(true);
    this.isLoading.set(true);
    this.pokemons.set([]);

    this.pokeApiService.getPokemonByType(type).pipe(
      switchMap((data: any) => {
        // Tomar máximo 40 para no saturar
        const slice = data.pokemon.slice(0, 40);
        const requests = slice.map((entry: any) =>
          this.pokeApiService.getPokemonByUrl(entry.pokemon.url)
        );
        return forkJoin(requests);
      })
    ).subscribe({
      next: (details: any) => {
        this.pokemons.set(details);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSearchInput(value: string) {
    this.searchQuery.set(value);
    this.selectedType.set("");
    this.searchSubject.next(value);
  }

  clearFilters() {
    this.searchQuery.set("");
    this.selectedType.set("");
    this.isFiltering.set(false);
    this.loadPokemonPage();
  }

  nextPage() {
    this.offset.update((v) => v + this.limit);
    this.loadPokemonPage();
  }

  prevPage() {
    if (this.offset() >= this.limit) {
      this.offset.update((v) => v - this.limit);
      this.loadPokemonPage();
    }
  }

  getTypeColor(type: string): string {
    return this.typeColors[type] || "#777";
  }

  getTypeIcon(type: string): string {
    return this.typeIcons[type] || "❓";
  }
}