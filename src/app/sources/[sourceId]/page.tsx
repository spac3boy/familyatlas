import { notFound } from "next/navigation"

import { SourceRecord } from "@/components/research/source-record"
import { familyGraph } from "@/data"
import { buildSourceRecordModel, isSourceId } from "@/lib/genealogy"

export const dynamicParams = false

export function generateStaticParams() {
  return familyGraph.sources
    .filter(({ researchStatus }) => researchStatus === "accepted")
    .map(({ id }) => ({ sourceId: id }))
}

export default async function SourcePage({
  params,
}: Readonly<{ params: Promise<{ sourceId: string }> }>) {
  const { sourceId } = await params
  if (!isSourceId(sourceId)) notFound()

  const model = buildSourceRecordModel(familyGraph, sourceId)
  if (!model) notFound()

  return <SourceRecord model={model} />
}
