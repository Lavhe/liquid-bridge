import {
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Heading } from "../../../components/shared/Table";
import { useFirebase } from "../../../context/FirebaseContext";
import { RoutePath } from "../../../utils/utils";

const headings: Heading = {
  name: {
    label: "Agent",
    type: "ID",
    route: RoutePath.AGENT,
  },
  id: { label: "Email address" },
  numOfApplications: { label: "No. of applications" },
  numOfUsers: { label: "No. of users" },
  numOfTrustAccounts: { label: "No. of trust accounts" },
  date: { label: "Created Date", type: "DATE" },
};

export enum AgentFilter {
  CLIENT_NAME = "CLIENT_NAME",
  FILE_NAME = "FILE_NAME",
  APPLICATION = "APPLICATION",
  NORMAL_USER = "NORMAL_USER",
  SUPER_USER = "SUPER_USER",
  APPROVER = "APPROVER",
}

export function useAgentList() {
  const {
    applicationCollection,
    userCollection,
    companyDoc,
    currentUser,
    userDoc,
    addAuditTrail,
    companyCollection,
  } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any[]>([]);

  const load = useCallback(async () => {
    try {
      if (!currentUser) {
        throw new Error("You have to be logged in");
      }
      setIsLoading(true);
      setError("");

      const companyRef = query(companyCollection());

      const querySnapshot = await getDocs(companyRef);
      const allData: any[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const applicationsRef = query(
          applicationCollection(),
          where("company.email", "==", doc.id)
        );
        const usersRef = query(
          userCollection(),
          where("company", "==", doc.ref)
        );
        const { size: numOfApplications } = await getDocs(applicationsRef);
        const { size: numOfUsers } = await getDocs(usersRef);

        allData.push({
          ...data,
          id: doc.id,
          numOfApplications: numOfApplications || 0,
          numOfUsers: numOfUsers || 0,
          numOfTrustAccounts: data.trustAccounts?.length || 0,
        });
      }

      console.log({ allData, querySnapshot: querySnapshot.docs });

      setData(allData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError((err as any).message);
    }
  }, []);

  const update = useCallback(
    async (form: any) => {
      try {
        const twoSecondsBefore = moment().subtract(2, "seconds");
        const currentData = data.find((d) => d.id === form.id) || {};

        const change = Object.keys(form)
          .filter((k) => (currentData as any)[k] !== form[k])
          .reduce((a, b) => {
            return {
              ...a,
              [b]: {
                [moment().format("HH:mm:ss")]: form[b],
                [twoSecondsBefore.format("HH:mm:ss")]: (currentData as any)[b],
              },
            };
          }, {});
        console.log({ currentData, change });

        if (Object.keys(change).length === 0) {
          return;
        }

        setIsLoading(true);
        setError("");
        const userRef = userDoc(form.id!);

        const userObj = {
          ...form,
          updated: serverTimestamp(),
        };

        await updateDoc(userRef, userObj);

        addAuditTrail("UPDATED_PROFILE", change);

        setData((prev) => {
          return prev.map((data) => {
            if (data.id === form.id) {
              return {
                ...data,
                ...form,
              };
            }

            return data;
          });
        });
        setIsLoading(false);
      } catch (err: any) {
        let error = err.message;
        setError(error);
        setIsLoading(false);
      }
    },
    [data]
  );

  const onSearch = useCallback(
    ({ filter, search }: { filter?: AgentFilter; search: string }) => {
      console.log("SEARCHING.....", { filter, search });
      load();
    },
    [load]
  );

  useEffect(() => {
    load();
  }, [load]);

  return { headings, data, error, isLoading, onSearch, update };
}
