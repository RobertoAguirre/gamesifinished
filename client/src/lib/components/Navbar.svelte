<script>
  import { clerk } from '../clerk.js';
  import { user, signOut } from '../stores/auth.js';

  let { view = $bindable('feed') } = $props();
</script>

<header class="navbar">
  <button class="brand" onclick={() => (view = 'feed')}>
    <span class="brand-icon">🎮</span>
    <span class="brand-text">GamesIFinished</span>
  </button>

  <nav class="nav-links">
    <button class:active={view === 'feed'} onclick={() => (view = 'feed')}>Feed</button>
    {#if $user}
      <button class:active={view === 'add'} onclick={() => (view = 'add')}>+ Añadir</button>
      <button class:active={view === 'mine'} onclick={() => (view = 'mine')}>Mis Juegos</button>
    {/if}
  </nav>

  <div class="auth-zone">
    {#if $user}
      <span class="username">{$user.username || $user.firstName || 'Jugador'}</span>
      <button class="btn-ghost" onclick={() => signOut()}>Salir</button>
    {:else}
      <button class="btn-primary" onclick={() => clerk.openSignIn()}>Entrar</button>
    {/if}
  </div>
</header>
