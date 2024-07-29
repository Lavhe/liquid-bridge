import { ApplicationTabs } from "../../hooks/application/useApplication";
import {
  EntityTransactionFilter,
  useEntityTransactions,
} from "../../hooks/dashboard/useEntityTransactions";
import { Loader } from "../shared";
import { SearchWithFilter } from "../shared/form/SearchWithFilter";
import { Table } from "../shared/Table";

const filters = [
  EntityTransactionFilter.CLIENT_NAME,
  EntityTransactionFilter.FILE_NAME,
  EntityTransactionFilter.APPLICATION,
  EntityTransactionFilter.NORMAL_USER,
  EntityTransactionFilter.SUPER_USER,
  EntityTransactionFilter.APPROVER,
];

export function EntityTransactions() {
  const { headings, data, onSearch, isLoading } = useEntityTransactions({
    tab: ApplicationTabs.ENTITY_APPLICATION,
  });

  return (
    <section className="p-10 bg-gray-100 rounded-tl-md rounded-bl-md">
      <div className="flex flex-col gap-2">
        <span className="text-4xl text-secondary">Entity Transactions</span>
        <span className="text-xl">
          Transactions made by other users within your company/entity
        </span>
        <SearchWithFilter filters={filters} onSearch={onSearch} />

        {isLoading && <Loader />}
        <Table headings={headings} data={data} />
      </div>
    </section>
  );
}
