import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickDonationForm from "@/components/QuickDonationForm";
import StatsSection from "@/components/StatsSection";
import { CheckCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import campaign1 from "@/assets/campaign1.jpg";
import campaign2 from "@/assets/campaign2.jpg";
import campaign3 from "@/assets/campaign3.jpg";

const Home = () => {
  const campaigns = [
    {
      id: 1,
      title: "Support Children's Education",
      description: "Help provide quality education and resources to underprivileged children in our community.",
      image: campaign2,
      raised: "$12,500",
      goal: "$25,000",
    },
    {
      id: 2,
      title: "Community Health Initiative",
      description: "Fund healthcare services and medical supplies for families in need.",
      image: campaign1,
      raised: "$8,750",
      goal: "$15,000",
    },
    {
      id: 3,
      title: "Food Security Program",
      description: "Provide nutritious meals to families facing food insecurity.",
      image: campaign3,
      raised: "$18,200",
      goal: "$30,000",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-primary-foreground">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Join Us in Changing Lives
              </h1>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Together, we can make a meaningful difference in the lives of those who need it most. Every contribution brings hope and opportunity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/donate">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className=" border-2 border-primary-foreground text-primary hover:bg-primary-foreground hover:text-orange-700">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <QuickDonationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Quick Donation */}
      <section className="md:hidden py-8 bg-secondary">
        <div className="container mx-auto px-4">
          <QuickDonationForm />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Vision Sections */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-t-4 border-t-green-500 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-card-foreground">Our Vision</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  We envision a world where every individual has access to the resources and support they need to thrive, creating stronger, more compassionate communities.
                </p>
                <Link to="/about">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-accent shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-card-foreground">Our Mission</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  To empower communities through dedicated fundraising efforts, providing essential resources and support to those facing hardship and adversity.
                </p>
                <Link to="/about">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help the Needy Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={campaign1}
                alt="Help the needy"
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                Help the Needy People
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <span className="text-lg text-muted-foreground">
                    Always give without remembering and always receive without forgetting
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <span className="text-lg text-muted-foreground">
                    Giving does not only precede receiving; it is the reason for it
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <span className="text-lg text-muted-foreground">
                    Together we can create lasting change in our communities
                  </span>
                </li>
              </ul>
              <Link to="/donate">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Active Campaigns</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Support our ongoing initiatives making a real difference in people's lives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                    {campaign.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {campaign.description}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Raised: {campaign.raised}</span>
                      <span className="text-muted-foreground">Goal: {campaign.goal}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-accent h-3 rounded-full transition-all"
                        style={{
                          width: `${
                            (parseInt(campaign.raised.replace(/[$,]/g, "")) /
                              parseInt(campaign.goal.replace(/[$,]/g, ""))) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <Link to="/donate">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Donate Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
