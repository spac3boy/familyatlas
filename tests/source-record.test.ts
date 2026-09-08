import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph } from "@/data";
import { buildSourceRecordModel } from "@/lib/genealogy/source-record";

test("every accepted source produces one stable normalized source record", () => {
  const acceptedSources = familyGraph.sources.filter(({ researchStatus }) => researchStatus === "accepted");
  const models = acceptedSources.map(({ id }) => buildSourceRecordModel(familyGraph, id));

  assert.ok(models.every(Boolean));
  assert.equal(new Set(models.map((model) => model?.source.id)).size, acceptedSources.length);
});

test("source records derive represented people and places only through explicit references", () => {
  const obituary = buildSourceRecordModel(familyGraph, "SRC-RITA-OBIT-ADVERTISER");

  assert.ok(obituary);
  assert.ok(obituary.people.some(({ id }) => id === "person-rita-leblanc-1928"));
  assert.ok(obituary.places.some(({ id }) => id === "place-us-la-carencro"));
  assert.ok(obituary.events.every(({ sourceRefs }) =>
    sourceRefs.some(({ sourceId }) =>
      sourceId === obituary.source.id || obituary.source.idAliases?.includes(sourceId),
    ),
  ));
});

test("unknown and unaccepted source IDs do not produce public source records", () => {
  assert.equal(buildSourceRecordModel(familyGraph, "SRC-NOT-PRESENT"), undefined);
});
