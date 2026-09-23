import { useNavigate } from 'react-router-dom';
import { AuthCard, OnboardingForm } from '../../components/auth';

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <AuthCard
      maxWidth="max-w-xl"
      title="Personalize Your Experience"
      subtitle="Choose learning topics and preferences to customize your feed"
      badge="Onboarding"
      showBackHome={false}
    >
      <OnboardingForm onComplete={() => navigate('/student')} />
    </AuthCard>
  );
}
