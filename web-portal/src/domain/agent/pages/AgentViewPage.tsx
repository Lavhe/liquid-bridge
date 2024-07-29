import { SideNav } from "../../../components/shared/SideNav";
import { Loader } from "../../../components/shared";
import { TopBar } from "../../../components/shared/TopBar";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAgentView } from "../hooks/useAgentView";
import { Agent } from "../components/Agent";

enum ClassName {
  Page = "flex flex-1 min-h-screen",
}

export function AgentViewPage() {
  const { agentId } = useParams();
  const { agent, isLoading } =
    useAgentView({
      agentId: agentId || "",
    });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <TopBar />
      <section className={ClassName.Page}>
        <SideNav />
        {isLoading || !agent ? (
          <div className="mx-auto my-auto h-full">
            <Loader />
          </div>
        ) : (
          <Agent
            agent={agent}
          />
        )}
      </section>
    </>
  );
}
