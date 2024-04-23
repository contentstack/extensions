/** @jsx jsx */
//@ts-nocheck
import { jsx } from "@emotion/core";
import ContentstackSDK from "@contentstack/app-sdk";
import {
  AudiencePostTag,
  AudiencePreTag,
  AudienceWrapperComponent
} from "./audiencePlugin/AudienceComponent";
import AudienceModal from "./audiencePlugin/AudienceModal";
import { cbModal } from "@contentstack/venus-components";

import { fieldExtractor } from "./audiencePlugin/lib";
import { AudienceIcon } from "./audiencePlugin/icons";

export default ContentstackSDK.init()
  .then(async (sdk) => {
    const extensionObj = await sdk["location"];
    const RTE = await extensionObj["RTEPlugin"];
    let audiences;
    let invalidConfig = {
      isConfigInvalid: false,
      errorHeading: "",
      errorMessage: "",
    };
    try {
      const AudiencePlugin = RTE("audience", async (rte) => {
        const config = await rte.getConfig();
        // const config = {
        //   content_type: "audience",
        //   field: "group",
        //   group_title: "grouptitle"
        // };
        if (config.content_type && config.field && config.group_title) {
          try {
            const query = await sdk.stack
              .ContentType(config.content_type)
              .Entry.Query()
              .find();
            const entries = query.entries || [];
            audiences = entries.map((entry) => {
              const audience = {
                label: entry.title,
                value: entry.title,
                children: [],
              };

              if (config.field) {
                if (!entry.hasOwnProperty(config.field))
                  throw Error("invalid group title");

                audience.children = fieldExtractor(
                  entry[config.field],
                  config.group_title
                );
              } else {
                if (!entry.hasOwnProperty("group"))
                  throw Error("invalid group title");

                audience.children = fieldExtractor(
                  entry.group,
                  config.group_title
                );
              }
              return audience;
            });
          } catch (err) {
            invalidConfig.isConfigInvalid = true;
            if (typeof err === "object" && err.toString()?.includes("field")) {
              invalidConfig.errorHeading = "Invalid Group Title";
              invalidConfig.errorMessage =
                "The group title provided in app configuration is either invalid or does not exist. Please verify the app config settings in Marketplace and try again.";
            } else if (
              typeof err === "object" &&
              err.toString()?.includes("invalid group title")
            ) {
              (invalidConfig.errorHeading = "Invalid Field UID"),
                (invalidConfig.errorMessage =
                  "The field provided in app configuration is either invalid or does not exist. Please verify the app config settings in Marketplace and try again.");
            } else if (
              typeof err === "string" &&
              err.includes("The Content Type")
            ) {
              (invalidConfig.errorHeading = "Invalid Content Type UID"),
                (invalidConfig.errorMessage =
                  "The content type provided in app configuration is either invalid or does not exist. Please verify the app config settings in Marketplace and try again.");
            }
          }
        }
        return {
          title: "Audience",
          icon: <AudienceIcon />,
          dnd: {
            disable: true,
            hideSelectionBackground: true,
          },
          elementType: ["inline"],
          displayOn: ["toolbar"],
        };
      });

      const AudiencePre = RTE("audience-pre", (rte) => ({
        render: (props) => {
          const savedSelection = rte.selection.get();
          return (
            <AudiencePreTag
              {...props}
              rte={rte}
              audienceList={audiences}
              savedSelection={savedSelection}
              invalidConfig={invalidConfig}
            />
          );
        },
        elementType: ["block","void"],
        dnd: {
          disable: true,
          hideSelectionBackground: true,
        },
        displayOn: [],
      }));

      const AudiencePost = RTE("audience-post", () => ({
        render: AudiencePostTag,
        elementType: ["block",  "void"],
        dnd: {
          disable: true,
          hideSelectionBackground: true,
        },
        displayOn: [],
      }));

      const AudienceWrapper = RTE("audience-wrapper", (rte) => ({

        render: (props) => {
          const savedSelection = rte.selection.get();
          return (<AudienceWrapperComponent
            {...props}
            rte={rte}
            audienceList={audiences}
            savedSelection={savedSelection}
            invalidConfig={invalidConfig} />)
        },
        elementType: ["block"],
        dnd: {
          disable: true,
          hideSelectionBackground: true,
        },
        displayOn: [],

      }));

      AudiencePlugin.on("exec", (rte) => {
        const savedSelection = rte.selection.get();
        console.log("rte", rte);

        cbModal({
          component: (props) => (
            <AudienceModal
              audiences={audiences}
              savedSelection={savedSelection}
              rte={rte}
              {...props}
              invalidConfig={invalidConfig}
            />
          ),

          modalProps: {
            shouldReturnFocusAfterClose: false,
            customClass: "variable-extension-modal",
          },
        });
      });


      AudiencePre.on("beforeRender", (rte) => {
        if (rte.element.type === "audience-pre") {
          rte.DisableDND = true;
          rte.DisableSelectionHalo = true;
        }
      });

      AudiencePost.on("beforeRender", (rte) => {
        if (rte.element.type === "audience-post") {
          rte.DisableDND = true;
          rte.DisableSelectionHalo = true;
        }
      });

      return {
        AudiencePlugin,
        AudienceWrapper,
        AudiencePre,
        AudiencePost,
      };
    } catch (err) {
      return [];
    }
  })
  .catch((err) => {
    console.log("err", err);
  });
