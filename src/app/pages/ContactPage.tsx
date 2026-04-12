import { useState } from "react";
import { Link } from "react-router";
import { Trash2, Mail, Phone, MapPin, Send, MessageSquare, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

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
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Get In Touch</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Contact Us
          </h1>

          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-[#F4FAF4]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-[#1A2E1A] mb-6">Let's Connect</h2>
            <p className="text-lg text-[#558B5A] mb-8">
              Whether you're interested in joining our pilot program, have questions about TrashHoop,
              or want to provide feedback on our platform, we'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-[#2E7D32] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A2E1A] mb-1">Email Us</h3>
                  <p className="text-[#558B5A] text-sm mb-2">Send us an email anytime</p>
                  <a href="mailto:support@trashhoop.com" className="text-[#2E7D32] hover:underline">
                    support@trashhoop.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A2E1A] mb-1">Call Us</h3>
                  <p className="text-[#558B5A] text-sm mb-2">Mon-Fri 8AM-6PM</p>
                  <a href="tel:+6332123456 7" className="text-[#2E7D32] hover:underline">
                    +63 32 123 4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A2E1A] mb-1">Visit Us</h3>
                  <p className="text-[#558B5A] text-sm mb-2">Our main office</p>
                  <p className="text-[#2E7D32]">
                    123 Osmeña Boulevard<br />
                    Capitol Site, Cebu City<br />
                    6000 Philippines
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A2E1A] mb-4">Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#558B5A]">Monday - Friday</span>
                  <span className="text-[#1A2E1A] font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#558B5A]">Saturday</span>
                  <span className="text-[#1A2E1A] font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#558B5A]">Sunday</span>
                  <span className="text-[#1A2E1A] font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#1A2E1A] mb-6">Send Us a Message</h2>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 flex items-start gap-3">
                <Send className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Message sent successfully!</p>
                  <p className="text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-[#1A2E1A] mb-1.5 block">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Juan Dela Cruz"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition"
                />
              </div>

              <div>
                <label className="text-sm text-[#1A2E1A] mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition"
                />
              </div>

              <div>
                <label className="text-sm text-[#1A2E1A] mb-1.5 block">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] transition appearance-none cursor-pointer"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="barangay">Barangay Implementation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-[#1A2E1A] mb-1.5 block">Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1A2E1A] mb-4 text-center">Frequently Asked Questions</h2>
          <p className="text-[#558B5A] mb-12 text-center">
            Quick answers to common questions
          </p>

          <div className="space-y-4">
            {[
              {
                question: "How do I register for TrashHoop?",
                answer: "Click the 'Get Started' button, select your role (Resident, Admin, or Collector), and fill out the registration form with your details.",
              },
              {
                question: "Is TrashHoop free to use?",
                answer: "Yes! TrashHoop is completely free for all residents, barangay admins, and garbage collectors in Cebu City.",
              },
              {
                question: "How does the credit score system work?",
                answer: "Your credit score (0-100) increases when you follow proper waste disposal guidelines and decreases when violations are recorded. It helps promote responsible waste management.",
              },
              {
                question: "Can I track garbage trucks in real-time?",
                answer: "Yes! The Routes page shows live GPS tracking of collection trucks with real-time position updates and estimated arrival times.",
              },
            ].map((faq, index) => (
              <details key={index} className="bg-[#F4FAF4] rounded-xl p-6 group">
                <summary className="font-semibold text-[#1A2E1A] cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-[#2E7D32] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-[#558B5A]">{faq.answer}</p>
              </details>
            ))}
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
