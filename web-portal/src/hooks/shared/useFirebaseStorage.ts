import {getDownloadURL, ref,uploadBytesResumable} from "firebase/storage"
import { useCallback } from "react"
import { useFirebase } from "../../context/FirebaseContext";

export function useFirebaseStorage(){
    const { storage, currentUser } = useFirebase();

    const uploadApplicationFile = useCallback(async (obj: {applicationId:string, file: File}) => {
        return new Promise((resolve,reject) => {
            const storageRef = ref(storage, `/applications/${obj.applicationId}/${obj.file.name}`);
            const uploadTask = uploadBytesResumable(storageRef,obj.file)
             
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
        
                    // update progress
                    console.log("UPLOADING....", percent);
                },
                (err) => reject(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((url) => {
                        return resolve(url);
                    })
                    .catch(err => reject(err))
                }); 
        })
    },[])

    return { uploadApplicationFile }
}