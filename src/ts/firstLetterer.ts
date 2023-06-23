import { writable, get } from 'svelte/store'
import * as fs from 'fs'
import { Paragraph, Document, Packer } from 'docx'
import { style, cleanPhrases, cleanWords, needsConverting } from './helpers'

const doc = writable(
  new Document({
    sections: []
  })
)

const grind = (phrases: string[]): string[] => {
  phrases = cleanPhrases(phrases)

  phrases = phrases.map(phrase => {
    return needsConverting(phrase) ? addFirstLetters(phrase) : phrase
  })

  return phrases
}

const addFirstLetters = (phrase: string): string => {
  let words = phrase.split(' ')

  words = cleanWords(words)
  let first_letters = words.map(word => {
    return isNaN(Number(word)) ? word.substring(0, 1).toUpperCase() : `${word}`
  })

  return `${phrase}\t ${first_letters.join('    ')}`
}

export const generate = (input: string): void => {
  let phrases = input.split('\n')
  const paragraphs = phrases.map(phrase => {
    return new Paragraph({
      children: [...style(phrase)]
    })
  })

  doc.set(
    new Document({
      creator: 'Ac Hybl',
      sections: [
        {
          // properties: {
          //   orientation: 'landscape'
          // },
          children: [...paragraphs]
        }
      ]
    })
  )
}

export const download = (): void => {
  Packer.toBuffer(get(doc)).then(buffer => {
    fs.writeFileSync('My Document.docx', buffer)
  })
}
