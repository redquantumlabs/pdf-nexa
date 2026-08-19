import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';

/**
 * Reads a PDF file from a given URI and returns it as a base64 string.
 * This is necessary because pdf-lib accepts base64 or Uint8Array.
 */
export const readPdfFileAsBase64 = async (uri: string): Promise<string> => {
  try {
    // Read the file natively (react-native-blob-util supports content:// URIs directly)
    const base64Str = await ReactNativeBlobUtil.fs.readFile(uri, 'base64');
    return base64Str;
  } catch (error) {
    console.error('Error reading PDF file:', error);
    throw new Error('Failed to read PDF file from device.');
  }
};

/**
 * Saves a base64 string as a PDF file in the Document directory.
 */
export const savePdfFile = async (base64Data: string, filename: string): Promise<string> => {
  try {
    const dirs = ReactNativeBlobUtil.fs.dirs;
    const saveDir = Platform.OS === 'android' ? dirs.DownloadDir : dirs.DocumentDir;
    
    // Ensure filename ends with .pdf
    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    
    // Prevent overwriting by appending timestamp if we want, or just let it save
    const filePath = `${saveDir}/${Date.now()}_${cleanFilename}`;

    await ReactNativeBlobUtil.fs.writeFile(filePath, base64Data, 'base64');
    
    // For Android 10+ (Q), we should trigger media scanner to make it visible in Downloads
    if (Platform.OS === 'android') {
      await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
        {
          name: cleanFilename,
          parentFolder: '',
          mimeType: 'application/pdf',
        },
        'Download',
        filePath
      );
    }
    
    return filePath;
  } catch (error) {
    console.error('Error saving PDF file:', error);
    throw new Error('Failed to save generated PDF file.');
  }
};
