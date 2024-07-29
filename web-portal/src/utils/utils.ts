/**
 * Converts an enum to a sentence
 * e.g. ACTIVE_USER_STATE -> Active User State
 */
export function convertEnumToSentence(value: any) {
    return value
      ?.toString()
      .replace(/_/gi, " ")
      .split(" ")
      .map((e: string) => e[0].toUpperCase() + e.slice(1).toLowerCase())
      .join(" ");
}

export function formatAuthError(errorCode:string){
    switch (errorCode) {
      case "ERROR_EMAIL_ALREADY_IN_USE":
      case "account-exists-with-different-credential":
      case "auth/email-already-in-use":
        return "Email already used. Go to login page.";
      case "ERROR_WRONG_PASSWORD":
      case "auth/wrong-password":
        return "Incorrect email or password";
      case "ERROR_USER_NOT_FOUND":
      case "auth/user-not-found":
        return "Incorrect email or password";
      case "ERROR_USER_DISABLED":
      case "auth/user-disabled":
        return "User disabled.";
      case "ERROR_TOO_MANY_REQUESTS":
        return "Too many requests to log into this account.";
      case "ERROR_OPERATION_NOT_ALLOWED":
      case "auth/operation-not-allowed":
        return "Server error, please try again later.";
      case "ERROR_INVALID_EMAIL":
      case "auth/invalid-email":
        return "Email address is invalid.";
      default:
        return "Login failed. Please try again.";
    }
}

export function formatMoney(value: number){
  if(isNaN(+value)){
    return ''
  }

  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(+value)
}

export enum ApplicationState {
  // ! MISSING INTERNAL APPROVAL AND DECLINES
  DRAFT = "DRAFT", // Normal save without submitting
  SUBMITTED = "SUBMITTED", // Application submitted to approver
  APPROVED = "APPROVED", // Approved by approver
  DECLINED = "DECLINED", // Declined by approver
  FINANCED = "FINANCED", // Liquid bridge paid money to the trust account
  PAID = "PAID" // Client paid back liquid bridge
}

export enum SettlementStatementStatus {
  REQUESTED = "REQUESTED",
  SENT = "SENT",
  SETTLED = "SETTLED"
}

export const RoutePath = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot/password",
  PROFILE: "/profile",
  USERS: "/users",
  APPLICATIONS: "/applications",
  ADMIN_APPLICATIONS: '/admin/application',
  NEW_APPLICATIONS: "/applications/new",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
  EMAIL_DISCLAIMER: "/email-disclaimer",
  AGENT: '/agent'
} as const