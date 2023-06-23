<script>
export let n = 2
</script>

<div class="flex justify-between items-center py-2">
  {#if n == 2}<h2 class="text-xl text-left"><slot /></h2>{/if}
  {#if n == 3}<h3 class="text-lg text-left"><slot /></h3>{/if}
  {#if n == 4}<h4 class="text-left"><slot /></h4>{/if}
</div>
