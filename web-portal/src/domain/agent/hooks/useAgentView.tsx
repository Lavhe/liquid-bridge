import { getDoc, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Heading } from "../../../components/shared/Table";
import { useFirebase } from "../../../context/FirebaseContext";

const headings: Heading = {
  name: {
    label: "Agent",
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

export function useAgentView({ agentId }: UseAgentViewProps) {
  const { applicationCollection, userCollection, companyDoc, currentUser } =
    useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agent, setAgent] = useState<any>();

  const load = useCallback(async () => {
    try {
      if (!currentUser) {
        throw new Error("You have to be logged in");
      }
      setIsLoading(true);
      setError("");

      const companyRef = companyDoc(agentId);

      const company = await getDoc(companyRef);

      const applicationsRef = query(
        applicationCollection(),
        where("company.email", "==", company.id)
      );
      const usersRef = query(
        userCollection(),
        where("company", "==", companyRef)
      );

      const { size: numOfApplications } = await getDocs(applicationsRef);
      const { size: numOfUser } = await getDocs(usersRef);

      setAgent({
        ...company.data(),
        numOfUser,
        numOfApplications,
        id: company.id,
      });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError((err as any).message);
    }
  }, []);

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

  return {
    headings,
    agent,
    error,
    isLoading,
    onSearch,
  };
}
interface UseAgentViewProps {
  agentId: string;
}
