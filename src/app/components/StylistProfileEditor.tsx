import React, { useState } from "react";
import { Upload, X } from "lucide-react";

interface StylistProfileEditorProps {
  onNavigate: (page: string) => void;
}

export const StylistProfileEditor = ({ onNavigate }: StylistProfileEditorProps) => {
  const [formData, setFormData] = useState({
    name: "Maven Clarke",
    city: "New York",
    country: "United States",
    bio: "Editorial stylist with over a decade of experience crafting timeless, sophisticated looks for discerning clientele.",
    specialties: {
      menswear: true,
      editorial: true,
      luxury: true,
      branding: false,
    },
    instagram: "@mavenclarke",
    website: "mavenclarke.com",
    acceptingClients: true,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: {
        ...prev.specialties,
        [specialty]: !prev.specialties[specialty as keyof typeof prev.specialties],
      },
    }));
  };

  const handleSave = () => {
    // Save logic would go here
    console.log("Saving profile:", formData);
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-24 space-y-4 border-b border-white/5 pb-12">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-[9px] font-medium tracking-[0.4em] text-neutral-600 uppercase transition-colors hover:text-white"
          >
            ← Back to Dashboard
          </button>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white">
            Edit Profile
          </h1>
        </div>

        {/* Profile Photo */}
        <div className="mb-20 space-y-6">
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Profile Photo
          </h2>
          <div className="flex items-center gap-8">
            <div className="h-32 w-32 overflow-hidden border border-white/10 bg-neutral-900">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Upload size={24} className="text-neutral-600" />
                </div>
              )}
            </div>
            <button className="border border-white/10 px-8 py-4 text-[9px] font-medium tracking-[0.4em] text-neutral-400 uppercase transition-all hover:border-white hover:text-white">
              Upload Image
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-20 space-y-8">
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <label className="text-[9px] font-medium tracking-[0.3em] text-neutral-500 uppercase">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors focus:border-red-900"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-medium tracking-[0.3em] text-neutral-500 uppercase">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors focus:border-red-900"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[9px] font-medium tracking-[0.3em] text-neutral-500 uppercase">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors focus:border-red-900"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[9px] font-medium tracking-[0.3em] text-neutral-500 uppercase">
                Short Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className="w-full border border-white/10 bg-transparent p-4 text-white outline-none transition-colors focus:border-red-900 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-20 space-y-8">
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Specialties
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { key: "menswear", label: "Menswear" },
              { key: "editorial", label: "Editorial Styling" },
              { key: "luxury", label: "Luxury Wardrobe" },
              { key: "branding", label: "Personal Branding" },
            ].map((specialty) => (
              <label
                key={specialty.key}
                className="flex cursor-pointer items-center gap-4 border border-white/5 bg-neutral-900/20 p-6 transition-all hover:border-white/10"
              >
                <input
                  type="checkbox"
                  checked={formData.specialties[specialty.key as keyof typeof formData.specialties]}
                  onChange={() => handleSpecialtyToggle(specialty.key)}
                  className="h-5 w-5 cursor-pointer border-white/10 bg-transparent accent-red-900"
                />
                <span className="text-[10px] font-medium tracking-[0.3em] text-white uppercase">
                  {specialty.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mb-20 space-y-8">
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Portfolio Images
          </h2>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {portfolioImages.map((img, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden border border-white/10">
                <img src={img} alt={`Portfolio ${index + 1}`} className="h-full w-full object-cover" />
                <button className="absolute right-2 top-2 bg-neutral-950/80 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
            
            {/* Upload placeholder */}
            <button className="flex aspect-square items-center justify-center border border-dashed border-white/10 bg-neutral-900/20 transition-all hover:border-white/30">
              <Upload size={24} className="text-neutral-600" />
            </button>
          </div>
          
          <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
            Upload up to 12 portfolio images
          </p>
        </div>

        {/* Social Links */}
        <div className="mb-20 space-y-8">
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Social Links
          </h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <label className="text-[9px] font-medium tracking-[0.3em] text-neutral-500 uppercase">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                placeholder="@username"
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors focus:border-red-900"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-medium tracking-[0.3em] text-neutral-500 uppercase">
                Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="www.yourwebsite.com"
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors focus:border-red-900"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-20 space-y-8">
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Availability
          </h2>
          
          <label className="flex cursor-pointer items-center justify-between border border-white/5 bg-neutral-900/20 p-8 transition-all hover:border-white/10">
            <div className="space-y-2">
              <p className="text-[10px] font-medium tracking-[0.3em] text-white uppercase">
                Accepting New Clients
              </p>
              <p className="text-[9px] tracking-[0.2em] text-neutral-600 uppercase">
                Toggle your availability status
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.acceptingClients}
              onChange={(e) => handleInputChange("acceptingClients", e.target.checked)}
              className="h-6 w-12 cursor-pointer appearance-none rounded-full bg-neutral-800 transition-all checked:bg-red-900 relative before:absolute before:left-1 before:top-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:checked:translate-x-6 checked:before:translate-x-6"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 border-t border-white/5 pt-12">
          <button
            onClick={handleSave}
            className="border border-white/10 bg-white px-12 py-5 text-[9px] font-bold tracking-[0.5em] text-neutral-950 uppercase transition-all hover:bg-red-900 hover:text-white hover:border-red-900"
          >
            Save Changes
          </button>
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-[9px] font-medium tracking-[0.4em] text-neutral-600 uppercase transition-colors hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
