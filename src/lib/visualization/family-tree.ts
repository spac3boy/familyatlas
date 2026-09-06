import { hierarchy, tree } from "d3-hierarchy";
import { linkHorizontal } from "d3-shape";

import {
  MATERNAL_ROOT_ID,
  MICHAEL_BUQUET_ID,
  PATERNAL_ROOT_ID,
} from "@/lib/genealogy/queries";
import type {
  Confidence,
  Event,
  GenealogyGraph,
  HistoricalDate,
  ParentChildRelationship,
  Person,
  PersonId,
  RelationshipId,
} from "@/types";

export type FamilyTreeScope = "all" | "paternal" | "maternal" | "selected";

export interface FamilyTreeHierarchyOptions {
  readonly scope: FamilyTreeScope;
  readonly selectedPersonId?: PersonId | null;
  /** Omit to expand every supported ancestor relationship. */
  readonly expandedPersonIds?: ReadonlySet<PersonId>;
}

export interface FamilyTreeDatum {
  readonly occurrenceId: string;
  readonly person: Person;
  readonly generation: number;
  readonly relationshipToChild?: ParentChildRelationship;
  readonly hasParents: boolean;
  readonly expanded: boolean;
  readonly children?: readonly FamilyTreeDatum[];
}

export interface FamilyTreeLayoutOptions {
  readonly rowGap?: number;
  readonly generationGap?: number;
  readonly nodeWidth?: number;
  readonly nodeHeight?: number;
  readonly padding?: number;
}

export interface FamilyTreeLayoutNode {
  readonly occurrenceId: string;
  readonly personId: PersonId;
  readonly canonicalName: string;
  readonly nameLines: readonly string[];
  readonly dateLabel?: string;
  readonly confidence: Confidence;
  readonly generation: number;
  readonly x: number;
  readonly y: number;
  readonly hasParents: boolean;
  readonly expanded: boolean;
}

export interface FamilyTreeLayoutEdge {
  readonly occurrenceId: string;
  readonly relationshipId: RelationshipId;
  readonly childPersonId: PersonId;
  readonly parentPersonId: PersonId;
  readonly confidence: Confidence;
  readonly path: string;
}

export interface FamilyTreeLayout {
  readonly rootPersonId: PersonId;
  readonly nodes: readonly FamilyTreeLayoutNode[];
  readonly edges: readonly FamilyTreeLayoutEdge[];
  readonly width: number;
  readonly height: number;
  readonly nodeWidth: number;
  readonly nodeHeight: number;
}

const isParentChildRelationship = (
  relationship: GenealogyGraph["relationships"][number],
): relationship is ParentChildRelationship => relationship.type === "parent-child";

function indexGraph(graph: GenealogyGraph) {
  const peopleById = new Map(graph.people.map((person) => [person.id, person]));
  const parentsByChild = new Map<PersonId, ParentChildRelationship[]>();

  for (const relationship of graph.relationships) {
    if (!isParentChildRelationship(relationship) || relationship.researchStatus !== "accepted") {
      continue;
    }
    const relationships = parentsByChild.get(relationship.childId) ?? [];
    relationships.push(relationship);
    parentsByChild.set(relationship.childId, relationships);
  }

  for (const relationships of parentsByChild.values()) {
    relationships.sort((first, second) => {
      const firstPerson = peopleById.get(first.parentId);
      const secondPerson = peopleById.get(second.parentId);
      return (
        (firstPerson?.canonicalName ?? first.parentId).localeCompare(
          secondPerson?.canonicalName ?? second.parentId,
        ) || first.id.localeCompare(second.id)
      );
    });
  }

  return { peopleById, parentsByChild };
}

function rootPersonId(options: FamilyTreeHierarchyOptions): PersonId {
  return options.scope === "selected" && options.selectedPersonId
    ? options.selectedPersonId
    : MICHAEL_BUQUET_ID;
}

function scopedParentRelationships(
  childId: PersonId,
  generation: number,
  options: FamilyTreeHierarchyOptions,
  parentsByChild: ReadonlyMap<PersonId, readonly ParentChildRelationship[]>,
): readonly ParentChildRelationship[] {
  const relationships = parentsByChild.get(childId) ?? [];
  if (generation !== 0 || childId !== MICHAEL_BUQUET_ID) return relationships;
  if (options.scope === "maternal") {
    return relationships.filter(({ parentId }) => parentId === MATERNAL_ROOT_ID);
  }
  if (options.scope === "paternal") {
    return relationships.filter(({ parentId }) => parentId === PATERNAL_ROOT_ID);
  }
  return relationships;
}

/**
 * Builds a temporary ancestry tree from canonical graph edges. Repeated people
 * receive path-specific occurrence IDs; the canonical person itself is never cloned or mutated.
 */
export function buildFamilyTreeHierarchy(
  graph: GenealogyGraph,
  options: FamilyTreeHierarchyOptions,
): FamilyTreeDatum {
  const { peopleById, parentsByChild } = indexGraph(graph);
  const rootId = rootPersonId(options);
  const root = peopleById.get(rootId);
  if (!root) throw new Error(`Family-tree root is not in the canonical graph: ${rootId}`);

  const expandedPersonIds =
    options.expandedPersonIds ?? new Set<PersonId>(graph.people.map(({ id }) => id));

  const visit = (
    person: Person,
    generation: number,
    path: readonly PersonId[],
    relationshipToChild?: ParentChildRelationship,
  ): FamilyTreeDatum => {
    const parentRelationships = scopedParentRelationships(
      person.id,
      generation,
      options,
      parentsByChild,
    ).filter(({ parentId }) => !path.includes(parentId));
    const expanded = expandedPersonIds.has(person.id);
    const nextPath = [...path, person.id];
    const children = expanded
      ? parentRelationships.flatMap((relationship) => {
          const parent = peopleById.get(relationship.parentId);
          return parent ? [visit(parent, generation + 1, nextPath, relationship)] : [];
        })
      : [];

    return {
      occurrenceId: nextPath.join(">"),
      person,
      generation,
      relationshipToChild,
      hasParents: parentRelationships.length > 0,
      expanded,
      ...(children.length > 0 ? { children } : {}),
    };
  };

  return visit(root, 0, []);
}

export function defaultExpandedPersonIds(
  graph: GenealogyGraph,
  options: Omit<FamilyTreeHierarchyOptions, "expandedPersonIds">,
  visibleGenerations = 3,
): ReadonlySet<PersonId> {
  if (!Number.isInteger(visibleGenerations) || visibleGenerations < 1) {
    throw new RangeError("Visible generations must be a positive integer.");
  }

  const fullTree = buildFamilyTreeHierarchy(graph, options);
  const expanded = new Set<PersonId>();
  const pending = [fullTree];
  while (pending.length > 0) {
    const current = pending.shift();
    if (!current) continue;
    if (current.generation < visibleGenerations) expanded.add(current.person.id);
    pending.push(...(current.children ?? []));
  }
  return expanded;
}

function dateYear(point: Extract<HistoricalDate, { kind: "exact" | "year" }>): string {
  return point.kind === "year" ? String(point.year) : point.value.slice(0, 4);
}

export function formatTreeDate(date: HistoricalDate): string | undefined {
  switch (date.kind) {
    case "exact":
    case "year":
      return dateYear(date);
    case "circa":
      return `c. ${dateYear(date.value)}`;
    case "before":
      return `before ${dateYear(date.value)}`;
    case "after":
      return `after ${dateYear(date.value)}`;
    case "range": {
      const start = dateYear(date.start);
      const end = dateYear(date.end);
      return start === end ? start : `${start}–${end}`;
    }
    case "unknown":
      return undefined;
  }
}

export function personLifeDateLabel(
  personId: PersonId,
  events: readonly Event[],
): string | undefined {
  const labelsFor = (type: "birth" | "death") => [
    ...new Set(
      events
        .filter((event) => event.type === type && event.personIds.includes(personId))
        .map(({ date }) => formatTreeDate(date))
        .filter((label): label is string => Boolean(label)),
    ),
  ];
  const births = labelsFor("birth");
  const deaths = labelsFor("death");
  const birthLabel = births.length > 0 ? `b. ${births.join(" / ")}` : undefined;
  const deathLabel = deaths.length > 0 ? `d. ${deaths.join(" / ")}` : undefined;
  return [birthLabel, deathLabel].filter(Boolean).join(" · ") || undefined;
}

export function splitTreeName(name: string): readonly string[] {
  const words = name.trim().split(/\s+/);
  if (words.length < 2 || name.length <= 22) return [name];

  let bestIndex = 1;
  let bestLongestLine = Number.POSITIVE_INFINITY;
  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(" ");
    const second = words.slice(index).join(" ");
    const longestLine = Math.max(first.length, second.length);
    if (longestLine < bestLongestLine) {
      bestIndex = index;
      bestLongestLine = longestLine;
    }
  }
  return [words.slice(0, bestIndex).join(" "), words.slice(bestIndex).join(" ")];
}

interface ConnectorPoint {
  readonly horizontal: number;
  readonly vertical: number;
}

interface ConnectorLink {
  readonly source: ConnectorPoint;
  readonly target: ConnectorPoint;
}

const connector = linkHorizontal<ConnectorLink, ConnectorPoint>()
  .x(({ horizontal }) => horizontal)
  .y(({ vertical }) => vertical);

export function layoutFamilyTree(
  rootDatum: FamilyTreeDatum,
  events: readonly Event[],
  options: FamilyTreeLayoutOptions = {},
): FamilyTreeLayout {
  const rowGap = options.rowGap ?? 76;
  const generationGap = options.generationGap ?? 224;
  const nodeWidth = options.nodeWidth ?? 184;
  const nodeHeight = options.nodeHeight ?? 58;
  const padding = options.padding ?? 36;

  const root = hierarchy(rootDatum, ({ children }) => children);
  const laidOut = tree<FamilyTreeDatum>().nodeSize([rowGap, generationGap])(root);
  const descendants = laidOut.descendants();
  const minVertical = Math.min(...descendants.map(({ x }) => x));
  const maxVertical = Math.max(...descendants.map(({ x }) => x));
  const maxHorizontal = Math.max(...descendants.map(({ y }) => y));

  const position = (node: (typeof descendants)[number]) => ({
    x: node.y + padding,
    y: node.x - minVertical + padding + nodeHeight / 2,
  });

  const nodes: FamilyTreeLayoutNode[] = descendants.map((node) => {
    const { x, y } = position(node);
    return {
      occurrenceId: node.data.occurrenceId,
      personId: node.data.person.id,
      canonicalName: node.data.person.canonicalName,
      nameLines: splitTreeName(node.data.person.canonicalName),
      dateLabel: personLifeDateLabel(node.data.person.id, events),
      confidence: node.data.person.confidence,
      generation: node.data.generation,
      x,
      y,
      hasParents: node.data.hasParents,
      expanded: node.data.expanded,
    };
  });

  const edges: FamilyTreeLayoutEdge[] = laidOut.links().flatMap(({ source, target }) => {
    const relationship = target.data.relationshipToChild;
    if (!relationship) return [];
    const sourcePosition = position(source);
    const targetPosition = position(target);
    const path = connector({
      source: {
        horizontal: sourcePosition.x + nodeWidth,
        vertical: sourcePosition.y,
      },
      target: {
        horizontal: targetPosition.x,
        vertical: targetPosition.y,
      },
    });
    if (!path) return [];
    return [
      {
        occurrenceId: `${source.data.occurrenceId}->${target.data.occurrenceId}`,
        relationshipId: relationship.id,
        childPersonId: relationship.childId,
        parentPersonId: relationship.parentId,
        confidence: relationship.confidence,
        path,
      },
    ];
  });

  return {
    rootPersonId: rootDatum.person.id,
    nodes,
    edges,
    width: maxHorizontal + nodeWidth + padding * 2,
    height: maxVertical - minVertical + nodeHeight + padding * 2,
    nodeWidth,
    nodeHeight,
  };
}
