import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import AppLayout from '@/components/layout/AppLayout'
import HomePage from '@/pages/HomePage'
import ExecuteReviewPage from '@/pages/ExecuteReviewPage'
import CommentPage from '@/pages/CommentPage'
import ProposalReviewPage from '@/pages/ProposalReviewPage'
import LearningStatusPage from '@/pages/LearningStatusPage'
import UpgradePage from '@/pages/UpgradePage'
import OverviewPage from '@/pages/OverviewPage'
import HowItWorksPage from '@/pages/HowItWorksPage'
import RepositoryPage from '@/pages/RepositoryPage'
import RunHistoryPage from '@/pages/RunHistoryPage'
import GuardrailsPage from '@/pages/GuardrailsPage'
import AgentsPage from '@/pages/AgentsPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/repository" element={<RepositoryPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/tasks/:id" element={<ExecuteReviewPage />} />
            <Route path="/tasks/:id/comment" element={<CommentPage />} />
            <Route path="/proposals" element={<ProposalReviewPage />} />
            <Route path="/learning" element={<LearningStatusPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/runs" element={<RunHistoryPage />} />
            <Route path="/guardrails" element={<GuardrailsPage />} />
            <Route path="/agents" element={<AgentsPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
