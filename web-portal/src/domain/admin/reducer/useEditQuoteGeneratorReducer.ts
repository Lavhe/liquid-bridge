import moment from "moment";
import { useReducer } from "react";
import { FormField } from "../../../components/shared/form";

const INITIAL_FORM: Form<string | null | number> = {
  quoteNumber: {
    label: 'Quote No',
    validate: () => true,
    type: 'CHECKBOX'
  },
  date: {
    label:'Date',
    validate: () => true,
    type: 'CHECKBOX'
  },
  clientName: {
    label:'Client name',
    validate: () => true,
    type: 'CHECKBOX'
  },
  initialAmountRequired: {
    label: 'Initial amount required',
    validate: () => true,
    type: 'CHECKBOX'
  },
  estimatedSettlementDate: {
    label: 'Estimated settlement date',
    validate: () => true,
    type: 'CHECKBOX'
  },
  erf: {
    label: 'ERF',
    validate: () => true,
    type: 'CHECKBOX'
  },
  stand: {
    label: 'Stand',
    validate: () => true,
    type: 'CHECKBOX',
  },
  portion: {
    label: 'Portion',
    validate: () => true,
    type: 'CHECKBOX',
  },
  extension: {
    label: 'Extension',
    validate: () => true,
    type: 'CHECKBOX',
  },
  discountingRate:{
    label: 'Discounting Rate',
    validate: () => true,
    type: 'TEXT',
  },
  initiationFee:{
    label: 'Initiation fee',
    validate: () => true,
    type: 'TEXT',
  },
  monthlyServiceFee: {
    label: 'Monthly service fee',
    validate: () => true,
    type: 'TEXT'
  }
};


function reducer(state: typeof INITIAL_FORM, action: ReducerAction){
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

export function useEditQuoteGeneratorReducer(){
  return useReducer(reducer, INITIAL_FORM)
}

interface ReducerAction {
  type: "UPDATED";
  payload: {
    key: keyof typeof INITIAL_FORM;
    value: any;
  };
}

interface Form<T> {
  [k: string]: FormField<T>
}
