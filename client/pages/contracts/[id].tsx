
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import ContractsPage from '@/components/contracts/ContractsPage'

export default function Contract() {
  const router = useRouter()
  const { id } = router.query
  
  return (
    <Layout>
      <ContractsPage id={id as string} />
    </Layout>
  )
}
