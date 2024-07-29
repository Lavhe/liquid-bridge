import { useReducer } from "react";
import { FormField } from "../../../components/shared/form";
import { Collection } from "../../../context/FirebaseContext";

const INITIAL_FORM = {
  name: {
    value: null,
    label: "Full names",
    classNames: "row-start-1 col-span-3",
    validate: (value:string) => value?.length > 2,
    validateMessage: "A valid name is required",
    type: 'TEXT'
  },
  role: {
    value: false,
    label: "Role",
    classNames: "row-start-1 col-start-4",
    type: "SINGLE_SELECT",
    options: [
      {
        value: "NORMAL",
        label: "NORMAL",
      },
      {
        value: "SUPER_ADMIN",
        label: "SUPER_ADMIN",
      }
    ], 
    show: ({ currentUser }: any) => currentUser?.role === "SUPER_ADMIN",
  },
  company: {
    value: null,
    label: "Agent",
    classNames: "row-start-1 col-start-5 col-span-2",
    validate: (value:string) => value?.length > 2,
    validateMessage: "A valid company is required",
    type: "SINGLE_SELECT",
    dbOptions: {
      collection: Collection.Companies,
      list: (results) => results,
      where: ({currentUser}) => [],
      format: (item) => ({ value:item.id, label: `${item.name} (${item.registrationNumber})` })
    },
    show: ({currentUser}) => currentUser?.role === 'SUPER_ADMIN'
  } as FormField<any>,
  surname: {
    label: "Surname",
    type: 'TEXT',
    classNames: "row-start-2 col-start-1 col-span-3",
    validate: (value:string) => value?.length > 2,
    validateMessage: "A valid surname is required",
    value: null
  },
  idNumber: {
    type: 'TEXT',
    label: "ID number",
    classNames: "row-start-2 col-start-4 col-span-3",
    validate: (value:string) => value?.length > 9,
    validateMessage: "A valid id number is required",
  },
  email: {
    type: 'TEXT',
    label: "Email address",
    classNames: "row-start-3 col-start-1 col-span-3",
    validate: (value:string) => value?.length > 2 && Boolean(value.match(".*[@].*[.].*")),
    validateMessage: "A valid email address is required",
  },
  cellNumber: {
    type: 'TEXT',
    label: "Cellphone no.",
    classNames: "row-start-3 col-start-4 col-span-3",
    validate: (value:string) => value?.length > 9,
    validateMessage: "A valid cell phone number is required",
  },
  designation: {
    type: 'TEXT',
    label: "Designation",
    classNames: "row-start-4 col-start-1 col-span-2",
    validate: (value:string) => true,
  },
  permissionLevel: {
    value: "NO_ACCESS",
    label: "Permission level",
    classNames: "row-start-4 col-start-3 col-span-2",
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
        label: "Full Admin Access",
      },
    ],
    validate: (value:string) => true,
  },
  isApprover: {
    value: false,
    label: "This user is an Approver",
    classNames: "row-start-4 col-start-5 col-span-2",
    type: "CHECKBOX",
    validate: (value:string) => true,
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

export function useAddNewUserReducer(){
    return useReducer(reducer, INITIAL_FORM);
}

interface ReducerAction {
  type: "UPDATED";
  payload: {
    key: keyof typeof INITIAL_FORM;
    value: any;
  };
}