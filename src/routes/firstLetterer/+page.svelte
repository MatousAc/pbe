<script>
import { loadNKJV, getBooks, getTextForBook } from '$/ts/nkjv'
import Button from '$/components/Button.svelte'
import TextMedia from '$/components/TextMedia.svelte'
import H1 from '$comp/H1.svelte'
import H2 from '$comp/H2.svelte'
import Select from '$comp/Select.svelte'

let input = '',
  book = ''
const download = () => {
  console.log(input)
}

const lazyNKJV = async () => {
  await loadNKJV()
  input = getTextForBook(book)
}
</script>

<svelte:head>
  <title>First Letterer</title>
</svelte:head>

<H1>First Letterer</H1>
<TextMedia reverse={true}>
  <textarea
    slot="media"
    bind:value={input}
    class="w-full p-4 text-lg rounded-xl"
    placeholder="Paste your text here
Joshua
Chapter 1
1 After the death of Moses the servant of the Lord
the Lord said to Joshua son of Nun, Moses' aide:
2 “Moses my servant is dead.
. . ."
  />
  <div slot="text">
    <H2>. . . or select a book:</H2>
    {#await lazyNKJV() then}
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
    <Button onClick={download} class="my-0">Download</Button>
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
