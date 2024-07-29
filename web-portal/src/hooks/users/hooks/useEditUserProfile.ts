import { updatePassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { useFirebase } from "../../../context/FirebaseContext";

export function useEditUserProfile() {
  const { addAuditTrail, auth } = useFirebase();
  const changePassword = async (newPassword: string, oldPassword:string) => {
      
      const { currentUser } = getAuth()
      if (!currentUser) {
        throw new Error("You are not logged in");
      }
  
      await signInWithEmailAndPassword(auth,currentUser?.email || "" ,oldPassword);

      await updatePassword(currentUser, newPassword);
        addAuditTrail("UPDATED_PROFILE", {
        password: "CHANGED",
        });

        Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Password successfully changed.'
        });
  };

  return { changePassword };
}
