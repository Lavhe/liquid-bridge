import { describe, it, expect, beforeEach } from "vitest";

import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";

describe("Tests for footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it("Footer must exist", async () => {
    const footer = screen.getByRole("region", {
      name: "footer",
    });

    expect(footer).toBeDefined();
  });
});
