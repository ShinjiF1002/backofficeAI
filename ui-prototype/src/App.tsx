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

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/repository" element={<RepositoryPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/tasks/:id" element={<ExecuteReviewPage />} />
            <Route path="/tasks/:id/comment" element={<CommentPage />} />
            <Route path="/proposals" element={<ProposalReviewPage />} />
            <Route path="/learning" element={<LearningStatusPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
