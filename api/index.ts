import { PDFDocument } from "pdf-lib";
import * as path from "path";
import { readFile } from "fs/promises";
const fs = require("fs");
const util = require("util");

const data = {
  "Full names": "John Doe",
  Surname: "SIrwali",
};

async function createPdf(input: string, output: string) {
  const readFile = util.promisify(fs.readFile);
  function getStuff() {
    return readFile(input);
  }
  const file = await getStuff();
  const pdfDoc = await PDFDocument.load(file);
  const form = pdfDoc.getForm();

  Object.keys(data).forEach((element) => {
    const key = element as keyof typeof data;
    const field = form.getTextField(key);
    field.setText(data[key]);
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFile(output, pdfBytes, () => {
    console.log("PDF created!");
  });
}
// createPdf("form.pdf", "output.pdf")

const cachedFiles: Record<string, Buffer> = {};

async function createFile(pdfFileName:string) {
  const formPath = path.join(__dirname, "form.pdf");
  const file = cachedFiles[formPath] || (await readFile(formPath));

  if (!cachedFiles[formPath]) {
    cachedFiles[formPath] = file;
  }

  const pdfDoc = await PDFDocument.load(file);
  const form = pdfDoc.getForm();

  Object.keys(data).forEach((element) => {
    const key = element as keyof typeof data;
    const field = form.getTextField(key);
    field.setText(data[key]);
  });
  const pdfBytes = await pdfDoc.save();
  fs.writeFile("output.pdf", pdfBytes, () => {
    console.log("PDF created!");
  });
}

createFile();
