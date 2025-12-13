import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Users, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We lead with empathy and understanding, ensuring every action reflects our commitment to helping others.",
    },
    {
      icon: Target,
      title: "Impact",
      description: "We focus on creating measurable, lasting change that transforms lives and strengthens communities.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in the power of collective action and bringing people together for a common good.",
    },
    {
      icon: Award,
      title: "Integrity",
      description: "We maintain the highest standards of transparency and accountability in all our operations.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Executive Director",
      description: "Leading with 15+ years of nonprofit experience",
    },
    {
      name: "Michael Chen",
      role: "Operations Manager",
      description: "Ensuring efficient program delivery",
    },
    {
      name: "Emily Rodriguez",
      role: "Community Outreach",
      description: "Building bridges with communities",
    },
    {
      name: "David Thompson",
      role: "Fundraising Director",
      description: "Maximizing donor impact",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Heart Fund</h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/90">
            We are a dedicated nonprofit organization committed to creating positive change through compassionate action and community support.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-card-foreground">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To empower individuals and communities through dedicated fundraising efforts, providing essential resources, support, and opportunities to those facing adversity. We believe that together, we can create lasting positive change.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-t-4 border-t-accent">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-card-foreground">Our Vision</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  A world where every individual has access to the resources and support they need to thrive. We envision stronger, more compassionate communities where no one is left behind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals working to make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">{member.name}</h3>
                  <p className="text-primary font-semibold mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center text-foreground">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Heart Fund was founded in 2010 with a simple yet powerful belief: that communities thrive when people come together to support one another. What began as a small grassroots initiative has grown into a comprehensive nonprofit organization serving thousands of families each year.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Over the past decade, we've witnessed the transformative power of collective compassion. From providing emergency assistance to families in crisis, to funding educational programs for underprivileged children, to supporting healthcare initiatives in underserved communities—our work continues to expand as we respond to the evolving needs of those we serve.
              </p>
              <p className="text-lg leading-relaxed">
                Today, Heart Fund stands as a testament to what can be achieved when dedicated individuals unite for a common cause. With the support of our donors, volunteers, and partners, we continue to build a brighter, more equitable future for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
