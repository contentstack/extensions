import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { Button, Tags, cbModal } from "@contentstack/venus-components";

import { fieldExtractor } from "../common/utils";
import { AudienceList } from "../common/types";

import { AddAudienceModal } from "./AddAudienceModal";

export const CustomField: React.FC = () => {
  const [appSdk, setAppSdk] = useState<any>(null);
  const [audienceList, setAudienceList] = useState<AudienceList[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);

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
                uid: "",
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

    setSelectedAudiences(
      initialData?.map((initialAudience: any) => initialAudience.value) || []
    );
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

  const handleAudienceChange = async (selectedTags: string[]) => {
    setSelectedAudiences(selectedTags);

    try {
      if (appSdk?.location?.CustomField?.field) {
        // Match selectedTags with audienceList children values and extract label, value, and uid
        const formattedData = selectedTags
          .map((tagLabel: string) => {
            const matchedAudience = audienceList.find((audience) =>
              audience.children.some((child) => child.value === tagLabel)
            );
            if (matchedAudience) {
              // Find the matched child
              const matchedChild = matchedAudience.children.find(
                (child) => child.value === tagLabel
              );
              if (matchedChild) {
                return {
                  label: matchedChild.label,
                  value: matchedChild.value,
                  uid: matchedChild.uid,
                };
              }
            }
            return null;
          })
          .filter((tag) => tag !== null); // Remove any null values (tags without a match)
        await appSdk.location.CustomField.field.setData({
          value: formattedData,
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
