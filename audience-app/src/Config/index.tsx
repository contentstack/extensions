/* Import React modules */
import React, { useState, useEffect } from "react";
/* Import other node modules */
import {
  Field,
  FieldLabel,
  TextInput,
} from "@contentstack/venus-components";
// For all the available venus components, please refer below doc
// https://venus-storybook.contentstack.com/?path=/docs/components-textinput--default
import ContentstackAppSdk from "@contentstack/app-sdk";
/* Import our modules */
import localeTexts from "../common/locale/en-us";
import utils from "../common/utils";
import { TypeAppSdkConfigState } from "../common/types";
// import { getDataFromAPI } from '../../services'; //If no services are required, this can be removed\
/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
//@ts-ignore
import styles from "./style.module.css";

const ConfigScreen: React.FC = function () {
  const [state, setState] = useState<TypeAppSdkConfigState>({
    installationData: {
      configuration: {
        /* Add all your config fields here */
        /* The key defined here should match with the name attribute
        given in the DOM that is being returned at last in this component */
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
          console.log("sdkConfigData: ",sdkConfigData)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** updateConfig - Function where you should update the state variable
   * Call this function whenever any field value is changed in the DOM
   * */
  const updateConfig = async (e: any) => {
    // eslint-disable-next-line prefer-const
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

  /* If need to get any data from API then use,
  getDataFromAPI({queryParams, headers, method, body}) function.
  Refer services/index.ts for more details and update the API
  call there as per requirement. */

  return (
    <div className={styles['layout-container']}>
      <div className="page-wrapper">
        {/* <Form className="config-wrapper"> */}
          <Field>
            <FieldLabel required htmlFor="content_typeId">
              {" "}
              {/* Change the label caption as per your requirement */}
              {localeTexts.configFields.field1.label}
            </FieldLabel>
            {/* Change the help caption as per your requirement */}
            {/* <Help text={localeTexts.configFields.field1.help} /> */}
            <TextInput
              id="content_typeId"
              required
              value={state.installationData.configuration.content_type}
              placeholder={localeTexts.configFields.field1.placeholder}
              /* The name attribute given here should match with the
              state variable definition. Please check the comments above
              at the state variable definition. */
              name="content_type"
              onChange={updateConfig}
            />
            {/* <InstructionText>
              {localeTexts.configFields.field1.instruction}
            </InstructionText> */}
          </Field>

          {/* <Line type="solid" /> */}

          <Field>
            <FieldLabel required htmlFor="fieldId">
              {" "}
              {/* Change the label caption as per your requirement */}
              {localeTexts.configFields.field2.label}
            </FieldLabel>
            {/* Change the help caption as per your requirement */}
            {/* <Help text={localeTexts.configFields.field2.help} /> */}
            <TextInput
              required
              id="fieldId"
              value={state.installationData.configuration.field}
              placeholder={localeTexts.configFields.field2.placeholder}
              name="field"
              onChange={updateConfig}
            />
            {/* <InstructionText>
              {localeTexts.configFields.field2.instruction}
            </InstructionText> */}
          </Field>
          <Field>
            <FieldLabel required htmlFor="group_titleId">
              {" "}
              {/* Change the label caption as per your requirement */}
              {localeTexts.configFields.field3.label}
            </FieldLabel>
            {/* Change the help caption as per your requirement */}
            {/* <Help text={localeTexts.configFields.field1.help} /> */}
            <TextInput
              id="group_titleId"
              required
              value={state.installationData.configuration.group_title}
              placeholder={localeTexts.configFields.field3.placeholder}
              /* The name attribute given here should match with the
              state variable definition. Please check the comments above
              at the state variable definition. */
              name="group_title"
              onChange={updateConfig}
            />
            {/* <InstructionText>
              {localeTexts.configFields.field1.instruction}
            </InstructionText> */}
          </Field>

          {/* <Line type="solid" /> */}
        {/* </Form> */}
      </div>
    </div>
  );
};

export default ConfigScreen;
