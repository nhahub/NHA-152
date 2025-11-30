import {
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  Award,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Mission", href: "/mission" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/shop/blog" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/shop/contact" },
    { label: "Vendor Support", href: "/vendor-support" },
    { label: "Customer Service", href: "/customer-service" },
    { label: "Report Issue", href: "/report" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Vendor Agreement", href: "/vendor-agreement" },
    { label: "Refund Policy", href: "/refund" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const contactInfo = {
  address: "123 LuxMart Street, Community City, CC 12345",
  phone: "+1 (555) 123-4567",
  email: "hello@luxmart.com",
  hours: "Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM",
};

function ShoppingFooter() {
  return (
    <footer className="border-t border-gray-400 dark:border-gray-600 bg-gradient-to-b from-blue-100 via-purple-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-black text-gray-800 dark:text-white transition-all duration-500 ">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-indigo-700 dark:text-white">
                  LuxMart
                </span>
                <span className="text-sm text-indigo-500 dark:text-indigo-300 -mt-1">
                  Local Marketplace
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
              Connecting communities with local artisans, tailors, home cooks,
              and creators. Support small businesses and discover unique,
              personalized products in your area.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
                Stay Updated
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-white border border-gray-300 dark:bg-white/10 dark:border-white/20 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/70 focus:ring-2 focus:ring-purple-400"
                />
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all">
                  Subscribe
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
                Follow Us
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                  >
                    <social.icon className="w-5 h-5 text-gray-700 dark:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-white/10 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-1" />
              <div>
                <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">
                  Address
                </h5>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {contactInfo.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-1" />
              <div>
                <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">
                  Phone
                </h5>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {contactInfo.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-1" />
              <div>
                <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">
                  Email
                </h5>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {contactInfo.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Secure Payments
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Verified Vendors
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Community Driven
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span>{contactInfo.hours}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-white/10 bg-gray-100/60 dark:bg-black/40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>© {new Date().getFullYear()} LuxMart. Made with</span>
              <Heart className="w-4 h-4 text-purple-500 dark:text-purple-400 fill-current" />
              <span>for local communities.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;

