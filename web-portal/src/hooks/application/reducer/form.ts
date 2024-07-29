import { documentId, where } from "firebase/firestore";
import { FormField } from "../../../components/shared/form";
import { Collection } from "../../../context/FirebaseContext";
import { DBCompany } from "../../../utils/types";

export const INITIAL_FORM: Form<string | boolean | null> = {
  typeOfSeller: {
    section: "SELLER_DETAILS",
    label: "Type of seller",
    classNames: "row-start-1col-start-1 col-span-1",
    type: "SINGLE_SELECT",
    placeholder: "Select a seller",
    options: [
      {
        value: "NATURAL_PERSON",
        label: "Natural Person",
      },
      {
        value: "JURISTIC_PERSON",
        label: "Juristic Person",
      },
    ],
    validate: (value) => true,
  },
  // entityType: {
  //   section: "SELLER_DETAILS",
  //   label: "Type of entity",
  //   classNames: "row-start-2 col-span-1",
  //   type: "TEXT",
  //   validate: (value) => true,
  //   hide: (form) => form.typeOfSeller === 'NATURAL_PERSON'
  // },
  // entityRegisteredName: {
  //   section: "SELLER_DETAILS",
  //   label: "Entity registered name",
  //   classNames: "row-start-2 col-span-1",
  //   type: "TEXT",
  //   validate: (value) => true,
  //   hide: (form) => form.typeOfSeller === 'NATURAL_PERSON'
  // },
  // entityPhysicalAddress: {
  //   section: "SELLER_DETAILS",
  //   label: "Entity physical address",
  //   classNames: "row-start-2 col-span-1",
  //   type: "TEXT",
  //   validate: (value) => true,
  //   hide: (form) => form.typeOfSeller === 'NATURAL_PERSON'
  // },
  // entityRegistrationNumber: {
  //   section: "SELLER_DETAILS",
  //   label: "Entity registration number",
  //   classNames: "row-start-2 col-span-1",
  //   type: "TEXT",
  //   validate: (value) => true,
  //   hide: (form) => form.typeOfSeller === 'NATURAL_PERSON'
  // },
  fullName: {
    section: "SELLER_DETAILS",
    label: "Full Names",
    classNames: "row-start-2 col-span-1",
    type: "TEXT",
    validate: (value) => true,
  },
  surname: {
    section: "SELLER_DETAILS",
    label: "Surname",
    classNames: "row-start-2 col-start-2",
    type: "TEXT",
    validate: (value) => true,
  },
  physicalAddress: {
    section: "SELLER_DETAILS",
    label: "Physical address",
    classNames: "row-start-3 col-span-full",
    type: "TEXT",
    validate: (value) => true,
  },
  cellNumber: {
    section: "SELLER_DETAILS",
    label: "Cellphone number",
    classNames: "row-start-4 col-span-1",
    type: "TEXT",
    validate: (value) => true,
  },
  workTel: {
    section: "SELLER_DETAILS",
    label: "Work tel",
    classNames: "row-start-4 col-start-2",
    type: "TEXT",
    validate: (value) => true,
  },
  emailAddress: {
    section: "SELLER_DETAILS",
    label: "E-mail address",
    classNames: "row-start-5 col-span-1",
    type: "TEXT",
    validate: (value) => true,
  },
  idNumber: {
    section: "SELLER_DETAILS",
    label: "ID Number",
    classNames: "row-start-5 col-start-2",
    type: "TEXT",
    validate: (value) => true,
  },
  erf: {
    section: "TRANSACTION_DETAILS",
    label: "ERF",
    classNames: "row-start-1 col-start-1 col-span-1",
    type: "TEXT",
    validate: (value) => true,
  },
  portion: {
    section: "TRANSACTION_DETAILS",
    label: "Portion",
    classNames: "row-start-1 col-start-2 col-span-1",
    type: "TEXT",
    validate: (value) => true,
  },
  stand: {
    section: "TRANSACTION_DETAILS",
    label: "Stand",
    classNames: "row-start-1 col-start-3 col-span-1",
    type: "TEXT",
    validate: (value) => true,
  },
  extension: {
    section: "TRANSACTION_DETAILS",
    label: "Extension",
    classNames: "row-start-1 col-start-4 col-span-1",
    type: "TEXT",
    validate: (value) => true,
  },
  purchaserName: {
    section: "TRANSACTION_DETAILS",
    label: "Purchaser Name",
    classNames: "col-start-1 col-span-2 row-start-2",
    type: "TEXT",
    validate: (value) => true,
  },
  purchaserSurname: {
    section: "TRANSACTION_DETAILS",
    label: "Purchaser Surname",
    classNames: "col-start-3 col-span-2 row-start-2",
    type: "TEXT",
    validate: (value) => true,
  },
  purchaserPrice: {
    section: "TRANSACTION_DETAILS",
    label: "Purchaser Price",
    classNames: "col-start-1 col-span-2 row-start-3",
    type: "TEXT",
    prefix: "R",
    validate: (value) => true,
  },
  depositPaid: {
    section: "TRANSACTION_DETAILS",
    label: "Deposit Paid",
    classNames: "col-start-3 col-span-2 row-start-3",
    type: "TEXT",
    prefix: "R",
    validate: (value) => true,
  },
  bondApprovedFor: {
    section: "TRANSACTION_DETAILS",
    label: "Bond approved for",
    classNames: "col-start-1 col-span-2 row-start-4",
    type: "TEXT",
    prefix: "R",
    validate: (value) => true,
  },
  bondCancellation: {
    section: "TRANSACTION_DETAILS",
    label: "Bond cancellation",
    classNames: "col-start-3 col-span-2 row-start-4",
    type: "TEXT",
    prefix: "R",
    validate: (value) => true,
  },
  propertyPractitionerCommission: {
    section: "TRANSACTION_DETAILS",
    label: "Property Practitioner Commission",
    classNames: "col-start-1 col-span-2 row-start-5",
    type: "TEXT",
    prefix: "R",
    validate: (value) => true,
  },
  ratesAndTaxesPayable: {
    section: "TRANSACTION_DETAILS",
    label: "Rates & taxes payable",
    classNames: "col-start-3 col-span-2 row-start-5",
    type: "TEXT",
    prefix: "R",
    validate: (value) => true,
  },
  expectedDateOfLodgement: {
    section: "TRANSACTION_DETAILS",
    label: "Expected date of lodgement",
    classNames: "col-start-1 col-span-2 row-start-6",
    type: 'DATE',
    validate: (value) => true,
  },
  specifiedTotalOfProceedsOfSale: {
    section: "TRANSACTION_DETAILS",
    label: "Specified total of proceeds of sale",
    classNames: "col-start-3 col-span-2 row-start-6",
    type: "TEXT",
    prefix: "R",
    validate: (value) => true,
  },
  totalAmountRequiredBySeller: {
    section: "TRANSACTION_DETAILS",
    label:
      "Total amount required by Seller from Liquid Bridge (rights “Purchase Price”):",
    classNames: "col-span-4 row-start-7",
    type: "TEXT",
    prefix: "R",
    validate: (value) => true,
  },
  amountsRequiredForRatesAndTaxes: {
    section: "TRANSACTION_DETAILS",
    label:
      "Please provide reason for funds request (e.g. rates & taxes, personal use, etc)",
    classNames: "col-span-4 row-start-8",
    type: "TEXTAREA",
    validate: (value) => true,
  },
  haveAllSuspensiveConditionMet:{
    section: "CONVEYANCER_CONFIRM",
    label: "Have all suspensive conditions been met?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      }
    ],
    validate: (value) => true,
    classNames: "row-start-1",
  },
  isSubjectToSection34:{
    section: "CONVEYANCER_CONFIRM",
    label: "Is the sale transaction subject to advertisement in terms of section 34 of the Insolvency Act?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      }
    ],
    validate: (value) => true,
    classNames: "row-start-2",
  },
  haveShareholdersSign:{
    section: "CONVEYANCER_CONFIRM",
    label: "Have all the shareholders signed resolutions in terms of section 112 and section 115 of the Companies Act with regards to sale transaction?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
      {
        label: "N/A",
        value: null,
      }
    ],
    validate: (value) => true,
    classNames: "row-start-3"
  },
  wasAdvertDoneInLine:{
    section: "CONVEYANCER_CONFIRM",
    label: "Was the advertisement done in line with all the requirements of section 34 of the Insolvency Act?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      }
    ],
    validate: (value) => true,
    classNames: "row-start-4"
  },
  hasPurchaserSignBondDocuments: {
    section: "CONVEYANCER_CONFIRM",
    label: "Has the purchaser signed the bond documents?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
      {
        label: "N/A",
        value: null,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-5",
  },
  hasPurchaserSignTransferDocuments: {
    section: "CONVEYANCER_CONFIRM",
    label: "Has the purchaser has signed the transfer documents?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
      {
        label: "No",
        value: false,
        hidden: true,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-6",
  },
  hasSellerSignTransferDocuments: {
    section: "CONVEYANCER_CONFIRM",
    label: "Has the seller signed the transfer documents?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
      {
        label: "N/A",
        value: null,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-7",
  },
  hasTransferDutyAndCostsPaid: {
    section: "CONVEYANCER_CONFIRM",
    label: "Have the transfer duty and costs been paid?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
      {
        label: "N/A",
        value: null,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-8",
  },
  hasCancellationFiguresBeenObtained: {
    section: "CONVEYANCER_CONFIRM",
    label: "Have the cancellations figures been obtained?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
      {
        label: "N/A",
        value: null,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-9",
  },
  hasFullAmountSecured: {
    section: "CONVEYANCER_CONFIRM",
    label:
      "Has the full amount of the purchase price been secured. (Either by guarantees or cash deposit or both?)",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-10",
  },
  isSellerInsolventOrDeceasedEstate: {
    section: "CONVEYANCER_CONFIRM",
    label: "Is the seller an insolvent / deceased estate?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-11",
  },
  isLinkedSimultaneousTransfer: {
    section: "CONVEYANCER_CONFIRM",
    label: "Is this a linked simultaneous transfer?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-12",
  },
  isAttorneysInPossessionOfTheTitleDeed: {
    section: "CONVEYANCER_CONFIRM",
    label:
      "Are we or the cancellation attorneys in possession of the title deed?",
    type: "RADIO_BUTTON",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
    validate: (value) => true,
    classNames: "row-start-13",
  },
  conveyancerName: {
    section: "CONVEYANCER_DETAILS",
    label: "Conveyancer name (attorney firm)",
    type: "TEXT",
    validate: (value) => true,
    classNames: "row-start-1 col-span-full",
    disabled: (value) => true
  },
  conveyancingSecretary: {
    section: "CONVEYANCER_DETAILS",
    label: "Conveyancing secretary",
    type: "TEXT",
    validate: (value) => true,
    classNames: "row-start-2 col-span-3",
  },
  conveyancerWorkTel: {
    section: "CONVEYANCER_DETAILS",
    label: "Work tel",
    type: "TEXT",
    validate: (value) => true,
    classNames: "row-start-2 col-start-4 col-span-3",
  },
  attorneyTrustAccount: {
    section: "CONVEYANCER_DETAILS",
    label: "Attorney Trust Account",
    type: "SINGLE_SELECT",
    placeholder: "Select a Trust account",
    dbOptions: {
      collection: Collection.Companies,
      list: (results) => results?.length > 0 ? results[0].trustAccounts?.filter((account:DBCompany['trustAccounts'][0]) => account.status === 'ACTIVE') : [],
      where: ({currentUser}:any) => [where(documentId(), '==', currentUser?.company?.email)],
      format: (item) => ({ value:`${item.bankName} - ${item.accountNumber}`, label: `${item.bankName} - ${item.accountNumber}` })
    },
    validate: (value) => true,
    classNames: "row-start-3 col-span-3 col-start-1",
  },
  id: {
    section: "CONVEYANCER_DETAILS",
    label: "File reference no.",
    type: "TEXT",
    placeholder: "GENERATED",
    disabled: (_value) => true,
    validate: (value) => true,
    classNames: "row-start-3 col-start-4 col-span-4",
  },
  userCompletingApplication: {
    section: "CONVEYANCER_DETAILS",
    label: "User completing this application",
    type: "TEXT",
    validate: (value) => true,
    classNames: "row-start-4 col-span-3 col-start-1",
    disabled: (value) => true
  },
  approver: {
    section: "CONVEYANCER_DETAILS",
    label: "Approver",
    type: "SINGLE_SELECT",
    dbOptions: {
      collection: Collection.Users,
      list: (results) => results,
      where: ({currentUser, companyRef}:any) => [where('isApprover', '==', true), where('company', '==', companyRef)],
      format: (item) => ({ value:item.id, label: `${item.displayName} (${item.email})` })
    },
    validate: (value) => true,
    classNames: "row-start-4 col-start-4",
  },
  attachedProFormaStatement: {
    section: "CONVEYANCER_DETAILS",
    label: "Attach Pro forma statement",
    type: "SINGLE_FILE_UPLOAD",
    validate: (value) => true,
    classNames: "row-start-5 col-span-full justify-center",
  },
  hasConfirmedTrueInformation: {
    section: "CONVEYANCER_DETAILS",
    label: "I confirm that all information provided is true and accurate.",
    type: "CHECKBOX",
    validate: (value) =>
      !value
        ? "You have to confirm that the information provided is true"
        : true,
    classNames: "row-start-6 col-span-3 col-start-1",
  },
  hasConfirmedTsAndCs: {
    section: "CONVEYANCER_DETAILS",
    label: "I confirm that I have read the T's & C's.",
    type: "CHECKBOX",
    validate: (value) =>
      !value ? "You have to confirm the T's and C's" : true,
    classNames: "row-start-6 col-start-4 col-span-full",
  },
}

export const reducer = (state: typeof INITIAL_FORM, action: ReducerAction) => {
  switch (action.type) {
    case "UPDATED":
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          value: action.payload.value,
        },
      };
    default:
      return state;
  }
};

interface ReducerAction {
  type: "UPDATED";
  payload: {
    key: keyof typeof INITIAL_FORM;
    value: any;
  };
}

interface Form<T> {
  [k: string]: FormField<T> & {
    section:
      | "SELLER_DETAILS"
      | "TRANSACTION_DETAILS"
      | "CONVEYANCER_CONFIRM"
      | "CONVEYANCER_DETAILS";
      hide?: (form: Record<keyof Form<T>,T>) => boolean
  };
}
