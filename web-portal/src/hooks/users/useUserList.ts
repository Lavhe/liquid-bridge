import { getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react'
import { Heading } from '../../components/shared/Table';
import { useFirebase } from '../../context/FirebaseContext'
import { DBCompany } from '../../utils/types';


const headings: Heading = {
    displayName: { label: "Client name" },
    'company.name': { label: 'Agent', show:({currentUser}) => currentUser?.role === 'SUPER_ADMIN' },
    date: { label: "Created Date", type: 'DATE' },
    numOfApplications: { label: 'No. of applications' },
    email: { label: "Email address" },
    permissionLevel: { 
      label: "Permissions",
      type: "SINGLE_SELECT",
      options: [
        {
          value: "NO_ACCESS",
          label: "No access",
        },      {
          value: "NORMAL_USER",
          label: "Normal user",
        },
        {
          value: "FULL_ADMIN_ACCESS",
          label: "Full Admin Access",
        },
      ], 
      show: ({currentUser}) => currentUser?.role === 'SUPER_ADMIN' },
    'permissionLevel ': { label: "Permissions", show: ({currentUser}) => currentUser?.role !== 'SUPER_ADMIN' },
  role: {
    value: false,
    label: "Role",
    type: "SINGLE_SELECT",
    options: [
      {
        value: "NORMAL",
        label: "NORMAL",
      },
      {
        value: "SUPER_ADMIN",
        label: "SUPER_ADMIN",
      }
    ], 
    show: ({ currentUser }: any) => currentUser?.role === "SUPER_ADMIN",
  },
    status: { label: 'Status' ,
    type: "SINGLE_SELECT",
    options: [
      {
        value: "ACTIVE",
        label: "Active",
      },
      {
        value: "REMOVED",
        label: "Removed",
      },
      {
        value: "BLOCKED",
        label: "Blocked",
      },
    ], 
    show: ({currentUser}) => currentUser?.role === 'SUPER_ADMIN' },
    'status ': { label: 'Status',show: ({currentUser}) => currentUser?.role !== 'SUPER_ADMIN'  },
    isApprover: {
      value: false,
      label: "Approver?",
      type: "SINGLE_SELECT",
      options: [
        {
          value: true,
          label: "Yes",
        },
        {
          value: false,
          label: "No",
        }
      ], 
      show: ({currentUser}) => currentUser?.role === 'SUPER_ADMIN' 
    },
  }
  
export enum UserFilter {
  CLIENT_NAME = "CLIENT_NAME",
  FILE_NAME = "FILE_NAME",
  APPLICATION = "APPLICATION",
  NORMAL_USER = "NORMAL_USER",
  SUPER_USER = "SUPER_USER",
  APPROVER = "APPROVER",
}

export function useUserList(){
  const {  userCollection, applicationCollection, companyDoc, currentUser,userDoc,addAuditTrail } = useFirebase();
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState('');
  const [data,setData] = useState<any[]>([]);
    
    const load = useCallback(async () => {
      try{
          if(!currentUser){ throw new Error('You have to be logged in')}
          setIsLoading(true)
          setError('');
          const isSuperUser = currentUser?.role === 'SUPER_ADMIN';
          const queryFilters = [];

          const companies:Record<string, DBCompany> = {}
          if (!isSuperUser) {
            const companyRef = companyDoc(currentUser?.company.email);
            const company = await getDoc(companyRef);
            
            companies[companyRef.id] = {
              ...company.data(),
              id: company.id
            } as DBCompany

            queryFilters.push(where("company", '==', companyRef))
          }

          const userRef = query(userCollection(),...queryFilters );

          const querySnapshot = await getDocs(userRef);
          const allData:any[] = []
          for(const doc of querySnapshot.docs) {
            const data = doc.data();
            const applicationsRef = query(applicationCollection(), ...queryFilters, where('clientEmail','==', data.email))
            const { size: numOfApplications } = await getDocs(applicationsRef);
       
            if(data.company?.id && !companies[data.company?.id]){
              companies[data.company?.id] = {
                ...(await getDoc(data.company)).data() as any,
                id: data.company.id
              } as DBCompany
            }

            console.log({company: data.company})
            allData.push({
              ...data,
              id: doc.id,
              company: companies[data.company?.id],
              numOfApplications: numOfApplications || 0
            })
          }

          setData(allData);
          setIsLoading(false)
        }catch(err){
          setIsLoading(false)
          setError((err as any).message)
        }
    },[])


    const update = useCallback(async (form: any) => {
      try{
          
          const twoSecondsBefore = moment().subtract(2,'seconds');
          const currentData = data.find(d => d.id === form.id) || {};

          const change = Object.keys(form).filter((k) => (currentData as any)[k] !== form[k]).reduce((a,b) => {
              return ({...a,[b]:{
                  [moment().format('HH:mm:ss')]: form[b],
                  [twoSecondsBefore.format('HH:mm:ss')]: (currentData as any)[b]
              }})
          }, {})
          console.log({currentData, change})

          if(Object.keys(change).length === 0){
              return;
          }

          setIsLoading(true)
          setError('')
          const userRef = userDoc(form.id!)

          const userObj = {
              ...form,
              updated: serverTimestamp()
          }

          await updateDoc(userRef,userObj);

          addAuditTrail("UPDATED_PROFILE", change);

          setData(prev => {
            return prev.map(data => {
              if(data.id === form.id){
                return {
                  ...data,
                  ...form
                }
              }

              return data;
            })
          })  
          setIsLoading(false)
      }catch(err:any){
          let error = err.message
          setError(error)
          setIsLoading(false)
      }
  }, [data])


    const onSearch = useCallback(({filter, search} : { filter?: UserFilter,search:string}) => {
      console.log("SEARCHING.....", {filter,search})
      load()
  }, [load]);

    useEffect(() => {
      load()
    }, [load])

    return { headings, data, error, isLoading, onSearch, update }
}