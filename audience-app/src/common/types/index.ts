import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

export interface TypePopupWindowDetails {
  url: string;
  title: string;
  w: number;
  h: number;
}

export interface TypeAppSdkConfigState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

export interface TypeSDKData {
  config: any;
  appSdkInitialized: boolean;
}

export interface TypeEntryData {
  url: string; // This is just example. You can remove this field or add any fields as per your requirement from the Entry data of CMS
}

export interface AudienceList {
  label: string;
  value: string;
  children: {
    label: string;
    value: string;
  }[];
}
