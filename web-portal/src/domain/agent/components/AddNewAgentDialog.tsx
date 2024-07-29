import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogProps } from "../../../components/shared/Dialog";
import checkIcon from "../../../assets/icons/check.svg";
import { useFirebase } from "../../../context/FirebaseContext";
import { Field } from "../../../components/shared/form";
import { useCreateCompanyReducer } from "../../admin/reducer/useCreateCompanyReducer";
import { useCreateCompany } from "../../admin/hooks/useCreateCompany";

export function AddNewAgentDialog(props: AddNewAgentDialogProps) {
  const { currentUser } = useFirebase();
  const { onHide } = props;
  const [form, dispatch] = useCreateCompanyReducer();
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const { updateCompany } = useCreateCompany();

  const handleSubmit = async () => {
    const formKeys = Object.keys(form);
    const errorKey = formKeys.find(
      // @ts-ignore
      (key) => !form[key].validate(form[key].value)
    );

    if (errorKey) {
      // @ts-ignore
      return console.log(form[errorKey].validateMessage);
    }

    const obj: any = {};

    formKeys.forEach((key) => {
      // @ts-ignore
      obj[key] = form[key].value;
    });

    await updateCompany(obj);
    onHide();
  };

  const disableSubmit = useMemo(() => {
    if (!hasConfirmed) return true;

    const ignoredKeys = ["isApprover", "cellNumber"];

    const allFilled = Object.keys(form)
      .filter((key) => !ignoredKeys.includes(key))
      .every((key) => (form as any)[key].value);

    return !allFilled;
  }, [form, hasConfirmed]);

  const handleOnChange = useCallback(
    (e: any) => {
      const key = e.target.name;
      let value = e.target.value;
      // @ts-ignore
      const { type } = form[key];

      if (type === "CHECKBOX") {
        value = e.target.checked;
      }

      dispatch({
        type: "UPDATED",
        payload: {
          key,
          value,
        },
      });
    },
    [dispatch]
  );

  return (
    <Dialog
      onHide={onHide}
      onSubmit={handleSubmit}
      title="Create an Agent Profile"
      actionText="Save changes"
      cancelText="Cancel"
      disableSubmit={disableSubmit}
    >
      <div className="grid grid-cols-6 grid-rows-4">
        {Object.keys(form).map((key) => (
          <Field
            variable={key}
            // @ts-ignore
            {...form[key]}
            onChange={handleOnChange}
          />
        ))}
      </div>
      <ConfirmCheckbox
        hasConfirmed={hasConfirmed}
        setHasConfirmed={setHasConfirmed}
      />
    </Dialog>
  );
}

function ConfirmCheckbox({ hasConfirmed, setHasConfirmed }: any) {
  const checkbox = useRef<any>(null);

  return (
    <div
      onClick={(e) => checkbox.current?.click()}
      className="flex flex-nowrap whitespace-nowrap w-full place-items-center cursor-pointer py-10 px-6"
    >
      <input
        ref={checkbox}
        type="checkbox"
        className="hidden"
        value={hasConfirmed}
        onChange={(e) => setHasConfirmed(e.target.checked)}
      />
      <div className="h-6 w-6 border border-gray-700 rounded-sm grid place-items-center hover:bg-gray-100 ">
        {hasConfirmed && <img src={checkIcon} />}
      </div>
      <label htmlFor="" className="text-sm px-4 text-gray-600 font-medium">
        I confirm that I have the necessary authorisation to create a new agent.
      </label>
    </div>
  );
}
interface AddNewAgentDialogProps {
  onHide: DialogProps["onHide"];
  onSubmit: (form: ReturnType<typeof useCreateCompanyReducer>["0"]) => void;
  error?: string;
}
