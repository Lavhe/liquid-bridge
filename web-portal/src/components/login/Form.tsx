import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/login/useLogin";
import { Loader } from "../shared/Loader";

enum ClassName {
  Row = "my-auto mx-5 sm:mx-20 lg:mx-20",
  Form = "py-6",
  InputRow = "flex flex-col text-left py-2",
  InputLabel = "text-lg py-2",
  InputField = "border py-2 px-4 text-sm border-gray-400 rounded-lg",
  ForgotPassword = "text-primary italic",
  RememberMeRow = "flex text-left py-6",
  RememberMeLabel = "px-2",
  RememberMeColumn = "flex-1",
  SubmitButton = "bg-primary font-semibold my-4 py-4 w-full rounded-full text-white",
  Error = "text-danger",
}

export function Form() {
  const { isLoading, error, login } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = useCallback(() => {
    login(username, password);
  }, [username, password]);

  return (
    <form className={ClassName.Form}>
      <div className={ClassName.InputRow}>
        <label className={ClassName.InputLabel}>Email address</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="email"
          className={ClassName.InputField}
          placeholder="Enter your email address"
        />
      </div>
      <div className={ClassName.InputRow}>
        <label className={ClassName.InputLabel}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className={ClassName.InputField}
          placeholder="Enter your password sent via email"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
      </div>
      <div className={ClassName.RememberMeRow}>
        <div className={ClassName.RememberMeColumn}>
          <input type="checkbox" id="remember_me" />
          <label htmlFor="remember_me" className={ClassName.RememberMeLabel}>
            Remember me
          </label>
        </div>
        <Link className={ClassName.ForgotPassword} to="/forgot/password">
          Forgot password?
        </Link>
      </div>
      {error && <p className={ClassName.Error}>{error}</p>}
      {isLoading ? (
        <Loader />
      ) : (
        <button
          className={ClassName.SubmitButton}
          type="button"
          onClick={handleLogin}
        >
          Login
        </button>
      )}
    </form>
  );
}
