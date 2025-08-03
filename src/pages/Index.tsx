import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { QuickScreener } from "@/components/QuickScreener";
import { DocumentUpload } from "@/components/DocumentUpload";
import { EligibilityStatus } from "@/components/EligibilityStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useUserFlow } from "@/hooks/useUserFlow";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { 
    currentStep, 
    flowData, 
    nextStep, 
    goToStep, 
    updateScreenerData, 
    updateUploadedDocuments,
    updateEligibilityResults 
  } = useUserFlow();

  // Redirect non-authenticated users to auth page when they try to access protected features
  useEffect(() => {
    if (!loading && !user && (currentStep !== "landing")) {
      navigate('/auth');
    }
  }, [user, loading, currentStep, navigate]);

  const handleStartFlow = () => {
    if (!user) {
      navigate('/auth');
    } else {
      goToStep('screener');
    }
  };

  const handleScreenerComplete = (data: any) => {
    updateScreenerData(data);
    nextStep(); // Go to upload step
  };

  const handleUploadComplete = (documents: File[]) => {
    updateUploadedDocuments(documents);
    // Simulate processing and go to results
    setTimeout(() => {
      updateEligibilityResults({
        eligible: true,
        programs: ['Federal Medicaid', 'SNAP'],
        message: 'Based on your information, you appear eligible for multiple programs.'
      });
      goToStep('results');
    }, 2000);
  };

  const renderCurrentView = () => {
    switch (currentStep) {
      case "screener":
        return (
          <QuickScreener 
            onComplete={handleScreenerComplete}
            onBack={() => goToStep('landing')}
          />
        );
      case "upload":
        return (
          <DocumentUpload 
            onComplete={handleUploadComplete}
            onBack={() => goToStep('screener')}
          />
        );
      case "results":
        return (
          <EligibilityStatus 
            results={flowData.eligibilityResults}
            onStartOver={() => goToStep('landing')}
            screenerData={flowData.screenerData}
          />
        );
      default:
        return <HeroSection onStartFlow={handleStartFlow} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
