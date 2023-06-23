<div class="flex justify-start md:justify-between items-center py-4 md:py-8">
  <h1 class="text-4xl md:text-6xl text-left"><slot /></h1>
</div>

<style lang="scss">
div {
  color: var(--h1);
  h1 {
    text-transform: capitalize;
  }
}
</style>
