import background from "../../assets/loginBackground.png";
import logo from "../../assets/logo.png";

enum ClassName {
  Row = "flex min-h-screen",
  Logo = "mb-20 -mt-5 w-1/2 mx-auto",
  LeftSection = "w-full md:w-1/2 2xl:w-1/3 my-auto mx-5 sm:mx-20",
  LeftSectionRow = "flex flex-col h-full my-auto mx-5 sm:mx-20 lg:mx-20 gap-20",
  RightSection = "flex-none sm:flex-1 bg-no-repeat bg-cover bg-center",
}

export function Blocked({ reason, by }: BlockedProps) {
  return (
    <div className={ClassName.Row}>
      <div className={ClassName.LeftSection}>
        <section className={ClassName.LeftSectionRow}>
          <img className={ClassName.Logo} src={logo} />
          <p className="text-center text-2xl text-red-400">
            This account/agent has been blocked
          </p>
          <p className="text-center text-2xl font-bold text-red-400">
            {reason}
          </p>
          <p className="text-center text-md">
            If you feel this is a mistake please email:{" "}
            <a className="underline cursor-pointer" href={`mailto:${by}`}>
              {by}
            </a>
          </p>
        </section>
      </div>
      <div
        className={ClassName.RightSection}
        style={{
          backgroundImage: `url(${background})`,
        }}
      ></div>
    </div>
  );
}
interface BlockedProps {
  by: string;
  reason: string;
}
