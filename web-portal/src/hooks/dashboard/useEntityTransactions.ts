import { useCallback, useEffect } from 'react'
import { Heading } from '../../components/shared/Table';
import { RoutePath } from '../../utils/utils';
import { useApplication, UseApplicationProps } from '../application/useApplication';

const headings = {
  id: {
    label: "#",
    type: "ID",
    link: (value: string) => `${RoutePath.NEW_APPLICATIONS}?applicationId=${value}`,
  },
  clientName: { label: "Client name" },
  date: { label: "Date", type: "DATE" },
  status: { label: "Status", default: 'Draft' },
  viewPDF: { label: "View PDF", type: 'VIEW_PDF' },
} as Heading
  
export enum EntityTransactionFilter {
  CLIENT_NAME = "CLIENT_NAME",
  FILE_NAME = "FILE_NAME",
  APPLICATION = "APPLICATION",
  NORMAL_USER = "NORMAL_USER",
  SUPER_USER = "SUPER_USER",
  APPROVER = "APPROVER",
}

export function useEntityTransactions(props:UseEntityTransactionsProps){
    const { data, error, isLoading, onSearch } = useApplication(props);

    return { headings, data, onSearch, error, isLoading }
}

type UseEntityTransactionsProps = UseApplicationProps 