import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { DocumentUpload } from "@/components/DocumentUpload";
import { EligibilityStatus } from "@/components/EligibilityStatus";
import { useState } from "react";

type AppState = "landing" | "upload" | "results";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");

  const renderCurrentView = () => {
    switch (currentState) {
      case "upload":
        return <DocumentUpload />;
      case "results":
        return <EligibilityStatus />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {renderCurrentView()}
      </main>
      
      {/* Development Navigation */}
      <div className="fixed bottom-4 right-4 bg-white shadow-elevated rounded-lg p-4 border">
        <p className="text-sm font-medium mb-2">Demo Navigation:</p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentState("landing")}
            className={`px-3 py-1 text-xs rounded ${currentState === "landing" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Landing
          </button>
          <button 
            onClick={() => setCurrentState("upload")}
            className={`px-3 py-1 text-xs rounded ${currentState === "upload" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Upload
          </button>
          <button 
            onClick={() => setCurrentState("results")}
            className={`px-3 py-1 text-xs rounded ${currentState === "results" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
