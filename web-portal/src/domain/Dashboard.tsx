import { QuoteGenerator } from "../components/dashboard/QuoteGenerator";
import { SideNav } from "../components/shared/SideNav";
import { PageTitle } from "../components/shared";
import { TopBar } from "../components/shared/TopBar";
import { EntityTransactions } from "../components/dashboard/EntityTransactions";
import { MyTransactions } from "../components/dashboard/MyTransactions";
import { useFirebase } from "../context/FirebaseContext";
import { DashboardApplications } from "../components/admin/DashboardApplications";
import { UserChanges } from "./admin/tables/UserChanges";
import { TransactionHistory } from "./admin/tables/TransactionHistory";
import { EditQuoteGenerator } from "./admin/forms/EditQuoteGenerator";
import { useEffect } from "react";

enum ClassName {
  Page = "flex flex-1",
}

export function Dashboard() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <TopBar />
      <section className={ClassName.Page}>
        <SideNav />
        <div className="w-full p-8 flex flex-col place-items-center">
          <PageTitle />
          <Content />
        </div>
      </section>
    </>
  );
}
function Content() {
  const { currentUser } = useFirebase();
  if (currentUser?.role === "SUPER_ADMIN") {
    return (
      <section className="flex flex-col gap-4">
        <div className="flex w-full">
          <div className="flex flex-col flex-grow w-full gap-4">
            <DashboardApplications />
          </div>
          <div className="flex-shrink">
            <EditQuoteGenerator />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <TransactionHistory />
          </div>
          <div className="flex-1">
            <UserChanges />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full gap-4">
        <EntityTransactions />
        <MyTransactions />
      </div>
      <div className="flex-initial">
        <QuoteGenerator />
      </div>
    </div>
  );
}
