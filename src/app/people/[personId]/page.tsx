import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PersonProfile } from "@/components/people/person-profile"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPersonProfileModel, isPersonId } from "@/lib/genealogy"

export const dynamicParams = false

export function generateStaticParams() {
  return familyGraph.people.map(({ id }) => ({ personId: id }))
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ personId: string }> }>): Promise<Metadata> {
  const { personId } = await params
  const person = isPersonId(personId) ? familyGraphQueries.personById(personId) : undefined
  return {
    title: person?.canonicalName ?? "Person not found",
    description: person
      ? `Review the supported Family Atlas profile for ${person.canonicalName}.`
      : "The requested Family Atlas person could not be found.",
  }
}

export default async function PersonPage({
  params,
}: Readonly<{ params: Promise<{ personId: string }> }>) {
  const { personId } = await params
  if (!isPersonId(personId)) notFound()

  const profile = buildPersonProfileModel(familyGraph, personId, familyGraphQueries)
  if (!profile) notFound()

  return <PersonProfile profile={profile} />
}
