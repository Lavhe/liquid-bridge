import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useProfileDetailsReducer } from "../../hooks/profile/reducer/useProfileDetailsReducer";
import { useFirebase } from "../../context/FirebaseContext";
import { useRegisterUser } from "../../hooks/users/useRegisterUser";
import { Field } from "../shared/form";
import { ChangePassword } from "./ChangePassword";

// TODO: Remove the ts-ignore
export function MyProfileDetails(props: MyProfileDetailsProps) {
  const { currentUser } = useFirebase();
  const { error } = props;
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();
  const [form, dispatch] = useProfileDetailsReducer();
  const { updateUser } = useRegisterUser();

  useEffect(() => {
    Object.keys(form).forEach((key) => {
      // @ts-ignore
      form[key].value = currentUser[key];
    });
  }, [currentUser]);

  const debounceChange = (callback: any) => {
    clearTimeout(debounceTimer);
    setDebounceTimer(
      setTimeout(() => {
        callback();
      }, 1500)
    );
  };

  const handleOnChange = useCallback(
    (e: any) => {
      const key = e.target.name;
      let value = e.target.value;
      // @ts-ignore
      const { type } = form[key];

      if (type === "CHECKBOX") {
        value = e.target.checked;
      }

      dispatch({
        type: "UPDATED",
        payload: {
          key,
          value,
        },
      });
    },
    [dispatch]
  );

  useEffect(() => {
    const formKeys = Object.keys(form);
    const errorKey = formKeys.find(
      // @ts-ignore
      (key) => !form[key].validate(form[key].value)
    );

    if (errorKey) {
      // @ts-ignore
      return console.log(form[errorKey].validateMessage);
    }

    const obj: any = {
      displayName: `${form["name"].value} ${form["surname"].value}`,
    };

    formKeys.forEach((key) => {
      // @ts-ignore
      obj[key] = form[key].value;
    });

    debounceChange(() => {
      updateUser(obj);
    });
  }, [form]);

  return (
    <>
      <span className="text-2xl text-secondary p-4">My profile details</span>
      <div className="grid grid-cols-6 grid-rows-4">
        {Object.keys(form).map((key) => (
          <Field
            variable={key}
            // @ts-ignore
            {...form[key]}
            onChange={handleOnChange}
          />
        ))}
      </div>
      <ChangePassword />
      {error && <p className="text-danger text-center py-2">{error}</p>}
    </>
  );
}

interface MyProfileDetailsProps {
  error?: string;
}