import { Loader } from "../../../components/shared";
import { Table } from "../../../components/shared/Table";

export function UserChanges() {
  return (
    <section className="p-10 bg-gray-100 rounded-tl-md rounded-bl-md">
      <div className="flex flex-col gap-2">
        <span className="text-4xl text-secondary">User Changes</span>
        <span className="text-xl">
          User changes made by super users and admin
        </span>

        <Loader />
        <Table headings={{}} data={[]} />
      </div>
    </section>
  );
}
