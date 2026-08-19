// Shared application types

export interface PdfFile {
  id: string;
  uri: string;
  name: string;
  size: number;
  lastModified?: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  PdfReader: { file: PdfFile };
  MergePdf: undefined;
  SplitPdf: undefined;
  RotatePages: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Files: undefined;
  Tools: undefined;
  Settings: undefined;
};
