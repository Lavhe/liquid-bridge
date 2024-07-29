import {
  readDocumentToTempFile,
  DocumentName
} from "../../config/readDocuments";
import { SettlementStatementStatus } from "../../utils/utils";
import { storage, firestore } from "firebase-admin";

/**
 * Event that gets called when a new settlement statement gets requested
 *
 * @param {any} application - The application
 */
export async function onSettlementStatementRequest(application: any) {
  try {
    const { filePath, done } = await readDocumentToTempFile(
      DocumentName.SETTLEMENT_STATEMENT,
      application
    );

    const [file] = await storage().bucket().upload(filePath, {
      public: true
    });

    done();

    firestore()
      .doc(`/applications/${application.id}`)
      .update({
        settlementStatement: {
          status: SettlementStatementStatus.SENT,
          url: file.publicUrl()
        }
      });
  } catch (err) {
    console.log("Error generating settlement statement", err);
  }
}
