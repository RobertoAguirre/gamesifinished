<script>
  import { onMount } from 'svelte';
  import { initAuth, authLoaded } from './lib/stores/auth.js';
  import Navbar from './lib/components/Navbar.svelte';
  import Feed from './lib/components/Feed.svelte';
  import AddEntry from './lib/components/AddEntry.svelte';
  import MyEntries from './lib/components/MyEntries.svelte';

  let view = $state('feed');

  onMount(() => {
    initAuth();
  });
</script>

<Navbar bind:view />

<main>
  {#if !$authLoaded}
    <p class="status-text">Cargando...</p>
  {:else if view === 'add'}
    <AddEntry oncreated={() => (view = 'feed')} />
  {:else if view === 'mine'}
    <MyEntries />
  {:else}
    <Feed />
  {/if}
</main>

<footer class="site-footer">
  <p>Hecho por gamers, para gamers. 🕹️</p>
</footer>
