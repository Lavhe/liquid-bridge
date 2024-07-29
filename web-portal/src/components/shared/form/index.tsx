import { Checkbox } from "./Checkbox";
import { SingleSelect } from "./SingleSelect";
import { TextInput } from "./TextInput";
import { TextArea } from "./TextArea";
import { RadioButton } from "./RadioButton";
import { ChangeEvent } from "react";
import { SingleFileUpload } from "./SingleFileUpload";
import { Collection, useFirebase } from "../../../context/FirebaseContext";
import type { QueryConstraint } from "firebase/firestore";
import { DBUser } from "../../../utils/types";

export type FormFieldType =
  | "CHECKBOX"
  | "SINGLE_SELECT"
  | "TEXT"
  | "TEXTAREA"
  | "RADIO_BUTTON"
  | "SINGLE_FILE_UPLOAD"
  | "DATE"
  | "PASSWORD";

export interface FormField<T> {
  value?: T;
  label: string;
  classNames?: string;
  type: FormFieldType;
  placeholder?: string;
  prefix?: string;
  disabled?: (value: T) => boolean;
  show?: (input: { currentUser: DBUser | null }) => boolean;
  options?: {
    value: T;
    label: string;
    hidden?: boolean;
  }[];
  validate: (value: T) => boolean | string;
  validateMessage?: string;
  dbOptions?: {
    collection: Collection;
    list: (results: any[]) => any[];
    where: (input: any) => QueryConstraint[];
    format: (result: any) => any;
  };
}

export function Field<T>(props: FieldProps<T>) {
  const { currentUser } = useFirebase();
  const mustShow = props.show?.({ currentUser }) ?? true;

  if (!mustShow) {
    return null;
  }

  switch (props.type) {
    case "CHECKBOX":
      return <Checkbox {...props} />;
    case "SINGLE_SELECT":
      return <SingleSelect {...props} />;
    case "TEXTAREA":
      return <TextArea {...props} />;
    case "RADIO_BUTTON":
      return <RadioButton {...props} />;
    case "SINGLE_FILE_UPLOAD":
      return <SingleFileUpload {...props} />;
    case "PASSWORD":
      return <TextInput {...props} type="password" />;
    default:
      return <TextInput {...props} />;
  }
}

type FieldProps<T> = FormField<T> & {
  onChange: (e: ChangeEvent) => void;
  variable: string;
};
