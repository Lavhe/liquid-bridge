import moment from "moment";
import { useReducer } from "react";
import { FormField } from "../../../components/shared/form";

const INITIAL_FORM: Form<any> = {
  quoteNumber: {
    label:'Quote no',
    validate: () => true,
    type: 'TEXT',
    disabled: (_value:any) => true
  },
  date: {
    label:'Date',
    validate: () => true,
    type: 'DATE'
  },
  clientName: {
    label:'Client name',
    validate: () => true,
    type: 'TEXT',
  },
  initialAmountRequired: {
    label: 'Initial amount required',
    validate: () => true,
    type: 'TEXT',
  },
  erf: {
    label: 'ERF',
    validate: () => true,
    type: 'TEXT',
  },
  stand: {
    label: 'Stand',
    validate: () => true,
    type: 'TEXT',
  },
  portion: {
    label: 'Portion',
    validate: () => true,
    type: 'TEXT',
  },
  extension: {
    label: 'Extension',
    validate: () => true,
    type: 'TEXT',
  },
  amountDue:{
    label: 'Extension',
    validate: () => true,
    type: 'TEXT',
  },
  discountingRate:{
    label: 'Discounting rate',
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
  },
  estimatedSettlementDate: {
    label:'Estimated settlement date',
    validate: () => true,
    type: 'DATE'
  },
};


function reducer(state: typeof INITIAL_FORM, action: ReducerAction){
  switch (action.type) {
    case "UPDATED":
      const {quoteGeneratorSettings, payload } = action;
      const newState: typeof INITIAL_FORM = {
        ...state,
        [payload.key]: {
          ...state[payload.key],
          value: payload.value,
        },
      };

      if(quoteGeneratorSettings){
        ['discountingRate','initiationFee','monthlyServiceFee'].forEach(key => {
          newState[key].value = quoteGeneratorSettings[key]
        })
      }

      const { value: date } = newState['date'];
      const { value: estimatedSettlementDate} = newState['estimatedSettlementDate'];
      const { value: initialAmountRequired } = newState['initialAmountRequired'];
      const { value: discountingRate } = newState['discountingRate'];
      const { value: initiationFee } = newState['initiationFee'];
      const { value: monthlyServiceFee} = newState['monthlyServiceFee']

      newState['amountDue'].value = null;

      if(initialAmountRequired && discountingRate && date && estimatedSettlementDate && initiationFee != null) {
          const diff = moment(date).diff(estimatedSettlementDate, 'days') * -1;
        
          newState['amountDue'].value = Math.floor(+initialAmountRequired + (+initialAmountRequired * ((+discountingRate/100) *diff)) + +initiationFee + +monthlyServiceFee);  
      }

      return newState;
    default:
      return state;
  }
};

export function useQuoteGeneratorReducer(){
  return useReducer(reducer, INITIAL_FORM)
}

interface ReducerAction {
  type: "UPDATED";
  payload: {
    key: keyof typeof INITIAL_FORM;
    value: any;
  };
  quoteGeneratorSettings: Record<string, string>
}

interface Form<T> {
  [k: string]: FormField<T>
}
