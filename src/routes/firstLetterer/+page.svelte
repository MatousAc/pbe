<script>
import { loadNKJV, getBooks, getTextForBook } from '$/ts/nkjv'
import { generate } from '$/ts/firstLetterer'
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
    placeholder="The text should start in this format:
The Book of Joshua

Chapter 1
1 After the death of Moses the servant of the LORD, it came to pass that the LORD spoke to Joshua the son of Nun, Moses' assistant, saying

2 “Moses my servant is dead. Now therefore, arise, go over this Jordan, you and all this people, to the land which I am giving to them--the children of Israel.

3 Every place that the sole of your foot will tread upon I have given you . . ."
  />
  <div slot="text">
    <H>Directions</H>
    <Col align="flex-start">
      <H n={3}>1. Choose text</H>
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
      <H n={3}>3. Generate & download document</H>
      <Button onClick={() => generate(input)} class="max-w-xs my-0">
        Generate
      </Button>
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
