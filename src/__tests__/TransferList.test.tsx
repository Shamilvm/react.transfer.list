import * as React from "react";
import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TransferList } from "../components/TransferList/TransferList";
import { setTransferListClipboard } from "../utils/clipboard";
import type { FilterConfig, TransferItem } from "../types";

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

function dragOverAt(target: Element, clientY: number, dataTransfer: object) {
  const event = createEvent.dragOver(target, { dataTransfer });
  Object.defineProperty(event, "clientY", { value: clientY });
  fireEvent(target, event);
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
        onChange={onChange}
        isFilter={false}
      />,
    );

    const excluded = getPanel("Users excluded");
    const included = getPanel("Users included");

    await waitFor(() => {
      expect(within(excluded).getByText("Alice")).toBeInTheDocument();
    });

    within(excluded).getByRole("button", { name: "Move Alice" }).focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(within(included).getByText("Alice")).toBeInTheDocument();
      expect(within(excluded).queryByText("Alice")).not.toBeInTheDocument();
    });

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls.at(-1)?.[0];
    expect(lastCall).toEqual([{ id: 1, text: "Alice" }]);
  });

  it("uses the latest controlled value and reports user actions only", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        value={[{ id: 2, text: "Bob" }]}
        onChange={onChange}
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

    const nextOnChange = vi.fn();
    rerender(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        value={[]}
        onChange={nextOnChange}
        isFilter={false}
      />,
    );
    expect(within(included).queryByText("Bob")).not.toBeInTheDocument();
    expect(within(excluded).getByText("Bob")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(nextOnChange).not.toHaveBeenCalled();

    await user.click(within(excluded).getByRole("button", { name: "Move Bob" }));
    expect(nextOnChange).toHaveBeenCalledExactlyOnceWith([{ id: 2, text: "Bob" }]);
    expect(within(included).queryByText("Bob")).not.toBeInTheDocument();
  });

  it("ignores obsolete remote responses and disables bulk moves while loading", async () => {
    let resolveOld!: (items: TransferItem[]) => void;
    let resolveNew!: (items: TransferItem[]) => void;
    const fetchFn = vi.fn(
      (url: string) =>
        new Promise<TransferItem[]>((resolve) => {
          if (url === "/old") resolveOld = resolve;
          else resolveNew = resolve;
        }),
    );
    const { rerender } = render(
      <TransferList label="Users" remoteUrl="/old" fetchFn={fetchFn} />,
    );

    rerender(<TransferList label="Users" remoteUrl="/new" fetchFn={fetchFn} />);
    expect(screen.getByRole("button", { name: "Move all" })).toBeDisabled();

    await act(async () => resolveNew([MOCK_ITEMS[1]]));
    await act(async () => resolveOld([MOCK_ITEMS[0]]));

    expect(screen.getByRole("button", { name: "Move Bob" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Move Alice" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Move all" })).toBeEnabled();
  });

  it("applies local filters independently of search and can suspend them", async () => {
    const user = userEvent.setup();
    const filters: FilterConfig[] = [{ type: "text", label: "Name", key: "text" }];
    const { rerender } = render(
      <TransferList label="Users" remoteUrl={MOCK_ITEMS} filters={filters} />,
    );
    await user.click(screen.getByRole("button", { name: "Show Filters" }));
    await user.type(screen.getByRole("textbox", { name: "Name" }), "LIC");
    await user.click(screen.getByRole("button", { name: "Apply filters" }));
    expect(screen.getByRole("button", { name: "Move Alice" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Move Bob" })).not.toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Search available..." }), "Bob");
    await user.click(screen.getByRole("button", { name: "Clear available search" }));
    expect(screen.queryByRole("button", { name: "Move Bob" })).not.toBeInTheDocument();

    rerender(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        filters={filters}
        isFilter={false}
      />,
    );
    expect(screen.getByRole("button", { name: "Move Bob" })).toBeInTheDocument();
  });

  it("suspends applied remote filters while retaining selected IDs", async () => {
    const fetchFn = vi.fn<
      NonNullable<React.ComponentProps<typeof TransferList>["fetchFn"]>
    >(async () => MOCK_ITEMS);
    const filters: FilterConfig[] = [
      { type: "text", label: "Name", key: "text", defaultValue: "Alice" },
    ];
    const selected = [MOCK_ITEMS[1]];
    const { rerender } = render(
      <TransferList
        label="Users"
        remoteUrl="/users"
        value={selected}
        filters={filters}
        fetchFn={fetchFn}
      />,
    );
    expect(fetchFn.mock.lastCall?.[1].filter).toEqual([
      { text: "Alice" },
      { selectedIds: [2] },
    ]);
    rerender(
      <TransferList
        label="Users"
        remoteUrl="/users"
        value={selected}
        filters={filters}
        fetchFn={fetchFn}
        isFilter={false}
      />,
    );
    expect(fetchFn.mock.lastCall?.[1].filter).toEqual([{ selectedIds: [2] }]);
    await screen.findByRole("button", { name: "Move Alice" });
  });

  it("removes only visible selected items during a search", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        value={MOCK_ITEMS}
        onChange={onChange}
      />,
    );
    await user.type(screen.getByRole("textbox", { name: "Search selected..." }), "Bob");
    await user.click(screen.getByRole("button", { name: "Remove matches" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith([MOCK_ITEMS[0], MOCK_ITEMS[2]]);
  });

  it("prefers system clipboard data and only counts newly added IDs", async () => {
    const user = userEvent.setup();
    const readText = vi
      .spyOn(navigator.clipboard, "readText")
      .mockResolvedValueOnce(
        JSON.stringify([MOCK_ITEMS[0], MOCK_ITEMS[1], MOCK_ITEMS[1]]),
      )
      .mockResolvedValueOnce("invalid JSON")
      .mockRejectedValueOnce(new Error("Clipboard unavailable"));
    const onChange = vi.fn();
    setTransferListClipboard([MOCK_ITEMS[2]]);
    try {
      render(
        <TransferList
          label="Users"
          remoteUrl={MOCK_ITEMS}
          value={[MOCK_ITEMS[0]]}
          onChange={onChange}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Paste" }));
      expect(onChange).toHaveBeenLastCalledWith([MOCK_ITEMS[0], MOCK_ITEMS[1]]);
      expect(screen.getByText("Pasted 1 item(s)")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Paste" }));
      expect(screen.getByText("No valid items in clipboard")).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledTimes(1);

      await user.click(screen.getByRole("button", { name: "Paste" }));
      expect(onChange).toHaveBeenLastCalledWith([MOCK_ITEMS[0], MOCK_ITEMS[2]]);
    } finally {
      readText.mockRestore();
      setTransferListClipboard([]);
    }
  });

  it.each(["select", "autocomplete"] as const)(
    "fetches remote %s options once when its control opens",
    async (type) => {
      const user = userEvent.setup();
      const fetchOptions = vi.fn(async () => [{ label: "First team", value: "first" }]);
      render(
        <TransferList
          label="Users"
          remoteUrl={MOCK_ITEMS}
          autocompleteFetchFn={fetchOptions}
          filters={[{ type, label: "Team", key: "team", remoteUrl: "/teams" }]}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Show Filters" }));
      expect(fetchOptions).not.toHaveBeenCalled();
      await user.click(
        screen.getByRole(type === "select" ? "button" : "textbox", { name: "Team" }),
      );
      expect(
        await screen.findByRole("button", { name: "First team" }),
      ).toBeInTheDocument();
      expect(fetchOptions).toHaveBeenCalledTimes(1);
    },
  );

  it.each(["checkbox", "chip", "radio"] as const)(
    "paginates remote %s options",
    async (type) => {
      const user = userEvent.setup();
      const fetchOptions = vi.fn(async (_url: string, params?: { page?: number }) =>
        params?.page === 1
          ? [
              { label: "First team", value: "first" },
              { label: "Second team", value: "second" },
            ]
          : [{ label: "Third team", value: "third" }],
      );
      render(
        <TransferList
          label="Users"
          remoteUrl={MOCK_ITEMS}
          autocompleteFetchFn={fetchOptions}
          filters={[{ type, label: "Team", key: "team", remoteUrl: "/teams", limit: 2 }]}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Show Filters" }));
      expect(await screen.findByText("First team")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Load more" }));
      expect(await screen.findByText("Third team")).toBeInTheDocument();
      expect(screen.getByText("First team")).toBeInTheDocument();
      expect(fetchOptions.mock.calls.map(([, params]) => params?.page)).toEqual([1, 2]);
    },
  );

  it("adds filtered autocomplete options without discarding earlier selections", async () => {
    const user = userEvent.setup();
    render(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        filters={[
          {
            type: "autocomplete",
            label: "Team",
            key: "team",
            options: [
              { label: "First team", value: "first" },
              { label: "Second team", value: "second" },
            ],
          },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Show Filters" }));
    const input = screen.getByRole("textbox", { name: "Team" });
    await user.type(input, "First");
    await user.click(screen.getByRole("button", { name: "Select all" }));
    await user.clear(input);
    await user.type(input, "Second");
    await user.click(screen.getByRole("button", { name: "Select all" }));
    await user.click(screen.getByRole("button", { name: "Apply filters" }));
    expect(screen.getByText("Team: First team, Second team")).toBeInTheDocument();
  });

  it("only shows ordering controls when enabled and reorders visible matches", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const props = { label: "Users", remoteUrl: MOCK_ITEMS, value: MOCK_ITEMS, onChange };
    const { rerender } = render(<TransferList {...props} />);
    expect(
      screen.queryByRole("button", { name: "Move Alice down" }),
    ).not.toBeInTheDocument();

    rerender(<TransferList {...props} enableOrdering />);
    expect(screen.getByRole("button", { name: "Move Alice up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move Carol down" })).toBeDisabled();
    await user.type(screen.getByRole("textbox", { name: "Search selected..." }), "a");
    await user.click(screen.getByRole("button", { name: "Move Carol up" }));

    const reordered = [MOCK_ITEMS[2], MOCK_ITEMS[1], MOCK_ITEMS[0]];
    expect(onChange).toHaveBeenCalledExactlyOnceWith(reordered);
    rerender(<TransferList {...props} value={reordered} enableOrdering />);
    await user.click(screen.getByRole("button", { name: "Clear selected search" }));
    expect(
      within(getPanel("Users included"))
        .getAllByRole("button", { name: /^Remove (Alice|Bob|Carol)$/ })
        .map((button) => button.getAttribute("aria-label")),
    ).toEqual(["Remove Carol", "Remove Bob", "Remove Alice"]);
  });

  it("moves a dragged item to the target position", () => {
    const onChange = vi.fn();
    render(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        value={MOCK_ITEMS}
        onChange={onChange}
        enableOrdering
      />,
    );

    const [handle] = screen.getAllByTitle("Drag to reorder");
    const target = screen.getByRole("button", { name: "Remove Carol" }).parentElement!;
    const dataTransfer = { setData: vi.fn() };
    fireEvent.dragStart(handle, { dataTransfer });
    fireEvent.dragOver(target, { dataTransfer });
    expect(target).toHaveAttribute("data-drop", "after");
    fireEvent.drop(target, { dataTransfer });

    expect(onChange).toHaveBeenCalledExactlyOnceWith([
      MOCK_ITEMS[1],
      MOCK_ITEMS[2],
      MOCK_ITEMS[0],
    ]);
    expect(target).not.toHaveAttribute("data-drop");
  });

  it("drops above the target row when the pointer is in its top half", () => {
    const onChange = vi.fn();
    render(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        value={MOCK_ITEMS}
        onChange={onChange}
        enableOrdering
      />,
    );

    const handles = screen.getAllByTitle("Drag to reorder");
    const target = screen.getByRole("button", { name: "Remove Bob" }).parentElement!;
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 0, y: 100, width: 200, height: 40 }),
    );
    const dataTransfer = { setData: vi.fn() };
    fireEvent.dragStart(handles[2], { dataTransfer });
    dragOverAt(target, 105, dataTransfer);
    expect(target).toHaveAttribute("data-drop", "before");
    fireEvent.drop(target, { dataTransfer });

    expect(onChange).toHaveBeenCalledExactlyOnceWith([
      MOCK_ITEMS[0],
      MOCK_ITEMS[2],
      MOCK_ITEMS[1],
    ]);
  });

  it("hides the drop indicator when the drop would not move the item", () => {
    render(
      <TransferList
        label="Users"
        remoteUrl={MOCK_ITEMS}
        value={MOCK_ITEMS}
        enableOrdering
      />,
    );
    const [handle] = screen.getAllByTitle("Drag to reorder");
    const target = screen.getByRole("button", { name: "Remove Bob" }).parentElement!;
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 0, y: 100, width: 200, height: 40 }),
    );
    const dataTransfer = { setData: vi.fn() };
    fireEvent.dragStart(handle, { dataTransfer });
    dragOverAt(target, 105, dataTransfer);
    expect(target).not.toHaveAttribute("data-drop");
  });

  it("reorders with Alt+Arrow keys, keeps focus and announces the new position", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = React.useState(MOCK_ITEMS);
      return (
        <TransferList
          label="Users"
          remoteUrl={MOCK_ITEMS}
          value={value}
          onChange={setValue}
          enableOrdering
        />
      );
    };
    render(<Controlled />);

    const alice = screen.getByRole("button", { name: "Remove Alice" });
    alice.focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");

    const panel = getPanel("Users included");
    expect(
      within(panel)
        .getAllByRole("button", { name: /^Remove (Alice|Bob|Carol)$/ })
        .map((button) => button.getAttribute("aria-label")),
    ).toEqual(["Remove Bob", "Remove Alice", "Remove Carol"]);
    expect(screen.getByRole("button", { name: "Remove Alice" })).toHaveFocus();
    expect(screen.getByText("Alice moved to position 2 of 3")).toBeInTheDocument();
    expect(within(panel).getAllByRole("listitem")[1]).toHaveTextContent(/^2/);
  });
});
