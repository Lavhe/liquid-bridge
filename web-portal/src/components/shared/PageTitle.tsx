import { useLocation } from "react-router-dom";
import { RoutePath } from "../../utils/utils";

export function PageTitle(props: PageTitleProps) {
  const { rightContent } = props;
  const { pathname } = useLocation();

  let title = "";

  switch (pathname.toLowerCase()) {
    case RoutePath.HOME:
      title = "DASHBOARD";
      break;
    case RoutePath.NEW_APPLICATIONS:
      title = "Bridging Application";
      break;
    case RoutePath.AGENT:
      title = "Agent Profile";
      break;
    default:
      title = pathname.replace("/", "").toUpperCase();
      break;
  }

  return (
    <div className="w-full pb-8 flex align-bottom">
      <span className="flex-initial font-thin text-4xl text-secondary">
        {title}
      </span>
      <div className="flex-1 mx-4 border-b border-secondary align-bottom"></div>
      {rightContent ? rightContent : null}
    </div>
  );
}
interface PageTitleProps {
  rightContent?: JSX.Element;
}
