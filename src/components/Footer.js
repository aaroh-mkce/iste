import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-12 bg-dark-900 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">IS</span>
              </div>
              <span className="font-poppins font-bold text-white">ISTE Chapter</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Indian Society for Technical Education Student Chapter — empowering tomorrow's innovators.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {["#about", "#events", "#team", "#gallery", "#contact"].map((href) => (
                <li key={href}>
                  <a href={href} className="hover:text-brand-400 transition-colors capitalize">
                    {href.replace("#", "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Admin</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/admin" className="hover:text-brand-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} ISTE Student Chapter. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
