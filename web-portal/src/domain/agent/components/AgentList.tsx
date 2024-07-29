import { Loader, Table } from "../../../components/shared";
import { AgentFilter, useAgentList } from "../hooks/useAgentList";

import { SearchWithFilter } from "../../../components/shared/form/SearchWithFilter";

const filters = [
  AgentFilter.CLIENT_NAME,
  AgentFilter.FILE_NAME,
  AgentFilter.APPLICATION,
  AgentFilter.NORMAL_USER,
  AgentFilter.SUPER_USER,
  AgentFilter.APPROVER,
];

export function AgentList() {
  const { headings, data, onSearch, isLoading, error, update } = useAgentList();

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
