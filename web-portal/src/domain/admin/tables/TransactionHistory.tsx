import { Loader } from "../../../components/shared";
import { Table } from "../../../components/shared/Table";

export function TransactionHistory() {
  return (
    <section className="p-10 bg-gray-100 rounded-tl-md rounded-bl-md">
      <div className="flex flex-col gap-2">
        <span className="text-4xl text-secondary">Transaction History</span>
        <span className="text-xl">
          Transactions made by users for new applications
        </span>

        <Loader />
        <Table headings={{}} data={[]} />
      </div>
    </section>
  );
}
