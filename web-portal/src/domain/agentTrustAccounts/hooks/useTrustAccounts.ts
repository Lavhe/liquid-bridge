import { useCallback, useEffect, useReducer, useState } from "react";
import { UseCompanyProps, useCompany } from "../../../hooks/companies/useCompany";
import { INITIAL_FORM,useTrustAccountsReducer } from "../reducer/useTrustAccountsReducer";

export function useTrustAccounts({
    companyId
}: UseTrustAccountsProps){
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();
    const { updateCompany, error: saveError, isLoading, company } = useCompany({companyId});
    const [formArray, dispatch] = useTrustAccountsReducer();
  
    const debounceChange = (callback: any) => {
      clearTimeout(debounceTimer);
      setDebounceTimer(
        setTimeout(() => {
          callback();
        }, 1500)
      );
    };
  
    useEffect(() => {
      (async () => {
        const { trustAccounts } = await company;
        const accounts =
          trustAccounts?.map((account) => {
            return Object.keys(INITIAL_FORM).reduce((acc, key) => {
              return {
                ...acc,
                [key]: {
                  ...INITIAL_FORM[key as keyof typeof INITIAL_FORM],
                  value: account[key as keyof Omit<typeof INITIAL_FORM, 'status '>],
                },
              };
            }, {} as typeof INITIAL_FORM);
          }) || [];
  
        dispatch({
          type: "INIT",
          state: accounts,
        });
      })();
    }, []);
  
    const handleOnChange = useCallback(
      (e: any, index: number) => {
        const key = e.target.name;
        const value = e.target.value;
  
        dispatch({
          type: "UPDATED",
          payload: {
            key,
            value,
            index,
          },
        });
      },
      [dispatch]
    );
  
    useEffect(() => {
      const obj: Record<string, string>[] = [];
      formArray.forEach((form, i) => {
        // @ts-ignore
        const formKeys = Object.keys(form);
        const errorKey = formKeys.find(
          // @ts-ignore
          (key) => !form[key].validate(form[key].value)
        );
  
        if (errorKey) {
          // @ts-ignore
          return console.log(form[errorKey].validateMessage);
        }
  
        formKeys.forEach((key) => {
          // @ts-ignore
          if (!obj[i]) {
            obj[i] = {};
          }
  
          obj[i][key] = (form as any)[key].value;
        });
      });
  
    }, [formArray]);
  
    const handleAddNew = () => {
      dispatch({
        type: "ADD_NEW",
      });
    };
  
    const saveChanges = () => {
      const obj: Record<string, string>[] = [];
      formArray.forEach((form, i) => {
        // @ts-ignore
        const formKeys = Object.keys(form);
        const errorKey = formKeys.find(
          // @ts-ignore
          (key) => !form[key].validate(form[key].value)
        );
  
        if (errorKey) {
          // @ts-ignore
          return console.log(form[errorKey].validateMessage);
        }
  
        formKeys.forEach((key) => {
          // @ts-ignore
          if (!obj[i]) {
            obj[i] = {};
          }
  
          obj[i][key] = (form as any)[key].value;
        });
      });
  
      if (obj.length) {
        updateCompany({
          trustAccounts: obj,
        });
      }
    };

    return {
        formArray,
        handleOnChange,
        saveChanges,
        handleAddNew,
        saveError,
        isLoading
    }
}
type UseTrustAccountsProps = UseCompanyProps