import nlp from 'compromise'

let min = 40,
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
      const punctRe = /[.,:;!?]|--/
      let i = clause.search(punctRe)
      while (i > 20 && clause.length > max) {
        let matchLen = clause[i] === '-' ? 2 : 1
        result.push(clause.slice(0, i + matchLen))
        clause = clause.slice(i + matchLen)
        i = clause.search(punctRe)
      }
      result.push(clause)
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

export const phraseSplit = (input: string) => {
  let verses = input.split('\n')
  verses = verses.map(verse => {
    let sentences = nlp(verse)
      .json()
      .map((o: { text: any }) => o.text)
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
  return verses.join('\n')
}
