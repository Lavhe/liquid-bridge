import { SideNav } from "../../../components/shared/SideNav";
import { Loader, PageTitle } from "../../../components/shared";
import { TopBar } from "../../../components/shared/TopBar";
import { AgentList } from "../components/AgentList";
import { Icon } from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { useEffect, useState } from "react";
import { AddNewAgentDialog } from "../components/AddNewAgentDialog";

enum ClassName {
  Page = "flex flex-1 min-h-screen",
}

export function AgentsPage() {
  const [showAddNewAgentDialog, setShowAddNewAgentDialog] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (showAddNewAgentDialog) {
    return (
      <AddNewAgentDialog
        onHide={() => setShowAddNewAgentDialog(false)}
        onSubmit={() => setShowAddNewAgentDialog(false)}
      />
    );
  }

  return (
    <>
      <TopBar />
      <section className={ClassName.Page}>
        <SideNav />
        <div className="w-full p-14 flex flex-col">
          <PageTitle
            rightContent={
              <button
                onClick={() => setShowAddNewAgentDialog(true)}
                className="rounded-full bg-gray-100 px-2 flex place-items-center hover:bg-gray-400"
              >
                <Icon
                  size={1}
                  path={mdiPlus}
                  className="bg-gray-200 rounded-full p-1"
                />
                <span className="text-xs px-3">Add an agent</span>
              </button>
            }
          />
          <AgentList />
        </div>
      </section>
    </>
  );
}
