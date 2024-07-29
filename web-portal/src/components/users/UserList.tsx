import { UserFilter, useUserList } from "../../hooks/users/useUserList";
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

export function UserList() {
  const { headings, data, onSearch, isLoading, error, update } = useUserList();

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="w-full px-10 rounded-tl-md rounded-bl-md">
      <div className="flex flex-col gap-2">
        <SearchWithFilter filters={filters} onSearch={onSearch} />
        {isLoading ? (
          <Loader />
        ) : (
          <Table
            settings={{
              headingClassNames: "bg-secondary text-white rounded-md",
            }}
            headings={headings}
            data={data}
            onChange={update}
          />
        )}
      </div>
    </section>
  );
}
