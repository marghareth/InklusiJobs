"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BasicInformation({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    age: initialData.age || "",
    currentAddress: initialData.currentAddress || "",
    permanentAddress: initialData.permanentAddress || "",
    contactNumber: initialData.contactNumber || "",
    educationalAttainment: initialData.educationalAttainment || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const educationalOptions = [
    "Some Elementary",
    "Elementary Graduate",
    "Some High School",
    "High School Graduate",
    "Some College",
    "College Graduate",
    "Some/Completed Master's Degree",
    "Master's Graduate",
    "Vocational/TVET",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user)
        throw new Error("Session expired. Please sign in again.");

      // Upsert into profiles table
      const role = user.user_metadata?.role || "worker";

      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: formData.age ? parseInt(formData.age) : null,
        role: role,
        current_address: formData.currentAddress,
        permanent_address: formData.permanentAddress,
        contact_number: formData.contactNumber,
        educational_attainment: formData.educationalAttainment,
        updated_at: new Date().toISOString(),
      });

      if (upsertError) throw upsertError;

      onSubmit?.({ first_name: formData.firstName, role });
    } catch (err) {
      console.error("BasicInformation save error:", err);
      setError(
        err.message || "Failed to save your information. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#648fbf] via-[#8891c9] to-[#9a89c6] text-white p-6 rounded-t-2xl">
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-white/90 text-sm mt-1">
          Please complete your profile
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-[#f4f7f9] max-h-[70vh] overflow-y-auto"
      >
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your First Name"
                className="w-full px-4 py-2 bg-[#eef2f7] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479880] text-[#1e293b] placeholder-[#8891c9]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your Last Name"
                className="w-full px-4 py-2 bg-[#eef2f7] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479880] text-[#1e293b] placeholder-[#8891c9]"
                required
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your Age"
              min="1"
              max="120"
              className="w-full px-4 py-2 bg-[#eef2f7] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479880] text-[#1e293b] placeholder-[#8891c9]"
              required
            />
          </div>

          {/* Current Address */}
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">
              Current Address
            </label>
            <input
              type="text"
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleChange}
              placeholder="Enter Current Address"
              className="w-full px-4 py-2 bg-[#eef2f7] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479880] text-[#1e293b] placeholder-[#8891c9]"
              required
            />
          </div>

          {/* Permanent Address */}
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">
              Permanent Address
            </label>
            <input
              type="text"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              placeholder="Enter Permanent Address"
              className="w-full px-4 py-2 bg-[#eef2f7] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479880] text-[#1e293b] placeholder-[#8891c9]"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter Contact Number"
              className="w-full px-4 py-2 bg-[#eef2f7] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479880] text-[#1e293b] placeholder-[#8891c9]"
              required
            />
          </div>

          {/* Educational Attainment */}
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">
              Educational Attainment
            </label>
            <select
              name="educationalAttainment"
              value={formData.educationalAttainment}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#eef2f7] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479880] text-[#1e293b]"
              required
            >
              <option value="">Select Educational Attainment</option>
              {educationalOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#3d7b74] via-[#5fa8d3] to-[#7286d3] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Saving…" : "Continue"}
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i <= 3 ? "bg-[#479880]" : "bg-[#e2e8f0]"}`}
            />
          ))}
        </div>
      </form>
    </div>
  );
}
