import type { Metadata } from "next"
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

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ sourceId: string }> }>): Promise<Metadata> {
  const { sourceId } = await params
  const source = isSourceId(sourceId)
    ? familyGraph.sources.find((candidate) => candidate.id === sourceId)
    : undefined
  return {
    title: source?.title ?? "Source not found",
    description: source
      ? `Review the normalized Family Atlas source record for ${source.title}.`
      : "The requested Family Atlas source could not be found.",
  }
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
