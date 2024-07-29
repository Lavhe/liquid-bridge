import { Icon } from "@mdi/react";
import { mdiInformationOutline } from "@mdi/js";
import { useFirebase } from "../../context/FirebaseContext";
import DatePicker from "react-datepicker";
import { useQuoteGeneratorReducer } from "../../hooks/dashboard/reducer/useQuoteGeneratorReducer";

import "react-datepicker/dist/react-datepicker.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { FormField } from "../shared/form";
import { formatMoney, RoutePath } from "../../utils/utils";
import { Dialog } from "../shared/Dialog";
import {
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  where,
  query,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { useGenerateQuote } from "../../hooks/dashboard/hooks/useGenerateQuote";
import { useNavigate } from "react-router-dom";

enum ClassName {
  Grid = "flex flex-col overflow-y-auto overflow-x-hidden h-full bg-secondary text-white rounded-md ml-4 self-end",
  Row = "flex flex-col px-10 py-5",
  Title = "text-4xl py-6 text-center",
  FieldRow = "flex flex-nowrap gap-2",
  SubTitle = "flex-1 px-2 py-3 my-auto font-semibold text-primary",
  DailyDiscountRow = "rounded-md shadow-md my-1 bg-primary bg-opacity-20 flex flex-col py-6 px-4",
  DailyDiscountPrice = "text-center text-primary text-xl font-bold",
  RequestQuoteButton = "bg-primary font-semibold my-4 py-4 w-full rounded-full text-white",
}

export function QuoteGenerator() {
  const { currentUser, quoteDoc, quoteCollection, settingsDoc, addAuditTrail } =
    useFirebase();
  const [form, dispatch] = useQuoteGeneratorReducer();
  const [showRequestQuoteDialog, setShowRequestQuoteDialog] = useState(false);
  const [quoteGeneratorSettings, setQuoteGeneratorSettings] = useState<any>();
  const { generateQuote, saveQuote } = useGenerateQuote();

  useEffect(() => {
    const quoteGeneratorRef = settingsDoc("QuoteGenerator");

    getDoc(quoteGeneratorRef).then((doc) => {
      setQuoteGeneratorSettings({
        id: doc.id,
        ...doc.data(),
      });
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "UPDATED",
      payload: { key: "date", value: new Date() },
      quoteGeneratorSettings,
    });

    dispatch({
      type: "UPDATED",
      payload: { key: "estimatedSettlementDate", value: new Date() },
      quoteGeneratorSettings,
    });

    const docsRefs = query(
      quoteCollection(),
      where("company.email", "==", currentUser?.company.email)
    );

    getDocs(docsRefs).then((allDocs) => {
      const prefix = `Q_${currentUser?.company.name.substring(0, 3)}`
      
      const allDocIds:string[] = []
      allDocs.docs.forEach((d, i) => {
        if(d.id.startsWith(prefix)){
          allDocIds.push(d.id);
        }
      });

      let counter = 1;
      let docId = `${prefix}${counter}`;
      do{
        docId = `${prefix}${counter}`;
        counter++
      }while(allDocIds.some(d => d === docId))

      dispatch({
        type: "UPDATED",
        payload: { key: "quoteNumber", value: docId },
        quoteGeneratorSettings,
      });
    });
  }, []);

  const onRequestQuote = useCallback(async () => {
    if (!showRequestQuoteDialog) {
      setShowRequestQuoteDialog(true);
      return;
    }
    setShowRequestQuoteDialog(false);

    const quoteRef = quoteDoc(
      `${currentUser?.company.name}-${moment().toISOString()}`
    );

    const formData: Record<string, any> = {};
    Object.keys(form).forEach((key) => {
      formData[key] = form[key].value;
    });

    const quote = await generateQuote({
      ...formData,
      source: "QUOTE_GENERATOR",
    });

    await saveQuote(quote);

    addAuditTrail("GENERATED_QUOTE", {
      [moment().format("DD/MM/YYYY HH:mm:ss")]: {
        quote: quoteRef,
        user: {
          [currentUser?.email || "_"]: currentUser?.displayName,
        },
      },
    });
  }, [showRequestQuoteDialog, setShowRequestQuoteDialog, form, currentUser]);

  if (!currentUser) return null;

  if (showRequestQuoteDialog) {
    return (
      <Dialog
        onSubmit={onRequestQuote}
        onHide={() => setShowRequestQuoteDialog(false)}
        actionText="Yes"
        title="Are you sure?"
        cancelText="Cancel"
      >
        <h3 className="px-10 text-center">
          The quote will be emailed to{" "}
          <em>
            <strong>{currentUser?.email}</strong>
          </em>
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
            mustShow={quoteGeneratorSettings?.["quoteNumber"]}
            {...form["quoteNumber"]}
            onChange={(value) => null}
          />
          <Field
            mustShow={quoteGeneratorSettings?.["date"]}
            {...form["date"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "date", value },
                quoteGeneratorSettings,
              })
            }
          />
        </div>
        <Field
          mustShow={quoteGeneratorSettings?.["clientName"]}
          {...form["clientName"]}
          onChange={(value) =>
            dispatch({
              type: "UPDATED",
              payload: { key: "clientName", value },
              quoteGeneratorSettings,
            })
          }
        />

        {quoteGeneratorSettings?.["initialAmountRequired"] ? (
          <Field
            mustShow={true}
            {...form["initialAmountRequired"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "initialAmountRequired", value },
                quoteGeneratorSettings,
              })
            }
          />
        ) : (
          <div className="flex">
            <span className="px-2 my-auto whitespace-nowrap">
              Initial Amount Required
            </span>
            <div className="mx-2 py-2 px-2 flex place-items-center gap-1 rounded-full bg-gray-300 bg-opacity-80 text-xs">
              <Icon path={mdiInformationOutline} size={0.8} /> Max 80% of sale
              proceeds
            </div>
          </div>
        )}
        <Field
          mustShow={true}
          {...form["estimatedSettlementDate"]}
          onChange={(value) =>
            dispatch({
              type: "UPDATED",
              payload: { key: "estimatedSettlementDate", value },
              quoteGeneratorSettings,
            })
          }
        />
        <span className={ClassName.SubTitle}>Property details</span>
        <div className={ClassName.FieldRow}>
          <Field
            mustShow={quoteGeneratorSettings?.["erf"]}
            {...form["erf"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "erf", value },
                quoteGeneratorSettings,
              })
            }
          />
          <Field
            mustShow={quoteGeneratorSettings?.["portion"]}
            {...form["portion"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "portion", value },
                quoteGeneratorSettings,
              })
            }
          />
        </div>
        <div className={ClassName.FieldRow}>
          <Field
            mustShow={quoteGeneratorSettings?.["stand"]}
            {...form["stand"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "stand", value },
                quoteGeneratorSettings,
              })
            }
          />
          <Field
            mustShow={quoteGeneratorSettings?.["extension"]}
            {...form["extension"]}
            onChange={(value) =>
              dispatch({
                type: "UPDATED",
                payload: { key: "extension", value },
                quoteGeneratorSettings,
              })
            }
          />
        </div>
      </div>
      <DiscountRate form={form} onRequestQuote={onRequestQuote} />
    </div>
  );
}

function Field({
  value,
  placeholder,
  label,
  onChange,
  type,
  mustShow,
}: FieldProps<any>) {
  if (!mustShow) {
    return null;
  }

  const Input = useMemo(() => {
    switch (type) {
      case "DATE":
        return (
          <DatePicker
            className="w-full rounded-md bg-opacity-40 bg-primary px-2 py-1 text-white"
            selected={value}
            value={value}
            onChange={(date) => onChange(date)}
            dateFormat="dd/MM/yyyy"
          />
        );
      default:
        return (
          <input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md bg-opacity-40 bg-primary px-2 py-1"
          />
        );
    }
  }, [value]);

  return (
    <div className="py-4 flex flex-nowrap">
      <span className="px-2 my-auto whitespace-nowrap">{label}</span>
      {Input}
    </div>
  );
}

function Triangle() {
  return (
    <div className="flex justify-center align-center">
      <div className="border-solid border-t-secondary border-t-[3rem] border-x-transparent border-x-[250px] border-b-0"></div>
    </div>
  );
}

function DiscountRate({ form, onRequestQuote }: any) {
  const navigate = useNavigate();

  const { value: initialAmountRequired } = form["initialAmountRequired"];
  const { value: discountingRate } = form["discountingRate"];
  const { value: amountDue } = form["amountDue"];
  const { value: estimatedSettlementDate } = form["estimatedSettlementDate"];
  const { value: initiationFee } = form["initiationFee"];
  const { value: monthlyServiceFee } = form["monthlyServiceFee"];
  const { value: date } = form["date"];

  const getDates = (days: number) => ({
    date: moment().add(days, "days").format("DD/MM/YYYY"),
    value: formatMoney(
      Math.floor(
        +initialAmountRequired +
          +initialAmountRequired * ((+discountingRate / 100) * days) +
          +initiationFee +
          +monthlyServiceFee
      )
    ),
  });

  const date30Days = getDates(30);
  const date60Days = getDates(60);
  const date90Days = getDates(90);

  const totalDays = moment(date).diff(estimatedSettlementDate, "days") * -1;

  return (
    <div className="bg-primary bg-opacity-50 w-full">
      <Triangle />
      <div className="flex flex-col px-10 py-10">
        <span className="text-4xl py-2 text-center">Discounting rate</span>
        <div className="py-4">
          <DailyDiscount
            days={30}
            minRegistration={date30Days.date}
            value={date30Days.value}
          />
          <DailyDiscount
            days={60}
            minRegistration={date60Days.date}
            value={date60Days.value}
          />
          <DailyDiscount
            days={90}
            minRegistration={date90Days.date}
            value={date90Days.value}
          />
        </div>
        <span className="text-center w-full pt-6 mx-auto font-extralight text-md">
          Total payable to us ({totalDays} days)
        </span>
        <div className="text-center py-4">
          <span className="text-4xl py-2 font-bold px-2">
            {(totalDays > 0 &&
              initialAmountRequired &&
              formatMoney(amountDue)) ||
              "R xxx"}
          </span>
        </div>

        <span className="text-center w-full mx-auto font-extralight">
          Initiation fee{" "}
          <span className="font-black">{formatMoney(initiationFee)}</span>
        </span>
        <span className="text-center w-full mx-auto font-extralight">
          Monthly service fee{" "}
          <span className="font-black">{formatMoney(monthlyServiceFee)}</span>
        </span>
        <button
          onClick={onRequestQuote}
          className={ClassName.RequestQuoteButton}
        >
          Request Quote
        </button>
        <span className="text-center w-full pt-4 mx-auto font-extralight italic opacity-70">
          This quote is valid for 7 days (T's & C's Apply).
          <br />
          <button
            className="underline"
            onClick={() => navigate(RoutePath.TERMS_AND_CONDITIONS)}
          >
            Click here
          </button>{" "}
          to view T's & C's
        </span>
      </div>
    </div>
  );
}

function DailyDiscount({ value, minRegistration, days }: any) {
  const condition =
    days == 30 ? ` or before ${minRegistration}` : ` ${minRegistration}`;

  return (
    <div className={ClassName.DailyDiscountRow}>
      <span className={ClassName.DailyDiscountPrice}>{value}</span>
      <span className="text-center">
        <strong>{days} days</strong> (if registration takes place on{condition})
      </span>
    </div>
  );
}
interface FieldProps<T> extends FormField<T> {
  onChange: (value: T) => void;
  mustShow: boolean;
}
