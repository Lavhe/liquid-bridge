import React, { useEffect, useMemo, useState } from "react";

import { Icon } from "@mdi/react";
import { mdiInformationOutline } from "@mdi/js";
import { useFirebase } from "../../../context/FirebaseContext";
import DatePicker from "react-datepicker";
import { useEditQuoteGeneratorReducer } from "../reducer/useEditQuoteGeneratorReducer";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { FormField } from "../../../components/shared/form";
import { formatMoney, RoutePath } from "../../../utils/utils";
import { Dialog } from "../../../components/shared/Dialog";
import { getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useCreateCompany } from "../hooks/useCreateCompany";
import { Loader } from "../../../components/shared";

enum ClassName {
  Grid = "flex flex-col overflow-y-auto overflow-x-hidden h-full bg-secondary text-white rounded-md ml-4 float-right",
  Row = "flex flex-col px-10",
  Title = "text-4xl py-6 text-center",
  FieldRow = "flex flex-nowrap gap-2",
  SubTitle = "flex-1 px-2 py-3 my-auto font-semibold text-primary",
  DailyDiscountRow = "rounded-md shadow-md my-1 bg-primary bg-opacity-20 flex flex-col py-6 px-4",
  DailyDiscountPrice = "text-center text-primary text-xl font-bold",
  RequestQuoteButton = "bg-primary font-semibold my-4 py-4 w-full rounded-full text-white",
}

export function EditQuoteGenerator() {
  const { currentUser, settingsDoc, addAuditTrail } = useFirebase();
  const { updateCompany, error, isLoading } = useCreateCompany();
  const [form, dispatch] = useEditQuoteGeneratorReducer();
  const [showSaveChangesDialog, setShowSaveChangesDialog] = useState(false);

  const quoteGeneratorRef = settingsDoc("QuoteGenerator");

  useEffect(() => {
    getDoc(quoteGeneratorRef).then((doc) => {
      const data = doc.data();
      for (const key in data) {
        dispatch({
          payload: {
            key,
            value: data[key],
          },
          type: "UPDATED",
        });
      }
    });
  }, []);

  const onSaveChanges = () => {
    setShowSaveChangesDialog((prevValue) => {
      if (!prevValue) {
        return true;
      }

      const formValues = Object.keys(form)
        .filter((key) => form[key].value !== undefined)
        .reduce(
          (acc, key) => ({ ...acc, [key]: form[key].value }),
          {} as Record<string, any>
        );

      updateDoc(quoteGeneratorRef, {
        ...formValues,
        updated: serverTimestamp(),
      });

      addAuditTrail("UPDATED_SETTINGS", {
        [moment().format("HH:mm:ss")]: {
          change: formValues,
          user: {
            [currentUser?.email || "_"]: currentUser?.displayName,
          },
        },
      });

      return false;
    });
  };

  if (!currentUser) return null;

  if (showSaveChangesDialog) {
    return (
      <Dialog
        onSubmit={onSaveChanges}
        onHide={() => setShowSaveChangesDialog(false)}
        actionText="Yes"
        title="Are you sure?"
        cancelText="Cancel"
      >
        <h3 className="px-10 text-center">
          Changes will be applied to future quotes
        </h3>
      </Dialog>
    );
  }

  return (
    <div className={ClassName.Grid}>
      <div className={ClassName.Row}>
        <span className={ClassName.Title}>Quote Generator</span>
        <div className={ClassName.FieldRow}>
          <Field
            {...form["quoteNumber"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "quoteNumber", value },
              })
            }
          />
          <Field
            {...form["date"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "date", value },
              })
            }
          />
        </div>
        <Field
          {...form["clientName"]}
          onChange={(value) =>
            dispatch({
              type: "UPDATED",
              payload: { key: "clientName", value },
            })
          }
        />
        <Field
          {...form["initialAmountRequired"]}
          onChange={(value) =>
            dispatch({
              type: "UPDATED",
              payload: { key: "initialAmountRequired", value },
            })
          }
        />
        <span className={ClassName.SubTitle}>Property details</span>
        <div className={ClassName.FieldRow}>
          <Field
            {...form["erf"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "erf", value },
              })
            }
          />
          <Field
            {...form["portion"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "portion", value },
              })
            }
          />
        </div>
        <div className={ClassName.FieldRow}>
          <Field
            {...form["stand"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "stand", value },
              })
            }
          />
          <Field
            {...form["extension"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "extension", value },
              })
            }
          />
        </div>
      </div>
      <Fees dispatch={dispatch} form={form} onSaveChanges={onSaveChanges} />
      {isLoading && <Loader />}
      {error && <span className="text-red-600 text-center">{error}</span>}
    </div>
  );
}

function Field({ value, placeholder, label, onChange, type }: FieldProps<any>) {
  switch (type) {
    case "CHECKBOX":
      return (
        <div className="flex w-full rounded-md px-2 py-1">
          <input
            className="h-6 w-6 rounded-md accent-light-gray bg-black"
            onChange={(e) => onChange(e.target.checked)}
            checked={value}
            type="checkbox"
            id={label}
          />
          <label
            htmlFor={label}
            className="px-2 my-auto whitespace-nowrap text-gray-300 font-medium"
          >
            {label}
          </label>
        </div>
      );
    case "DATE":
      return (
        <div className="py-4 flex flex-nowrap">
          <span className="px-2 my-auto whitespace-nowrap">{label}</span>
          <DatePicker
            className="w-full rounded-md bg-opacity-40 bg-primary px-2 py-1 text-white"
            selected={value}
            value={value}
            onChange={(date) => onChange(date)}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      );
    default:
      return (
        <div className="py-4 flex flex-nowrap">
          <span className="px-2 my-auto whitespace-nowrap flex-1">{label}</span>
          <input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 rounded-md bg-opacity-40 bg-primary px-2 py-1"
          />
        </div>
      );
  }
}

function Triangle() {
  return (
    <div className="flex justify-center align-center">
      <div className="border-solid border-t-secondary border-t-[3rem] border-x-transparent border-x-[250px] border-b-0"></div>
    </div>
  );
}

function Fees({ form, onSaveChanges, dispatch }: any) {
  const navigate = useNavigate();

  return (
    <div className="bg-primary bg-opacity-50 w-full">
      <Triangle />
      <div className="flex flex-col px-10 py-10">
        <span className="text-4xl py-2 text-center">Fees</span>
        <div className="py-4">
          <Field
            {...form["discountingRate"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "discountingRate", value },
              })
            }
          />
          <Field
            {...form["initiationFee"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "initiationFee", value },
              })
            }
          />
          <Field
            {...form["monthlyServiceFee"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "monthlyServiceFee", value },
              })
            }
          />
        </div>
        <button
          onClick={onSaveChanges}
          className={ClassName.RequestQuoteButton}
        >
          Save Changes
        </button>
        <p className="text-center italic text-gray-300 py-6">
          <button
            className="underline"
            onClick={() => navigate(RoutePath.TERMS_AND_CONDITIONS)}
          >
            Click here
          </button>{" "}
          to view T's & C's
        </p>
      </div>
    </div>
  );
}

interface FieldProps<T> extends FormField<T> {
  onChange: (value: T) => void;
}
