import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph } from "@/data";
import {
  buildFamilyTimelineModel,
  formatTimelineDate,
  historicalDateExtent,
  layoutFamilyTimeline,
} from "@/lib/visualization";

test("historical dates retain exact, bounded, approximate, open, and unknown semantics", () => {
  const exact = historicalDateExtent({ kind: "exact", value: "1928-04-20" });
  const year = historicalDateExtent({ kind: "year", year: 1928 });
  const circa = historicalDateExtent({
    kind: "circa",
    value: { kind: "year", year: 1790 },
    toleranceYears: 2,
  });
  const range = historicalDateExtent({
    kind: "range",
    start: { kind: "year", year: 1785 },
    end: { kind: "year", year: 1786 },
  });
  const before = historicalDateExtent({ kind: "before", value: { kind: "year", year: 1900 } });
  const after = historicalDateExtent({ kind: "after", value: { kind: "year", year: 1900 } });

  assert.equal(exact?.start?.toISOString(), "1928-04-20T00:00:00.000Z");
  assert.equal(exact?.end?.toISOString(), exact?.start?.toISOString());
  assert.equal(year?.start?.toISOString(), "1928-01-01T00:00:00.000Z");
  assert.equal(year?.end?.toISOString(), "1928-12-31T00:00:00.000Z");
  assert.equal(circa?.start?.getUTCFullYear(), 1788);
  assert.equal(circa?.end?.getUTCFullYear(), 1792);
  assert.equal(range?.start?.getUTCFullYear(), 1785);
  assert.equal(range?.end?.getUTCFullYear(), 1786);
  assert.equal(before?.start, undefined);
  assert.equal(before?.end?.getUTCFullYear(), 1900);
  assert.equal(after?.start?.getUTCFullYear(), 1900);
  assert.equal(after?.end, undefined);
  assert.equal(historicalDateExtent({ kind: "unknown", originalText: "not recovered" }), undefined);
  assert.equal(formatTimelineDate({ kind: "circa", value: { kind: "year", year: 1790 } }), "circa 1790");
});

test("a lifespan is emitted only with supported birth and death bounds", () => {
  const rita = buildFamilyTimelineModel(familyGraph, {
    scope: "selected",
    selectedPersonId: "person-rita-leblanc-1928",
  });
  const michael = buildFamilyTimelineModel(familyGraph, {
    scope: "selected",
    selectedPersonId: "person-michael-buquet",
  });

  assert.equal(rita.rows.length, 1);
  assert.equal(rita.rows[0].lifespan?.possibleStart.toISOString(), "1928-04-20T00:00:00.000Z");
  assert.equal(rita.rows[0].lifespan?.possibleEnd.toISOString(), "2017-02-13T00:00:00.000Z");
  assert.ok(rita.undatedEvents.length > 0);
  assert.ok(rita.rows[0].datedEvents.every(({ event }) => event.date.kind !== "unknown"));
  assert.equal(michael.rows.length, 0);
  assert.equal(michael.domain, undefined);
});

test("conflicting birth evidence widens the possible lifespan instead of choosing a fake date", () => {
  const model = buildFamilyTimelineModel(familyGraph, {
    scope: "selected",
    selectedPersonId: "person-oscar-paul-bakke",
  });
  const lifespan = model.rows[0]?.lifespan;

  assert.ok(lifespan);
  assert.equal(lifespan.possibleStart.toISOString(), "1884-01-31T00:00:00.000Z");
  assert.equal(lifespan.supportedStart.toISOString(), "1885-01-31T00:00:00.000Z");
  assert.equal(lifespan.confidence, "unresolved");
});

test("branch scopes include the chosen line and exclude the opposite immediate branch", () => {
  const maternal = buildFamilyTimelineModel(familyGraph, {
    scope: "maternal",
    selectedPersonId: null,
  });
  const paternal = buildFamilyTimelineModel(familyGraph, {
    scope: "paternal",
    selectedPersonId: null,
  });
  const maternalIds = new Set(maternal.rows.map(({ person }) => person.id));
  const paternalIds = new Set(paternal.rows.map(({ person }) => person.id));

  assert.ok(maternalIds.has("person-rita-leblanc-1928"));
  assert.ok(!maternalIds.has("person-verna-arlene-bakke"));
  assert.ok(paternalIds.has("person-verna-arlene-bakke"));
  assert.ok(!paternalIds.has("person-rita-leblanc-1928"));
});

test("responsive layout keeps a readable minimum canvas and derives D3 time-axis ticks", () => {
  const model = buildFamilyTimelineModel(familyGraph, {
    scope: "selected",
    selectedPersonId: "person-rita-leblanc-1928",
  });
  const layout = layoutFamilyTimeline(model, 320);

  assert.ok(layout);
  assert.equal(layout.width, 760);
  assert.ok(layout.ticks.length >= 3);
  assert.ok(layout.ticks.every(({ label }) => /^\d{4}$/.test(label)));
  const exactEvent = layout.rows[0].events.find(({ event }) => event.id === "event-rita-leblanc-birth");
  assert.ok(exactEvent);
  assert.equal(exactEvent.x1, exactEvent.x2);
});
