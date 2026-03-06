import React from "react";
import { AnimatedSection } from "../components/AnimatedSection";

const HIGHLIGHTS = [
  {
    icon: "🚀",
    title: "Technical Excellence",
    desc: "Cutting-edge workshops and hands-on sessions to sharpen your technical skills.",
  },
  {
    icon: "🤝",
    title: "Industry Connect",
    desc: "Bridge the gap between academia and industry with expert-led seminars.",
  },
  {
    icon: "💡",
    title: "Innovation Hub",
    desc: "Hackathons and competitions that spark creativity and problem-solving.",
  },
  {
    icon: "🌐",
    title: "Community Network",
    desc: "Connect with like-minded peers, alumni, and professionals worldwide.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            What is{" "}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              ISTE?
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            The Indian Society for Technical Education (ISTE) is the leading national organization for 
            technical education in India. Our student chapter fosters a culture of learning, innovation, 
            and professional development among engineering and technology students.
          </p>
        </AnimatedSection>

        {/* Highlights grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <div className="p-6 rounded-2xl bg-white dark:bg-dark-700 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-brand-500/30 transition-all duration-300 h-full">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Mission */}
        <AnimatedSection delay={0.4} className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-600/10 to-purple-600/10 border border-brand-500/20 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Our Mission</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            To provide the platform for technical professionals and students to interact and upgrade 
            themselves with the recent developments in engineering, technology and management through 
            programs, workshops, competitions, and hands-on experiences.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
