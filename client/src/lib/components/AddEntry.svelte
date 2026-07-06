<script>
  import { user } from '../stores/auth.js';
  import { api } from '../api.js';
  import { uploadEvidence } from '../cloudinary.js';
  import GameSearch from './GameSearch.svelte';

  let { oncreated } = $props();

  let selectedGame = $state(null);
  let finishedDate = $state('');
  let hoursSpent = $state('');
  let levelReached = $state('');
  let evidenceFile = $state(null);
  let submitting = $state(false);
  let error = $state('');

  function onFileChange(e) {
    evidenceFile = e.target.files[0] ?? null;
  }

  async function submit() {
    error = '';
    if (!selectedGame) {
      error = 'Selecciona un juego';
      return;
    }
    if (!finishedDate) {
      error = 'Indica la fecha en que lo terminaste';
      return;
    }
    if (!evidenceFile) {
      error = 'Sube tu evidencia (captura o video)';
      return;
    }

    submitting = true;
    try {
      const { url, type } = await uploadEvidence(evidenceFile);
      await api.createEntry({
        username: $user.username || $user.firstName || 'Jugador',
        gameName: selectedGame.name,
        gameRawgId: selectedGame.id,
        gameCoverUrl: selectedGame.coverUrl,
        finishedDate,
        hoursSpent: hoursSpent ? Number(hoursSpent) : undefined,
        levelReached,
        evidenceUrl: url,
        evidenceType: type,
      });
      oncreated?.();
    } catch (err) {
      error = err.message || 'Algo salió mal';
    } finally {
      submitting = false;
    }
  }
</script>

<section class="panel add-entry">
  <h2>Registra tu victoria</h2>

  <GameSearch onselect={(g) => (selectedGame = g)} />

  {#if selectedGame}
    <div class="selected-game">
      {#if selectedGame.coverUrl}<img src={selectedGame.coverUrl} alt={selectedGame.name} />{/if}
      <strong>{selectedGame.name}</strong>
    </div>
  {/if}

  <label>
    Fecha en que lo terminaste
    <input type="date" bind:value={finishedDate} />
  </label>

  <label>
    Horas invertidas (aprox.)
    <input type="number" min="0" bind:value={hoursSpent} placeholder="ej. 35" />
  </label>

  <label>
    Nivel / progreso alcanzado
    <input type="text" bind:value={levelReached} placeholder="ej. 100%, Final Boss, New Game+" />
  </label>

  <label>
    Evidencia (captura o video corto)
    <input type="file" accept="image/*,video/*" onchange={onFileChange} />
  </label>

  {#if error}<p class="error-text">{error}</p>{/if}

  <button class="btn-primary" onclick={submit} disabled={submitting}>
    {submitting ? 'Subiendo...' : 'Publicar'}
  </button>
</section>
