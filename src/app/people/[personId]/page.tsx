import { notFound } from "next/navigation"

import { PersonProfile } from "@/components/people/person-profile"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPersonProfileModel, isPersonId } from "@/lib/genealogy"

export const dynamicParams = false

export function generateStaticParams() {
  return familyGraph.people.map(({ id }) => ({ personId: id }))
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
