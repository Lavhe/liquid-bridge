enum ClassName {
  Footer = "flex flex-col text-left",
  FooterRow = "py-2",
  FooterSignUp = "text-primary font-semibold",
  FooterTsAndCs = "underline",
}

export function Footer() {
  return (
    <section aria-label="footer" className={ClassName.Footer}>
      <span className={ClassName.FooterRow}>
        By logging in, I agree to the{" "}
        <a href="#" className={ClassName.FooterTsAndCs}>
          T's & C's
        </a>
      </span>
      <span className={ClassName.FooterRow}>
        Don't have an account?{" "}
        <a href="#" className={ClassName.FooterSignUp}>
          Sign Up
        </a>
      </span>
    </section>
  );
}
