import React, { useState, useEffect } from "react";
import {
  Field,
  FieldLabel,
  TextInput,
} from "@contentstack/venus-components";
import ContentstackAppSdk from "@contentstack/app-sdk";
import localeTexts from "../common/locale/en-us";
import utils from "../common/utils";
import { TypeAppSdkConfigState } from "../common/types";
import "@contentstack/venus-components/build/main.css";
import styles from "./style.module.css";

const ConfigScreen: React.FC = function () {
  const [state, setState] = useState<TypeAppSdkConfigState>({
    installationData: {
      configuration: {
        content_type: "",
        field: "",
        group_title: ""
      },
      serverConfiguration: {},
    },
    setInstallationData: (): any => {},
    appSdkInitialized: false,
  });

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
      const sdkConfigData = appSdk?.location?.AppConfigWidget;
      if (sdkConfigData) {
        const installationDataFromSDK =
        //@ts-ignore
          await sdkConfigData.installation.getInstallationData();
          //@ts-ignore
        const setInstallationDataOfSDK = sdkConfigData.installation.setInstallationData;
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
    });
  }, []);

  const updateConfig = async (e: any) => {
    let { name: fieldName, value: fieldValue } = e.target;
    const updatedConfig = state?.installationData?.configuration || {};
    updatedConfig[fieldName] = fieldValue;

    const updatedServerConfig = state.installationData.serverConfiguration;
    updatedServerConfig[fieldName] = fieldValue;

    if (typeof state.setInstallationData !== "undefined") {
      await state.setInstallationData({
        ...state.installationData,
        configuration: updatedConfig,
        server_configuration: updatedServerConfig,
      });
    }

    return true;
  };

  return (
    <div className={styles['layout-container']}>
      <div className="page-wrapper">
          <Field>
            <FieldLabel required htmlFor="content_typeId">
              {" "}
              {localeTexts.configFields.field1.label}
            </FieldLabel>
            <TextInput
              id="content_typeId"
              required
              value={state.installationData.configuration.content_type}
              placeholder={localeTexts.configFields.field1.placeholder}
              name="content_type"
              onChange={updateConfig}
            />
          </Field>
          <Field>
            <FieldLabel required htmlFor="fieldId">
              {" "}
              {localeTexts.configFields.field2.label}
            </FieldLabel>
            <TextInput
              required
              id="fieldId"
              value={state.installationData.configuration.field}
              placeholder={localeTexts.configFields.field2.placeholder}
              name="field"
              onChange={updateConfig}
            />
          </Field>
          <Field>
            <FieldLabel required htmlFor="group_titleId">
              {" "}
              {localeTexts.configFields.field3.label}
            </FieldLabel>
            <TextInput
              id="group_titleId"
              required
              value={state.installationData.configuration.group_title}
              placeholder={localeTexts.configFields.field3.placeholder}
              name="group_title"
              onChange={updateConfig}
            />
          </Field>
      </div>
    </div>
  );
};

export default ConfigScreen;
