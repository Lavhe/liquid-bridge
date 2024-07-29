import { SideNav } from "../components/shared/SideNav";
import { PageTitle } from "../components/shared";
import { useFirebase } from "../context/FirebaseContext";
import { TopBar } from "../components/shared/TopBar";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { ApplicationList } from "../components/application/ApplicationList";
import { ApplicationTabs } from "../hooks/application/useApplication";
import { useLocation } from "react-router-dom";
import { AddNewApplication } from "../components/application/AddNewApplication";
import { RoutePath } from "../utils/utils";

enum ClassName {
  Page = "flex flex-1",
}

export function Applications() {
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
        <div className="w-full p-8 flex flex-col">
          <PageTitle />
          <Application />
        </div>
      </section>
    </>
  );
}

function Application() {
  const { currentUser } = useFirebase();
  const { pathname } = useLocation();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const [selectedTab, setSelectedTab] = useState(
    isSuperAdmin
      ? ApplicationTabs.ADMIN_ALL_APPLICATION
      : ApplicationTabs.MY_APPLICATION
  );
  const [normalTabs] = useState([
    {
      label: "My Applications",
      value: ApplicationTabs.MY_APPLICATION,
    },
    {
      label: "Draft Applications",
      value: ApplicationTabs.DRAFT_APPLICATION,
    },
    {
      label: "Agent Applications",
      value: ApplicationTabs.ENTITY_APPLICATION,
    },
  ]);
  const [adminTabs] = useState([
    {
      label: "All Applications",
      value: ApplicationTabs.ADMIN_ALL_APPLICATION,
    },
    {
      label: "Draft Applications",
      value: ApplicationTabs.ADMIN_DRAFT_APPLICATION,
    },
  ]);

  const className = classnames(
    "flex-1 bg-opacity-40 rounded-t-lg place-items-center grid text-2xl text-white cursor-pointer",
    {
      "bg-primary": !isSuperAdmin,
      "bg-secondary": isSuperAdmin,
    }
  );
  const selectedClassName = "py-4 -mt-2 bg-opacity-100";

  const tabClassName = classnames("flex gap-1 border-b-4", {
    "border-primary": !isSuperAdmin,
    "border-secondary": isSuperAdmin,
  });

  if (pathname.toLowerCase() === RoutePath.NEW_APPLICATIONS) {
    return <AddNewApplication />;
  }

  const tabs = isSuperAdmin ? adminTabs : normalTabs;

  return (
    <>
      <div className={tabClassName}>
        {tabs.map((tab) => (
          <div
            onClick={() => setSelectedTab(tab.value)}
            className={`${className} ${
              tab.value === selectedTab && selectedClassName
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <ApplicationList tab={selectedTab} />
    </>
  );
}
