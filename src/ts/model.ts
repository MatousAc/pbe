import { loadModelPotT5, generateQuestionPotT5 } from './potT5'
import { writable } from 'svelte/store'
// model load progress
export let loadProgress = writable('0%')

// model list
export const models = [
  {
    huggingID: 'example/dummy-id',
    url: 'https://example.com/dummy-url',
    name: 'test model'
  },
  {
    huggingID: 'potsawee/t5-large-generation-squad-QuestionAnswer',
    url: 'https://storage.googleapis.com/aqg_onnx',
    name: 't5 potsawee onnx'
  }
]

export let generateQuestion: (text: string) => string | PromiseLike<string>

export const loadModel = async (modelName: string) => {
  console.log(`loading model: ${modelName}`)
  let model = models.find(m => m.name === modelName)
  if (!model) {
    console.log('no model found with the given name')
    return
  }

  switch (modelName) {
    case 't5 potsawee onnx':
      await loadModelPotT5(model.huggingID, model.url)
      generateQuestion = generateQuestionPotT5
      break
    case 'test model':
      generateQuestion = async (text: string) => 'dummy answer'
      for (let i = 1; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 / i)) // speed up
        let progress = i + '%'
        loadProgress.set(progress)
      }
      break
  }
}
