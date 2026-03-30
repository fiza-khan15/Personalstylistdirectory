import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export const StylistProfileEditor = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    bio: "",
    specialties: {
      menswear: false,
      womenswear: false,
      luxury: false,
      personal: false,
    },
    instagram: "",
    website: "",
    acceptingClients: false,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          console.error("User ID not found");
          setIsLoading(false);
          return;
        }

        // Fetch profile data from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setProfileData(null);
        } else {
          setProfileData(profile);

          // Populate form with existing data
          setFormData({
            name: profile?.name || "",
            city: profile?.city || "",
            country: profile?.country || "",
            bio: profile?.bio || "",
            specialties: profile?.specialties || {
              menswear: false,
              womenswear: false,
              luxury: false,
              personal: false,
            },
            instagram: profile?.instagram || "",
            website: profile?.website || "",
            acceptingClients: profile?.availability || false,
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!userId) {
        console.error("User ID not found");
        setIsSaving(false);
        return;
      }

      // Update profile data in profiles table
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          city: formData.city,
          country: formData.country,
          bio: formData.bio,
          specialties: formData.specialties,
          instagram: formData.instagram,
          website: formData.website,
          availability: formData.acceptingClients,
        })
        .eq("user_id", userId)
        .maybeSingle();

      if (updateError) {
        console.error("Profile update error:", updateError);
      } else {
        setProfileData(updatedProfile);
        console.log("Saving profile:", formData);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="h-px w-24 mx-auto bg-[#4a1a1a]/20 animate-pulse" />
          <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase animate-pulse">
            Loading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-20 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white">
            Edit Profile
          </h1>
        </div>

        {/* Profile Photo */}
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-3">
            <div className="h-24 w-24 border border-white/10 bg-neutral-950 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Upload size={20} className="text-neutral-600" />
              )}
            </div>
            <button className="border border-white/10 bg-black px-6 py-3 text-[8px] font-medium tracking-[0.4em] text-neutral-500 uppercase transition-all hover:border-white/20 hover:text-white">
              Change Image
            </button>
          </div>
          <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
            Profile Photo
          </p>
        </div>

        {/* Basic Information */}
        <div className="mb-16 space-y-8">
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                Name/Studio
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                Base City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
              United States
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
              Editorial stylist with over a decade of experience crafting fashion, sophisticated looks for discerning clientele.
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="w-full border border-white/10 bg-transparent p-4 text-white text-sm outline-none transition-colors focus:border-white/30 resize-none"
            />
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-16 space-y-8">
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Specialties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "menswear", label: "Menswear" },
              { key: "womenswear", label: "Womenswear Styling" },
              { key: "luxury", label: "Formal Wardrobe" },
              { key: "personal", label: "Personal Shopping" },
            ].map((specialty) => (
              <label
                key={specialty.key}
                className="flex items-center gap-3 border border-white/10 bg-black p-5 cursor-pointer transition-all hover:border-white/20"
              >
                <input
                  type="checkbox"
                  checked={
                    formData.specialties[
                      specialty.key as keyof typeof formData.specialties
                    ]
                  }
                  onChange={() => handleSpecialtyToggle(specialty.key)}
                  className="h-4 w-4 cursor-pointer border-white/10 bg-transparent accent-[#4a1a1a]"
                />
                <span className="text-[8px] font-medium tracking-[0.3em] text-white uppercase">
                  {specialty.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Portfolio Images */}
        <div className="mb-16 space-y-8">
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Portfolio Images
          </h2>

          <button className="flex aspect-square w-32 items-center justify-center border border-dashed border-white/10 bg-neutral-950 transition-all hover:border-white/30">
            <Upload size={24} className="text-neutral-600" />
          </button>
        </div>

        {/* Social Links */}
        <div className="mb-16 space-y-8">
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Social Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                @username
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                hello@username.com
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-16 space-y-8">
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Availability
          </h2>

          <label className="flex items-center justify-between border border-white/10 bg-black p-6 cursor-pointer transition-all hover:border-white/20">
            <span className="text-[8px] font-medium tracking-[0.3em] text-white uppercase">
              Accepting New Clients
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.acceptingClients}
                onChange={(e) =>
                  handleInputChange("acceptingClients", e.target.checked)
                }
                className="peer sr-only"
              />
              <div className="w-11 h-6 bg-neutral-800 rounded-full peer-checked:bg-[#4a1a1a] transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-black px-10 py-4 text-[8px] font-bold tracking-[0.4em] uppercase transition-all duration-300 hover:bg-neutral-200 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};