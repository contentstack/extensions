let url = 'https://dev11-app.csnonprod.com/content-intelligence/spell-check'

export const getSpellSuggestion = async (text: any) => {
   // @ts-ignore
//   return window.postRobot.sendToParent("stackQuery", {
//     action: 'getSpellSuggestion',
//     payload: {
//       input_text: text,
//     },
//     params: {
//       urlKey: 'AI_SERVICES_URL'
//     }
// }).then((data: any) => data.substr(text.length)).catch((err: any) => err)
    return await fetch(url, {
      method: 'POST',
      headers: {
        'authtoken': 'blt5934a2551e3986d6',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ input_text: text })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json()
      })
      .then(data => {
        return data
      })
      .catch(err => console.log('error', err))
   
  }