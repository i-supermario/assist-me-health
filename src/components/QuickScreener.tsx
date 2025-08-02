import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface QuickScreenerProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export const QuickScreener = ({ onComplete, onBack }: QuickScreenerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    zipCode: '',
    employmentStatus: '',
    monthlyHours: '',
    monthlyIncome: '',
    immigrationStatus: '',
    medicalConditions: [] as string[],
    dependentsUnder14: ''
  });

  const steps = [
    {
      title: "Basic Information",
      fields: [
        {
          key: 'age',
          label: 'Age',
          type: 'number',
          placeholder: 'Enter your age',
          required: true
        },
        {
          key: 'zipCode',
          label: 'ZIP Code',
          type: 'text',
          placeholder: 'Enter your ZIP code',
          required: true
        }
      ]
    },
    {
      title: "Employment & Income",
      fields: [
        {
          key: 'employmentStatus',
          label: 'Employment Status',
          type: 'select',
          options: [
            { value: 'employed', label: 'Employed' },
            { value: 'unemployed', label: 'Unemployed' },
            { value: 'self-employed', label: 'Self-employed' },
            { value: 'retired', label: 'Retired' },
            { value: 'disabled', label: 'Disabled' },
            { value: 'student', label: 'Student' }
          ],
          required: true
        },
        {
          key: 'monthlyHours',
          label: 'Monthly Work Hours',
          type: 'number',
          placeholder: 'Average hours worked per month',
          condition: (data: any) => data.employmentStatus === 'employed' || data.employmentStatus === 'self-employed'
        },
        {
          key: 'monthlyIncome',
          label: 'Monthly Income',
          type: 'number',
          placeholder: 'Enter monthly income in dollars',
          required: true
        }
      ]
    },
    {
      title: "Immigration & Family",
      fields: [
        {
          key: 'immigrationStatus',
          label: 'Immigration Status',
          type: 'select',
          options: [
            { value: 'citizen', label: 'U.S. Citizen' },
            { value: 'permanent-resident', label: 'Permanent Resident (Green Card)' },
            { value: 'refugee', label: 'Refugee' },
            { value: 'asylee', label: 'Asylee' },
            { value: 'other', label: 'Other Legal Status' },
            { value: 'undocumented', label: 'Undocumented' }
          ],
          required: true
        },
        {
          key: 'dependentsUnder14',
          label: 'Number of Dependents Under 14',
          type: 'number',
          placeholder: '0',
          required: true
        }
      ]
    },
    {
      title: "Medical Conditions",
      fields: [
        {
          key: 'medicalConditions',
          label: 'Do you have any of these conditions?',
          type: 'checkbox',
          options: [
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'hypertension', label: 'High Blood Pressure' },
            { value: 'heart-disease', label: 'Heart Disease' },
            { value: 'mental-health', label: 'Mental Health Conditions' },
            { value: 'chronic-pain', label: 'Chronic Pain' },
            { value: 'pregnancy', label: 'Pregnancy' },
            { value: 'disability', label: 'Disability' },
            { value: 'none', label: 'None of the above' }
          ]
        }
      ]
    }
  ];

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: checked 
        ? [...prev.medicalConditions, value]
        : prev.medicalConditions.filter(item => item !== value)
    }));
  };

  const canProceed = () => {
    const currentStepFields = steps[currentStep].fields;
    return currentStepFields.every((field: any) => {
      if (field.condition && !field.condition(formData)) return true;
      if (!field.required) return true;
      if (field.type === 'checkbox') return true;
      return formData[field.key as keyof typeof formData];
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const renderField = (field: any) => {
    if (field.condition && !field.condition(formData)) {
      return null;
    }

    switch (field.type) {
      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Select onValueChange={(value) => handleInputChange(field.key, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.key} className="space-y-3">
            <Label>{field.label}</Label>
            <div className="grid grid-cols-1 gap-3">
              {field.options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={formData.medicalConditions.includes(option.value)}
                    onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)}
                  />
                  <Label htmlFor={option.value} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.key as keyof typeof formData]}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              required={field.required}
            />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length} - Help us determine your eligibility
          </CardDescription>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep].fields.map(renderField)}
          
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 0 ? 'Back to Home' : 'Previous'}
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === steps.length - 1 ? 'Complete Screening' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};