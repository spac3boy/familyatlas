import { hierarchy, tree } from "d3-hierarchy";
import { linkHorizontal } from "d3-shape";

import {
  createGenealogyQueries,
  MATERNAL_ROOT_ID,
  MICHAEL_BUQUET_ID,
  PATERNAL_ROOT_ID,
} from "@/lib/genealogy/queries";
import type {
  Confidence,
  CoupleRelationship,
  Event,
  GenealogyGraph,
  HistoricalDate,
  ParentChildRelationship,
  Person,
  PersonId,
  RelationshipId,
} from "@/types";

export type FamilyTreeScope = "family" | "all" | "paternal" | "maternal" | "selected";

export const FAMILY_TREE_FOCUS_IDS = [
  "person-chloe-eloise-buquet",
  "person-jolie-renee-buquet",
] as const satisfies readonly PersonId[];

const KARLA_CONTRERAS_BUQUET_ID = "person-karla-vannessa-contreras-buquet" as const;

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
  /** True when at least one supported parent is visible in this projection. */
  readonly parentsVisible?: boolean;
  readonly expanded: boolean;
  readonly role?: "focus" | "immediate" | "collateral" | "ancestor";
}

interface FamilyTreeLayoutEdgeBase {
  readonly occurrenceId: string;
  readonly relationshipId: RelationshipId;
  readonly confidence: Confidence;
  readonly path: string;
}

export interface FamilyTreeParentChildLayoutEdge extends FamilyTreeLayoutEdgeBase {
  readonly relationshipType: "parent-child";
  readonly childPersonId: PersonId;
  readonly parentPersonId: PersonId;
}

export interface FamilyTreeCoupleLayoutEdge extends FamilyTreeLayoutEdgeBase {
  readonly relationshipType: "spouse" | "partner";
  readonly personIds: readonly [PersonId, PersonId];
}

export type FamilyTreeLayoutEdge =
  | FamilyTreeParentChildLayoutEdge
  | FamilyTreeCoupleLayoutEdge;

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
        relationshipType: "parent-child" as const,
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

function parentChildPath(
  child: FamilyTreeLayoutNode,
  parent: FamilyTreeLayoutNode,
  nodeWidth: number,
): string {
  const parentIsRightOfChild = parent.x >= child.x;
  return connector({
    source: {
      horizontal: parentIsRightOfChild ? child.x + nodeWidth : child.x,
      vertical: child.y,
    },
    target: {
      horizontal: parentIsRightOfChild ? parent.x : parent.x + nodeWidth,
      vertical: parent.y,
    },
  }) ?? "";
}

function couplePath(
  first: FamilyTreeLayoutNode,
  second: FamilyTreeLayoutNode,
  nodeWidth: number,
  nodeHeight: number,
): string {
  const horizontalSeparation = Math.abs(first.x - second.x);
  if (horizontalSeparation >= nodeWidth) {
    const left = first.x <= second.x ? first : second;
    const right = left === first ? second : first;
    const startX = left.x + nodeWidth;
    const endX = right.x;
    const middleX = (startX + endX) / 2;
    return `M${startX},${left.y}C${middleX},${left.y} ${middleX},${right.y} ${endX},${right.y}`;
  }
  const upper = first.y <= second.y ? first : second;
  const lower = upper === first ? second : first;
  const x = upper.x + nodeWidth / 2;
  return `M${x},${upper.y + nodeHeight / 2}V${lower.y - nodeHeight / 2}`;
}

/**
 * Builds the default daughter-centered family overview without changing the
 * canonical graph. Chloé and Jolie are layout focal points; the remaining
 * projection combines Michael's ancestry with his spouse and siblings.
 */
export function layoutDaughterCenteredFamilyTree(
  graph: GenealogyGraph,
  events: readonly Event[],
  expandedPersonIds: ReadonlySet<PersonId>,
  options: FamilyTreeLayoutOptions = {},
): FamilyTreeLayout {
  const rowGap = options.rowGap ?? 76;
  const generationGap = options.generationGap ?? 224;
  const nodeWidth = options.nodeWidth ?? 184;
  const nodeHeight = options.nodeHeight ?? 58;
  const padding = options.padding ?? 36;
  const ancestry = layoutFamilyTree(
    buildFamilyTreeHierarchy(graph, { scope: "all", expandedPersonIds }),
    events,
    options,
  );
  const queries = createGenealogyQueries(graph);
  const peopleById = new Map(graph.people.map((person) => [person.id, person]));
  const michaelNode = ancestry.nodes.find(({ personId }) => personId === MICHAEL_BUQUET_ID);
  if (!michaelNode) throw new Error("Daughter-centered tree requires Michael in the ancestry projection.");

  const rawNodes: FamilyTreeLayoutNode[] = ancestry.nodes.map((node) => ({
    ...node,
    occurrenceId: `family:${node.occurrenceId}`,
    generation: node.generation + 1,
    x: node.x + generationGap * 2,
    role: node.personId === MICHAEL_BUQUET_ID ? "immediate" : "ancestor",
  }));
  const familyColumnY = michaelNode.y;
  const karlaColumnX = michaelNode.x;
  const daughterColumnX = michaelNode.x + generationGap;
  const michaelColumnX = michaelNode.x + generationGap * 2;
  const karlaColumnY = familyColumnY;
  const karlaAncestry = layoutFamilyTree(
    buildFamilyTreeHierarchy(graph, {
      scope: "selected",
      selectedPersonId: KARLA_CONTRERAS_BUQUET_ID,
      expandedPersonIds,
    }),
    events,
    options,
  );
  const karlaRootNode = karlaAncestry.nodes.find(
    ({ personId }) => personId === KARLA_CONTRERAS_BUQUET_ID,
  );
  if (!karlaRootNode) throw new Error("Daughter-centered tree requires Karla in the partner projection.");

  for (const node of karlaAncestry.nodes) {
    if (node.personId === KARLA_CONTRERAS_BUQUET_ID) continue;
    rawNodes.push({
      ...node,
      occurrenceId: `family:karla:${node.occurrenceId}`,
      generation: node.generation + 1,
      x: karlaColumnX - (node.x - karlaRootNode.x),
      y: karlaColumnY + (node.y - karlaRootNode.y),
      role: "ancestor",
    });
  }

  const addPersonNode = (
    personId: PersonId,
    generation: number,
    y: number,
    role: NonNullable<FamilyTreeLayoutNode["role"]>,
    x = generation === 0 ? daughterColumnX : michaelColumnX,
    hasParents = false,
    parentsVisible = personId !== KARLA_CONTRERAS_BUQUET_ID,
  ) => {
    const person = peopleById.get(personId);
    if (!person || rawNodes.some((node) => node.personId === personId)) return;
    rawNodes.push({
      occurrenceId: `family:${personId}`,
      personId,
      canonicalName: person.canonicalName,
      nameLines: splitTreeName(person.canonicalName),
      dateLabel: personLifeDateLabel(person.id, events),
      confidence: person.confidence,
      generation,
      x,
      y,
      hasParents,
      parentsVisible,
      expanded: true,
      role,
    });
  };

  const centeredOffsets = (count: number): readonly number[] => [
    ...Array.from({ length: Math.ceil(count / 2) }, (_, index) => index - Math.ceil(count / 2)),
    ...Array.from({ length: Math.floor(count / 2) }, (_, index) => index + 1),
  ];
  const michaelSiblingIds = queries.siblings(MICHAEL_BUQUET_ID).map(({ person }) => person.id);
  const collateralRowOffsets = centeredOffsets(michaelSiblingIds.length);
  michaelSiblingIds.forEach((personId, index) =>
    addPersonNode(
      personId,
      1,
      familyColumnY + rowGap * collateralRowOffsets[index],
      "collateral",
    ),
  );
  addPersonNode(
    KARLA_CONTRERAS_BUQUET_ID,
    1,
    karlaColumnY,
    "immediate",
    karlaColumnX,
  );
  addPersonNode(FAMILY_TREE_FOCUS_IDS[0], 0, familyColumnY - rowGap / 2, "focus");
  addPersonNode(FAMILY_TREE_FOCUS_IDS[1], 0, familyColumnY + rowGap / 2, "focus");

  const lateralCoupleRelationshipIds = new Set<RelationshipId>();
  const ancestryMinY = Math.min(...ancestry.nodes.map(({ y }) => y));
  const ancestryMaxY = Math.max(...ancestry.nodes.map(({ y }) => y));
  const lateralRowGap = Math.max(rowGap * 1.35, nodeHeight + 28);
  const parentalSiblingGroups = [
    {
      parentId: PATERNAL_ROOT_ID,
      direction: -1,
      edgeY: ancestryMinY,
    },
    {
      parentId: MATERNAL_ROOT_ID,
      direction: 1,
      edgeY: ancestryMaxY,
    },
  ] as const;

  for (const { parentId, direction, edgeY } of parentalSiblingGroups) {
    const parentNode = rawNodes.find(({ personId }) => personId === parentId);
    if (!parentNode) continue;
    const parentSiblingIds = queries.siblings(parentId).map(({ person }) => person.id);
    let distanceFromAncestry = lateralRowGap;
    for (const siblingId of parentSiblingIds) {
      const cousinChildren = queries.children(siblingId);
      const cousinRowGap = Math.max(rowGap, nodeHeight + 24);
      const branchSpan = Math.max(
        lateralRowGap,
        Math.max(1, cousinChildren.length) * cousinRowGap,
      );
      const siblingY = edgeY + direction * (distanceFromAncestry + branchSpan / 2);
      addPersonNode(
        siblingId,
        parentNode.generation,
        siblingY,
        "collateral",
        parentNode.x,
        false,
        true,
      );
      const partners = queries.spousesAndPartners(siblingId);
      const relatedAdultIds = new Set(partners.map(({ person }) => person.id));
      for (const cousin of cousinChildren) {
        for (const otherParent of queries.parents(cousin.person.id)) {
          if (otherParent.person.id !== siblingId) relatedAdultIds.add(otherParent.person.id);
        }
      }
      const relatedAdults = [...relatedAdultIds].flatMap((personId) => {
        const person = peopleById.get(personId);
        return person ? [person] : [];
      });
      for (const [adultIndex, adult] of relatedAdults.entries()) {
        const adultOffset =
          relatedAdults.length > 1
            ? (adultIndex - (relatedAdults.length - 1) / 2) * (nodeHeight + 12)
            : 0;
        addPersonNode(
          adult.id,
          parentNode.generation,
          siblingY + adultOffset,
          "collateral",
          parentNode.x + nodeWidth + 28,
          false,
          false,
        );
      }
      for (const partner of partners) {
        lateralCoupleRelationshipIds.add(partner.relationship.id);
      }
      const cousinOffsets = Array.from(
        { length: cousinChildren.length },
        (_, index) => index - (cousinChildren.length - 1) / 2,
      );
      cousinChildren.forEach((cousin, index) =>
        addPersonNode(
          cousin.person.id,
          Math.max(0, parentNode.generation - 1),
          siblingY + cousinOffsets[index] * cousinRowGap,
          "collateral",
          parentNode.x - generationGap,
          false,
          true,
        ),
      );
      distanceFromAncestry += branchSpan + lateralRowGap * 0.45;
    }
  }

  const minX = Math.min(...rawNodes.map(({ x }) => x));
  const minY = Math.min(...rawNodes.map(({ y }) => y - nodeHeight / 2));
  const xShift = minX < padding ? padding - minX : 0;
  const yShift = minY < padding ? padding - minY : 0;
  const nodes = rawNodes.map((node) => ({
    ...node,
    x: node.x + xShift,
    y: node.y + yShift,
  }));
  const nodesByPerson = new Map(nodes.map((node) => [node.personId, node]));
  const edges: FamilyTreeLayoutEdge[] = [];

  for (const relationship of graph.relationships) {
    if (relationship.researchStatus !== "accepted") continue;
    if (relationship.type === "parent-child") {
      const child = nodesByPerson.get(relationship.childId);
      const parent = nodesByPerson.get(relationship.parentId);
      if (!child || !parent) continue;
      edges.push({
        occurrenceId: `family:${relationship.id}`,
        relationshipId: relationship.id,
        relationshipType: "parent-child",
        childPersonId: relationship.childId,
        parentPersonId: relationship.parentId,
        confidence: relationship.confidence,
        path: parentChildPath(child, parent, nodeWidth),
      });
      continue;
    }
    const isFocalCouple =
      relationship.personIds.includes(MICHAEL_BUQUET_ID) &&
      relationship.personIds.includes(KARLA_CONTRERAS_BUQUET_ID);
    if (!isFocalCouple && !lateralCoupleRelationshipIds.has(relationship.id)) continue;
    const first = nodesByPerson.get(relationship.personIds[0]);
    const second = nodesByPerson.get(relationship.personIds[1]);
    if (!first || !second) continue;
    const coupleRelationship: CoupleRelationship = relationship;
    edges.push({
      occurrenceId: `family:${relationship.id}`,
      relationshipId: relationship.id,
      relationshipType: coupleRelationship.type,
      personIds: coupleRelationship.personIds,
      confidence: coupleRelationship.confidence,
      path: couplePath(first, second, nodeWidth, nodeHeight),
    });
  }

  return {
    rootPersonId: FAMILY_TREE_FOCUS_IDS[0],
    nodes,
    edges,
    width: Math.max(...nodes.map(({ x }) => x + nodeWidth)) + padding,
    height: Math.max(...nodes.map(({ y }) => y + nodeHeight / 2)) + padding,
    nodeWidth,
    nodeHeight,
  };
}
