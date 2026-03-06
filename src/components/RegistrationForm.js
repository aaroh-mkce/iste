import React, { useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG"];

export function RegistrationForm({ event, onClose }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", college: "", department: "", year: "", reg_no: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("registrations").insert({
        event_id: event.id,
        ...form,
      });
      if (error) throw error;
      setSuccess(true);
      toast.success("Registered successfully!");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-700 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-white/10 flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Register for Event</h2>
            <p className="text-sm text-brand-500 mt-0.5 font-medium">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Registration Successful!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              You've registered for <strong>{event.title}</strong>. We'll send updates to {form.email}.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-medium hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {[
              { name: "name", label: "Full Name", type: "text", required: true },
              { name: "email", label: "Email Address", type: "email", required: true },
              { name: "phone", label: "Phone Number", type: "tel" },
              { name: "reg_no", label: "Register Number", type: "text" },
              { name: "college", label: "College / Institution", type: "text" },
            ].map(({ name, label, type, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={required}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Year
                </label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/50 outline-none transition"
                >
                  <option value="">Select</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md mt-2"
            >
              {submitting ? "Submitting…" : "Complete Registration"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default RegistrationForm;
