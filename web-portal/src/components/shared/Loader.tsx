import classnames from "classnames";
import icon from "../../assets/icon.png";

enum ClassName {
  Loader = "animate-spin rounded-full h-16 w-16 border-b-2 border-primary",
  Row = "relative grid place-items-center",
  Image = "absolute w-16 h-16",
  FullScreenLoader = "animate-spin rounded-full h-16 w-16 border-b-2 border-primary",
  FullScreenRow = "h-screen w-screen fixed top-0 left-0 z-10 grid place-items-center backdrop-blur-sm",
  FullScreenImage = "absolute w-1/6 animate-bounce",
}

export function Loader(props: LoaderProps) {
  const { size = "auto" } = props;

  const imageClassName = classnames({
    [ClassName.FullScreenImage]: size === "full-screen",
    [ClassName.Image]: size === "auto",
  });

  const mainClassName = classnames({
    [ClassName.FullScreenRow]: size === "full-screen",
    [ClassName.Row]: size === "auto",
  });

  const loaderClassName = classnames({
    [ClassName.FullScreenLoader]: size === "full-screen",
    [ClassName.Loader]: size === "auto",
  });

  return (
    <div className={mainClassName} role="status">
      <img src={icon} className={imageClassName} />
      <div className={loaderClassName}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

interface LoaderProps {
  size?: "auto" | "full-screen";
}
