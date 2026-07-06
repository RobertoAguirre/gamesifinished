<script>
  let { entry, onDelete } = $props();

  const formattedDate = $derived(
    new Date(entry.finishedDate).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  );
</script>

<article class="game-card">
  <div class="cover">
    {#if entry.gameCoverUrl}
      <img src={entry.gameCoverUrl} alt={entry.gameName} />
    {:else}
      <div class="cover-placeholder">🎮</div>
    {/if}
    <span class="badge">{entry.evidenceType === 'video' ? '🎬' : '📸'}</span>
  </div>
  <div class="info">
    <h3>{entry.gameName}</h3>
    <p class="player">por <strong>{entry.username}</strong></p>
    <p class="meta">Terminado el {formattedDate}</p>
    {#if entry.hoursSpent}<p class="meta">⏱ {entry.hoursSpent}h</p>{/if}
    {#if entry.levelReached}<p class="meta">🏁 {entry.levelReached}</p>{/if}
    <div class="card-actions">
      <a class="btn-ghost" href={entry.evidenceUrl} target="_blank" rel="noopener noreferrer">
        Ver evidencia
      </a>
      {#if onDelete}
        <button class="btn-danger" onclick={() => onDelete(entry._id)}>Eliminar</button>
      {/if}
    </div>
  </div>
</article>
