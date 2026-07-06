<script>
  import { api } from '../api.js';

  let { onselect } = $props();

  let query = $state('');
  let results = $state([]);
  let loading = $state(false);
  let timer;

  function onInput() {
    clearTimeout(timer);
    if (!query.trim()) {
      results = [];
      return;
    }
    timer = setTimeout(search, 350);
  }

  async function search() {
    loading = true;
    try {
      results = await api.searchGames(query);
    } catch {
      results = [];
    } finally {
      loading = false;
    }
  }

  function pick(game) {
    onselect(game);
    results = [];
    query = game.name;
  }
</script>

<div class="game-search">
  <input type="text" placeholder="Busca un juego..." bind:value={query} oninput={onInput} />
  {#if loading}<p class="hint">Buscando...</p>{/if}
  {#if results.length}
    <ul class="search-results">
      {#each results as game (game.id)}
        <li>
          <button type="button" onclick={() => pick(game)}>
            {#if game.coverUrl}<img src={game.coverUrl} alt={game.name} />{/if}
            <span>{game.name}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
