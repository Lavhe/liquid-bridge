import { DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useFirebase } from "../../context/FirebaseContext";

export function useEnsureNotBlocked(){
    const { blockedDoc, currentUser } = useFirebase();
    const [blocked, setBlocked] = useState<DocumentData | undefined>()

    useEffect(() => {
        if(!currentUser){
            return;
        }

        const companyBlockedRef = blockedDoc(`/${currentUser.company.email}`);
        const userBlockedRef = blockedDoc(`/${currentUser.email}`);

        (async () => {
            const userBlocked = (await getDoc(userBlockedRef)).data()
            const companyBlocked = (await getDoc(companyBlockedRef)).data()

            setBlocked(userBlocked || companyBlocked)
        })()
    }, [])

    return {
        blocked
    }
}