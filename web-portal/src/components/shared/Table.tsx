import classNames from "classnames";
import moment from "moment";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../../context/FirebaseContext";
import { DBUser } from "../../utils/types";
import { RoutePath } from "../../utils/utils";
import { SettlementDocPDF } from "./elements/SettlementDocPDF";
import { ViewPDF } from "./elements/ViewPDF";
import { Field } from "./form";

const DEFAULT_LINES_PER_PAGE = 5;

export function Table<T>(props: TableProps) {
  const { currentUser } = useFirebase();
  const linesPerPage = props?.settings?.linesPerPage || DEFAULT_LINES_PER_PAGE;

  const [page, setPage] = useState(0);
  const { headings } = useMemo(() => {
    const headings = Object.keys(props.headings).map((k) => ({
      ...props.headings[k],
      value: k,
    }));

    return { headings };
  }, [props.headings, props.data]);

  const { data, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(props.data.length / linesPerPage) || 1;

    if (page != 0 && page >= totalPages) {
      setPage(0);
    }

    return {
      totalPages,
      data: props.data.slice(
        page * linesPerPage,
        page * linesPerPage + linesPerPage
      ),
    };
  }, [page, props.data, linesPerPage]);

  const getValue = (obj: Record<string, string | Date>, key: string) => {
    return key.split(".").reduce((acc, k) => {
      return acc && acc[k.trim()];
    }, obj as any);
  };

  return (
    <div className={`rounded-tl-lg rounded-tr-lg`}>
      <table
        className={`w-full py-4 px-10 ${props?.settings?.headingClassNames}`}
      >
        <thead>
          <tr className={`py-3 w-full border-b border-b-black`}>
            {headings != null &&
              headings
                .filter((heading) => heading.show?.({ currentUser }) ?? true)
                .map((heading, i) => (
                  <td
                    key={i}
                    className="font-semibold px-2 py-4 text-md text-center"
                  >
                    {heading.label}
                  </td>
                ))}
          </tr>
        </thead>
        <tbody className="bg-white text-black">
          {data != null && data?.length == 0 && (
            <tr>
              <td colSpan={10} className="text-center">
                <span
                  className="text-danger text-lg t
            ext-center py-6"
                >
                  No records found!
                </span>
              </td>
            </tr>
          )}
          {data != null &&
            data.map((item, i) => (
              <tr
                key={i}
                className="py-10 border-b border-opacity-40 border-b-black w-full"
              >
                {headings
                  .filter((heading) => heading.show?.({ currentUser }) ?? true)
                  .map((heading, j) => (
                    <td key={`${i}-${j}`} className="p-2 text-center mx-auto">
                      <RenderComponent
                        id={item.id}
                        heading={heading}
                        value={getValue(item, heading.value)}
                        onChange={props.onChange}
                      />
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="grid place-items-end w-full py-4">
        <div className="flex my-auto align-center justify-center">
          <button
            onClick={(e) => setPage((p) => (p <= 0 ? totalPages - 1 : --p))}
            className="text-secondary text-5xl px-4 hover:font-bold"
          >
            {"<"}
          </button>
          <span className="flex-1 my-auto text-center">
            {page + 1} of {totalPages}
          </span>
          <button
            onClick={(e) => setPage((p) => (p >= totalPages - 1 ? 0 : ++p))}
            className="text-secondary text-5xl px-4 hover:font-bold"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RenderComponent({ heading, value, onChange, id }: any) {
  const handleChange = (e: any) => {
    value = e.target.value;
    onChange({ id, [e.target.name]: e.target.value });
  };

  switch (heading.type) {
    case "YES_NO":
      return <span>{value ? "YES" : "NO"}</span>;
    case "SINGLE_SELECT":
      return (
        <Field
          type="SINGLE_SELECT"
          {...heading}
          variable={heading.value}
          value={value}
          onChange={handleChange}
          noLabel={true}
        />
      );
    case "SETTLEMENT_DOC_WITH_REQUEST_OPTION":
      return <SettlementDocPDF link={value} applicationId={id} />;
    case "VIEW_PDF":
      return <ViewPDF link={value} />;
    case "ID":
      if (heading.link) {
        return (
          <Link
            className="text-primary hover:text-opacity-40 cursor-pointer"
            to={heading.link(value)}
          >{`#${value}`}</Link>
        );
      }

      if (heading.route) {
        return (
          <Link
            className="text-primary hover:text-opacity-40 cursor-pointer"
            to={`${heading.route}/${id}`}
          >
            {value}
          </Link>
        );
      }

      return <span>{`#${value}`}</span>;
    case "DATE":
      return (
        <span>{moment((value as any)?.toDate?.()).format("DD MMM YYYY")}</span>
      );
    default:
      return (
        <span>
          <span className="font-medium">{heading.prefix}</span>
          {value ?? heading.default}
        </span>
      );
  }
}

export interface Heading {
  [key: string]: {
    label: string;
    show?: (input: { currentUser: DBUser | null }) => boolean;
    type?:
      | "SINGLE_SELECT"
      | "SETTLEMENT_DOC_WITH_REQUEST_OPTION"
      | "VIEW_PDF"
      | "ID"
      | "DATE"
      | "YES_NO";
    options?: {
      value: any;
      label: string;
    }[];
    link?: (value: string) => string;
    route?: typeof RoutePath[keyof typeof RoutePath];
    default?: string;
    value?: any;
    classNames?: string;
    validate?: (value: any) => boolean;
    disabled?: (value: any, currentUser: any) => boolean;
  };
}

interface TableProps {
  headings: Heading;
  data: {
    [k in keyof Heading]: string | Date;
  }[];
  settings?: {
    linesPerPage?: number;
    headingClassNames?: string;
  };
  onChange?: (
    payload: {
      [k in keyof Heading]: string | Date;
    } & {
      id: string;
    }
  ) => void;
}
