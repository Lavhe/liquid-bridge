import { signInWithEmailAndPassword, User, sendPasswordResetEmail } from 'firebase/auth'
import { collection, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useFirebase } from '../../context/FirebaseContext'
import { DBCompany, DBUser } from '../../utils/types';
import { formatAuthError, RoutePath } from '../../utils/utils';

export function useLogin(){
    const { auth ,currentUser,setCurrentUser , userDoc, companyDoc } = useFirebase();
    const navigate = useNavigate()
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState('')

    useEffect(() => {
        if(currentUser){
            return navigate(RoutePath.DASHBOARD)
        }
    }, [currentUser]);

    const syncDBUser = useCallback(async (user: User) => {
        const userRef = userDoc(user.email!)
        const userObj = JSON.parse(JSON.stringify(user.toJSON()));

        await setDoc(userRef,{
            ...userObj,
            lastLogin: serverTimestamp()
        },{
            merge: true
        });

        const doc = await getDoc(userDoc(user.email!));
        const fullUser = {
            ...(doc.data()),
            id: doc.id,
        } as any;

        const company = await getDoc(fullUser.company)

        const loggedInUser:DBUser = {
            ...fullUser,
            company: {
                ...(company.data() as DBCompany),
                email: company.id,
                id: company.id
            },
        };

        if(loggedInUser.status !== 'ACTIVE'){
            throw new Error(`Your account is not Active, please contact admin`);
        }
        console.log({loggedInUser})

        if(!loggedInUser.company || !loggedInUser.company.email || !loggedInUser.company.name){
            throw new Error(`Your account is not linked to any company, please contact admin`);
        }

        setCurrentUser(loggedInUser);
    }, [])

    const login = useCallback(async (username:string,password:string) => {
        setIsLoading(true)
        setError('')
        try{
            const results = await signInWithEmailAndPassword(auth,username,password);
            await syncDBUser(results.user);
        }catch(err:any){
            console.log({err});
            let error = err.message
            if(err.code){
                error = formatAuthError(err.code)
            }
            setError(error);
        }
        setIsLoading(false)
    }, [syncDBUser]);

    const resetPassword = useCallback(async (email:string) => {
        setIsLoading(true)
        setError('')
        try{
            await sendPasswordResetEmail(auth,email);
            Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Recovery email successfully sent.'
            });
            return navigate(RoutePath.LOGIN)
        }catch(err:any){
            console.log({err});
            let error = err.message
            if(err.code){
                error = formatAuthError(err.code)
            }
            setError(error);
        }
        setIsLoading(false)
    }, [syncDBUser]);

    return { login, isLoading, error, syncDBUser, resetPassword}
}