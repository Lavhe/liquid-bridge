import { mdiBluetooth, mdiFilePdfBox } from "@mdi/js";
import { Icon } from "@mdi/react";
import classNames from "classnames";

enum ClassName {
  Row = "rounded-md grid place-items-center mx-auto",
  Enabled = "hover:bg-opacity-50",
  Disabled = "",
  Text = "font-black text-white",
}
export function ViewPDF({ link }: ViewPDFProps) {
  const pdfClassName = classNames(ClassName.Row, {
    [ClassName.Enabled]: link,
    [ClassName.Disabled]: !link,
  });

  const iconClassName = classNames({
    "text-secondary": link,
    "text-gray-600": !link,
  });

  const handleOnClick = () => {
    new Window().open(link, "__blank");
  };

  return (
    <div className="flex">
      <button onClick={handleOnClick} disabled={!link} className={pdfClassName}>
        <Icon path={mdiFilePdfBox} size={1.5} className={iconClassName}></Icon>
      </button>
    </div>
  );
}
export interface ViewPDFProps {
  link?: string;
}
