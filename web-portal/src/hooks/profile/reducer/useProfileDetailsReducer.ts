import { useReducer } from "react";

const INITIAL_FORM = {
  name: {
    value: null,
    label: "Full names",
    classNames: "row-start-1 col-span-full",
    validate: (value:string) => true,
    validateMessage: "A valid name is required",
    disabled: () => true
  },
  surname: {
    value: null,
    label: "Surname",
    classNames: "row-start-2 col-start-1 col-span-3",
    validate: (value:string) => value?.length > 2,
    validateMessage: "A valid surname is required",
    disabled: () => true
  },
  idNumber: {
    value: null,
    label: "ID number",
    classNames: "row-start-2 col-start-4 col-span-3",
    validate: (value:string) => value?.length > 9,
    validateMessage: "A valid id number is required",
    disabled: () => true
  },
  email: {
    value: null,
    label: "Email address",
    classNames: "row-start-3 col-start-1 col-span-3",
    validate: (value:string) => value?.length > 2 && value.match(".*[@].*[.].*"),
    validateMessage: "A valid email address is required",
    disabled: () => true,
    type: 'email'
  },
  cellNumber: {
    value: null,
    label: "Cellphone no.",
    classNames: "row-start-3 col-start-4 col-span-3",
    validate: (value:string) => value?.length > 9,
    validateMessage: "A valid cell phone number is required",
  },
  permissionLevel: {
    value: "NO_ACCESS",
    label: "Permission level",
    classNames: "row-start-4 col-start-1 col-span-3",
    type: "SINGLE_SELECT",
    options: [
      {
        value: "NO_ACCESS",
        label: "No access",
      },
      {
        value: "NORMAL_USER",
        label: "Normal user",
      },
      {
        value: "FULL_ADMIN_ACCESS",
        label: "Full admin access",
      },
    ],
    validate: (value:string) => true,
    disabled: (value:string, currentUser:any) => currentUser?.role !== 'SUPER_ADMIN'
  },
  isApprover: {
    value: false,
    label: "This user is an Approver",
    classNames: "row-start-4 col-start-4 col-span-2",
    type: "CHECKBOX",
    validate: (value:string) => true,
    disabled: (value:string, currentUser:any) => currentUser?.role !== 'SUPER_ADMIN'
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

export function useProfileDetailsReducer(){
  return useReducer(reducer, INITIAL_FORM)
}

interface ReducerAction {
  type: "UPDATED";
  payload: {
    key: keyof typeof INITIAL_FORM;
    value: any;
  };
}
