import { useApplication } from "../../../hooks/application/useApplication";
import { useSettlementStatement } from "../../../hooks/application/useSettlementStatement";
import { ViewPDF, ViewPDFProps } from "./ViewPDF";

enum ClassName {
  Row = "flex gap-2 place-items-center",
  SendRequestButton = "text-sm text-primary underline cursor-pointer",
}
export function SettlementDocPDF({
  link,
  applicationId,
}: SettlementDocPDFProps) {
  const { requestSettlementStatement } = useSettlementStatement();

  const handleSendRequest = () => {
    requestSettlementStatement(applicationId);
  };

  return (
    <div className={ClassName.Row}>
      <ViewPDF link={link} />
      {!link && (
        <button
          onClick={handleSendRequest}
          className={ClassName.SendRequestButton}
        >
          Send Request
        </button>
      )}
    </div>
  );
}
interface SettlementDocPDFProps extends ViewPDFProps {
  applicationId: string;
}
