import React, { useState, useEffect } from "react";
import {
  Field,
  FieldLabel,
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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        try {
          const sdkConfigData = appSdk?.location?.AppConfigWidget;
          //@ts-ignore
          const config = await sdkConfigData.installation.getInstallationData();
          console.log("config", config);
          
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
          setError("Failed to initialize app configuration. Please refresh the page.");
        }
      })
      .catch((error) => {
        console.error("Error initializing Contentstack App SDK:", error);
        setError("Failed to initialize app. Please refresh the page.");
      });
  }, []);

  const updateConfig = async (e: any) => {
    console.log("ONCHANGE",e.target.name, e.target.value)
    let { name: fieldName, value: fieldValue } = e.target;
    let updatedConfig = fontState;
    //@ts-ignore
    updatedConfig[fieldName] = fieldValue;

    const updatedServerConfig = state.installationData.serverConfiguration;
    updatedServerConfig[fieldName] = fieldValue;

    if (typeof state.setInstallationData !== "undefined") {
      setFontState(updatedConfig);
    }
    
    // Enable add button only if both fields have values
    const shouldDisable = !updatedConfig.name.trim() || !updatedConfig.url.trim();
    setDisableAddButton(shouldDisable);
    
    // Clear any previous errors
    setError("");
    
    return true;
  };

  const validateInputs = () => {
    if (!fontState.name.trim()) {
      setError("Font name is required");
      return false;
    }
    if (!fontState.url.trim()) {
      setError("Font URL is required");
      return false;
    }
    
    // Check for URL format (basic validation)
    // const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    // if (!urlPattern.test(fontState.url)) {
    //   setError("Please enter a valid URL");
    //   return false;
    // }
    
    // Check for duplicate fonts
    const isDuplicate = state.installationData.configuration.fontFamily.some(
      (font: any) => font.name.toLowerCase() === fontState.name.toLowerCase()
    );
    if (isDuplicate) {
      setError("A font with this name already exists");
      return false;
    }
    
    return true;
  };

  const addFontFamily = async () => {
    console.log("fontState", fontState, state.installationData.configuration.fontFamily)
    
    if (!validateInputs()) {
      return false;
    }
    
    if (typeof state.setInstallationData !== "undefined") {
      try {
        const updatedFontFamily = [
          fontState,
          ...state.installationData.configuration.fontFamily,
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
        setDisableAddButton(true);
        setError("");
        
      } catch (error) {
        console.error("Error saving font configuration:", error);
        setError("Failed to save font configuration. Please try again.");
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
        
        console.log("Font deleted successfully:", fontToDelete);
        
      } catch (error) {
        console.error("Error deleting font:", error);
        setError("Failed to delete font. Please try again.");
      }
    }
  };

  console.log("STATE VALUE: ",state.installationData.configuration.fontFamily, fontState)
  return (
    <div className={styles["layout-container"]}>
      <div className="page-wrapper">
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '10px', 
            padding: '8px', 
            backgroundColor: '#ffeaea', 
            border: '1px solid #ffcdd2', 
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}
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
          />
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
        </Field>
        <Button
          id="applyPropertyBtn"
          disabled={disableAddButton || !fontState.name.trim() || !fontState.url.trim()}
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
