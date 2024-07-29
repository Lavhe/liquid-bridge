import { useReducer } from "react";
import { Heading } from "../../../components/shared";

export const INITIAL_FORM = {
  bankName: {
    value: null,
    label: "Bank Name",
    classNames: "row-start-1 col-start-1 col-span-3",
    validate: (value: string) => true,
    disabled: (value:string,currentUser: any) =>  currentUser?.role !== "SUPER_ADMIN",
  },
  accountNumber: {
    value: null,
    label: "Account Number",
    classNames: "row-start-1 col-start-4 col-span-3",
    validate: (value: string) => true,
    disabled: (value:string, currentUser: any) =>  currentUser?.role !== "SUPER_ADMIN",
  },
  status: {
    label: "Status",
    classNames: "row-start-1 col-start-8 col-span-3",
    type: "SINGLE_SELECT",
    options: [
      {
        value: "ACTIVE",
        label: "Active",
      },
      {
        value: "REMOVED",
        label: "Removed",
      },
      {
        value: "BLOCKED",
        label: "Blocked",
      },
    ],
    show: ({ currentUser }: any) => currentUser?.role === "SUPER_ADMIN",
    validate: (value: string) => true,
    disabled: () => false,
  },
  "status ": {
    label: "Status",
    classNames: "row-start-1 col-start-8 col-span-3",
    show: ({ currentUser }: any) => currentUser?.role !== "SUPER_ADMIN",
    validate: (value: string) => true,
    disabled: () => true,
  },
};

export const reducer = (
  state: typeof INITIAL_FORM[],
  action: ReducerAction
) => {
  switch (action.type) {
    case "INIT":
      if (action.state) {
        return [...action.state];
      }
      return [...state];
    case "ADD_NEW":
      return [...state, INITIAL_FORM];
    case "UPDATED":
      if (action.payload) {
        const { index, key, value } = action.payload;

        state[index] = {
          ...state[index],
          [key]: {
            ...state[index][key],
            value,
          },
        };
      }
      return [...state];
    default:
      return [...state];
  }
};

export function useTrustAccountsReducer() {
  return useReducer(reducer, []);
}

interface ReducerAction {
  type: "UPDATED" | "ADD_NEW" | "INIT";
  payload?: {
    key: keyof typeof INITIAL_FORM;
    value: any;
    index: number;
  };
  state?: typeof INITIAL_FORM[];
}
