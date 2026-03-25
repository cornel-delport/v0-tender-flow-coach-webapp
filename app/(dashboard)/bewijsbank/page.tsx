import { getEvidenceItems } from '@/lib/services/evidence.service'
import { BewijsbankClient } from './bewijsbank-client'

export default async function BewijsbankPage() {
  const items = await getEvidenceItems()
  return <BewijsbankClient initialItems={items} />
}
