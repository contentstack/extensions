import ContentstackSDK from "@contentstack/app-sdk";
import { createFontFamily } from "./font-family/index";
import { createFontSize } from "./font-size/index";
import { createFontColor } from "./font-color/index";

export default ContentstackSDK.init().then(async (sdk) => {
  const extensionObj = await sdk["location"];
  const RTE = await extensionObj["RTEPlugin"];
  if(!RTE) return;
  const FontFamily = createFontFamily(RTE);
  const FontSize = createFontSize(RTE);
  const FontColor = createFontColor(RTE);
  return {
    FontFamily,
    FontSize,
    FontColor,
  };
});
