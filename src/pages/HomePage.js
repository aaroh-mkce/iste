import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HeroSection } from "../sections/HeroSection";
import { AboutSection } from "../sections/AboutSection";
import { EventsSection } from "../sections/EventsSection";
import { TeamSection } from "../sections/TeamSection";
import { GallerySection } from "../sections/GallerySection";
import { AnnouncementsSection } from "../sections/AnnouncementsSection";
import { SponsorsSection } from "../sections/SponsorsSection";
import { FeedbackSection } from "../sections/FeedbackSection";
import { ContactSection } from "../sections/ContactSection";

export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <AnnouncementsSection />
        <EventsSection type="upcoming" />
        <GallerySection />
        <TeamSection />
        <EventsSection type="past" />
        <SponsorsSection />
        <FeedbackSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
