import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Blocked } from "../components/login/Blocked";
import { useEnsureNotBlocked } from "../hooks/users/useEnsureNotBlocked";
import { UserRoles } from "../utils/types";
import { RoutePath } from "../utils/utils";
import { useFirebase } from "./FirebaseContext";

export function RequiresAuthProvider(props: RequiresAuthProviderProps) {
  const { allowedRoles } = props;
  const { currentUser } = useFirebase();
  const { blocked } = useEnsureNotBlocked();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return navigate(RoutePath.LOGIN);
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return navigate(RoutePath.LOGIN);
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  if (blocked) {
    return <Blocked reason={blocked.reason} by={blocked.by} />;
  }

  return props.children;
}
interface RequiresAuthProviderProps extends PropsWithChildren<any> {
  allowedRoles?: UserRoles[];
}
