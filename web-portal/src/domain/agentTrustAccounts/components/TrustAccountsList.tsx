import { Field } from "../../../components/shared/form";
import { mdiContentSave, mdiPlus } from "@mdi/js";
import { Icon } from "@mdi/react";
import { Loader } from "../../../components/shared";
import { useTrustAccounts } from "../hooks/useTrustAccounts";

export function TrustAccountsList(props: TrustAccountsProps) {
  const { error, companyId } = props;
  const {
    formArray,
    handleOnChange,
    saveChanges,
    handleAddNew,
    isLoading,
    saveError,
  } = useTrustAccounts({
    companyId,
  });

  return (
    <>
      <div className="flex place-items-center p-4 mt-3">
        <span className="flex-1 text-2xl text-gray-400 whitespace-nowrap">
          Attorney trust accounts
        </span>
        <span className="text-blue-400 text-sm underline cursor-pointer">
          Do you have any amendments? Click here to request for amendments
        </span>
      </div>
      {formArray.map((form, index) => (
        <div className="grid grid-cols-6 grid-rows-1">
          {Object.keys(form).map((key) => (
            <Field
              variable={key}
              // @ts-ignore
              {...form[key]}
              onChange={(e) => handleOnChange(e, index)}
            />
          ))}
        </div>
      ))}

      <Error errors={[error, saveError]} />
      {isLoading ? (
        <Loader size="auto" />
      ) : (
        <AddNewTrustAccount
          handleAddNew={handleAddNew}
          saveChanges={saveChanges}
        />
      )}
    </>
  );
}

function Error({ errors }: { errors: (string | undefined)[] }) {
  const error = errors.join(" ");

  if (!error.trim()) {
    return null;
  }

  return <p className="text-danger text-center py-2">{error}</p>;
}

function AddNewTrustAccount({
  handleAddNew,
  saveChanges,
}: AddNewTrustAccountProps) {
  return (
    <div className="flex">
      <button
        onClick={handleAddNew}
        className="rounded-full bg-gray-100 px-2 flex place-items-center hover:bg-gray-400 m-4"
      >
        <Icon
          size={1}
          path={mdiPlus}
          className="bg-gray-200 rounded-full p-1"
        />
        <span className="text-xs px-3 py-2 whitespace-nowrap">
          Add trust account
        </span>
      </button>

      <button
        onClick={saveChanges}
        className="rounded-full bg-primary px-2 flex place-items-center hover:bg-opacity-40 m-4"
      >
        <Icon
          size={1}
          path={mdiContentSave}
          color="white"
          className="rounded-full p-1"
        />
        <span className="text-xs text-center mr-3 py-2 text-white whitespace-nowrap">
          Save Changes
        </span>
      </button>
    </div>
  );
}

interface TrustAccountsProps {
  error?: string;
  companyId: string;
}

type AddNewTrustAccountProps = Pick<
  ReturnType<typeof useTrustAccounts>,
  "handleAddNew" | "saveChanges"
>;
