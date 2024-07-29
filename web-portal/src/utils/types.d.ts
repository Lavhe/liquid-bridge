
import type {  User } from "firebase/auth";

export interface DBUser extends User {
    id: string;
    company: DBCompany;
    permissionLevel: string;
    isApprover: boolean;
    date: string;
    cellNumber: string;
    designation?: string;
    status: "ACTIVE" | "REMOVED";
    role: UserRoles;
    profilePic?:string;
}

export interface DBCompany {
    id: string;
    name: string;
    trustAccounts: {
      bankName: string;
      accountNumber: string;
      status: "ACTIVE" | "REMOVED";
    }[];
    contactNumber: string;
    type:string;
    registeredName:string;
    name:string;
    registrationNumber:string;
    representativeFullNames:string;
    contactNumber:string;
    workTel:string;
    email:string;
  }
  export type UserRoles = 'NORMAL' | 'SUPER_ADMIN'