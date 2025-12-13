import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, CreditCard, Shield } from "lucide-react";

const Donation = () => {
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const { toast } = useToast();

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handlePresetClick = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    
    if (finalAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please select or enter a donation amount",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 Sending donation to server...');
      
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          amount: finalAmount,
          donationType: donationType,
          currency: 'USD'
        }),
      });

      const result = await response.json();
      console.log('✅ Server response:', result);

      if (response.ok) {
        toast({
          title: "Thank you for your generosity! 🎉",
          description: result.message || `Your ${donationType} donation of $${finalAmount} has been processed successfully.`,
        });

        // Reset form
        setAmount(0);
        setCustomAmount("");
        setFormData({
          name: "",
          email: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        });
      } else {
        toast({
          title: "Donation failed",
          description: result.error || "There was an error processing your donation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast({
        title: "Connection error",
        description: "Unable to connect to the server. Please make sure the backend is running on http://localhost:5000",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-pink-300" />
          <h1 className="text-5xl font-bold mb-6">Make a Donation</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Your generous contribution helps us continue our mission of supporting communities in need.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Donation Type */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Donation Type</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDonationType("one-time")}
                        className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                          donationType === "one-time"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        One-Time Donation
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationType("monthly")}
                        className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                          donationType === "monthly"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Monthly Donation
                      </button>
                    </div>
                  </div>

                  {/* Donation Amount */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Amount</h2>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                      {presetAmounts.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handlePresetClick(value)}
                          className={`py-4 px-4 rounded-lg font-semibold transition-all ${
                            amount === value && !customAmount
                              ? "bg-green-500 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          ${value}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(0);
                      }}
                      className="text-lg py-3"
                    />
                  </div>

                  {/* Donor Information */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="py-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="py-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Information (ملاحظة: هذه للعرض فقط) */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                      <CreditCard className="w-6 h-6 mr-2" />
                      Payment Details (Demo)
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Card Number
                        </label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="py-3"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Expiry Date
                          </label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="py-3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            CVV
                          </label>
                          <Input
                            type="text"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="py-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">
                          Note: This is a demo application
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          No real payment information is processed. Data is saved to a local SQLite database.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Donation...
                      </span>
                    ) : (
                      `Complete Donation of $${customAmount ? customAmount : amount || '0'}`
                    )}
                  </Button>

                  {/* Test Note */}
                  <div className="text-center text-sm text-gray-500">
                    <p>Test the backend by filling name, email, and amount then click submit.</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">$50</div>
                  <p className="text-gray-600">Provide meals for a family for a week</p> 
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">$100</div>
                  <p className="text-gray-600">Supplies school materials for 10 children</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">$250</div>
                  <p className="text-gray-600">Supports healthcare for a family in need</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Donation;