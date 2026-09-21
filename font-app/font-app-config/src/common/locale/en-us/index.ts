const localeTexts = {
  configFields: {
    field1: {
      label: "Name",
      help: "The font-family name. This is written into your entries and is what the delivered page will ask for.",
      placeholder: "Roboto Slab",
    },
    field2: {
      label: "URL",
      help: "A stylesheet or font file the browser can load, so the font previews while editing.",
      placeholder: "https://fonts.googleapis.com/css2?family=Roboto+Slab",
    },
  },
  errors: {
    reservedName:
      "That name is used by the editor itself. Please choose a different font name.",
    duplicateName: "A font with that name has already been added.",
  },
  /**
   * Families the Rich Text Editor uses for its own interface. A custom font
   * with one of these names would restyle the editor, so it is rejected here
   * and ignored by the plugin at load time.
   */
  reservedFontNames: ["inter", "ibm plex mono"],
};

export default localeTexts;
