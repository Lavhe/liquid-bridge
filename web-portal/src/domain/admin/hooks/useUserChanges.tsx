import { createUserWithEmailAndPassword, updatePassword } from "firebase/auth";
import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import Swal from "sweetalert2";
import { useFirebase } from "../../../context/FirebaseContext";

export function useUserChanges() {
  const { auth, setCurrentUser, currentUser, companyDoc, addAuditTrail } =
    useFirebase();
  const [showAddNewUserDialog, setShowAddNewUserDialog] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleAddNewUserDialog = useCallback(() => {
    setShowAddNewUserDialog((s) => !s);
  }, []);

  const updateCompany = useCallback(async (form: any) => {
    try {
      if (!currentUser) {
        throw new Error("You have to be logged in to perform this action.");
      }
      const twoSecondsBefore = moment().subtract(2, "seconds");

      const change = Object.keys(form)
        .filter((k) => (currentUser.company as any)[k] !== form[k])
        .reduce((a, b) => {
          return {
            ...a,
            [b]: {
              [moment().format("HH:mm:ss")]: form[b],
              [twoSecondsBefore.format("HH:mm:ss")]: (currentUser as any)[b],
            },
          };
        }, {});

      if (Object.keys(change).length === 0) {
        return;
      }

      setIsLoading(true);
      setError("");
      console.log({ form });
      const companyRef = companyDoc(form.email!);

      await setDoc(companyRef, {
        ...form,
        updated: serverTimestamp(),
      });

      addAuditTrail("UPDATED_COMPANY", change);

      setIsLoading(false);
    } catch (err: any) {
      let error = err.message;
      setError(error);
      setIsLoading(false);
    }
  }, []);

  return {
    showAddNewUserDialog,
    toggleAddNewUserDialog,
    updateCompany,
    isLoading,
    error,
  };
}
