
import { serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react'
import { useFirebase } from '../../context/FirebaseContext'
import { DBCompany } from '../../utils/types';
import { formatAuthError } from '../../utils/utils';

export function useCompany({
    companyId
}:UseCompanyProps){
    const { companyDoc, addAuditTrail } = useFirebase();
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState('')

    const company = useMemo(async () => {
        const companyRef = companyDoc(companyId)

        const doc = await getDoc(companyRef)

        return {
            ...doc.data(),
            id: doc.id
        } as DBCompany
    }, [companyId]);

    const updateCompany = useCallback(async (form: any) => {
        try{
            const change = Object.keys(form).reduce((a,b) => {
                return ({...a,[b]:{
                    [moment().format('HH:mm:ss')]: form[b]
                }})
            }, {})

            if(Object.keys(change).length === 0){
                return;
            }

            setIsLoading(true)
            setError('')
            
            const companyRef = companyDoc(companyId)

            const companyObj = JSON.parse(JSON.stringify({
                ...form,
                updated: serverTimestamp()
            }))
            await setDoc(companyRef,companyObj, {
                merge: true
            });

            addAuditTrail("UPDATED_COMPANY", change);

            setIsLoading(false)
        }catch(err:any){
            let error = err.message
            console.log(err.message)
            if(err.code){
                error = formatAuthError(err.code)
            }
            setError(error)
            setIsLoading(false)
        }
    }, [companyId])

    return { updateCompany,company, isLoading, error }
}
export interface UseCompanyProps {
    companyId: string
}