const FONTS = [
  "Inter",
  "Allura",
  "Caveat",
  "Comfortaa",
  "Dancing Script",
  "EB Garamond",
  "Lora",
  "Merriweather",
  "Montserrat",
  "Nanum Pen Script",
  "Nunito",
  "Niconne",
  "Open Sans",
  "Oswald",
  "Raleway",
  "Source Code Pro",
  "Spectral",
  "Syne Mono",
  "Ubuntu",
]

/**
 * The stylesheet for the bundled list, built from the list itself.
 *
 * This used to be a hand-maintained block of @import rules in fontFamily.css,
 * which had drifted: nine of the fonts above had no @font-face at all and only
 * rendered on machines that happened to have them installed locally — which is
 * why they previewed in some browsers and not others.
 *
 * Inter is left out because the rte-extension iframe already loads it.
 */
export const BUNDLED_FONTS_STYLESHEET =
  "https://fonts.googleapis.com/css2?" +
  FONTS
    .filter((font) => font !== "Inter")
    .map((font) => `family=${font.replace(/ /g, "+")}`)
    .join("&") +
  "&display=swap"

export default FONTS
