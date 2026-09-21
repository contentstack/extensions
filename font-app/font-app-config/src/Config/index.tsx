import React, { useState, useEffect } from "react";
import {
  Field,
  FieldLabel,
  InstructionText,
  TextInput,
  Button,
} from "@contentstack/venus-components";
import ContentstackAppSdk from "@contentstack/app-sdk";
import localeTexts from "../common/locale/en-us";
import utils from "../common/utils";
import { TypeAppSdkConfigState } from "../common/types";
import "@contentstack/venus-components/build/main.css";
//@ts-ignore
import styles from "./style.module.css";
import { PlusIcon } from "./assets/PlusIcon";
import Table from './Table'

const ConfigScreen: React.FC = function () {
  const [state, setState] = useState<TypeAppSdkConfigState>({
    installationData: {
      configuration: {
        fontFamily: [],
      },
      serverConfiguration: {},
    },
    setInstallationData: (): any => {},
    appSdkInitialized: false,
  });

  const [fontState, setFontState] = useState({
    name: "",
    url: "",
  });
  const [disableAddButton, setDisableAddButton] = useState(true);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        try {
          const sdkConfigData = appSdk?.location?.AppConfigWidget;

          if (sdkConfigData) {
            const installationDataFromSDK =
              //@ts-ignore
              await sdkConfigData.installation.getInstallationData();
            //@ts-ignore
            const setInstallationDataOfSDK =
              sdkConfigData.installation.setInstallationData;
            setState({
              ...state,
              installationData: utils.mergeObjects(
                state.installationData,
                installationDataFromSDK
              ),
              setInstallationData: setInstallationDataOfSDK,
              appSdkInitialized: true,
            });
          }
        } catch (error) {
          console.error("Error initializing SDK configuration:", error);
        }
      })
      .catch((error) => {
        console.error("Error initializing Contentstack App SDK:", error);
      });
  }, []);

  /**
   * A configured font is loaded into the Rich Text Editor's iframe, which is
   * shared with the editor's own interface and with every other plugin on the
   * field. Reusing a name the editor already owns would restyle it, so those
   * names are rejected here as well as ignored by the plugin at load time.
   */
  const validate = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return "";
    if (localeTexts.reservedFontNames.indexOf(trimmed.toLowerCase()) !== -1) {
      return localeTexts.errors.reservedName;
    }
    const existing = state.installationData.configuration.fontFamily || [];
    const clash = existing.some(
      (font: any) => font?.name?.trim().toLowerCase() === trimmed.toLowerCase()
    );
    return clash ? localeTexts.errors.duplicateName : "";
  };

  const updateConfig = (e: any) => {
    const { name: fieldName, value: fieldValue } = e.target;

    // A new object, so the inputs actually re-render. The draft is deliberately
    // kept out of serverConfiguration: the font list is plain configuration,
    // and writing `name`/`url` there persisted them into the app's server
    // configuration on every keystroke.
    const draft = { ...fontState, [fieldName]: fieldValue };

    setFontState(draft);
    setValidationError(validate(draft.name));
    setDisableAddButton(!draft.name.trim() || !draft.url.trim());

    return true;
  };

  const addFontFamily = async () => {
    const error = validate(fontState.name);
    if (error) {
      setValidationError(error);
      return false;
    }

    if (typeof state.setInstallationData !== "undefined") {
      try {
        const existingFonts = Array.isArray(
          state.installationData.configuration.fontFamily
        )
          ? state.installationData.configuration.fontFamily
          : [];
        const updatedFontFamily = [
          { name: fontState.name.trim(), url: fontState.url.trim() },
          ...existingFonts,
        ];

        // Update local state with preserved serverConfiguration
        setState({
          ...state,
          installationData: {
            ...state.installationData,
            configuration: {
              ...state.installationData.configuration,
              fontFamily: updatedFontFamily,
            },
          },
        });
       
        // Save to SDK with preserved configuration
        await state.setInstallationData({
          ...state.installationData,
          configuration: {
            ...state.installationData.configuration,
            fontFamily: updatedFontFamily,
          },
        });
        
        // Reset form
        setFontState({
          name: "",
          url: "",
        });
        setValidationError("");
        setDisableAddButton(true);
        
      } catch (error) {
        console.error("Error saving font configuration:", error);
        return false;
      }
    }
    return true;
  };

  const handleDeleteFont = async (fontToDelete: any) => {
    if (typeof state.setInstallationData !== "undefined") {
      try {
        const updatedFontFamily = state.installationData.configuration.fontFamily.filter(
          (font: any) => !(font.name === fontToDelete.name && font.url === fontToDelete.url)
        );
        
        // Update local state
        setState({
          ...state,
          installationData: {
            ...state.installationData,
            configuration: {
              ...state.installationData.configuration,
              fontFamily: updatedFontFamily,
            },
          },
        });
        
        // Save to SDK
        await state.setInstallationData({
          ...state.installationData,
          configuration: {
            ...state.installationData.configuration,
            fontFamily: updatedFontFamily,
          },
        });
        
      } catch (error) {
        console.error("Error deleting font:", error);
      }
    }
  };

  return (
    <div className={styles["layout-container"]}>
      <div className="page-wrapper">
        <Field>
          <FieldLabel required htmlFor="nameId">
            {" "}
            {localeTexts.configFields.field1.label}
          </FieldLabel>
          <TextInput
            id="nameId"
            value={fontState.name}
            placeholder={localeTexts.configFields.field1.placeholder}
            name="name"
            onChange={updateConfig}
            error={Boolean(validationError)}
          />
          <InstructionText>
            {validationError || localeTexts.configFields.field1.help}
          </InstructionText>
        </Field>
        <Field>
          <FieldLabel required htmlFor="urlId">
            {" "}
            {localeTexts.configFields.field2.label}
          </FieldLabel>
          <TextInput
            id="urlId"
            value={fontState.url}
            placeholder={localeTexts.configFields.field2.placeholder}
            name="url"
            onChange={updateConfig}
          />
          <InstructionText>{localeTexts.configFields.field2.help}</InstructionText>
        </Field>
        <Button
          id="applyPropertyBtn"
          disabled={
            disableAddButton ||
            Boolean(validationError) ||
            !fontState.name.trim() ||
            !fontState.url.trim()
          }
          onClick={addFontFamily}
        >
          {" "}
          <PlusIcon />
          Add
        </Button>
        <Table fonts={state.installationData.configuration.fontFamily} deleteFont={handleDeleteFont}/>
      </div>
    </div>
  );
};

export default ConfigScreen;
