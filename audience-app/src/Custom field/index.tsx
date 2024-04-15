import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { Button, Tags, cbModal } from "@contentstack/venus-components";

import { fieldExtractor } from "../common/utils";
import { AudienceList } from "../common/types";

import { AddAudienceModal } from "./AddAudienceModal";

export const CustomField: React.FC = () => {
  const [appSdk, setAppSdk] = useState<any>(null);
  const [audienceList, setAudienceList] = useState<AudienceList[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<AudienceList[]>(
    []
  );

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const sdk = await ContentstackAppSDK.init();
        setAppSdk(sdk);
        const appConfig = await sdk.getConfig();
        const query = await sdk.stack
          .ContentType(appConfig.content_type)
          .Entry.Query()
          .find();
        const entries = query.entries || [];

        const audiences: AudienceList[] = entries.map((entry: any) => {
          const audience: AudienceList = {
            label: entry.title,
            value: entry.title,
            children: [
              {
                label: "",
                value: "",
              },
            ],
          };
          const field = appConfig.field ? entry[appConfig.field] : entry.group;
          if (!entry.hasOwnProperty(appConfig.field || "group")) {
            throw new Error("Invalid group title");
          }
          audience.children = fieldExtractor(field, appConfig.group_title);
          return audience;
        });
        setAudienceList(audiences);
      } catch (error) {
        console.error("Error initializing the SDK:", error);
      }
    };
    initializeSDK();
  }, []);

  useEffect(() => {
    const initialData =
      appSdk?.location?.CustomField?.field?.getData()?.value || [];
    setSelectedAudiences(initialData);
  }, [appSdk]);

  const openModal = () =>
    cbModal({
      component: (props: any) => (
        <AddAudienceModal
          audiences={audienceList}
          selectedAudiences={selectedAudiences}
          setSelectedAudiences={setSelectedAudiences}
          {...props}
        />
      ),
      modalProps: {
        shouldReturnFocusAfterClose: false,
        customClass: "variable-extension-modal",
      },
    });

  const handleAudienceChange = async (selectedTags: AudienceList[]) => {
    setSelectedAudiences(selectedTags);

    try {
      if (appSdk?.location?.CustomField?.field) {
        await appSdk.location.CustomField.field.setData({
          value: selectedTags,
        });
      } else {
        console.error("Something went wrong while saving data.");
      }
    } catch (error) {
      console.error("Error occurred while saving data:", error);
    }
  };

  return (
    <div>
      <Button onClick={openModal}>Add Audiences</Button>
      {selectedAudiences.length !== 0 && (
        <Tags
          tags={selectedAudiences}
          version="v2"
          onChange={handleAudienceChange}
        />
      )}
    </div>
  );
};
