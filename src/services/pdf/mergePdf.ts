import { PDFDocument } from 'pdf-lib';
import { readPdfFileAsBase64, savePdfFile } from '../storage/fileManager';

export const mergePdfs = async (fileUris: string[], outputFilename: string = 'MergedDocument.pdf'): Promise<string> => {
  if (!fileUris || fileUris.length < 2) {
    throw new Error('Please select at least two PDF files to merge.');
  }

  try {
    const mergedPdf = await PDFDocument.create();

    for (const uri of fileUris) {
      // 1. Read file
      const base64Data = await readPdfFileAsBase64(uri);
      
      // 2. Load into pdf-lib
      const pdf = await PDFDocument.load(base64Data);
      
      // 3. Copy all pages
      const pageIndices = pdf.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
      
      // 4. Add pages to new document
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // 5. Serialize
    const mergedBase64 = await mergedPdf.saveAsBase64();

    // 6. Save back to disk
    const savedFilePath = await savePdfFile(mergedBase64, outputFilename);
    return savedFilePath;

  } catch (error) {
    console.error('Merge PDF Error:', error);
    throw new Error('Failed to merge PDF files. Please ensure the files are valid.');
  }
};
