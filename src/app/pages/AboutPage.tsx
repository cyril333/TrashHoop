import { Link } from "react-router";
import { Trash2, Target, Users, Heart, Award, Leaf, ArrowLeft } from "lucide-react";

export default function AboutPage() {
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

          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-[#558B5A] hover:text-[#2E7D32] transition">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6" style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Our Story</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About TrashHoop
          </h1>

          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            A CIT-U initiative to transform waste management in Cebu City through
            innovative technology, community engagement, and sustainable practices.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-[#F4FAF4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-green-100 text-[#2E7D32] rounded-xl flex items-center justify-center mb-5">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A2E1A] mb-4">Our Mission</h3>
              <p className="text-[#558B5A]">
                To leverage technology to empower communities in Cebu City with smart waste management tools that
                promote environmental responsibility and create a cleaner, healthier living environment for everyone.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A2E1A] mb-4">Our Vision</h3>
              <p className="text-[#558B5A]">
                A future where technology unites residents, admins, and collectors in achieving zero waste—starting
                in Cebu City and inspiring sustainable communities across the Philippines.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A2E1A] mb-4">Our Values</h3>
              <p className="text-[#558B5A]">
                Innovation, sustainability, community engagement, and continuous learning drive everything we do.
                We believe in creating practical solutions that empower individuals to make a positive
                environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1A2E1A] mb-8 text-center">How It All Started</h2>

          <div className="prose prose-lg max-w-none text-[#558B5A] space-y-6">
            <p>
              TrashHoop was born from a simple observation made by three students from Cebu Institute of Technology -
              University (CIT-U): waste management in Cebu City needed a digital transformation. Through careful
              observation of barangay waste collection challenges, community disposal habits, and the disconnect
              between residents and collectors, we identified an opportunity to create real change.
            </p>

            <p>
              Launched in 2026, we started with a pilot program targeting five barangays—Lahug, Apas, Capitol Site,
              Kamputhaw, and Mabolo. Our vision was to create a platform that could connect residents, barangay
              administrators, and garbage collectors in one unified ecosystem. By combining real-time tracking,
              gamification through our credit score system, and educational resources, we aimed to fundamentally
              change how communities approach waste management.
            </p>

            <p>
              Currently, we're actively testing TrashHoop with early adopters in our pilot barangays. While our platform
              is still in development, we're seeing promising engagement from residents and collectors who are helping us
              refine the experience. Our ultimate goal is to serve thousands of users across 50+ barangays, process
              numerous waste collection reports daily, and achieve high collection efficiency rates. This journey has
              just begun, and we're committed to expanding our platform and continuing to innovate in the waste
              management space.
            </p>
          </div>
        </div>
      </section>

      {/* Current Impact & Goals */}
      <section className="py-20 px-6 bg-[#F4FAF4]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1A2E1A] mb-4 text-center">Current Progress</h2>
          <p className="text-[#558B5A] mb-12 text-center max-w-2xl mx-auto">
            We're building momentum with our pilot program in Cebu City
          </p>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              { value: "150+", label: "Beta Testers", icon: Users },
              { value: "5", label: "Pilot Barangays", icon: Trash2 },
              { value: "85%", label: "User Satisfaction", icon: Target },
              { value: "420+", label: "Test Reports", icon: Award },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <div className="w-14 h-14 bg-[#2E7D32] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-[#2E7D32] mb-2">{stat.value}</div>
                  <div className="text-[#558B5A]">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Our Vision & Goals</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { value: "10,000+", label: "Target Users" },
                { value: "50+", label: "Barangays Coverage" },
                { value: "98%", label: "Collection Efficiency" },
                { value: "Zero Waste", label: "Ultimate Goal" },
              ].map((goal) => (
                <div key={goal.label} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">{goal.value}</div>
                  <div className="text-green-200 text-sm">{goal.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1A2E1A] mb-4 text-center">Meet the Team</h2>
          <p className="text-lg text-[#558B5A] mb-12 text-center max-w-2xl mx-auto">
            Three passionate individuals from CIT-U working to make Cebu City cleaner and greener
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Snyd Jabines", role: "Frontend and Documentation", initial: "SJ" },
              { name: "Cyril Antolijao", role: "UI/UX Designer and QA / Tester", initial: "CA" },
              { name: "Ian Abesia", role: "Project Manager / Team Lead", initial: "IA" },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 bg-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-white">{member.initial}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A2E1A] mb-1">{member.name}</h3>
                <p className="text-[#558B5A]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-green-100 mb-10">
            Help us test and refine TrashHoop to create a cleaner, greener Cebu City.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-[#2E7D32] rounded-xl font-semibold hover:bg-green-50 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2E1A] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-green-400">
          <p>&copy; 2026 TrashHoop. Built with ❤️ by CIT-U for Cebu City.</p>
        </div>
      </footer>
    </div>
  );
}
