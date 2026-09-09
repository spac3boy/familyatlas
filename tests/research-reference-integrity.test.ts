import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { familyGraph } from "@/data";

interface ResearchReferenceCarrier {
  readonly researchRefs?: readonly {
    readonly file: string;
    readonly originalId?: string;
  }[];
}

type ResearchReference = NonNullable<ResearchReferenceCarrier["researchRefs"]>[number];

const collectResearchReferences = (value: unknown): readonly ResearchReference[] => {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(collectResearchReferences);

  const record = value as Record<string, unknown>;
  const ownReferences = Array.isArray(record.researchRefs)
    ? (record.researchRefs as NonNullable<ResearchReferenceCarrier["researchRefs"]>)
    : [];

  return [
    ...ownReferences,
    ...Object.entries(record)
      .filter(([key]) => key !== "researchRefs")
      .flatMap(([, child]) => collectResearchReferences(child)),
  ];
};

test("every canonical research reference resolves to its owning archive file and original ID", () => {
  const references = collectResearchReferences(familyGraph);
  assert.ok(references.length > 0);

  for (const reference of references) {
    assert.ok(existsSync(reference.file), `Missing research file: ${reference.file}`);
    if (!reference.originalId) continue;

    const content = readFileSync(reference.file, "utf8");
    assert.ok(
      content.includes(reference.originalId),
      `${reference.originalId} is not present in ${reference.file}`,
    );
  }
});
