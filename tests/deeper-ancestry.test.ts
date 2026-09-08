import assert from "node:assert/strict";
import test from "node:test";

import { maternalAncestorPeople } from "@/data/ancestry/maternal/people";
import { paternalAncestorPeople } from "@/data/ancestry/paternal/people";
import { familyGraph } from "@/data";
import { auditGenealogyGraph } from "@/lib/genealogy/audit";
import type { Event, Person, PersonId } from "@/types";

const expectedMaternalIds = [
  "person-lucuis-leblanc", "person-euchariste-dugas", "person-jules-comeaux-1888", "person-joesette-r",
  "person-moise-j-dugas", "person-emma-miller-1883", "person-marcel-dugas-1848", "person-marie-ruffin-plaisance",
  "person-marcellin-dugas-1804", "person-melanie-boudreaux", "person-joseph-simon-dugas-1769", "person-celeste-dugas-1778",
  "person-charles-dugas-1737", "person-marguerite-granger-1740", "person-claude-dugas-1702", "person-anne-hebert",
  "person-claude-dugas-1677", "person-jeanne-bourg", "person-claude-dugas-1649", "person-francoise-bourgeois",
  "person-abraham-dugas-1616", "person-marguerite-doucet", "person-jean-dugas", "person-marguerite-dupuis",
  "person-adolphe-miller-1849", "person-marie-emma-boudreaux-1852", "person-george-charles-miller", "person-pauline-savoie",
] as const satisfies readonly PersonId[];

const expectedPaternalIds = [
  "person-aubin-vincent-buquet-1887", "person-lena-maronge-1890", "person-quentin-alcide-augustin-buquet",
  "person-jeanne-octavie-savoie", "person-francois-luc-theodore-buquet", "person-celeste-felonise-leblanc",
  "person-francois-michel-jacques-buquet", "person-marie-anne-henry", "person-marcelin-tiburse-savoie",
  "person-malvina-bergeron", "person-oscar-paul-bakke", "person-olga-josephine-doely", "person-martin-h-bakke",
  "person-olava-olausdatter-dukleth", "person-hans-hansen-bakke-1801", "person-ingeborg-skore",
  "person-olaus-paulsen-dukleth", "person-grethe-pauline-pedersdatter-melhus", "person-nicolai-ingvaldsen-doely",
  "person-serine-roble", "person-ingvald-throndsen-doely", "person-helene-blexrud",
] as const satisfies readonly PersonId[];

test("C5 retains all 50 accepted deeper direct ancestors alongside the expanded family graph", () => {
  assert.deepEqual(maternalAncestorPeople.map(({ id }) => id).sort(), [...expectedMaternalIds].sort());
  assert.deepEqual(paternalAncestorPeople.map(({ id }) => id).sort(), [...expectedPaternalIds].sort());
  assert.equal(familyGraph.people.length, 83);
  assert.equal(new Set(familyGraph.people.map(({ id }) => id)).size, 83);
  assert.ok(familyGraph.people.every(({ id, researchStatus }) => id.startsWith("person-") && researchStatus === "accepted"));
});

test("every deeper ancestor reaches Michael through accepted parent-child edges", () => {
  const children = new Map<PersonId, PersonId[]>();
  for (const relationship of familyGraph.relationships) {
    if (relationship.type !== "parent-child") continue;
    children.set(relationship.parentId, [...(children.get(relationship.parentId) ?? []), relationship.childId]);
  }
  const reachesMichael = (start: PersonId): boolean => {
    const queue = [start];
    const seen = new Set<PersonId>();
    while (queue.length > 0) {
      const person = queue.shift();
      if (!person || seen.has(person)) continue;
      if (person === "person-michael-buquet") return true;
      seen.add(person);
      queue.push(...(children.get(person) ?? []));
    }
    return false;
  };
  for (const id of [...expectedMaternalIds, ...expectedPaternalIds]) {
    assert.ok(reachesMichael(id), `${id} is disconnected from Michael's ancestry`);
  }
});

test("rejected and still-unattached identities stay outside the accepted graph", () => {
  assert.ok(familyGraph.people.every(({ id }) => !id.startsWith("candidate-")));
  const forbidden = [
    "person-philomene-comeaux", "person-rella-leblanc", "person-alton-comeaux-1910",
    "candidate-lucius-john-leblanc-1893",
    "candidate-julien-comeaux-1888", "candidate-louis-leopold-buquet-1768",
  ];
  for (const id of forbidden) assert.equal(familyGraph.people.some((person) => person.id === id), false);
});

test("known uncertainty and identity guards remain explicit", () => {
  const events = new Map<string, Event>(familyGraph.events.map((event) => [event.id, event]));
  assert.equal(events.get("event-francois-michel-buquet-birth")?.date.originalText, "about 1785/1786");
  assert.equal(events.get("event-claude-dugas-1649-birth")?.date.originalText, "circa 1649 or 1652");
  assert.equal(events.get("event-olava-dukleth-birth")?.date.originalText, "about 1853 or 1855");
  assert.equal(events.get("event-oscar-bakke-birth-alternative")?.confidence, "unresolved");
  assert.equal(events.get("event-martin-bakke-birth-1855-alternative")?.confidence, "unresolved");

  const marieEmma: Person | undefined = familyGraph.people.find(({ id }) => id === "person-marie-emma-boudreaux-1852");
  assert.ok(marieEmma?.notes?.some((note) => note.includes("Josephine Boudreaux")));
  assert.equal(marieEmma?.alternateNames.some(({ name }) => name === "Josephine Boudreaux"), false);
});

test("the genealogy-specific audit has no hard integrity failures", () => {
  const audit = auditGenealogyGraph(familyGraph);
  assert.equal(audit.valid, true);
  assert.equal(audit.counts.errors, 0);
  assert.deepEqual(
    audit.issues.filter(({ code }) => code === "claims.contradictory-birth").map(({ entityIds }) => entityIds[0]).sort(),
    ["person-joesette-r", "person-martin-h-bakke", "person-oscar-paul-bakke"],
  );
  assert.equal(audit.issues.some(({ code }) => code === "ancestry.circular"), false);
  assert.equal(audit.issues.some(({ code }) => code === "person.orphan"), false);
  assert.equal(audit.issues.some(({ code }) => code === "place.orphan"), false);
  assert.equal(audit.issues.some(({ code }) => code === "source.orphan"), false);
  assert.equal(audit.issues.some(({ code }) => code === "identity.likely-duplicate"), false);
});
