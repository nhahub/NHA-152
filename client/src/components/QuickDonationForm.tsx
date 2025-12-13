import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const QuickDonationForm = () => {
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const presetAmounts = [1, 5, 10, 99];

  const handlePresetClick = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you for your donation!",
      description: `Your donation of $${finalAmount} has been processed.`,
    });

    // Reset form
    setAmount(0);
    setCustomAmount("");
    setName("");
    setEmail("");
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-xl border border-border">
      <h3 className="text-2xl font-bold text-card-foreground mb-6 text-center">
        Quick Donation Form
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {presetAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handlePresetClick(value)}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                amount === value && !customAmount
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              ${value.toString().padStart(2, "0")}
            </button>
          ))}
        </div>

        <Input
          type="number"
          placeholder="Custom amount"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setAmount(0);
          }}
          className="text-center text-lg font-semibold"
        />

        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6"
        >
          Donate Now
        </Button>
      </form>
    </div>
  );
};

export default QuickDonationForm;
