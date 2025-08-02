import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, X, Download, ExternalLink } from "lucide-react";
import statusIcons from "@/assets/status-icons.png";

interface EligibilityResult {
  program: string;
  status: "eligible" | "ineligible" | "missing-documents";
  reason: string;
  missingDocuments?: string[];
  nextSteps?: string[];
}

const mockResults: EligibilityResult[] = [
  {
    program: "Medicaid",
    status: "eligible",
    reason: "Your income and household size qualify you for Medicaid benefits.",
    nextSteps: [
      "Complete your Medicaid application online",
      "Schedule an appointment at your local office",
      "Bring original documents for verification"
    ]
  },
  {
    program: "SNAP (Food Stamps)",
    status: "missing-documents",
    reason: "Additional documentation needed to verify eligibility.",
    missingDocuments: ["Rent Receipt", "Utility Bill from last month"],
    nextSteps: [
      "Upload missing rent receipt",
      "Provide recent utility bill",
      "Resubmit for review"
    ]
  },
  {
    program: "Healthy SF",
    status: "eligible",
    reason: "You qualify for San Francisco's local health coverage program.",
    nextSteps: [
      "Visit a Healthy SF enrollment site",
      "Bring proof of SF residency",
      "Schedule a health screening"
    ]
  }
];

const extractedData = {
  fullName: "John Doe",
  dateOfBirth: "01/15/1985",
  address: "123 Main Street, San Francisco, CA 94102",
  householdSize: 3,
  monthlyIncome: "$3,200",
  employmentStatus: "Employed",
  citizenship: "US Citizen"
};

export const EligibilityStatus = () => {
  const getStatusIcon = (status: EligibilityResult["status"]) => {
    switch (status) {
      case "eligible":
        return <CheckCircle className="w-6 h-6 text-success" />;
      case "missing-documents":
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      case "ineligible":
        return <X className="w-6 h-6 text-destructive" />;
    }
  };

  const getStatusBadge = (status: EligibilityResult["status"]) => {
    switch (status) {
      case "eligible":
        return <Badge className="bg-success text-success-foreground">✅ Eligible</Badge>;
      case "missing-documents":
        return <Badge className="bg-warning text-warning-foreground">❗ Missing Info</Badge>;
      case "ineligible":
        return <Badge variant="destructive">❌ Not Eligible</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <img 
          src={statusIcons} 
          alt="Eligibility Status" 
          className="w-48 h-32 mx-auto mb-6 object-contain"
        />
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Your Eligibility Results
        </h1>
        <p className="text-xl text-muted-foreground">
          Based on your uploaded documents, here's what we found:
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center border-success/20 bg-success/5">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-success">2</h3>
          <p className="text-success-foreground">Programs Eligible</p>
        </Card>
        <Card className="p-6 text-center border-warning/20 bg-warning/5">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-warning">1</h3>
          <p className="text-warning-foreground">Needs More Info</p>
        </Card>
        <Card className="p-6 text-center border-primary/20 bg-primary/5">
          <Download className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary">PDF</h3>
          <p className="text-primary-foreground">Report Ready</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Program Eligibility</h2>
          
          {mockResults.map((result, index) => (
            <Card key={index} className="p-6 shadow-card hover:shadow-elevated transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <h3 className="text-xl font-semibold">{result.program}</h3>
                </div>
                {getStatusBadge(result.status)}
              </div>
              
              <p className="text-muted-foreground mb-4">{result.reason}</p>
              
              {result.missingDocuments && (
                <div className="mb-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <h4 className="font-semibold text-warning mb-2">Missing Documents:</h4>
                  <ul className="list-disc list-inside text-sm text-warning-foreground space-y-1">
                    {result.missingDocuments.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.nextSteps && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Next Steps:</h4>
                  <ul className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    {result.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-3 mt-4">
                {result.status === "eligible" && (
                  <Button variant="success" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                )}
                {result.status === "missing-documents" && (
                  <Button variant="warning" size="sm">
                    Upload Documents
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Sidebar - Extracted Data */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Extracted Information</h3>
            <div className="space-y-3 text-sm">
              {Object.entries(extractedData).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Additional Resources</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                SF Health Network
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Benefits Calculator
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Local Assistance Centers
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-primary border-primary/20">
            <h3 className="text-lg font-semibold text-primary-foreground mb-4">
              Download Your Report
            </h3>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Get a comprehensive PDF report with all your eligibility results and recommendations.
            </p>
            <Button variant="hero" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};