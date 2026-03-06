import React from "react";
import { AnimatedSection } from "../components/AnimatedSection";
import { EnvelopeIcon, MapPinIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Questions, partnerships, or just want to say hello? We'd love to hear from you.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info */}
          <AnimatedSection>
            <div className="space-y-6">
              {[
                {
                  icon: <EnvelopeIcon className="w-5 h-5" />,
                  label: "Email",
                  value: "iste@college.edu",
                  href: "mailto:iste@college.edu",
                },
                {
                  icon: <MapPinIcon className="w-5 h-5" />,
                  label: "Location",
                  value: "Student Activity Centre, Campus",
                  href: null,
                },
                {
                  icon: <GlobeAltIcon className="w-5 h-5" />,
                  label: "Website",
                  value: "iste.chapter.edu",
                  href: "#",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a href={item.href} className="text-gray-900 dark:text-white font-medium hover:text-brand-500 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="mt-8 flex gap-3">
              {["LinkedIn", "Instagram", "Twitter", "GitHub"].map((social) => (
                <button
                  key={social}
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-dark-700 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-brand-500/50 hover:text-brand-500 transition-all"
                >
                  {social}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Quick message form */}
          <AnimatedSection delay={0.2}>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                  <input type="text" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input type="email" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                <input type="text" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                <textarea rows={4} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/50 resize-none" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-medium hover:opacity-90 transition shadow-md">
                Send Message
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
