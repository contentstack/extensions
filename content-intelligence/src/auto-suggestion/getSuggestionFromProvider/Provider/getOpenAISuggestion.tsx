//@ts-ignore
import OpenAIApi from 'openai-api-node'
//add an open ai key
var openai = new OpenAIApi("your-openai-key")

export const getOpenAISuggestion = (text: any) => {
    return openai.CompletionsCreate(text)
      .then(function (data: any) {
          return data.choices[0].text;
      })
      .catch(function (err: any) {
        console.log(err)
      })
}
