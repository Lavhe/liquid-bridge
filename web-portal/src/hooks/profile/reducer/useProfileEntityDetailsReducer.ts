import { useReducer } from "react";

const INITIAL_FORM = {
  companyName: {
    value: null,
    label: "Name of agent",
    classNames: "row-start-1 col-start-1 col-span-3",
    validate: (value:string) => true,
    disabled: () => true
  },
  workAddress: {
    value: null,
    label: "Work Address",
    classNames: "row-start-1 col-start-4 col-span-3",
    validate: (value:string) => true,
    disabled: () => true
  },
  physicalAddress: {
    value: null,
    label: "Physical address",
    classNames: "row-start-2 col-span-full",
    validate: (value:string) => true,
    disabled: () => true
  },

};

const reducer = (state: typeof INITIAL_FORM, action: ReducerAction) => {
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

export function useProfileEntityDetailsReducer() {
  return useReducer(reducer, INITIAL_FORM)
}

interface ReducerAction {
  type: "UPDATED";
  payload: {
    key: keyof typeof INITIAL_FORM;
    value: any;
  };
}
