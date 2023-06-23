import { writable, get } from 'svelte/store'
import * as docx from 'docx'

const doc = writable(
  new docx.Document({
    sections: []
  })
)

const defaultSectionProperties = {
  type: docx.SectionType.CONTINUOUS,
  page: {
    margin: {
      orientation: docx.PageOrientation.LANDSCAPE,
      top: 1000,
      right: 1000,
      bottom: 1000,
      left: 1000
    },
    size: {
      orientation: docx.PageOrientation.LANDSCAPE
    }
  }
}

const title = writable('result.docx')

const splitToPhrases = (input: string): string[] => {
  let phrases = input.split('\n')
  return phrases.map(phrase => phrase.trim())
}
const isBookTitle = (phrase: string): boolean => {
  return phrase.toLowerCase().startsWith('the book of')
}
const isChapter = (phrase: string): boolean => {
  return phrase.toLowerCase().startsWith('chapter')
}
const needsConverting = (phrase: string): boolean => {
  return !isBookTitle(phrase) && !isChapter(phrase) && phrase != ''
}

const cleanWords = (words: string[]): string[] => {
  return words.map(word => {
    return word.replace(/[.,'‘’“”"\/#!$%\^&\*;:{}=\-_`~()]/g, '')
  })
}

const addFirstLetters = (phrase: string): string => {
  let words = phrase.split(' ')

  words = cleanWords(words)
  let first_letters = words.map(word => {
    return isNaN(Number(word)) ? word.substring(0, 1).toUpperCase() : `${word}`
  })

  return `${phrase}\t${first_letters.join('    ')}`
}

const styledParagraphs = (phrase: string): docx.Paragraph => {
  const basicStyle = {
    line: 1.5,
    after: 0,
    before: 0,
    tabStops: [
      {
        type: docx.TabStopType.LEFT,
        position: 7000
      }
    ]
  }

  if (isBookTitle(phrase)) {
    return new docx.Paragraph({
      heading: docx.HeadingLevel.TITLE,
      alignment: docx.AlignmentType.CENTER,
      children: [new docx.TextRun({ text: phrase, size: 20 * 2 })]
    })
  }

  if (isChapter(phrase)) {
    return new docx.Paragraph({
      children: [new docx.TextRun({ text: phrase, size: 16 * 2 })]
    })
  }

  return new docx.Paragraph({
    ...basicStyle,
    children: [new docx.TextRun({ text: phrase, size: 12 * 2 })]
  })
}

export const generate = (input: string): void => {
  let phrases = splitToPhrases(input)
  title.set(`${phrases[0]} - First Letters.docx`)
  phrases = phrases.map(phrase => {
    return needsConverting(phrase) ? addFirstLetters(phrase) : phrase
  })

  console.log(phrases[3])

  const paragraphs = phrases.map(phrase => styledParagraphs(phrase))

  doc.set(
    new docx.Document({
      creator: 'Ac Hybl',
      sections: [
        {
          properties: defaultSectionProperties,
          children: [...paragraphs]
        }
      ]
    })
  )

  console.log(get(doc))
}

export const download = (): void => {
  docx.Packer.toBlob(get(doc)).then(blob => {
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = get(title)
    link.click()
  })
}
