import { useCallback, useState } from "react";
import { convertEnumToSentence } from "../../../utils/utils";
import { DropDown } from "../DropDown";

export function SearchWithFilter<T>({
  onSearch,
  filters,
}: SearchWithFilterProps<T>) {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<T>();

  const handleSearch = useCallback(() => {
    onSearch({
      search,
      filter: selectedFilter,
    });
  }, [selectedFilter, search]);

  return (
    <div className="my-8 rounded-md border border-black flex bg-white">
      <input
        className="bg-transparent rounded-md flex-1 p-4"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.code.toLowerCase() === "enter" && handleSearch()}
      />
      <DropDown
        className="bg-gray-200 h-full border-transparent rounded-tr-none rounded-br-none"
        onChange={(e) => setSelectedFilter(e.target.value as T)}
        items={filters.map((filter) => ({
          value: filter,
          label: convertEnumToSentence(filter),
        }))}
        name="filter"
        placeholder="Filter"
        label={convertEnumToSentence(selectedFilter)}
      />
      <button
        onClick={handleSearch}
        className="rounded-tr-md rounded-br-md bg-primary hover:bg-opacity-50 p-4 flex-initial h-full text-white"
      >
        Search
      </button>
    </div>
  );
}

interface SearchWithFilterProps<T> {
  onSearch: (obj: { search: string; filter?: T }) => void;
  filters: T[];
}
