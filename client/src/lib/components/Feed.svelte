<script>
  import { onMount } from 'svelte';
  import { api } from '../api.js';
  import GameCard from './GameCard.svelte';

  let entries = $state([]);
  let loading = $state(true);

  onMount(async () => {
    entries = await api.getFeed();
    loading = false;
  });
</script>

<section class="feed">
  <h2>Victorias recientes</h2>
  {#if loading}
    <p class="status-text">Cargando...</p>
  {:else if entries.length === 0}
    <p class="status-text">Nadie ha registrado nada todavía. ¡Sé el primero!</p>
  {:else}
    <div class="grid">
      {#each entries as entry (entry._id)}
        <GameCard {entry} />
      {/each}
    </div>
  {/if}
</section>
