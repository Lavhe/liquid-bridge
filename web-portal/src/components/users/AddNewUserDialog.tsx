import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Dialog, DialogProps } from "../shared/Dialog";
import { useAddNewUserReducer } from "../../hooks/users/reducers/useAddNewUserReducer";
import checkIcon from "../../assets/icons/check.svg";
import { Field } from "../shared/form";
import { useFirebase } from "../../context/FirebaseContext";

export function AddNewUserDialog(props: AddNewUserDialogProps) {
  const { currentUser } = useFirebase();
  const { onHide, onSubmit, error } = props;
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [form, dispatch] = useAddNewUserReducer();

  useEffect(() => {
    dispatch({
      type: "UPDATED",
      payload: {
        key: "company",
        value: currentUser?.company?.email,
      },
    });
  }, []);

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

  const handleSubmit = useCallback(() => {
    const formKeys = Object.keys(form);
    const errorKey = formKeys.find(
      // @ts-ignore
      (key) => !form[key].validate(form[key].value)
    );

    if (errorKey) {
      // @ts-ignore
      return console.log(form[errorKey].validateMessage);
    }

    const obj: any = {
      displayName: `${form["name"].value} ${form["surname"].value}`,
      status: "ACTIVE",
    };

    formKeys.forEach((key) => {
      // @ts-ignore
      obj[key] = form[key].value;
    });

    onSubmit(obj);
  }, [form]);

  const disableSubmit = useMemo(() => {
    if (!hasConfirmed) return true;

    const ignoredKeys = ["isApprover", "cellNumber"];

    const allFilled = Object.keys(form)
      .filter((key) => !ignoredKeys.includes(key))
      .every((key) => (form as any)[key].value);

    return !allFilled;
  }, [form, hasConfirmed]);

  return (
    <Dialog
      onHide={onHide}
      onSubmit={handleSubmit}
      title="ADDING A NEW USER"
      actionText="Submit new user"
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
      {error && <p className="text-danger text-center py-2">{error}</p>}
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
        I confirm that I have the necessary authorisation to apply for a new
        user on behalf of my organisation.
      </label>
    </div>
  );
}
interface AddNewUserDialogProps {
  onHide: DialogProps["onHide"];
  onSubmit: (form: ReturnType<typeof useAddNewUserReducer>["0"]) => void;
  error?: string;
}
