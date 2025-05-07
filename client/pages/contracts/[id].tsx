
import { useRouter } from 'next/router'
import ContractsPage from '@/components/contracts/ContractsPage'

export default function Contract() {
  const router = useRouter()
  const { id } = router.query
  
  return (
    <div>
      <ContractsPage id={id as string} />
    </div>
  )
}
