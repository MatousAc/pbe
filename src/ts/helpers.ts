import { TextRun, HeadingLevel, AlignmentType } from 'docx'

// let newVerseFlag = true

// const isHeader = (phrase: string): boolean => {
//   return newVerseFlag && isNaN(Number(phrase.split(' ')[0]))
// }

// const setNewVerseFlag = (phrase: string): void => {
//   if (phrase === '') {
//     newVerseFlag = true
//   } else {
//     newVerseFlag = false
//   }
// }

// const needsConverting = (phrase: string): boolean => {
//   if (isChapter(phrase) || isHeader(phrase) || isKRs(phrase)) {
//     return false
//   }

//   setNewVerseFlag(phrase)

//   if (phrase === '') {
//     return false
//   }

//   return true
// }
