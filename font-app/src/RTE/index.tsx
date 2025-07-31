//@ts-nocheck
// import { jsx } from "@emotion/core";

// 1 include app sdk
import ContentstackSDK from "@contentstack/app-sdk";
import VariableComponent from "./variable_plugin/VariableComponent";
import VariableIcon from "./variable_plugin/VariableIcon";
import VariablePluginModal from "./variable_plugin/VariablePluginModal";
import { cbModal } from "@contentstack/venus-components";

import { fieldExtractor } from "./variable_plugin/lib";
import { useState, useEffect } from "react";
// step 2 initialize contentstack app sdk
// export default ContentstackSDK.init().then(async (sdk) => {
// console.log("ContentstackSDK.init() from VARIABLE")

//     const extensionObj = await sdk["location"];
//     const RTE = await extensionObj["RTEPlugin"];
//     if (!RTE) return;

//     const test = await sdk?.getConfig();
//     console.log("TEST: ",test)

//     // step 3 create a plugin
//     // step 4 register the plugin using RTE Plugin
//     //wanna get this config from the UI while installing the app.
//     const config = {
//         content_type: "group_data",
//         field: "group",
//     };
//     try {
//         // console.log("TRY")
//         const query = await sdk.stack
//             .ContentType(config.content_type)
//             .Entry.Query()
//             .find();

//         const entries = query.entries || [];

//         const files: { [key: string]: any } = {};
//         entries.forEach((entry) => {
//             let variables = {};
//             if (config.field) {
//                 const field = entry[config.field];
//                 if (!field)
//                     throw new Error(
//                         "Group is missing or provide a proper name for field"
//                     );

//                 variables = fieldExtractor(field, entry.uid);
//             } else {
//                 const field = entry.group;
//                 if (!field)
//                     throw new Error(
//                         "Group is missing or provide a proper name for field"
//                     );

//                 variables = fieldExtractor(field, entry.uid);
//             }

//             files[entry.uid] = { value: variables, title: entry.title };
//         });

//         const variableOptions: { [key: string]: any }[] = [];

//         Object.values(files).forEach(
//             (file: { [key: string]: any; value: any }) => {
//                 Object.entries(file.value).forEach(
//                     ([key, value]: [string, any]) => {
//                         variableOptions.push({
//                             label: key,
//                             value: {
//                                 uid: value.uid,
//                                 title: key,
//                             },
//                         });
//                     }
//                 );
//             }
//         );
//         // console.log("BEFORE INIT")
//         const VariablePlugin = RTE("variable-plugin", () => ({
//             title: "Insert Variable",
//             icon: <VariableIcon />,
//             Component: (props) => (
//                 <VariableComponent variableData={files} {...props} />
//             ),
//             dnd: {
//                 disable: true,
//                 hideSelectionBackground: true,
//             },
//             elementType: ["inline", "void"],
//             displayOn: ["toolbar"],
//         }));

//         VariablePlugin.on("exec", (rte) => {
//             const savedSelection = rte.selection.get();
//             cbModal({
//                 component: (props) => (
//                     <VariablePluginModal
//                         variableData={variableOptions}
//                         savedSelection={savedSelection}
//                         rte={rte}
//                         {...props}
//                     />
//                 ),

//                 modalProps: {
//                     shouldReturnFocusAfterClose: false,
//                     customClass: "variable-extension-modal",
//                 },
//             });
//         });

//         return {
//             VariablePlugin,
//         };
//     } catch (err) {
//         // console.log("CATCH")
//         console.error("errr", err);
//     }
// });

console.log("BEFORE LOADING");
const RTE: React.FC = function () {
  console.log("RTE RENDERED");
  const [js, setJS] = useState<TypeSDKData>({
    rawCode: "",
    config: {},
    appSdkInitialized: false,
  });

  useEffect(() => {
    ContentstackSDK.init().then(async (sdk) => {
      // const test = await appSdk?.getConfig();
      // console.log("TEST", test)
      const extensionObj = await sdk["location"];
      const RTE = await extensionObj["RTEPlugin"];
      if (!RTE) return;
      const test = await sdk?.getConfig();
      console.log("TEST: ", test);
      // step 3 create a plugin
      // step 4 register the plugin using RTE Plugin
      //wanna get this config from the UI while installing the app.
      const config = {
        content_type: "group_data",
        field: "group",
      };
      try {
        // console.log("TRY")
        const query = await sdk.stack
          .ContentType(config.content_type)
          .Entry.Query()
          .find();
        const entries = query.entries || [];
        const files: { [key: string]: any } = {};
        entries.forEach((entry) => {
          let variables = {};
          if (config.field) {
            const field = entry[config.field];
            if (!field)
              throw new Error(
                "Group is missing or provide a proper name for field"
              );
            variables = fieldExtractor(field, entry.uid);
          } else {
            const field = entry.group;
            if (!field)
              throw new Error(
                "Group is missing or provide a proper name for field"
              );
            variables = fieldExtractor(field, entry.uid);
          }
          files[entry.uid] = { value: variables, title: entry.title };
        });
        const variableOptions: { [key: string]: any }[] = [];
        Object.values(files).forEach(
          (file: { [key: string]: any; value: any }) => {
            Object.entries(file.value).forEach(
              ([key, value]: [string, any]) => {
                variableOptions.push({
                  label: key,
                  value: {
                    uid: value.uid,
                    title: key,
                  },
                });
              }
            );
          }
        );
        // console.log("BEFORE INIT")
        const VariablePlugin = RTE("variable-plugin", () => ({
          title: "Insert Variable",
          icon: <VariableIcon />,
          Component: (props) => (
            <VariableComponent variableData={files} {...props} />
          ),
          dnd: {
            disable: true,
            hideSelectionBackground: true,
          },
          elementType: ["inline", "void"],
          displayOn: ["toolbar"],
        }));
        VariablePlugin.on("exec", (rte) => {
          const savedSelection = rte.selection.get();
          cbModal({
            component: (props) => (
              <VariablePluginModal
                variableData={variableOptions}
                savedSelection={savedSelection}
                rte={rte}
                {...props}
              />
            ),
            modalProps: {
              shouldReturnFocusAfterClose: false,
              customClass: "variable-extension-modal",
            },
          });
        });
        return {
          VariablePlugin,
        };
      } catch (err) {
        // console.log("CATCH")
        console.error("errr", err);
      }
      // const entryData = appSdk?.location?.RTEPlugin?.get(); //get the RTE plugin data
      // setEntryData(entryData); //entryData is the whole entry object from CMS that contains all the data in the current entry for which sidebar is opened.
      setState({
        config,
        appSdkInitialized: true,
      });
    });

    // (async () => {
    //   try {
    //     // const response = await fetch(`http://localhost:38523/plugin.system.js`);

    //     // const data = await response?.text();

    //     // console.log({ data, type: typeof data });

    //     const response = await import(
    //       `http://localhost:38523/plugin.system.js`
    //     );

    //     console.log({ response });

    //     setJS({ rawCode: data });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // })();
  }, []);

  console.log({ js });

  /* Handle your UI as per requirement. State variable will hold
    the configuration details from the appSdk. */

  return <></>;
};

export default RTE;
