import classname from "classnames";
import { useMemo } from "react";
import { useFirebase } from "../../../context/FirebaseContext";

export function RadioButton({
  label,
  value,
  variable,
  onChange,
  classNames,
  type,
  disabled,
  options,
}: any) {
  const { currentUser } = useFirebase();
  const isDisabled = useMemo(() => {
    return disabled?.(value, currentUser);
  }, [value]);

  const labelClassName = classname(
    "text-sm px-4 text-gray-600 font-medium w-2/3",
    {
      "text-gray-400": isDisabled,
    }
  );

  return (
    <div
      className={`${classNames} py-2 flex flex-nowrap w-full place-items-center`}
    >
      <label htmlFor="" className={labelClassName}>
        {label}
      </label>
      <div className="flex-initial text-right flex gap-6 justify-evenly">
        {options.map((option: any) => (
          <div className="flex flex-initial float-right">
            {!option.hidden && (
              <>
                <input
                  type="radio"
                  className=""
                  id={option.label}
                  value={option.value}
                  checked={option.value === value}
                  name={variable}
                  onChange={(e) =>
                    onChange({
                      target: { name: variable, value: option.value },
                    })
                  }
                  disabled={isDisabled}
                />
                <label className="text-xs mx-1 my-auto">{option.label}</label>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
