import { Icon } from "@mdi/react";
import { useReducer, useState, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { INITIAL_FORM, reducer } from "../../hooks/application/reducer/form";
import { useApplication } from "../../hooks/application/useApplication";
import { Loader } from "../shared";
import { Field } from "../shared/form";
import { mdiPlus } from "@mdi/js";
import { useFirebaseStorage } from "../../hooks/shared/useFirebaseStorage";
import { ApplicationState } from "../../utils/utils";
import { useFirebase } from "../../context/FirebaseContext";
import { TextArea } from "../shared/form/TextArea";
import classnames from "classnames";

export function AddNewApplication() {
  const [applicationId, setApplicationId] = useState<string>();
  const [page, setPage] = useState("BASIC" as "BASIC" | "CONVEYANCER");
  const [form, dispatch] = useReducer(reducer, INITIAL_FORM);
  const { addOrUpdate, get, isLoading } = useApplication({});
  const { search } = useLocation();
  const { uploadApplicationFile } = useFirebaseStorage();
  const { currentUser } = useFirebase();

  useEffect(() => {
    const id = search
      .replace("?", "")
      .split("&")
      .find((v) => v.includes("applicationId="))
      ?.replace("applicationId=", "");

    if (!id) {
      Object.keys(form).forEach((key) => {
        form[key].value = undefined;
      });
      return;
    }

    setApplicationId(id);
  }, []);

  useEffect(() => {
    form["userCompletingApplication"].value = currentUser?.displayName;
    form["conveyancerName"].value = currentUser?.company?.name;

    if (!applicationId) {
      return;
    }

    get(applicationId)
      .then((application) => {
        console.log({ application });
        Object.keys(form)
          .filter(
            (key) =>
              !["hasConfirmedTsAndCs", "hasConfirmedTrueInformation"].includes(
                key
              )
          )
          .forEach((key) => {
            form[key].value = (application as any)[key];
          });
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [applicationId]);

  const handleOnChange = useCallback(
    ({ target }: ChangeEvent) => {
      let { name, checked, value, files } = target;
      const key = name as keyof typeof form;

      const { type } = form[key];

      if (type === "CHECKBOX") {
        value = checked;
      }

      if (type === "SINGLE_FILE_UPLOAD") {
        value = files[0];
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

  const handleOnSave = useCallback(
    async (baseObj: Record<string, any> = {}) => {
      const errorKey = null;

      if (errorKey) {
        // @ts-ignore
        return alert(form[errorKey]?.validateMessage);
      }

      const obj: any = {};

      for (const key in form) {
        switch (form[key].type) {
          case "SINGLE_FILE_UPLOAD":
            // ? All file uploads are handled after the application has been saved below
            break;
          default:
            obj[key] = form[key].value;
            break;
        }
      }

      const newApplicationId = await addOrUpdate(
        JSON.parse(JSON.stringify({ ...obj, ...baseObj }))
      );
      setApplicationId(newApplicationId);

      try {
        const uploadedFiles: any = {};
        console.log({ form });
        for (const key in form) {
          if (
            form[key].value &&
            form[key].type === "SINGLE_FILE_UPLOAD" &&
            typeof form[key].value !== "string"
          ) {
            console.log("UPLOADING.....", form[key].value);
            // ? All file uploads are handled after the application has been saved below
            uploadedFiles[key] = await uploadApplicationFile({
              applicationId: newApplicationId,
              file: form[key].value,
            });
            console.log("DONE.....", uploadedFiles[key]);

            dispatch({
              type: "UPDATED",
              payload: {
                key,
                value: uploadedFiles[key],
              },
            });
          }
        }

        if (Object.keys(uploadedFiles).length) {
          await addOrUpdate(
            JSON.parse(
              JSON.stringify({ ...uploadedFiles, id: newApplicationId })
            )
          );
        }
      } catch (err) {
        console.log({ err });
      }
    },
    [form]
  );

  const nextPageOrSubmit = () => {
    if (page === "BASIC") {
      return setPage("CONVEYANCER");
    }

    handleOnSave({
      state: ApplicationState.SUBMITTED,
      submitter: {
        email: currentUser?.email,
        displayName: currentUser?.displayName,
      },
    });
  };

  const saveDraft = () => {
    handleOnSave({
      state: ApplicationState.DRAFT,
    });
  };

  const isDisabled = useMemo(() => {
    const confirmed = [
      "hasConfirmedTsAndCs",
      "hasConfirmedTrueInformation",
    ].every((key) => form[key].value);
    console.log({ confirmed, page });
    if (confirmed || page === "BASIC") return false;

    return true;
  }, [form, page]);

  return (
    <section className="w-full rounded-tl-md rounded-bl-md">
      {isLoading && <Loader size="full-screen" />}
      {page === "BASIC" && (
        <BasicForm form={form} handleOnChange={handleOnChange} />
      )}
      {page === "CONVEYANCER" && (
        <ConveyancerForm form={form} handleOnChange={handleOnChange} />
      )}
      {form.approver.value !== currentUser?.email && (
        <SaveApplication
          saveDraft={saveDraft}
          nextPageOrSubmit={nextPageOrSubmit}
          page={page}
          isDisabled={isDisabled}
        />
      )}
      {form.approver.value === currentUser?.email &&
        form.state?.value === ApplicationState.SUBMITTED && (
          <ApproveApplication
            applicationId={applicationId}
            addOrUpdate={addOrUpdate}
          />
        )}
    </section>
  );
}

function SaveApplication({
  saveDraft,
  nextPageOrSubmit,
  page,
  isDisabled,
}: any) {
  const className = classnames(
    "shadow-md my-6 rounded-full justify-center align-center w-1/3 py-2 mx-2 grid place-items-center whitespace-nowrap bg-primary text-white hover:bg-opacity-70",
    {
      "cursor-not-allowed bg-gray-400 hover:bg-opacity-100": isDisabled,
    }
  );

  return (
    <div className="flex flex-row justify-center mx-10 my-6">
      <button
        onClick={saveDraft}
        type="button"
        className="shadow-md my-6 rounded-full flex-nowrap text-primary w-1/3 justify-center align-center px-10 py-2 flex whitespace-nowrap place-items-center border border-primary hover:bg-gray-100"
      >
        Save Application to Drafts
      </button>
      <button
        onClick={nextPageOrSubmit}
        disabled={isDisabled}
        type="button"
        className={className}
      >
        {page === "CONVEYANCER" ? "Submit Application" : "Next"}
      </button>
    </div>
  );
}

function ApproveApplication({ applicationId, addOrUpdate }: any) {
  const [declineReason, setDeclineReason] = useState("");

  const handleApproveApplication = async (state: ApplicationState) => {
    await addOrUpdate(
      JSON.parse(
        JSON.stringify({
          id: applicationId,
          declineReason,
          state,
        })
      )
    );
  };

  return (
    <div className="flex flex-row justify-center gap-12 mx-12 my-6">
      <div className="flex flex-col gap-2 flex-1 place-items-center">
        <TextArea
          placeholder="Reason for declining"
          value={declineReason}
          variable="declineReason"
          onChange={(e: any) => setDeclineReason(e.target.value)}
        />
        <button
          onClick={() => handleApproveApplication(ApplicationState.DECLINED)}
          type="button"
          className="shadow-md rounded-full flex-nowrap text-red-400 justify-center align-center px-10 py-2 flex whitespace-nowrap place-items-center border border-red-400 hover:bg-gray-100"
        >
          Decline
        </button>
      </div>
      <div className="flex flex-1 place-items-center">
        <button
          onClick={() => handleApproveApplication(ApplicationState.APPROVED)}
          type="button"
          className="shadow-md rounded-full py-2 justify-center align-center flex-1 flex-nowrap mx-2 flex place-items-center whitespace-nowrap bg-primary text-white hover:bg-opacity-70"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

function BasicForm({ form, handleOnChange }: any) {
  return (
    <>
      <div className="my-2 py-2 px-4 uppercase text-xs font-semibold bg-primary bg-opacity-20 rounded-sm text-secondary">
        Seller's details
      </div>
      <div className="grid grid-cols-2 grid-rows-5 my-6">
        {Object.keys(form)
          .filter((key) => form[key].section === "SELLER_DETAILS")
          .map((key) => (
            <Field
              variable={key}
              {...form[key as keyof typeof form]}
              onChange={handleOnChange}
            />
          ))}
      </div>
      <div className="my-2 py-2 px-4 uppercase text-xs font-semibold bg-primary bg-opacity-20 rounded-sm text-secondary">
        Transaction Details
      </div>
      <p className="font-semibold py-4 text-xs px-4">
        Property Description "The property":
      </p>
      <div className="grid grid-cols-4 grid-rows-8">
        {Object.keys(form)
          .filter((key) => form[key].section === "TRANSACTION_DETAILS")
          .map((key) => (
            <Field
              variable={key}
              {...form[key as keyof typeof form]}
              onChange={handleOnChange}
            />
          ))}
      </div>
    </>
  );
}

function ConveyancerForm({ form, handleOnChange }: any) {
  return (
    <>
      <div className="my-2 py-2 px-4 uppercase text-xs font-semibold bg-primary bg-opacity-20 rounded-sm text-secondary">
        CONVEYANCER CONFIRMS THE BELOW
      </div>
      <div className="grid grid-rows-5 my-6">
        {Object.keys(form)
          .filter((key) => form[key].section === "CONVEYANCER_CONFIRM")
          .filter(
            (key) =>
              key !== "wasAdvertDoneInLine" ||
              (key === "wasAdvertDoneInLine" &&
                form["haveShareholdersSign"].value)
          )
          .map((key) => (
            <Field
              variable={key}
              {...form[key as keyof typeof form]}
              onChange={handleOnChange}
            />
          ))}
      </div>
      <OutstandingItemsBeforeLodgement />
      <div className="my-2 py-2 px-4 uppercase text-xs font-semibold bg-primary bg-opacity-20 rounded-sm text-secondary">
        CONVEYANCER DETAILS
      </div>
      <div className="grid grid-cols-6 grid-rows-5">
        {Object.keys(form)
          .filter((key) => form[key].section === "CONVEYANCER_DETAILS")
          .map((key) => (
            <Field
              variable={key}
              {...form[key as keyof typeof form]}
              onChange={handleOnChange}
            />
          ))}
      </div>
    </>
  );
}

function OutstandingItemsBeforeLodgement() {
  const [outstandingItems, setOutstandingItems] = useState<any[]>([]);

  return (
    <section>
      <p className="text-sm px-4 text-gray-600 font-medium">
        Please confirm what items remain outstanding before lodgement can take
        place
      </p>
      {outstandingItems.map((item) => (
        <div className="flex gap-4">
          <Field
            type="TEXT"
            validate={() => true}
            variable="name"
            onChange={(e) => console.log({ e })}
            label=""
            classNames="flex-1"
            placeholder="Please specify the item here"
          />
          <Field
            type="TEXT"
            validate={() => true}
            variable="name"
            onChange={(e) => console.log({ e })}
            label="Expected date of lodgement"
            classNames="flex-1"
          />
        </div>
      ))}
      <div></div>
      <button
        onClick={() => setOutstandingItems((o) => o.concat([{}]))}
        className="rounded-full bg-gray-100 px-2 flex place-items-center hover:bg-gray-400 m-6"
      >
        <Icon
          size={1}
          path={mdiPlus}
          className="bg-gray-200 rounded-full p-1"
        />
        <span className="text-xs px-3 py-2">Add another item</span>
      </button>
    </section>
  );
}

interface ChangeEvent {
  target: {
    name: string;
    value: string | number | boolean | File | File[];
    checked: boolean;
    files: File[];
  };
}
