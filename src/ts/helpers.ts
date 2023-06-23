import { TextRun, HeadingLevel, AlignmentType } from 'docx'

let newVerseFlag = true

const isChapter = (phrase: string): boolean => {
  return phrase.includes('Chapter') || phrase.includes('chapter')
}

const isHeader = (phrase: string): boolean => {
  return newVerseFlag && isNaN(Number(phrase.split(' ')[0]))
}

const isKRs = (phrase: string): boolean => {
  return '1 Kings' === phrase || 'Ruth' === phrase
}

const setNewVerseFlag = (phrase: string): void => {
  if (phrase === '') {
    newVerseFlag = true
  } else {
    newVerseFlag = false
  }
}

const cleanPhrases = (phrases: string[]): string[] => {
  let newPhrases = phrases.map(phrase => {
    let ps = phrase.split(' ')
    return ps[0] === '' ? phrase.substring(1, phrase.length) : phrase
  })

  newPhrases = newPhrases.map(phrase => {
    let ps = phrase.split(' ')
    return ps[ps.length - 1] === ''
      ? phrase.substring(0, phrase.length - 1)
      : phrase
  })

  return newPhrases
}

const cleanWords = (words: string[]): string[] => {
  return words.map(word => {
    return word.replace(/[.,'‘’“”"\/#!$%\^&\*;:{}=\-_`~()]/g, '')
  })
}

const needsConverting = (phrase: string): boolean => {
  if (isChapter(phrase) || isHeader(phrase) || isKRs(phrase)) {
    return false
  }

  setNewVerseFlag(phrase)

  if (phrase === '') {
    return false
  }

  return true
}

const style = (phrase: string): TextRun[] => {
  const basicStyle = {
    size: 12 * 2
  }

  if (isKRs(phrase)) {
    return [
      new TextRun({
        text: phrase,
        bold: true,
        size: 16 * 2,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER
      })
    ]
  }

  if (isChapter(phrase) || isHeader(phrase)) {
    return [
      new TextRun({
        text: phrase,
        bold: true,
        ...basicStyle
      })
    ]
  }

  if (newVerseFlag) {
    setNewVerseFlag(phrase)
    let words = phrase.split(' ')

    words = words.map(word => {
      return !isNaN(Number(word)) ? `$~${word}$~` : word
    })

    const runs = words
      .join(' ')
      .split('$~')
      .filter(run => {
        return run !== ''
      })

    return runs.map(run => {
      return new TextRun({
        text: run,
        bold: !isNaN(Number(run)),
        ...basicStyle
      })
    })
  }

  setNewVerseFlag(phrase)

  return [
    new TextRun({
      text: phrase,
      ...basicStyle
    })
  ]
}

export { needsConverting, cleanPhrases, cleanWords, setNewVerseFlag, style }
