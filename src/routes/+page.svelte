<script lang="ts">
import H1 from '$comp/H1.svelte'
import H2 from '$/components/H.svelte'
import P from '$comp/P.svelte'
import Select from '$comp/Select.svelte'
import Button from '$comp/Button.svelte'
import Row from '$comp/Row.svelte'
import { loadProgress, models, loadModel, generateQuestion } from '$/ts/model'
import { loadNKJV, getBooks, getChapters, getVerses, getText } from '$/ts/nkjv'

let { book, chapter, startVerse, endVerse, text, result, modelName } = {
  book: 'Genesis',
  chapter: '1',
  startVerse: '1',
  endVerse: '1',
  text: '',
  result: '',
  modelName: 'test model'
}
let outputArea: HTMLTextAreaElement
let progress: string = '0%'
loadProgress.subscribe(p => {
  progress = p
})

let chapters: { name: string; value: string }[] = []
let verses: { name: string; value: string }[] = []

const updateText = () => {
  text = getText(
    book,
    parseInt(chapter),
    parseInt(startVerse),
    parseInt(chapter),
    parseInt(endVerse)
  )
}

const lazyNKJV = async () => {
  await loadNKJV()
  chapters = getChapters(book)
  verses = getVerses(book, chapter)
  updateText()
}

const lazyModel = async () => {
  await loadModel(modelName)
  outputArea.innerHTML = await generateQuestion(text)
}

const truncateText = (text: string) => {
  const sentences = text.trim().split('. ')
  if (sentences.length <= 2) {
    return text
  }

  const firstTwoSentences = sentences.slice(0, 2).join('. ')

  const words = text.trim().split(/\s+/)
  const lastEightWords = words.slice(-8).join(' ')

  const truncatedText = `${firstTwoSentences} ... ${lastEightWords}`
  return truncatedText
}
</script>

<svelte:head>
  <title>PBE Question Generator</title>
</svelte:head>

<H1>Question Generator</H1>
<div>
  <p style="color: var(--dim)">
    Please note that this tool is in development and does not yet produce good
    questions and answers.
  </p>
  <H2>Select a model to use for question generation.</H2>
  <Select
    justify="flex-start"
    name="modelName"
    bind:value={modelName}
    options={models.map(m => ({ name: m.name, value: m.name }))}
    on:change={() => loadModel(modelName)}
  />
</div>
<div>
  <H2>Select a text.</H2>
  {#await lazyNKJV() then}
    <Row justify="flex-start" align="left" class="flex-col my-0 md:flex-row">
      <Select
        justify="flex-start"
        bind:value={book}
        name="book"
        options={getBooks()}
        on:change={() => {
          chapters = getChapters(book)
          chapter = '1'
          updateText()
        }}
      />
      <Row justify="flex-start">
        <Select
          bind:value={chapter}
          name="chapter"
          options={chapters}
          on:change={() => {
            verses = getVerses(book, chapter)
            startVerse = '1'
            endVerse = '1'
            updateText()
          }}
        />
        <H2>:</H2>
        <Select
          bind:value={startVerse}
          name="startVerse"
          options={verses}
          on:change={() => {
            if (parseInt(startVerse) > parseInt(endVerse)) {
              endVerse = startVerse
            }
            updateText()
          }}
        />
        <H2>-</H2>
        <Select
          bind:value={endVerse}
          name="endVerse"
          options={verses}
          on:change={() => {
            if (parseInt(startVerse) > parseInt(endVerse)) {
              startVerse = endVerse
            }
            updateText()
          }}
        />
      </Row>
    </Row>
    <P>
      {truncateText(text)}
    </P>
  {/await}
  <Row justify="between">
    {#await lazyModel()}
      <Button disabled class="mr-auto">
        Loading Model: {progress}
      </Button>
    {:then}
      <Button
        onClick={async () => {
          outputArea.innerHTML = await generateQuestion(text)
        }}
        class="mr-auto"
      >
        Generate Question
      </Button>
    {/await}
  </Row>
</div>
<textarea
  bind:this={outputArea}
  class="p-4 mx-4 md:m-0 bg-transparent rounded-lg h-60"
/>

<style>
textarea {
  border: 2px solid var(--accent);
  resize: none;
  width: -webkit-fill-available;
}
</style>
