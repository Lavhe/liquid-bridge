import { SideNav } from "../components/shared/SideNav";
import { Loader, PageTitle } from "../components/shared";
import { TopBar } from "../components/shared/TopBar";
import { Icon } from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { useRegisterUser } from "../hooks/users/useRegisterUser";
import { AddNewUserDialog } from "../components/users/AddNewUserDialog";
import { UserList } from "../components/users/UserList";
import { useEffect } from "react";

enum ClassName {
  Page = "flex flex-1 min-h-screen",
}

export function Users() {
  const {
    toggleAddNewUserDialog,
    showAddNewUserDialog,
    addNewUser,
    isLoading,
    error,
  } = useRegisterUser();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (showAddNewUserDialog) {
    return (
      <AddNewUserDialog
        error={error}
        onHide={toggleAddNewUserDialog}
        onSubmit={addNewUser}
      />
    );
  }

  return (
    <>
      <TopBar />
      <section className={ClassName.Page}>
        <SideNav />
        <div className="w-full p-8 flex flex-col">
          <PageTitle
            rightContent={
              <button
                onClick={toggleAddNewUserDialog}
                className="rounded-full bg-gray-100 px-2 flex place-items-center hover:bg-gray-400"
              >
                <Icon
                  size={1}
                  path={mdiPlus}
                  className="bg-gray-200 rounded-full p-1"
                />
                <span className="text-xs px-3">Add a user</span>
              </button>
            }
          />
          <UserList />
        </div>
      </section>
    </>
  );
}
