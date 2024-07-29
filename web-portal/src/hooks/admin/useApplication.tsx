import { getDoc, getDocs, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useFirebase } from "../../context/FirebaseContext";
import { RoutePath } from "../../utils/utils";
import { Heading } from "../../components/shared/Table";

const headings = {
  id: {
    label: "#",
    type: "ID",
    link: (value: string) =>
      `${RoutePath.NEW_APPLICATIONS}?applicationId=${value}`,
  },
  "company.name": { label: "Agent" },
  clientName: { label: "Client name" },
  date: { label: "Date", type: "DATE" },
  status: { label: "Status", default: "Draft" },
  viewPDF: { label: "View PDF", type: "VIEW_PDF" },
} as Heading;

export enum UserFilter {
  CLIENT_NAME = "CLIENT_NAME",
  FILE_NAME = "FILE_NAME",
  APPLICATION = "APPLICATION",
  NORMAL_USER = "NORMAL_USER",
  SUPER_USER = "SUPER_USER",
  APPROVER = "APPROVER",
}

export function useApplication() {
  const { applicationCollection, applicationDoc, addAuditTrail } =
    useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [application, setApplication] = useState<any>({});

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

      const applicationRef = query(applicationCollection());

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
  }, []);

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

  return {
    get,
    headings,
    data,
    error,
    isLoading,
    onSearch,
  };
}

export enum ApplicationTabs {
  MY_APPLICATION,
  DRAFT_APPLICATION,
  ENTITY_APPLICATION,
}
