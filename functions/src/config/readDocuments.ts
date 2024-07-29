import * as path from "path";
import { readFile, writeFile, rm } from "fs/promises";
import { render } from "mustache";
import * as moment from "moment";
const cachedFiles: Record<string, any> = {};

/**
 * Reads content from the documents folder
 *
 * @param {DocumentName} fileName - The name of the document to read
 * @param {Record<string, string>} payload - The data to pass into the document
 */
export async function readDocument(
  fileName: typeof DocumentName[keyof typeof DocumentName]
) {
  const filePath = path.join(__dirname, "documents", fileName);
  const content = cachedFiles[filePath] || (await readFile(filePath));
  cachedFiles[filePath] = content;

  return content;
}
/**
 * Reads content from the documents folder
 *
 * @param {DocumentName} fileName - The name of the document to read
 * @param {Record<string, string>} payload - The data to pass into the document
 */
export async function readDocumentToTempFile(
  fileName: typeof DocumentName[keyof typeof DocumentName],
  payload: Record<string, string>
) {
  const filePath = path.join(__dirname, "documents", fileName);
  const content =
    cachedFiles[filePath] || (await readFile(filePath)).toString();
  cachedFiles[filePath] = content;

  const completeDocument = render(content, payload);

  const tempFile = path.join("/", "tmp", `${moment().toISOString()}-fileName`);

  await writeFile(tempFile, completeDocument);
  return {
    filePath: tempFile,
    done: () => {
      rm(tempFile);
    }
  };
}
export const DocumentName = {
  FINANCE_TERMS_AND_CONDITIONS: "FINANCE_TERMS_AND_CONDITIONS.pdf",
  SETTLEMENT_STATEMENT: "SETTLEMENT_STATEMENT.html"
} as const;
