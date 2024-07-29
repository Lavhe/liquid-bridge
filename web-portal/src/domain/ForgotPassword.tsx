import { useEffect } from "react";
import background from "../assets/loginBackground.png";
import { Header, Form, Footer } from "../components/login";
import { ResetPasswordForm } from "../components/login/ResetPasswordForm";

enum ClassName {
  Page = "flex min-h-screen",
  LeftSection = "w-full md:w-1/2 2xl:w-1/3 my-auto mx-5 sm:mx-20",
  LeftSectionRow = "my-auto mx-5 sm:mx-20 lg:mx-20",
  RightSection = "flex-none sm:flex-1 bg-no-repeat bg-cover bg-center",
}

export function ForgotPassword() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className={ClassName.Page}>
      <div className={ClassName.LeftSection}>
        <section className={ClassName.LeftSectionRow}>
          <Header
            title="Reset Password"
            subTitle="Your reset password link will be emailed to you."
          />
          <ResetPasswordForm />
        </section>
      </div>
      <div
        className={ClassName.RightSection}
        style={{
          backgroundImage: `url(${background})`,
        }}
      ></div>
    </section>
  );
}
