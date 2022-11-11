let url = 'https://dev11-app.csnonprod.com/content-intelligence/spell-check'

export const getSpellSuggestion = async (text: any) => {
   // @ts-ignore
  return window.postRobot.sendToParent("stackQuery", {
    action: 'getSpellSuggestion',
    payload: {
      input_text: text,
    },
    params: {
      urlKey: 'AI_SERVICES_URL'
    }
}).then((data: any) => data.substr(text.length)).catch((err: any) => err)
  }