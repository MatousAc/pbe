<script>
import { loadNKJV, getBooks, getTextForBook } from '$/ts/nkjv'
import { generate, download } from '$/ts/firstLetterer'
import { phraseSplit } from '$/ts/clauser'
import Button from '$/components/Button.svelte'
import TextMedia from '$/components/TextMedia.svelte'
import H1 from '$/components/H1.svelte'
import H from '$/components/H.svelte'
import Select from '$comp/Select.svelte'
import Col from '$comp/Col.svelte'

let input = '',
  book = ''
</script>

<svelte:head>
  <title>First Letterer</title>
</svelte:head>

<H1>First Letterer</H1>
<TextMedia reverse={true}>
  <textarea
    autofocus
    slot="media"
    bind:value={input}
    class="w-full p-4 text-lg rounded-xl"
    placeholder="Paste your text here like this
The Book of Joshua
Chapter 1
1 After the death of Moses the servant of the Lord the Lord said to Joshua son of Nun, Moses' aide:
2 “Moses my servant is dead . . ."
  />
  <div slot="text">
    <H>Directions</H>
    <Col align="flex-start">
      <H n={3}>1. Paste or select text</H>
      {#await loadNKJV() then}
        <Select
          justify="flex-start"
          bind:value={book}
          name="book"
          options={getBooks()}
          on:change={() => {
            input = getTextForBook(book)
          }}
        />
      {/await}
      <H n={3}>2. Split into phrases</H>

      <Button
        onClick={() => {
          input = phraseSplit(input)
        }}
        class="max-w-xs my-0"
      >
        Phrase Split
      </Button>
      <H n={3}>3. Generate document</H>
      <Button onClick={() => generate(input)} class="max-w-xs my-0">
        Generate
      </Button>
      <H n={3}>4. Download</H>
      <Button onClick={download} class="max-w-xs my-0">Download</Button>
    </Col>
  </div>
</TextMedia>

<style>
textarea {
  resize: none;
  height: 50vh;
  overflow-y: auto;
  outline: none;
  color: var(--nav-text);
  background-color: var(--nav);
}

textarea::placeholder {
  color: lightgrey;
}

textarea::-webkit-scrollbar {
  width: 7px;
}

:global(textarea)::-webkit-scrollbar-track {
  background-color: transparent;
}

:global(textarea)::-webkit-scrollbar-thumb {
  background-color: var(--center-bottom);
  border-radius: 10px;
}
</style>
