import { UserFilter, useApplication } from "../../hooks/admin/useApplication";
import { Loader } from "../shared";
import { SearchWithFilter } from "../shared/form/SearchWithFilter";
import { Table } from "../shared/Table";

const filters = [
  UserFilter.CLIENT_NAME,
  UserFilter.FILE_NAME,
  UserFilter.APPLICATION,
  UserFilter.NORMAL_USER,
  UserFilter.SUPER_USER,
  UserFilter.APPROVER,
];

export function DashboardApplications(props: DashboardApplicationsProps) {
  const { headings, data, onSearch, isLoading, error } = useApplication();

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="p-10 bg-gray-100 rounded-tl-md rounded-bl-md">
      <div className="flex flex-col gap-2">
        <span className="text-4xl text-secondary">New Applications</span>
        <span className="text-xl">
          Applications made by users from different entities
        </span>
        <SearchWithFilter filters={filters} onSearch={onSearch} />
        {isLoading && <Loader />}
        <Table
          settings={{
            headingClassNames: "bg-secondary text-white rounded-md",
          }}
          headings={headings}
          data={data}
          onChange={(change) => {
            alert("Change not supported!");
            console.log({ change });
          }}
        />
      </div>
    </section>
  );
}

interface DashboardApplicationsProps {}
