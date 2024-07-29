import {
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useFirebase } from "../../context/FirebaseContext";
import Swal from "sweetalert2";
import moment from "moment";
import { ApplicationState, RoutePath } from "../../utils/utils";
import { Heading } from "../../components/shared/Table";
import { useGenerateQuote } from "../dashboard/hooks/useGenerateQuote";

const normalHeadings: Heading = {
  id: {
    label: "#",
    type: "ID",
    link: (value: string) =>
      `${RoutePath.NEW_APPLICATIONS}?applicationId=${value}`,
  },
  clientName: { label: "Client name" },
  date: { label: "Posted Date", type: "DATE" },
  fundsTransmitted: {
    label: "Funds transmitted?",
    type: "SINGLE_SELECT",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
    disabled: (value: string) => true,
  },
  status: {
    label: "Status",
    type: "SINGLE_SELECT",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "PENDING", label: "Pending" },
      { value: "CONCLUDED", label: "Concluded" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    disabled: (value: string) => true,
  },
  state: {
    label: "State",
  },
  viewPDF: {
    label: "Settlement statement",
    type: "SETTLEMENT_DOC_WITH_REQUEST_OPTION",
  },
};

const adminHeadings: Heading = {
  id: {
    label: "#",
    type: "ID",
    link: (value: string) =>
      `${RoutePath.NEW_APPLICATIONS}?applicationId=${value}`,
  },
  "company.name": { label: "Agent" },
  clientName: { label: "Client name" },
  date: { label: "Posted Date", type: "DATE" },
  fundsTransmitted: {
    label: "Funds transmitted?",
    type: "SINGLE_SELECT",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  status: {
    label: "Status",
    type: "SINGLE_SELECT",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "PENDING", label: "Pending" },
      { value: "CONCLUDED", label: "Concluded" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
  },
  state: {
    label: "State",
  },
} as Heading;

export enum UserFilter {
  CLIENT_NAME = "CLIENT_NAME",
  FILE_NAME = "FILE_NAME",
  APPLICATION = "APPLICATION",
  NORMAL_USER = "NORMAL_USER",
  SUPER_USER = "SUPER_USER",
  APPROVER = "APPROVER",
}

export function useApplication(props: UseApplicationProps) {
  const { currentUser, applicationCollection, applicationDoc, addAuditTrail } =
    useFirebase();
  const { generateQuote, saveQuote } = useGenerateQuote();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [application, setApplication] = useState<any>({});

  const addOrUpdate = useCallback(async (formData: any) => {
    try {
      setIsLoading(true);
      const quote = await generateQuote({
        erf: formData.erf || application.erf,
        portion: formData.portion || application.portion,
        stand: formData.stand || application.stand,
        extension: formData.extension || application.extension,
        initialAmountRequired:
          formData.purchaserPrice || application.purchaserPrice,
        estimatedSettlementDate:
          formData.expectedDateOfLodgement ||
          application.expectedDateOfLodgement,
        applicationId: formData.id || application.id,
        clientName: formData.clientName || application.clientName,
        approver: formData.approver || application.approver,
        source: "APPLICATION",
      });

      const fields = JSON.parse(
        JSON.stringify({
          ...formData,
          quote,
        })
      );

      await saveQuote(quote);

      if (fields?.id) {
        await update(fields);

        return fields.id;
      }

      const docRefs = query(
        applicationCollection(),
        where("company.email", "==", currentUser?.company.email)
      );
      const { size } = await getDocs(docRefs);

      const docId = `${currentUser?.company.name.substring(0, 3)}${size + 1}`;

      const docRef = applicationDoc(docId);
      const doc = {
        ...fields,
        date: serverTimestamp(),
        company: currentUser?.company,
        clientEmail: currentUser?.email,
      };

      await setDoc(docRef, doc, {
        merge: true,
      });

      addAuditTrail("CREATED_NEW_APPLICATION", {
        [docId]: {
          date: moment().format("DD/MM/YYYY HH:mm:ss"),
        },
      });

      Swal.fire({
        text: "Changes saved successfully",
        icon: "success",
      });
      setIsLoading(false);

      return docId;
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        title: "Unable to save changes",
        text: (err as any).message,
        timer: 9000,
        icon: "error",
      });

      return null;
    }
  }, []);

  const update = useCallback(async ({ id, ...fields }: any) => {
    setIsLoading(true);
    const docRef = applicationDoc(id);

    const change = Object.keys(fields)
      .filter((k) => (application as any)[k] !== fields[k])
      .reduce((a, b) => {
        return {
          ...a,
          [b]: fields[b],
        };
      }, {});

    await updateDoc(docRef, {
      lastUpdated: serverTimestamp(),
      ...fields,
    });

    addAuditTrail("UPDATED_APPLICATION", {
      id,
      [moment().format("DD/MM/YYYY HH:mm:ss")]: {
        change,
        user: {
          [currentUser?.email || "_"]: currentUser?.displayName,
        },
      },
    });

    await get(id);
    await load();

    Swal.fire({
      text: "Changes saved successfully",
      icon: "success",
    });
    setIsLoading(false);
  }, []);

  const get = useCallback(async (applicationId: string) => {
    try {
      setIsLoading(true);
      setError("");

      const docRef = applicationDoc(applicationId);
      const doc = await getDoc(docRef);

      setIsLoading(false);
      const dbDoc = {
        ...doc.data(),
        id: doc.id,
      };

      setApplication(dbDoc);
      return dbDoc;
    } catch (err) {
      setIsLoading(false);
      setError((err as any).message);
      throw err;
    }
  }, []);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const queries = [];
      switch (props?.tab) {
        case ApplicationTabs.ADMIN_DRAFT_APPLICATION:
          queries.push(where("state", "==", ApplicationState.DRAFT));
          break;
        case ApplicationTabs.DRAFT_APPLICATION:
          queries.push(where("state", "==", ApplicationState.DRAFT));
          break;
        case ApplicationTabs.MY_APPLICATION:
          queries.push(where("clientEmail", "==", currentUser?.email));
          break;
        case ApplicationTabs.ENTITY_APPLICATION:
          queries.push(where("state", "!=", ApplicationState.DRAFT));
          break;
      }

      const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
      if (!isSuperAdmin) {
        queries.push(where("company.email", "==", currentUser?.company.email));
      }

      const applicationRef = query(applicationCollection(), ...queries);

      const querySnapshot = await getDocs(applicationRef);
      const allData: any[] = [];
      querySnapshot.forEach((doc) => {
        allData.push({ id: doc.id, ...doc.data() });
      });

      setData([...allData]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError((err as any).message);
    }
  }, [props?.tab]);

  const onSearch = useCallback(
    ({ filter, search }: { filter?: any; search: string }) => {
      console.log("SEARCHING.....", { filter, search });
      load();
    },
    [load]
  );

  useEffect(() => {
    load();
  }, [load]);

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  return {
    addOrUpdate,
    get,
    headings: isSuperAdmin ? adminHeadings : normalHeadings,
    data,
    error,
    isLoading,
    onSearch,
    update,
  };
}

export enum ApplicationTabs {
  ADMIN_ALL_APPLICATION,
  ADMIN_DRAFT_APPLICATION,
  MY_APPLICATION,
  DRAFT_APPLICATION,
  ENTITY_APPLICATION,
}

export interface UseApplicationProps {
  tab?: ApplicationTabs;
}
