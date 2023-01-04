declare global {
  interface Window { postRobot: any; }
}
export const getGrammerSuggestion = async (text: any) => {
  return window.postRobot.sendToParent("stackQuery", {
    action: 'getGrammarSuggestion',
    payload: {
      input_text: text,
    },
    params: {
      urlKey: 'AI_SERVICES_URL'
    }
}).then((data: any) => {
  if(data?.data?.contentToReplace){
    return data.data
  }
}).catch((err: any) => err)
   
  }