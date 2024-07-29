import { PropsWithChildren, useEffect } from "react";

export function Dialog({
  children,
  onHide,
  actionText,
  cancelText,
  onSubmit,
  title,
  hideSubmit,
  hideCancel,
  disableSubmit,
}: PropsWithChildren<DialogProps>) {
  useEffect(() => {
    const prevScroll = window.scrollY;

    window.scrollTo({
      top: 0,
    });

    return () => {
      window.scrollTo({ top: prevScroll });
    };
  }, []);

  return (
    <dialog className="transition-transform absolute top-0 bottom-0 h-screen w-screen grid place-items-center backdrop-blur-sm bg-black bg-opacity-70 z-20">
      <div className="relative pt-10 max-w-5xl px-4 shadow-md rounded-lg bg-white">
        <div className="w-full">
          <p className="text-center text-2xl py-4 font-semibold text-secondary">
            {title}
          </p>
          <div className="p-2 w-full">{children}</div>

          <div className="flex flex-row justify-center gap-6">
            {!hideCancel && (
              <button
                onClick={onHide}
                type="button"
                className="shadow-md my-6 rounded-full flex-nowrap justify-center align-center w-1/3 px-10 py-2 flex whitespace-nowrap place-items-center border border-primary text-secondary"
              >
                {cancelText}
              </button>
            )}
            {!hideSubmit && (
              <button
                onClick={onSubmit}
                disabled={disableSubmit}
                type="button"
                className="shadow-md my-6 rounded-full justify-center  align-center px-10 py-2  w-1/3 grid place-items-center whitespace-nowrap bg-primary text-white disabled:bg-gray-600 disabled:bg-opacity-50 disabled:cursor-not-allowed"
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

export interface DialogProps {
  onHide: () => void;
  actionText: string;
  cancelText: string;
  title: string;
  onSubmit: () => void;
  hideSubmit?: boolean;
  hideCancel?: boolean;
  disableSubmit?: boolean;
}
