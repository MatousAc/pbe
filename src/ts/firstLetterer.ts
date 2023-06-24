import { writable, get } from 'svelte/store'
import type { Phrase } from './types'
import * as docx from 'docx'

// clause splitting
const splitToPhrases = (input: string): Phrase[] => {
  let phrases = input.split('\n')
  phrases = phrases.map(phrase => phrase.trim())
  let verse: number,
    isFirst = false
  return phrases.map(text => {
    // remove and store verse number
    let firstWord = Number(text.split(' ')[0])
    if (!isNaN(firstWord)) {
      verse = firstWord
      isFirst = true
      text = text.substring(text.indexOf(' ') + 1)
    } else {
      isFirst = false
    }

    return {
      text: text,
      isBook: text.toLowerCase().startsWith('the book of'),
      isChapter: text.toLowerCase().startsWith('chapter'),
      isFirst,
      isEmpty: text === '',
      verse
    }
  })
}

// adding first letters
const cleanWords = (words: string[]): string[] => {
  return words.map(word => {
    return word.replace(/[.,'‘’“”"\/#!$%\^&\*;:{}=\-_`~()]/g, '')
  })
}

const needsConverting = (phrase: Phrase): boolean => {
  return !phrase.isBook && !phrase.isChapter && !phrase.isEmpty
}

const spaces = '    '
const addFirstLetters = (phrase: Phrase): Phrase => {
  if (!needsConverting(phrase)) return phrase
  let words = phrase.text.split(' ')

  words = cleanWords(words)
  let first_letters = words.map(word => {
    return word.substring(0, 1).toUpperCase()
  })

  phrase.firstLetters = first_letters.join(spaces)
  return phrase
}

// writing docx
const doc = writable(
  new docx.Document({
    sections: []
  })
)

const defaultSectionProperties = {
  type: docx.SectionType.CONTINUOUS,
  page: {
    margin: {
      top: 700,
      right: 700,
      bottom: 700,
      left: 700
    },
    size: {
      orientation: docx.PageOrientation.LANDSCAPE
    }
  }
}

const title = writable('result.docx')

const styledParagraphs = (phrase: Phrase): docx.Paragraph => {
  let { titleSz, chapterSz, verseSz } = {
    titleSz: 20 * 2,
    chapterSz: 16 * 2,
    verseSz: 12 * 2
  }
  if (phrase.isEmpty) return new docx.Paragraph({})
  // styling for documente header
  if (phrase.isBook) {
    return new docx.Paragraph({
      heading: docx.HeadingLevel.TITLE,
      alignment: docx.AlignmentType.CENTER,
      children: [new docx.TextRun({ text: phrase.text, size: titleSz })]
    })
  }
  // styling for chapter headers
  if (phrase.isChapter) {
    return new docx.Paragraph({
      children: [
        new docx.TextRun({ text: phrase.text, size: chapterSz, bold: true })
      ]
    })
  }

  // normal verses
  let children: docx.TextRun[] = []
  if (phrase.isFirst)
    children.push(
      new docx.TextRun({
        text: `${phrase.verse} `,
        bold: true,
        size: verseSz
      })
    )
  children.push(new docx.TextRun({ text: phrase.text, size: verseSz }))
  children.push(new docx.TextRun({ text: '\t', size: verseSz }))
  if (phrase.isFirst)
    children.push(
      new docx.TextRun({
        text: phrase.verse + spaces,
        bold: true,
        size: verseSz
      })
    )
  children.push(new docx.TextRun({ text: phrase.firstLetters, size: verseSz }))

  return new docx.Paragraph({
    spacing: {
      // line height
      line: 375,
      after: 0,
      before: 0
    },
    tabStops: [
      {
        // align first letters
        type: docx.TabStopType.LEFT,
        position: 8000
      }
    ],
    children: children
  })
}

export const generate = (input: string): void => {
  let phrases = splitToPhrases(input)
  title.set(`${phrases[0].text} - First Letters.docx`)
  phrases = phrases.map(phrase => addFirstLetters(phrase))

  console.log(phrases)

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
}

export const download = (): void => {
  docx.Packer.toBlob(get(doc)).then(blob => {
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = get(title)
    link.click()
  })
}
