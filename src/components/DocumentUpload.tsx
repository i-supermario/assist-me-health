import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertTriangle, X } from "lucide-react";
import uploadIcon from "@/assets/upload-docs.png";

type DocumentType = 
  | "utility-bill"
  | "state-id"
  | "paystub"
  | "rent-agreement"
  | "birth-certificate"
  | "application-form";

interface UploadedDocument {
  id: string;
  name: string;
  type: DocumentType;
  status: "uploaded" | "processing" | "completed" | "error";
  extractedFields?: Record<string, any>;
}

const documentTypes = [
  { type: "utility-bill" as DocumentType, label: "Utility Bill", required: true },
  { type: "state-id" as DocumentType, label: "State ID / Driver's License", required: true },
  { type: "paystub" as DocumentType, label: "Paystub / W2", required: true },
  { type: "rent-agreement" as DocumentType, label: "Rent Agreement", required: false },
  { type: "birth-certificate" as DocumentType, label: "Birth Certificate", required: false },
  { type: "application-form" as DocumentType, label: "Application Form", required: false },
];

interface DocumentUploadProps {
  onComplete: (documents: File[]) => void;
  onBack: () => void;
}

export const DocumentUpload = ({ onComplete, onBack }: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      const newDoc: UploadedDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: "utility-bill", // Would be determined by AI
        status: "uploaded"
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id 
              ? { ...doc, status: "processing" }
              : doc
          )
        );
        
        // Simulate completion
        setTimeout(() => {
          setDocuments(prev => 
            prev.map(doc => 
              doc.id === newDoc.id 
                ? { 
                    ...doc, 
                    status: "completed",
                    extractedFields: {
                      fullName: "John Doe",
                      address: "123 Main St, San Francisco, CA",
                      monthlyIncome: "$3,200"
                    }
                  }
                : doc
            )
          );
        }, 2000);
      }, 1000);
    });
  };

  const getStatusIcon = (status: UploadedDocument["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "processing":
        return <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />;
      case "error":
        return <X className="w-5 h-5 text-destructive" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRequiredDocuments = () => {
    const uploaded = documents.filter(doc => doc.status === "completed");
    const required = documentTypes.filter(dt => dt.required);
    const missing = required.filter(req => 
      !uploaded.some(doc => doc.type === req.type)
    );
    return { uploaded: uploaded.length, required: required.length, missing };
  };

  const { uploaded, required, missing } = getRequiredDocuments();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Upload Your Documents</h2>
          <p className="text-muted-foreground">
            Upload the required documents to check your eligibility for healthcare benefits.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Screening
        </Button>
      </div>

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed p-8 mb-8 transition-all cursor-pointer ${
          isDragging 
            ? "border-primary bg-primary/5 shadow-medical" 
            : "border-border hover:border-primary/50 hover:bg-accent/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <img 
            src={uploadIcon} 
            alt="Upload Documents" 
            className="w-24 h-24 mx-auto mb-4 opacity-80"
          />
          <h3 className="text-xl font-semibold mb-2">Drag & Drop Your Documents</h3>
          <p className="text-muted-foreground mb-4">
            Or click to browse files. Supports PDF, JPG, PNG formats.
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </label>
          </Button>
        </div>
      </Card>

      {/* Progress Overview */}
      {documents.length > 0 && (
        <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upload Progress</h3>
            <Badge variant={uploaded >= required ? "default" : "secondary"}>
              {uploaded}/{required} Required Documents
            </Badge>
          </div>
          <Progress 
            value={(uploaded / required) * 100} 
            className="h-3 mb-4"
          />
          {missing.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Still needed: {missing.map(m => m.label).join(", ")}
            </div>
          )}
        </Card>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Documents</h3>
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4 shadow-card hover:shadow-elevated transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {doc.type.replace("-", " ")}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={doc.status === "completed" ? "default" : "secondary"}
                  className={
                    doc.status === "completed" ? "bg-success text-success-foreground" :
                    doc.status === "processing" ? "bg-warning text-warning-foreground" :
                    doc.status === "error" ? "bg-destructive text-destructive-foreground" :
                    ""
                  }
                >
                  {doc.status}
                </Badge>
              </div>
              
              {doc.extractedFields && (
                <div className="mt-4 p-3 bg-success/10 rounded-md border border-success/20">
                  <p className="text-sm font-medium text-success-foreground mb-2">
                    Extracted Information:
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {Object.entries(doc.extractedFields).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Required Documents Checklist */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold mb-4">Document Checklist</h3>
        <div className="space-y-3">
          {documentTypes.map((docType) => {
            const isUploaded = documents.some(
              doc => doc.type === docType.type && doc.status === "completed"
            );
            return (
              <div key={docType.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isUploaded ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-muted rounded-full" />
                  )}
                  <span className={isUploaded ? "text-foreground" : "text-muted-foreground"}>
                    {docType.label}
                  </span>
                </div>
                <Badge variant={docType.required ? "destructive" : "secondary"}>
                  {docType.required ? "Required" : "Optional"}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Next Steps */}
      {uploaded >= required && (
        <Card className="mt-6 p-6 bg-gradient-success border-success/20">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-success-foreground mb-2">
              Ready for Eligibility Check!
            </h3>
            <p className="text-success-foreground/80 mb-4">
              All required documents have been uploaded and processed.
            </p>
            <Button 
              variant="success" 
              size="lg"
              onClick={() => onComplete(documents.map(() => new File([], 'mock')))}
            >
              Check My Eligibility
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};