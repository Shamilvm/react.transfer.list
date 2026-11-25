import { describe, expect, it, vi } from "vitest";
import { buildFilterArray } from "../utils/filters";
import { defaultFetchFn } from "../utils/fetch";
import { defaultAutocompleteFetchFn, mapToFilterOptions } from "../utils/listFetch";
import { dedupeById, parseTransferItems } from "../utils/items";
import type { FilterConfig } from "../types";

describe("dedupeById", () => {
  it("removes duplicate ids keeping first occurrence", () => {
    const items = [
      { id: 1, text: "Alice" },
      { id: 2, text: "Bob" },
      { id: 1, text: "Alice duplicate" },
    ];

    expect(dedupeById(items)).toEqual([
      { id: 1, text: "Alice" },
      { id: 2, text: "Bob" },
    ]);
  });
});

describe("parseTransferItems", () => {
  it("parses valid items and dedupes by id", () => {
    const data = [
      { id: "a", text: "Alpha" },
      { id: "b", text: "Beta" },
      { id: "a", text: "Alpha again" },
      { id: 3, text: 123 },
      null,
    ];

    expect(parseTransferItems(data)).toEqual([
      { id: "a", text: "Alpha" },
      { id: "b", text: "Beta" },
    ]);
  });

  it("returns empty array for non-array input", () => {
    expect(parseTransferItems(null)).toEqual([]);
    expect(parseTransferItems({})).toEqual([]);
  });
});

describe("buildFilterArray", () => {
  const filters: FilterConfig[] = [
    { type: "text", label: "Name", key: "name" },
    {
      type: "autocomplete",
      label: "Group",
      key: "group",
    },
    { type: "switch", label: "Active", key: "active" },
  ];

  it("skips empty values and maps autocomplete selections to values", () => {
    const result = buildFilterArray(
      {
        name: "Alice",
        group: [
          { label: "Engineering", value: "eng" },
          { label: "Sales", value: "sales" },
        ],
        active: false,
        empty: "",
        none: null,
        tags: [],
      },
      filters,
    );

    expect(result).toEqual([{ name: "Alice" }, { group: ["eng", "sales"] }]);
  });
});

describe("mapToFilterOptions", () => {
  it("maps label/value and id/text shapes", () => {
    const data = [
      { label: "Engineering", value: "eng" },
      { id: 2, text: "Sales" },
      { invalid: true },
    ];

    expect(mapToFilterOptions(data)).toEqual([
      { label: "Engineering", value: "eng" },
      { label: "Sales", value: "2" },
    ]);
  });

  it("returns empty array for non-array input", () => {
    expect(mapToFilterOptions(undefined)).toEqual([]);
  });
});

it("merges fetch parameters with existing query strings before the fragment", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
  vi.stubGlobal("fetch", fetchMock);
  try {
    await defaultFetchFn("/people?tenant=1&search=old#top", { search: "a & b" });
    await defaultAutocompleteFetchFn("/teams?tenant=2&page=9#options", {
      page: 1,
      limit: 5,
    });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/people?tenant=1&search=a+%26+b&filter=%5B%5D#top",
      "/teams?tenant=2&page=1&limit=5#options",
    ]);
  } finally {
    vi.unstubAllGlobals();
  }
});
