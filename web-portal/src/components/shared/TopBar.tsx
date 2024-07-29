import logo from "../../assets/logoWhite.png";
import { Icon } from "@mdi/react";
import { mdiBell } from "@mdi/js";
import { Link } from "react-router-dom";
import { RoutePath } from "../../utils/utils";

enum ClassName {
  Logo = "my-4 h-16 w-auto",
  Bell = "h-8 w-8 fill-white",
}

export function TopBar() {
  return (
    <div className="w-full px-12 py-2 bg-secondary flex place-items-center">
      <div className="flex-1 text-center">
        <Link to={RoutePath.HOME}>
          <img className={ClassName.Logo} src={logo} />
        </Link>
      </div>
      <div className="flex place-items-center gap-10">
        <Icon
          path={mdiBell}
          size={1.3}
          className="text-primary cursor-pointer hover:text-opacity-50"
        />
        <Link
          to={RoutePath.NEW_APPLICATIONS}
          className="rounded-full px-4 py-2 font-bold text-sm bg-white shadow-sm text-secondary hover:bg-gray-200"
        >
          Apply for Finance
        </Link>
      </div>
    </div>
  );
}
