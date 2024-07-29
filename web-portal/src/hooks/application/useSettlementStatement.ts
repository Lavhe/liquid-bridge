import { useCallback } from "react";
import {
    serverTimestamp,
    updateDoc,
  } from "firebase/firestore";
import moment from "moment";
import Swal from "sweetalert2";
import { useFirebase } from "../../context/FirebaseContext";
import { SettlementStatementStatus } from "../../utils/utils";

export function useSettlementStatement(){
    const { currentUser, applicationDoc, addAuditTrail } =
    useFirebase();
    

  const requestSettlementStatement = useCallback(async (applicationId:string) => {
    const docRef = applicationDoc(applicationId);

    const change = {
        'settlementStatement': {
            'status': SettlementStatementStatus.REQUESTED
        }
    }

    await updateDoc(docRef, {
      lastUpdated: serverTimestamp(),
      ...change,
    });

    addAuditTrail("UPDATED_APPLICATION", {
      id: applicationId,
      [moment().format("DD/MM/YYYY HH:mm:ss")]: {
        change,
        user: {
          [currentUser?.email || "_"]: currentUser?.displayName,
        },
      },
    });

    Swal.fire({
      text: "Statement successfully requested!",
      icon: "success",
    });
  }, []);

    return {
        requestSettlementStatement
    }
}