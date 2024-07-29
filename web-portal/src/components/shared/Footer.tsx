import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../utils/utils";

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="flex place-items-center gap-8 py-4 px-20 bg-secondary text-white text-sm w-full">
      <button onClick={() => navigate(RoutePath.TERMS_AND_CONDITIONS)}>
        T's & C's
      </button>
      <div className="h-4 w-px bg-white" />
      <button>Help</button>
    </footer>
  );
}
