import { TrustAccountsList } from "../../agentTrustAccounts/components/TrustAccountsList";
import { EditAgent } from "./EditAgent";

export function Agent({ agent }: any) {
  return (
    <section className="mx-10 mt-6 w-screen gap-14">
      <div className="grid gap-10">
        <div className="flex mx-4">
          <div className="flex-1 grid my-auto gap-2">
            <span className="flex-initial font-semibold text-2xl text-secondary">
              {agent.name}
            </span>
            <span className="text-opacity-60 text-primary">{agent.id}</span>
          </div>
          <div className="flex gap-2">
            <SmallCard title="Users" value={agent.numOfUser} />
            <SmallCard title="Applications" value={agent.numOfApplications} />
          </div>
        </div>
        <EditAgent companyId={agent.id} />
        <div>
          <TrustAccountsList companyId={agent.id} />
        </div>
      </div>
    </section>
  );
}
function SmallCard({ value, title }: any) {
  return (
    <div className="W-1/4 relative shadow-lg rounded-lg p-4 m-4 flex gap-2 my-auto">
      <span className="my-auto text-gray-600 text-6xl font-black">{value}</span>
      <span className="text-gray-600 font-bold text-left my-auto">{title}</span>
    </div>
  );
}
