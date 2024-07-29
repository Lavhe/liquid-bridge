import { useCallback, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Field } from "../shared/form";
import { Icon } from "@mdi/react";
import { mdiLockOutline } from "@mdi/js";
import { useEditUserProfile } from "../../hooks/users/hooks/useEditUserProfile";

export function ChangePassword() {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { changePassword } = useEditUserProfile();

  const handleSaveChanges = useCallback(async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      if (password.length < 8) {
        throw new Error("Passwords must be longer than 8 characters!");
      }

      await changePassword(password, oldPassword);

      setShowChangePasswordModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  }, [password, confirmPassword, oldPassword]);

  if (showChangePasswordModal) {
    return (
      <Dialog
        onHide={() => setShowChangePasswordModal(false)}
        title="Change Password"
        actionText="Submit"
        cancelText="Cancel"
        onSubmit={handleSaveChanges}
      >
        <div className="w-full">
          <Field
            variable={"oldPassword"}
            type="PASSWORD"
            validate={() => true}
            label="Old Password"
            onChange={(e: any) => setOldPassword(e.target.value)}
          />
          <Field
            variable={"password"}
            type="PASSWORD"
            validate={() => true}
            label="New Password"
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <Field
            variable={"confirmPassword"}
            validate={() => true}
            type="PASSWORD"
            label="Confirm Password"
            onChange={(e: any) => setConfirmPassword(e.target.value)}
          />
        </div>
      </Dialog>
    );
  }

  return (
    <button
      onClick={() => setShowChangePasswordModal(true)}
      className="rounded-full w-1/6 bg-gray-100 px-2 flex place-items-center hover:bg-gray-400 m-4"
    >
      <Icon
        size={1}
        path={mdiLockOutline}
        className="bg-gray-200 rounded-full p-1"
      />
      <span className="text-xs px-3 py-2 whitespace-nowrap">
        Change Password
      </span>
    </button>
  );
}
