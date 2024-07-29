import { useCallback, useEffect, useMemo, useState } from "react";
import { useFirebase } from "../../../context/FirebaseContext";
import { Field } from "../../../components/shared/form";
import { useCreateCompanyReducer } from "../../admin/reducer/useCreateCompanyReducer";
import { useCreateCompany } from "../../admin/hooks/useCreateCompany";
import { mdiContentSave } from "@mdi/js";
import { Icon } from "@mdi/react";
import classnames from "classnames";
import { useCompany } from "../../../hooks/companies/useCompany";

export function EditAgent({ companyId }: EditAgentProps) {
  const [form, dispatch] = useCreateCompanyReducer();
  const { updateCompany, company } = useCompany({
    companyId,
  });

  useEffect(() => {
    (async () => {
      const data = await company;

      Object.keys(form).forEach((k) => {
        const key = k as keyof typeof form;

        // @ts-ignore
        dispatch({
          type: "UPDATED",
          payload: {
            key,
            value: data[key],
          },
        });
      });
    })();
  }, [company]);

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
  };

  const disableSubmit = useMemo(() => {
    const ignoredKeys = ["isApprover", "cellNumber"];

    const allFilled = Object.keys(form)
      .filter((key) => !ignoredKeys.includes(key))
      .every((key) => (form as any)[key].value);

    console.log(
      Object.keys(form)
        .filter((key) => !ignoredKeys.includes(key))
        .map((key) => (form as any)[key].value + "_" + key)
    );
    return !allFilled;
  }, [form, dispatch]);

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
    <div>
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
      <SaveChanges saveChanges={handleSubmit} disabled={disableSubmit} />
    </div>
  );
}

function SaveChanges({ saveChanges, disabled }: any) {
  const className = classnames(
    "rounded-full bg-primary px-2 flex place-items-center hover:bg-opacity-40 m-4",
    {
      "cursor-not-allowed bg-gray-300 hover:bg-opacity-100": disabled,
    }
  );
  return (
    <div className="flex">
      <button onClick={saveChanges} disabled={disabled} className={className}>
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

interface EditAgentProps {
  companyId: string;
}
