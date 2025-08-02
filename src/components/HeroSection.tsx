import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Shield, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-healthcare.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Check Your Healthcare
              <br />
              <span className="text-secondary-light">Eligibility</span> Instantly
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Upload your documents and discover if you qualify for Medicaid, SNAP, or local health programs like Healthy SF. Get personalized recommendations in minutes.
            </p>
          </div>
          
          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <FileText className="w-12 h-12 text-secondary-light mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Smart Document Analysis</h3>
              <p className="text-white/80">AI-powered extraction from your uploaded documents</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Shield className="w-12 h-12 text-secondary-light mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-white/80">Your documents are processed securely and privately</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <CheckCircle className="w-12 h-12 text-secondary-light mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
              <p className="text-white/80">Get eligibility results and recommendations immediately</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              className="text-lg px-8 py-4"
            >
              Start Eligibility Check
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};