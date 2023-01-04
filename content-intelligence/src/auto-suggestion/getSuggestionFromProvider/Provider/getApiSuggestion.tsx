declare global {
  interface Window { postRobot: any; }
}
export const getAPISuggestion = async (text: any) => {
  return window.postRobot.sendToParent("stackQuery", {
    action: 'getAutoSuggestion',
    payload: {
      input_text: text,
    },
    params: {
      urlKey: 'AI_SERVICES_URL'
    }
}).then((data: any) => {  
  if(data.data){
    return data.data.substr(text.length)
  }
}).catch((err: any) => err)
  }
