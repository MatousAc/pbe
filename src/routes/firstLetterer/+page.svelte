<script lang="ts">
import { loadNKJV, getBooks, getTextForBook } from '$/ts/nkjv'
import { generate, download } from '$/ts/firstLetterer'
import Button from '$/components/Button.svelte'
import TextMedia from '$/components/TextMedia.svelte'
import H1 from '$/components/H1.svelte'
import H from '$/components/H.svelte'
import Select from '$comp/Select.svelte'
import Col from '$comp/Col.svelte'
import nlp from 'compromise'

let input = '',
  book = '',
  min = 40,
  max = 75

const isTooShort = (text: string, add: string): boolean => {
  if (text.length + add.length > max) return false
  else return text.length < min || text.split(' ').length < 7
}

const clauser = (sentences: string[]): string[] => {
  // let compromise handle most of the clause splitting
  let smartClauses: string[] = sentences
    .map(sentence => {
      sentence = sentence.trim()
      if (sentence.length < 50) return sentence

      let doc = nlp(sentence)
      return doc.clauses().out('array')
    })
    .flat()

  // custom split on punctuation if needed
  smartClauses = smartClauses
    .map(clause => {
      if (clause.length < max) return clause
      let result: string[] = []
      const punctRe = /[.,:;!?]/
      let i = clause.search(punctRe)
      while (i !== -1 && clause.length > max) {
        result.push(clause.slice(0, i + 1))
        clause = clause.slice(i + 1)
        i = clause.search(punctRe)
      }
      result.push(clause.slice(0, i + 1))
      return result
    })
    .flat()

  // forcible clause split to tidy up
  let shortClauses: string[] = []
  smartClauses.forEach(clause => {
    while (clause.length > max) {
      const splitIndex = clause.slice(0, max).lastIndexOf(' ')
      shortClauses.push(clause.slice(0, splitIndex))
      clause = clause.slice(splitIndex + 1)
    }
    shortClauses.push(clause)
  })
  return shortClauses
}

const phraseSplit = () => {
  let verses = input.split('\n')
  verses = verses.map(verse => {
    let sentences = verse.match(/[^\.\?!\"-]+[\.!\?\"-]+/g)
    if (!sentences) sentences = [verse]
    let clauses: string[] = clauser(sentences)

    let phrases: string[] = []
    while (clauses.length > 0) {
      let phrase: string = clauses.shift() || ''
      while (clauses.length > 0 && isTooShort(phrase, clauses[0])) {
        phrase += ' ' + clauses.shift()
      }
      phrases.push(phrase.trim())
    }
    return phrases.join('\n')
  })
  input = verses.join('\n\n')
}
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

      <Button onClick={phraseSplit} class="max-w-xs my-0">Phrase Split</Button>
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
