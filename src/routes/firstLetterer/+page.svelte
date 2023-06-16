<script>
import TextMedia from '$/components/TextMedia.svelte'
import H1 from '$comp/H1.svelte'

let input = ''
</script>

<svelte:head>
  <title>First Letterer</title>
</svelte:head>

<H1>First Letterer</H1>
<TextMedia reverse={true}>
  <textarea
    slot="media"
    class="w-full p-4 text-lg rounded"
    placeholder="Joshua&#10;Chapter 1&#10;1 After the death of Moses the servant . . ."
  />
  <div slot="text">Download</div>
</TextMedia>

<style>
textarea {
  white-space: pre-line;
  resize: none;
  height: 50vh;
}
</style>
