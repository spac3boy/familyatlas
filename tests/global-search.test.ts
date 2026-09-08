import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familySearchIndex } from "@/data";
import {
  buildGlobalSearchIndex,
  normalizeSearchText,
  searchGlobalIndex,
} from "@/lib/genealogy/global-search";

test("the global index projects accepted canonical people, places, surnames, and sources", () => {
  const index = buildGlobalSearchIndex(familyGraph);
  const kinds = new Set(index.map(({ kind }) => kind));

  assert.deepEqual([...kinds], ["person", "place", "surname", "source"]);
  assert.equal(
    index.filter(({ kind }) => kind === "person").length,
    familyGraph.people.filter(({ researchStatus }) => researchStatus === "accepted").length,
  );
  assert.equal(
    index.filter(({ kind }) => kind === "place").length,
    familyGraph.places.filter(({ researchStatus }) => researchStatus === "accepted").length,
  );
  assert.equal(
    index.filter(({ kind }) => kind === "source").length,
    familyGraph.sources.filter(({ researchStatus }) => researchStatus === "accepted").length,
  );
  assert.deepEqual(index, familySearchIndex);
});

test("search is accent-insensitive and finds alternate canonical name forms", () => {
  const francois = searchGlobalIndex(familySearchIndex, "francois michel");
  const bouquet = searchGlobalIndex(familySearchIndex, "bouquet");

  assert.equal(francois[0]?.entityId, "person-francois-michel-jacques-buquet");
  assert.ok(bouquet.some(({ kind, title }) => kind === "surname" && title === "Bouquet — alternate spelling"));
  assert.ok(bouquet.some(({ kind, entityId }) =>
    kind === "person" && entityId === "person-francois-michel-jacques-buquet",
  ));
});

test("place historical names and source metadata remain searchable", () => {
  const portRoyal = searchGlobalIndex(familySearchIndex, "Port Royal");
  const familySearch = searchGlobalIndex(familySearchIndex, "FamilySearch");
  const sourceId = searchGlobalIndex(familySearchIndex, "SRC-RITA-OBIT-ADVERTISER");

  assert.ok(portRoyal.some(({ kind, entityId }) =>
    kind === "place" && entityId === "place-historical-port-royal-acadia",
  ));
  assert.ok(familySearch.some(({ kind }) => kind === "source"));
  assert.equal(sourceId[0]?.href, "/sources/SRC-RITA-OBIT-ADVERTISER");
});

test("every search destination is a stable application route", () => {
  for (const entry of familySearchIndex) {
    if (entry.kind === "person") assert.match(entry.href, /^\/people\/person-/u);
    if (entry.kind === "place") assert.match(entry.href, /^\/places\/place-/u);
    if (entry.kind === "surname") assert.match(entry.href, /^\/people\?surname=/u);
    if (entry.kind === "source") assert.match(entry.href, /^\/sources\/SRC-/u);
  }
});

test("empty searches return no guessed suggestions and result limits are validated", () => {
  assert.deepEqual(searchGlobalIndex(familySearchIndex, "   "), []);
  assert.equal(searchGlobalIndex(familySearchIndex, "a", 3).length, 3);
  assert.throws(() => searchGlobalIndex(familySearchIndex, "a", 0), RangeError);
  assert.equal(normalizeSearchText("  Céleste—Félonise  "), "celeste felonise");
});
