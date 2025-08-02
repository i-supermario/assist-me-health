import { useState } from 'react';

export type FlowStep = "landing" | "screener" | "upload" | "assessment" | "results";

interface ScreenerData {
  age?: number;
  zipCode?: string;
  employmentStatus?: string;
  monthlyHours?: number;
  monthlyIncome?: number;
  immigrationStatus?: string;
  medicalConditions?: string[];
  dependentsUnder14?: number;
}

interface FlowData {
  screenerData: ScreenerData;
  uploadedDocuments: File[];
  eligibilityResults: any;
}

export const useUserFlow = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>("landing");
  const [flowData, setFlowData] = useState<FlowData>({
    screenerData: {},
    uploadedDocuments: [],
    eligibilityResults: null
  });

  const nextStep = () => {
    const stepOrder: FlowStep[] = ["landing", "screener", "upload", "assessment", "results"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const goToStep = (step: FlowStep) => {
    setCurrentStep(step);
  };

  const updateScreenerData = (data: Partial<ScreenerData>) => {
    setFlowData(prev => ({
      ...prev,
      screenerData: { ...prev.screenerData, ...data }
    }));
  };

  const updateUploadedDocuments = (documents: File[]) => {
    setFlowData(prev => ({
      ...prev,
      uploadedDocuments: documents
    }));
  };

  const updateEligibilityResults = (results: any) => {
    setFlowData(prev => ({
      ...prev,
      eligibilityResults: results
    }));
  };

  const resetFlow = () => {
    setCurrentStep("landing");
    setFlowData({
      screenerData: {},
      uploadedDocuments: [],
      eligibilityResults: null
    });
  };

  return {
    currentStep,
    flowData,
    nextStep,
    goToStep,
    updateScreenerData,
    updateUploadedDocuments,
    updateEligibilityResults,
    resetFlow
  };
};