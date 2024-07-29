import { PDFDocument } from "pdf-lib";
import * as path from "path";
import { readFile } from "fs/promises";

const cachedFiles: Record<string, Buffer> = {};
/**
 *  Reads a PDF file and fill it in with data
 *
 * @param {PDFType} type - The Pdf type to read
 * @param {Record<string,string>} data - The data to input into the pdf
 */
export async function fillInPdf(type: PDFType, data: Record<string, string>) {
  const formPath = path.join(__dirname, "pdfForms", type);
  const file = cachedFiles[formPath] || (await readFile(formPath));

  if (!cachedFiles[formPath]) {
    cachedFiles[formPath] = file;
  }

  const pdfDoc = await PDFDocument.load(file);
  const form = pdfDoc.getForm();
  const errors: any[] = [];

  const fields = form.getFields().map((field) => field.getName());
  console.log({ fields });

  Object.keys(data).forEach((element) => {
    try {
      const field = form.getTextField(element);
      field.setText(data[element]);
    } catch (err) {
      errors.push(err);
    }
  });

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}
export enum PDFType {
  NATURAL_PERSON_APPLICATION = "NATURAL_PERSON_APPLICATION.pdf",
  BRIDGING_FINANCE_QUOTE = "BRIDGING_FINANCE_QUOTE.pdf"
}
