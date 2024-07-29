import {
  CollectionReference,
  DocumentData,
  getDocs,
  Query,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Collection, useFirebase } from "../../../context/FirebaseContext";
import { DropDown, DropDownProps } from "../DropDown";

export function SingleSelect({
  label,
  value,
  variable,
  onChange,
  classNames,
  options,
  dbOptions,
  noLabel,
  placeholder,
  disabled,
}: any) {
  const [items, setItems] = useState<DropDownProps["items"]>([]);
  const { userCollection, companyCollection, companyDoc, currentUser } =
    useFirebase();

  const isDisabled = useMemo(() => {
    return disabled?.(value, currentUser);
  }, [value]);

  useEffect(() => {
    if (!dbOptions) {
      return setItems(options);
    }

    const companyRef = companyDoc(currentUser?.company.id);

    let queryRef: Query<DocumentData> | null = null;
    switch (dbOptions.collection) {
      case Collection.Users:
        queryRef = query(
          userCollection(),
          ...dbOptions.where({ currentUser, companyRef })
        );
        break;
      case Collection.Companies:
        queryRef = query(
          companyCollection(),
          ...dbOptions.where({ currentUser, companyRef })
        );
        break;
    }

    if (queryRef) {
      (async () => {
        const querySnapshot = await getDocs(queryRef);
        setItems((i) => {
          const newItems: typeof i = [];

          const allDocs: any[] = dbOptions.list(
            querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }))
          );

          console.log({ allDocs, newItems });
          return (allDocs?.map((doc) => dbOptions.format(doc)) ||
            []) as typeof i;
        });
      })();
    }
  }, [query, options]);

  return (
    <div
      className={`${classNames} py-2 flex flex-nowrap whitespace-nowrap w-full place-items-center`}
    >
      {!noLabel && (
        <label htmlFor="" className="text-xs px-4 text-gray-600 font-medium">
          {label}
        </label>
      )}
      <DropDown
        className="h-full text-xs"
        onChange={onChange}
        items={items}
        name={variable}
        label={items.find((o: any) => o.value === value)?.label || "-"}
        placeholder={placeholder}
        disabled={isDisabled}
      />
    </div>
  );
}
