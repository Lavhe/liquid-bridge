import {
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { useCallback } from "react";
import { useFirebase } from "../../../context/FirebaseContext";
import Swal from "sweetalert2";

export function useGenerateQuote() {
  const { currentUser, settingsDoc, quoteCollection, quoteDoc, addAuditTrail } =
    useFirebase();

  const generateQuote = useCallback(async (data: Partial<Quote>) => {
    const quote = {
      ...data,
    } as Partial<Quote>;
    const quoteGeneratorRef = settingsDoc("QuoteGenerator");

    const quoteDoc = await getDoc(quoteGeneratorRef);

    const quoteGeneratorSettings = {
      ...quoteDoc.data(),
      id: quoteDoc.id,
    } as any;

    ["discountingRate", "initiationFee", "monthlyServiceFee"].forEach((key) => {
      quote[key as keyof Quote] = (quoteGeneratorSettings[key]).toString();
    });

    if(!quote.id && quote.quoteNumber){
      quote.id = quote.quoteNumber;
    }

    if (!quote.id) {
      Swal.fire({
        title: 'Failed to generate quote',
        text: 'quote id is missing, please contact admin',
        icon: "error"
      });
      return {};
    }

    quote.quoteNumber = quote.id 

    const amountDue = (days: number) =>
        Math.floor(
          +(quote.initialAmountRequired || 0) +
            +(quote.initialAmountRequired || 0) *
              ((+(quote.discountingRate || 0) / 100) * days) +
            +(quote.initiationFee || 0) +
            +(quote.monthlyServiceFee || 0)
      ).toString()

    quote["30DaysValue"] = amountDue(30);
    quote["30DaysDate"] = moment().add(30, "days").format("DD/MM/YYYY");
    quote["60DaysValue"] = amountDue(60);
    quote["60DaysDate"] = moment().add(60, "days").format("DD/MM/YYYY");
    quote["90DaysValue"] = amountDue(90);
    quote["90DaysDate"] = moment().add(90, "days").format("DD/MM/YYYY");

    quote.date = quote.date || moment().format("DD/MM/YYYY");
    quote.totalDays =
      (moment(quote.date).diff(quote.estimatedSettlementDate, "days") * -1).toString();
    quote.amountDue = amountDue(+quote.totalDays);
    

    return quote;
  }, []);

  const saveQuote = useCallback(async (form: Partial<Quote>) => {
    const quoteRef = quoteDoc(
      form.id
    );

    await setDoc(quoteRef, {
      ...JSON.parse(JSON.stringify(form)),
      company: currentUser?.company,
      clientEmail: currentUser?.email,
      updated: serverTimestamp(),
    }, {merge: true});

    addAuditTrail("GENERATED_QUOTE", {
      [moment().format("DD/MM/YYYY HH:mm:ss")]: {
        quote: quoteRef,
        user: {
          [currentUser?.email || "_"]: currentUser?.displayName,
        },
      },
    });
  }, []);

  return {
    generateQuote,
    saveQuote,
  };
}
interface Quote {
  id: string;
  applicationId: string;
  quoteNumber: string;
  initialAmountRequired: string;
  discountingRate: string;
  amountDue: string;
  estimatedSettlementDate: string;
  initiationFee: string;
  monthlyServiceFee: string;
  date: string;
  "30DaysValue": string;
  "30DaysDate": string;
  "60DaysValue": string;
  "60DaysDate": string;
  "90DaysValue": string;
  "90DaysDate": string;
  totalDays: string;
  erf: string;
  portion: string;
  stand: string;
  extension: string;
  source: 'APPLICATION' | 'QUOTE_GENERATOR';
  clientName:string;
  approver:string;
}
