import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useProfileEntityDetailsReducer } from "../../hooks/profile/reducer/useProfileEntityDetailsReducer";
import { useFirebase } from "../../context/FirebaseContext";
import { useRegisterUser } from "../../hooks/users/useRegisterUser";
import { Field } from "../shared/form";

export function ProfileEntityDetails(props: MyProfileDetailsProps) {
  const { currentUser } = useFirebase();
  const { error } = props;
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();
  const [form, dispatch] = useProfileEntityDetailsReducer();
  const { updateUser } = useRegisterUser();

  useEffect(() => {
    Object.keys(form).forEach((key) => {
      if (key === "companyName") {
        // @ts-ignore
        form[key].value = currentUser?.company?.name;
      } else {
        // @ts-ignore
        form[key].value = currentUser[key];
      }
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

    const obj: any = {};

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
      <div className="flex place-items-center p-4 mt-3">
        <span className="flex-1 text-2xl text-gray-400 whitespace-nowrap">
          Agent details
        </span>
        <span className="text-blue-400 text-sm underline cursor-pointer">
          Do you have any amendments? Click here to request for amendments
        </span>
      </div>
      <div className="grid grid-cols-6 grid-rows-2">
        {Object.keys(form).map((key) => (
          <Field
            variable={key}
            // @ts-ignore
            {...form[key]}
            onChange={handleOnChange}
          />
        ))}
      </div>
      {error && <p className="text-danger text-center py-2">{error}</p>}
    </>
  );
}

interface MyProfileDetailsProps {
  error?: string;
}
