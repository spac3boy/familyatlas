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

test("family-confirmed siblings and supported alternate names are searchable", () => {
  assert.equal(searchGlobalIndex(familySearchIndex, "Sidney Paul Roger")[0]?.entityId, "person-sidney-paul-roger");
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Gina Nevils").some(
      ({ kind, entityId }) => kind === "person" && entityId === "person-gina-buquet",
    ),
  );
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Bud Buquet").some(
      ({ kind, entityId }) => kind === "person" && entityId === "person-edmond-paul-buquet",
    ),
  );
});

test("Michael's wife, daughters, and Karla's maiden name are searchable", () => {
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Karla Vannessa Contreras").some(
      ({ kind, entityId }) => kind === "person" && entityId === "person-karla-vannessa-contreras-buquet",
    ),
  );
  assert.equal(searchGlobalIndex(familySearchIndex, "Chloe Eloise")[0]?.entityId, "person-chloe-eloise-buquet");
  assert.equal(searchGlobalIndex(familySearchIndex, "Jolie Renee")[0]?.entityId, "person-jolie-renee-buquet");
});

test("documented parental siblings and conflicting Priscilla name forms are searchable", () => {
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Rooster Comeaux").some(
      ({ kind, entityId }) => kind === "person" && entityId === "person-russell-j-comeaux",
    ),
  );
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Cathy B McRae").some(
      ({ kind, entityId }) => kind === "person" && entityId === "person-cathy-buquet",
    ),
  );
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Priscilla LeBlanc").some(
      ({ entityId }) => entityId === "person-priscilla-comeaux",
    ),
  );
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Michael Buquet").filter(
      ({ kind, entityId }) =>
        kind === "person" &&
        ["person-michael-buquet", "person-michael-buquet-edmond-child"].includes(entityId),
    ).length >= 2,
  );
});

test("cousins and carefully retained name variants are searchable", () => {
  assert.equal(
    searchGlobalIndex(familySearchIndex, "Paige Bartholomew")[0]?.entityId,
    "person-paige-bartholomew",
  );
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Sean Rusty McRae").some(
      ({ kind, entityId }) => kind === "person" && entityId === "person-sean-mcrae",
    ),
  );
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Ryan Earl Comeaux").some(
      ({ kind, entityId }) => kind === "person" && entityId === "person-rhyan-comeaux",
    ),
  );
  assert.ok(
    searchGlobalIndex(familySearchIndex, "Sid Roger").some(
      ({ kind, entityId }) => kind === "person" && entityId === "person-sidney-paul-roger",
    ),
  );
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
