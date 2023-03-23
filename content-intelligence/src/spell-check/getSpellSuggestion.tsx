declare global {
  interface Window { postRobot: any; }
}
interface ISpellCorrectionDTO {
  "incorrect_input": string,
  "corrected_input": Array<string>,
  "start_offset": number,
  "end_offset": number
}
interface ISpellCheckResponse {
  contentToReplace: Array<ISpellCorrectionDTO>
}
export const getSpellSuggestion: (body: string ) => Promise<ISpellCheckResponse> = async (body) => {
  return window.postRobot.sendToParent("stackQuery", {
    action: 'getSpellSuggestion',
    payload: {
      input_text: body,
    },
    params: {
      urlKey: 'AI_SERVICES_URL'
    }
  }).then((data: any) => {
    if (data.data.contentToReplace) {
      return data.data
    }
    return {
      contentToReplace: []
    }
  }).catch((err: any) => {
    console.error("Error while fetching spell response",err)
    return {
      contentToReplace: []
    }
  })
}