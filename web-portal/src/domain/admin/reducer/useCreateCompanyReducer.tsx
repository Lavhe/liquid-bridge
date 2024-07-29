import { useReducer } from "react";

const INITIAL_FORM = {
  type: {
    label: "Type of Agent",
    classNames: "row-start-1 col-start-1 col-span-3",
    validate: (value: string) => true,
    validateMessage: "A valid type of agent is required",
  },
  registeredName: {
    label: "Agent Registered name",
    classNames: "row-start-1 col-start-4 col-span-3",
    validate: (value: string) => value?.length > 2,
    validateMessage: "A valid registered name is required",
  },
  name: {
    label: "Trading name",
    classNames: "row-start-2 col-start-1 col-span-3",
    validate: (value: string) => true,
    validateMessage: "A valid trading name is required",
  },
  registrationNumber: {
    label: "Registration number",
    classNames: "row-start-2 col-start-4 col-span-3",
    validate: (value: string) => value?.length > 2,
    validateMessage: "A valid registration number is required",
  },
  representativeFullNames: {
    label: "Agent representative full names",
    classNames: "row-start-3 col-span-full",
    validate: (value: string) => true,
    validateMessage: "A valid representative full names is required",
  },
  contactNumber: {
    label: "Contact number",
    classNames: "row-start-4 col-start-1 col-span-2",
    validate: (value: string) => true,
  },
  workTel: {
    label: "Work tel.",
    classNames: "row-start-4 col-start-3 col-span-2",
    validate: (value: string) => true,
  },
  email: {
    label: "Email",
    classNames: "row-start-4 col-start-5 col-span-2",
    validate: (value: string) => true,
  },
};

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

export function useCreateCompanyReducer() {
  return useReducer(reducer, INITIAL_FORM);
}
