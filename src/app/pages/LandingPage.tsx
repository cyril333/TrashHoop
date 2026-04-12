import { Link } from "react-router";
import { Trash2, Leaf, MapPin, Users, Shield, TrendingUp, CheckCircle, Phone, Mail } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#2E7D32] rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2E7D32]">TrashHoop</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#558B5A] hover:text-[#2E7D32] transition">Features</a>
            <a href="#how-it-works" className="text-[#558B5A] hover:text-[#2E7D32] transition">How It Works</a>
            <Link to="/about" className="text-[#558B5A] hover:text-[#2E7D32] transition">About</Link>
            <Link to="/contact" className="text-[#558B5A] hover:text-[#2E7D32] transition">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6" style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)" }}>
        <div className="max-w-7xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Leaf className="w-4 h-4" />
            <span className="text-sm">Smart Waste Management for Cebu City</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Building a Cleaner,<br />Greener Community
          </h1>

          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Connecting residents, barangay admins, and garbage collectors through innovative technology
            for smarter waste management in Cebu City.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-[#2E7D32] rounded-xl font-semibold hover:bg-green-50 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
            {[
              { value: "150+", label: "Beta Testers", desc: "Currently testing" },
              { value: "5", label: "Pilot Barangays", desc: "Active now" },
              { value: "10K+", label: "Target Users", desc: "Our goal" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-green-200 text-sm mt-1">{stat.label}</div>
                <div className="text-green-300 text-xs mt-0.5 opacity-80">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-[#F4FAF4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A2E1A] mb-4">
              Everything You Need for Smart Waste Management
            </h2>
            <p className="text-lg text-[#558B5A] max-w-2xl mx-auto">
              Powerful features designed for residents, admins, and collectors to work together seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Live Truck Tracking",
                description: "Real-time GPS tracking of garbage collection trucks with route optimization and ETA updates.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Shield,
                title: "Violation Tracking",
                description: "Automated violation detection with warning system and credit score management for accountability.",
                color: "bg-amber-100 text-amber-600",
              },
              {
                icon: Users,
                title: "Community Reports",
                description: "Easy photo-based reporting of improper waste disposal with real-time admin notifications.",
                color: "bg-green-100 text-[#2E7D32]",
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                description: "Comprehensive insights on waste collection, violations, and community engagement metrics.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: Leaf,
                title: "Waste Categorization",
                description: "Smart guidance on biodegradable, recyclable, residual, and hazardous waste disposal.",
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                icon: CheckCircle,
                title: "Credit Score System",
                description: "Gamified reward system (0-100) that encourages proper waste management behavior.",
                color: "bg-indigo-100 text-indigo-600",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2E1A] mb-3">{feature.title}</h3>
                  <p className="text-[#558B5A]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A2E1A] mb-4">How TrashHoop Works</h2>
            <p className="text-lg text-[#558B5A] max-w-2xl mx-auto">
              Simple steps to join the movement for a cleaner Cebu City
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Role",
                description: "Register as a Resident, Barangay Admin, or Garbage Collector",
              },
              {
                step: "02",
                title: "Access Your Dashboard",
                description: "Get personalized features based on your role and barangay location",
              },
              {
                step: "03",
                title: "Take Action",
                description: "Report violations, track trucks, manage schedules, or view educational content",
              },
              {
                step: "04",
                title: "Build Your Score",
                description: "Earn credit points for good practices and maintain community standards",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-[#E8F5E9] mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-[#1A2E1A] mb-3">{item.title}</h3>
                <p className="text-[#558B5A]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-green-100 mb-10">
            Be part of our pilot program and help shape the future of waste management in Cebu City.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-[#2E7D32] rounded-xl font-semibold hover:bg-green-50 transition shadow-lg"
          >
            Join the Beta Program
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2E1A] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#2E7D32] rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TrashHoop</span>
            </div>
            <p className="text-green-300 text-sm">
              Smart waste management for a sustainable Cebu City.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block text-green-300 hover:text-white transition">About Us</Link>
              <Link to="/contact" className="block text-green-300 hover:text-white transition">Contact</Link>
              <a href="#features" className="block text-green-300 hover:text-white transition">Features</a>
              <a href="#how-it-works" className="block text-green-300 hover:text-white transition">How It Works</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Get Started</h4>
            <div className="space-y-2 text-sm">
              <Link to="/login" className="block text-green-300 hover:text-white transition">Sign In</Link>
              <Link to="/register" className="block text-green-300 hover:text-white transition">Register</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-green-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@trashhoop.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+63 32 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-green-900 text-center text-sm text-green-400">
          <p>&copy; 2026 TrashHoop. Built with ❤️ by CIT-U for Cebu City.</p>
        </div>
      </footer>
    </div>
  );
}
