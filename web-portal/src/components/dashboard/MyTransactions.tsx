import { ApplicationTabs } from "../../hooks/application/useApplication";
import { useMyTransactions } from "../../hooks/dashboard/useMyTransactions ";
import { Loader } from "../shared";
import { Table } from "../shared/Table";

export function MyTransactions() {
  const { headings, data, isLoading } = useMyTransactions({
    tab: ApplicationTabs.MY_APPLICATION,
  });

  return (
    <section className="p-10 bg-gray-100 rounded-tl-md rounded-bl-md">
      <div className="flex flex-col gap-2">
        <span className="text-4xl text-secondary">My Transactions</span>
        <span className="text-xl pb-8">
          Active applications that haven't been financed yet
        </span>
        {isLoading && <Loader />}
        <Table headings={headings} data={data} />
      </div>
    </section>
  );
}
