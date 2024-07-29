import { Icon } from "@mdi/react";
import classnames from "classnames";
import { useFirebase } from "../../context/FirebaseContext";
import { useSideNav } from "../../hooks/dashboard/useSideNav";
import { mdiAccountCircleOutline } from "@mdi/js";

enum ClassName {
  Row = "grid place-items-center px-10",
  Form = "py-6",
  InputRow = "flex flex-col text-left py-2",
  InputLabel = "text-lg py-2",
  InputField = "border py-2 px-4 text-sm border-gray-400 rounded-lg",
  ForgotPassword = "text-primary italic",
  RememberMeRow = "flex text-left py-6",
  RememberMeLabel = "px-2",
  RememberMeColumn = "flex-1",
  SubmitButton = "bg-primary font-semibold my-4 py-4 w-full rounded-full text-white",
  Error = "text-danger",
}

export function SideNav() {
  const { currentUser } = useFirebase();

  if (!currentUser) return null;

  const navClassName = classnames(ClassName.Row, {
    "bg-gray-700 bg-opacity-50": currentUser?.role === "SUPER_ADMIN",
    "bg-light-gray": !currentUser?.role || currentUser.role === "NORMAL",
  });
  const smallTextClassName = classnames("text-sm", {
    "text-white": currentUser?.role === "SUPER_ADMIN",
    "text-secondary": !currentUser?.role || currentUser.role === "NORMAL",
  });

  return (
    <div className={navClassName}>
      <div className="text-center h-full w-48">
        {currentUser?.role === "SUPER_ADMIN" && (
          <p className="text-2xl font-bold pt-10 text-white">Super admin</p>
        )}
        {currentUser.profilePic ? (
          <img
            src={currentUser.profilePic}
            className="text-center mx-auto my-10 text-gray-500 rounded-full bg-white p-px h-28 w-28"
          />
        ) : (
          <Icon
            path={mdiAccountCircleOutline}
            size={5}
            className="text-center mx-auto my-10 text-gray-500 rounded-full bg-white p-px"
          />
        )}
        <div className="flex flex-col pb-10">
          <span className="font-bold text-md text-secondary">
            {currentUser.displayName}
          </span>
          <span className={smallTextClassName}>{currentUser.email}</span>
          <span className={smallTextClassName}>{currentUser.company.name}</span>
        </div>
        <div className="h-0.5 px-4 bg-secondary w-full"></div>
        <SideNavButtons />
      </div>
    </div>
  );
}

function SideNavButtons() {
  const { buttons, handleNavigate, isCurrentRoute } = useSideNav();
  const { logout, currentUser } = useFirebase();

  const selectedClassname = classnames(
    "text-white w-full rounded-md my-1 py-3 font-bold",
    {
      "bg-gray-800": currentUser?.role === "SUPER_ADMIN",
      "bg-primary": !currentUser?.role || currentUser.role === "NORMAL",
    }
  );
  const unselectedClassname = classnames(
    "bg-opacity-20 bg-secondary text-white w-full rounded-md my-1 py-3",
    {
      "bg-opacity-10": currentUser?.role === "SUPER_ADMIN",
    }
  );

  const logoutClassName = classnames(
    "border-2 w-full rounded-md my-1 py-3 font-bold",
    {
      "border-white bg-transparent text-white":
        currentUser?.role === "SUPER_ADMIN",
      "border-primary text-primary":
        !currentUser?.role || currentUser.role === "NORMAL",
    }
  );

  return (
    <nav className="grid place-items-center py-10">
      {buttons.map((btn, i) => (
        <button
          key={btn.link}
          onClick={(e) => handleNavigate(btn.link)}
          className={
            isCurrentRoute(btn.link) ? selectedClassname : unselectedClassname
          }
        >
          {btn.text}
        </button>
      ))}
      <button className={logoutClassName} onClick={(e) => logout()}>
        Log out
      </button>
    </nav>
  );
}
