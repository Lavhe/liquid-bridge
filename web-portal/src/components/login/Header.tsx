import logo from "../../assets/logo.png";

enum ClassName {
  Header = "flex flex-col text-left py-6",
  Logo = "mb-20 -mt-5 w-1/2",
  Title = "text-6xl font-medium text-secondary",
  SubTitle = "text-lg text-primary",
}

export function Header({ title, subTitle }: HeaderProps) {
  return (
    <header className={ClassName.Header}>
      <img className={ClassName.Logo} src={logo} />
      <span className={ClassName.Title}>{title}</span>
      <span className={ClassName.SubTitle}>{subTitle}</span>
    </header>
  );
}
interface HeaderProps {
  title: string;
  subTitle: string;
}
