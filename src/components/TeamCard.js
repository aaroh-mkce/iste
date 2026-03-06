import React from "react";
import { motion } from "framer-motion";
import { LinkedinIcon } from "./Icons";

export function TeamCard({ member, index }) {
  const imageUrl = member.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=4f46e5,7e22ce&textColor=ffffff`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/10 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300"
    >
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-brand-500/30 group-hover:ring-brand-500 transition-all duration-300">
          <img
            src={imageUrl}
            alt={member.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-purple-500/20 scale-110 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
        {member.name}
      </h3>
      <p className="text-xs text-brand-500 font-medium mt-0.5">{member.role}</p>

      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 p-1.5 rounded-full text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
          aria-label={`LinkedIn - ${member.name}`}
        >
          <LinkedinIcon className="w-4 h-4" />
        </a>
      )}
    </motion.div>
  );
}

export default TeamCard;
