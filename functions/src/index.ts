import { firestore } from "firebase-functions";
import * as admin from "firebase-admin";
import {
  onNewApplication,
  onDeclineApplication,
  onApproveApplication,
  onFinancedApplication
} from "./lib/application";
import { onNewUser } from "./lib/user/onNewUser";
import { ApplicationState, SettlementStatementStatus } from "./utils/utils";
import { onSettlementStatementRequest } from "./lib/settlementStatement/onSettlementStatementRequest";
import { onNewQuote } from "./lib/quote/onNewQuote";

admin.initializeApp();

// A firebase function that runs when a document gets created on firestore
export const newApplication = firestore
  .document("/applications/{documentId}")
  .onCreate(async (snapshot, context) => {
    const data = { id: snapshot.id, ...snapshot.data() } as any;

    if (data.state === ApplicationState.SUBMITTED) {
      onNewApplication(data);
    }
  });

// A firebase function that runs when a document gets created on firestore
export const newUser = firestore
  .document("/users/{documentId}")
  .onCreate(async (snapshot, context) => {
    const data = { id: snapshot.id, ...snapshot.data() } as any;

    onNewUser(data);
  });

// A firebase function that runs when a document gets updated on firestore
export const updatedApplication = firestore
  .document("/applications/{documentId}")
  .onUpdate(async (snapshot, context) => {
    const snapshotBefore = {
      id: snapshot.before.id,
      ...snapshot.before.data()
    } as any;

    const snapshotAfter = {
      id: snapshot.after.id,
      ...snapshot.after.data()
    } as any;

    const conditions = {
      [ApplicationState.DRAFT + ApplicationState.SUBMITTED]: onNewApplication,
      [ApplicationState.SUBMITTED + ApplicationState.APPROVED]:
        onApproveApplication,
      [ApplicationState.SUBMITTED + ApplicationState.DECLINED]:
        onDeclineApplication,
      [ApplicationState.APPROVED + ApplicationState.FINANCED]:
        onFinancedApplication
    };

    const action = conditions[snapshotBefore.state + snapshotAfter.state];

    if (action) {
      await action(snapshotAfter);
    }

    return null;
  });

// A firebase function that runs when a document gets updated on firestore
export const handleSettlementStatementChange = firestore
  .document("/applications/{documentId}")
  .onUpdate(async (snapshot, context) => {
    const snapshotBefore = {
      id: snapshot.before.id,
      ...snapshot.before.data()
    } as any;

    const snapshotAfter = {
      id: snapshot.after.id,
      ...snapshot.after.data()
    } as any;

    const conditions = {
      [undefined + SettlementStatementStatus.REQUESTED]:
        onSettlementStatementRequest
    };

    const action =
      conditions[
        snapshotBefore.settlementStatement?.status +
          snapshotAfter.settlementStatement?.status
      ];

    if (action) {
      await action(snapshotAfter);
    }

    return null;
  });

// A firebase function that runs when a document gets created on firestore
export const newQuote = firestore
  .document("/quotes/{documentId}")
  .onCreate(async (snapshot, context) => {
    const data = { id: snapshot.id, ...snapshot.data() } as any;

    if (data.source === "QUOTE_GENERATOR") {
      onNewQuote(data);
    }
  });
