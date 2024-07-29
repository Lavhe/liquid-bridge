import { createUserWithEmailAndPassword, updatePassword } from 'firebase/auth'
import { addDoc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useFirebase } from '../../context/FirebaseContext'
import { DBUser } from '../../utils/types';
import { formatAuthError } from '../../utils/utils';

export function useRegisterUser(){
    const { auth, setCurrentUser, currentUser , userDoc, companyDoc, addAuditTrail } = useFirebase();
    const [showAddNewUserDialog,setShowAddNewUserDialog] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState('')

    const toggleAddNewUserDialog = useCallback(() => {
        setShowAddNewUserDialog(s => !s);
    }, [])

    const addNewUser = useCallback(async (form: any) => {
        try{
            setIsLoading(true)
            setError('')

            const userRef = userDoc(form.email!)
            const doc = await getDoc(userRef)

            const companyRef = companyDoc(form.company)
            
            if(doc.exists()){
                throw new Error(`User with email ${form.email} already exists!`)
            }
            
            const newDoc = {
                ...form,
                status: 'ACTIVE',
                company: companyRef,
                date: serverTimestamp(),
                profilePic: `https://ui-avatars.com/api/?name=${form.surname}+${form.name}`
            }
            await setDoc(userRef,newDoc);

            await createUserWithEmailAndPassword(auth, form.email, form.email)

            setIsLoading(false)
            setShowAddNewUserDialog(false)

            addAuditTrail("CREATED_NEW_USER", {
                [form.email]:{
                    ...newDoc
                }
            });

            Swal.fire({
                text: `${form.displayName}, Successfully added!`,
                icon: "success",
            });
        }catch(err:any){
            let error = err.message
            console.log({err})
            if(err.code){
                error = formatAuthError(err.code)
            }
            setError(error)
            setIsLoading(false)
        }
    }, [])

    const updateUser = useCallback(async (form: any) => {
        try{
            if(!currentUser){
                throw new Error("You have to be logged in to perform this action.")
            }
            const twoSecondsBefore = moment().subtract(2,'seconds');
            
            const change = Object.keys(form).filter((k) => (currentUser as any)[k] !== form[k]).reduce((a,b) => {
                return ({...a,[b]:{
                    [moment().format('HH:mm:ss')]: form[b],
                    [twoSecondsBefore.format('HH:mm:ss')]: (currentUser as any)[b]
                }})
            }, {})

            if(Object.keys(change).length === 0){
                return;
            }

            setIsLoading(true)
            setError('')
            console.log({form})
            const userRef = userDoc(form.email!)
            
            // TODO: Update email and password on authentication db
            // await createUserWithEmailAndPassword(auth, form.email, form.email)

            delete form['password']
            const userObj = {
                ...form,
                updated: serverTimestamp()
            }
            await setDoc(userRef,userObj, {
                merge: true
            });

            setCurrentUser((s) => ({
                ...s,
                ...userObj
            }) as DBUser);

            addAuditTrail("UPDATED_PROFILE", change);

            setIsLoading(false)
        }catch(err:any){
            let error = err.message
            if(err.code){
                error = formatAuthError(err.code)
            }
            setError(error)
            setIsLoading(false)
        }
    }, [])

    return { showAddNewUserDialog,toggleAddNewUserDialog, updateUser,addNewUser, isLoading, error }
}