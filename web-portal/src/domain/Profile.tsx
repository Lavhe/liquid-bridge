import { SideNav } from "../components/shared/SideNav";
import { PageTitle } from "../components/shared";
import { TopBar } from "../components/shared/TopBar";
import { MyProfileDetails } from "../components/profile/MyProfileDetails";
import { ProfileEntityDetails } from "../components/profile/ProfileEntityDetails";
import { useFirebase } from "../context/FirebaseContext";
import { useEffect } from "react";
import { TrustAccountsList } from "./agentTrustAccounts/components/TrustAccountsList";

enum ClassName {
  Page = "flex flex-1 min-h-screen",
}

export function Profile() {
  const { currentUser } = useFirebase();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
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
          <MyProfileDetails />
          {!isSuperAdmin && (
            <>
              <ProfileEntityDetails />
              {currentUser?.company.email && (
                <TrustAccountsList companyId={currentUser?.company.email} />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
