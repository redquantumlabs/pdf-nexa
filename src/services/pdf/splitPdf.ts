import { PDFDocument } from 'pdf-lib';
import { readPdfFileAsBase64, savePdfFile } from '../storage/fileManager';

/**
 * Splits a PDF by extracting specific page ranges (1-indexed).
 */
export const splitPdf = async (
  fileUri: string, 
  pageRanges: { start: number; end: number }[],
  outputFilename: string = 'SplitDocument.pdf'
): Promise<string> => {
  try {
    const base64Data = await readPdfFileAsBase64(fileUri);
    const originalPdf = await PDFDocument.load(base64Data);
    const totalPages = originalPdf.getPageCount();

    const newPdf = await PDFDocument.create();
    
    // Gather 0-indexed indices to extract
    const indicesToExtract: number[] = [];
    
    for (const range of pageRanges) {
      const start = Math.max(0, range.start - 1);
      const end = Math.min(totalPages - 1, range.end - 1);
      for (let i = start; i <= end; i++) {
        indicesToExtract.push(i);
      }
    }

    if (indicesToExtract.length === 0) {
      throw new Error('No valid pages selected for extraction.');
    }

    const copiedPages = await newPdf.copyPages(originalPdf, indicesToExtract);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const newPdfBase64 = await newPdf.saveAsBase64();
    const savedFilePath = await savePdfFile(newPdfBase64, outputFilename);
    return savedFilePath;

  } catch (error) {
    console.error('Split PDF Error:', error);
    throw new Error('Failed to split PDF.');
  }
};
