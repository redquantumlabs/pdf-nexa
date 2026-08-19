import { PDFDocument, degrees } from 'pdf-lib';
import { readPdfFileAsBase64, savePdfFile } from '../storage/fileManager';

/**
 * Rotates specific pages in a PDF.
 * @param pageIndices 0-indexed array of pages to rotate
 * @param angle Degrees to rotate (90, 180, 270)
 */
export const rotatePages = async (
  fileUri: string,
  pageIndices: number[],
  angle: number,
  outputFilename: string = 'RotatedDocument.pdf'
): Promise<string> => {
  try {
    const base64Data = await readPdfFileAsBase64(fileUri);
    const pdfDoc = await PDFDocument.load(base64Data);
    
    const pages = pdfDoc.getPages();
    
    pageIndices.forEach(index => {
      if (index >= 0 && index < pages.length) {
        const page = pages[index];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      }
    });

    const newPdfBase64 = await pdfDoc.saveAsBase64();
    return await savePdfFile(newPdfBase64, outputFilename);
  } catch (error) {
    console.error('Rotate PDF Error:', error);
    throw new Error('Failed to rotate pages.');
  }
};
