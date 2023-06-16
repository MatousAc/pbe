import { AutoTokenizer, T5ForConditionalGeneration } from 'web-transformers'
import { loadProgress } from './model'

let tokenizer: AutoTokenizer
let model: T5ForConditionalGeneration

const generateProgress = async (
  outputTokenIds: number[],
  forInputIds: number[]
) => {
  let shouldContinue = true
  return shouldContinue
}
const generationOptions = {
  maxLength: 512,
  topK: 10
}

// load the tokenizer and model
export const loadModelPotT5 = async (huggingID: string, modelPath: string) => {
  tokenizer = AutoTokenizer.fromPretrained(huggingID, modelPath)
  model = new T5ForConditionalGeneration(
    huggingID,
    modelPath,
    async progress => {
      console.log(`Loading network: ${Math.round(progress * 100)}%`)
      loadProgress.set(`${Math.round(progress * 100)}%`)
    }
  )
}

const processQA = (inputString: string) => {
  const parts = inputString.split('[32100]') // split string on separator
  if (parts.length < 2) {
    return ''
  }
  const [question, answer] = parts.map(part =>
    part
      .replace(/<.*?>/g, '') // remove angle brackets
      .replace(/\[.*?\]/g, '') // remove square brackets
      .trim()
  )

  return `Question: ${question}\nAnswer: ${answer}`
}

export const generateQuestionPotT5 = async (text: string) => {
  const inputTokenIds = await tokenizer.encode(text)

  const finalOutputTokenIds = await model.generate(
    inputTokenIds,
    generationOptions,
    generateProgress
  )
  let finalOutput = (await tokenizer.decode(finalOutputTokenIds, false)).trim()
  finalOutput = processQA(finalOutput)
  console.log(finalOutput)
  return finalOutput
}
