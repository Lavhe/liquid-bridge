import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import moment from "moment";
import { getStorage } from "firebase/storage";
import { DBUser } from "../utils/types";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC05ojeMG7hTF0DGH6DBhJPaSKXQiGTR04",
  authDomain: "liquidbridge-d3667.firebaseapp.com",
  projectId: "liquidbridge-d3667",
  storageBucket: "liquidbridge-d3667.appspot.com",
  messagingSenderId: "707878167704",
  appId: "1:707878167704:web:5160f31c8678d2a074dced",
};

export enum Collection {
  Users = "/users",
  AuditTrail = "/audit-trail",
  Application = "/applications",
  Blocked = "/blocked",
  Companies = "/companies",
  Quotes = "/quotes",
  Settings = "/settings",
}

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const userCollection = (path: string = "") =>
  collection(firestore, Collection.Users, path);

const applicationCollection = (path: string = "") =>
  collection(firestore, Collection.Application, path);

const quoteCollection = (path: string ="") => collection(firestore, Collection.Quotes, path)

const blockedDoc = (path: string = "") =>
  doc(firestore, Collection.Blocked, path);

const applicationDoc = (path: string = "") =>
  doc(firestore, Collection.Application, path);

const userDoc = (path: string = "") => doc(firestore, Collection.Users, path);

const companyCollection = (path: string = "") =>
  collection(firestore, Collection.Companies, path);

const companyDoc = (path: string = "") =>
  doc(firestore, Collection.Companies, path);

const auditTrailDoc = (path: string = "") =>
  doc(firestore, Collection.AuditTrail, path);

const quoteDoc = (path: string = "") => doc(firestore, Collection.Quotes, path);

const settingsDoc = (path: "QuoteGenerator") =>
  doc(firestore, Collection.Settings, path);

const MyFirebaseContext = createContext({
  storage,
  firebaseApp,
  auth,
  userCollection,
  userDoc,
  companyCollection,
  companyDoc,
  applicationCollection,
  applicationDoc,
  blockedDoc,
  addAuditTrail: (type: AuditTrailType, data: any) => {},
  currentUser: null as DBUser | null,
  quoteDoc,
  quoteCollection,
  settingsDoc,
  setCurrentUser: (
    _currentUser: DBUser | null | ((u: DBUser | null) => DBUser)
  ) => {},
  logout: () => {},
});

/**
 * Helper hook for the firebase context
 */
export function useFirebase() {
  return useContext(MyFirebaseContext);
}

/**
 * Provider for the firebase context
 *
 * @param props - content inside the provider
 */
export function FirebaseProvider(
  props: PropsWithChildren<FirebaseProviderProps>
) {
  const storedUser = JSON.parse(
    window.localStorage.getItem("currentUser") || "null"
  );
  const [currentUser, setCurrentUser] = useState<DBUser | null>(storedUser);
  const { children, loading } = props;

  useEffect(() => {
    if (!currentUser) {
      return window.localStorage.removeItem("currentUser");
    }

    addAuditTrail("LOG_IN", {
      [moment().format("DD/MM/YYYY HH:mm:ss")]: true,
    });
    window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  const logout = useCallback(async () => {
    loading(true);
    try {
      await addAuditTrail("LOG_OUT", {
        [moment().format("DD/MM/YYYY HH:mm:ss")]: true,
      });
    } catch (err) {}
    loading(false);
    signOut(auth);
  }, []);

  const addAuditTrail = useCallback(
    async (type: AuditTrailType, data: any) => {
      const docId = data?.id || currentUser?.email;

      const docRef = auditTrailDoc(
        docId
          ? `${currentUser?.company?.email}/${type}/${docId}`
          : `unknown/${type}/${moment().format("DD/MM/YYYY HH:mm:ss")}`
      );

      const doc = JSON.parse(
        JSON.stringify({
          ...data,
          displayName: currentUser?.displayName,
          companyName: currentUser?.company?.name,
        })
      );
      console.log(`${currentUser?.company?.email}/${type}/${docId}`, doc);

      await setDoc(
        docRef,
        {
          ...doc,
          date: serverTimestamp(),
        },
        {
          merge: true,
        }
      );
    },
    [currentUser]
  );

  useEffect(() => {
    onAuthStateChanged(
      auth,
      async (user) => {
        if (!user && currentUser) {
          setCurrentUser(null);
        }
        loading(false);
      },
      (err) => {
        setCurrentUser(null);
        loading(false);
      }
    );
  }, [onAuthStateChanged, addAuditTrail, loading]);

  return (
    <MyFirebaseContext.Provider
      value={{
        storage,
        firebaseApp,
        auth,
        currentUser,
        setCurrentUser,
        logout,
        userCollection,
        userDoc,
        companyCollection,
        companyDoc,
        addAuditTrail,
        applicationCollection,
        quoteCollection,
        applicationDoc,
        blockedDoc,
        quoteDoc,
        settingsDoc,
      }}
    >
      {children}
    </MyFirebaseContext.Provider>
  );
}
interface FirebaseProviderProps {
  loading: (loading: boolean) => void;
}

type AuditTrailType =
  | "LOG_IN"
  | "LOG_OUT"
  | "CREATED_NEW_USER"
  | "UPDATED_PROFILE"
  | "UPDATED_APPLICATION"
  | "CREATED_NEW_APPLICATION"
  | "CREATED_NEW_QUOTE"
  | "UPDATED_COMPANY"
  | "UPDATED_SETTINGS"
  | "GENERATED_QUOTE";
