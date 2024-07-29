import { useEffect } from "react";
import terms from "./FINANCE_TERMS_AND_CONDITIONS.pdf";

export function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <object className="w-full h-screen" data={terms} type="application/pdf">
      <div>No online PDF viewer installed</div>
    </object>
  );
}
