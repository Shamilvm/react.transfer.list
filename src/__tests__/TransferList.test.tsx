import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TransferList } from "../components/TransferList/TransferList";
import type { TransferItem } from "../types";

const MOCK_ITEMS: TransferItem[] = [
  { id: 1, text: "Alice" },
  { id: 2, text: "Bob" },
  { id: 3, text: "Carol" },
];

function getPanel(title: string) {
  const heading = screen.getByText(title);
  const panel = heading.closest(".stl-list-panel");
  if (!panel) throw new Error(`Panel not found for title: ${title}`);
  return panel as HTMLElement;
}

describe("TransferList", () => {
  it("renders excluded and included panels with available items", async () => {
    render(<TransferList label="Users" remoteUrl={MOCK_ITEMS} isFilter={false} />);

    expect(screen.getByText("Users excluded")).toBeInTheDocument();
    expect(screen.getByText("Users included")).toBeInTheDocument();

    const excluded = getPanel("Users excluded");
    await waitFor(() => {
      expect(within(excluded).getByText("Alice")).toBeInTheDocument();
      expect(within(excluded).getByText("Bob")).toBeInTheDocument();
      expect(within(excluded).getByText("Carol")).toBeInTheDocument();
    });
  });

  it("moves an item from excluded to included and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        value={[]}
        onChange={onChange}
        isFilter={false}
      />,
    );

    const excluded = getPanel("Users excluded");
    const included = getPanel("Users included");

    await waitFor(() => {
      expect(within(excluded).getByText("Alice")).toBeInTheDocument();
    });

    await user.click(within(excluded).getByText("Alice"));

    await waitFor(() => {
      expect(within(included).getByText("Alice")).toBeInTheDocument();
      expect(within(excluded).queryByText("Alice")).not.toBeInTheDocument();
    });

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls.at(-1)?.[0];
    expect(lastCall).toEqual([{ id: 1, text: "Alice" }]);
  });

  it("respects controlled value for included items", async () => {
    render(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        value={[{ id: 2, text: "Bob" }]}
        isFilter={false}
      />,
    );

    const excluded = getPanel("Users excluded");
    const included = getPanel("Users included");

    await waitFor(() => {
      expect(within(included).getByText("Bob")).toBeInTheDocument();
      expect(within(excluded).queryByText("Bob")).not.toBeInTheDocument();
      expect(within(excluded).getByText("Alice")).toBeInTheDocument();
      expect(within(excluded).getByText("Carol")).toBeInTheDocument();
    });
  });
});
