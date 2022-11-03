//@ts-ignore
import OpenAIApi from 'openai-api-node'

var openai = new OpenAIApi("sk-REDACTED")

export const getOpenAISuggestion = (text: any) => {
    return openai.CompletionsCreate(text)
      .then(function (data: any) {
          return data.choices[0].text;
      })
      .catch(function (err: any) {
        console.log(err)
      })
  }
