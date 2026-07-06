<script>
  import { onMount } from 'svelte';
  import { api } from '../api.js';
  import GameCard from './GameCard.svelte';

  let entries = $state([]);
  let loading = $state(true);

  onMount(load);

  async function load() {
    loading = true;
    entries = await api.getMine();
    loading = false;
  }

  async function remove(id) {
    await api.deleteEntry(id);
    entries = entries.filter((e) => e._id !== id);
  }
</script>

<section class="feed">
  <h2>Mis Juegos Terminados</h2>
  {#if loading}
    <p class="status-text">Cargando...</p>
  {:else if entries.length === 0}
    <p class="status-text">Aún no has registrado ningún juego.</p>
  {:else}
    <div class="grid">
      {#each entries as entry (entry._id)}
        <GameCard {entry} onDelete={remove} />
      {/each}
    </div>
  {/if}
</section>
