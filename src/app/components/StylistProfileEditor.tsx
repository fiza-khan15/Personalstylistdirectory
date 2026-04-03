import React, { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { projectId } from '/utils/supabase/info';

export const StylistProfileEditor = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const portfolioImagesInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    professionalTitle: "",
    yearsExperience: "",
    city: "",
    country: "",
    bio: "",
    specialties: [] as string[],
    instagram: "",
    website: "",
    acceptingClients: false,
    profileImage: "",
    portfolioImages: [] as string[],
  });

  const availableSpecialties = [
    "Menswear",
    "Womenswear Styling",
    "Editorial Styling",
    "Luxury Wardrobe",
    "Personal Shopping",
    "Wardrobe Consulting",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          console.error("User ID not found");
          setIsLoading(false);
          return;
        }

        console.log("Fetching profile for userId:", userId);

        // Fetch profile data from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
        } else if (profile) {
          console.log("Profile loaded:", profile);
          
          // Populate form with existing data
          setFormData({
            name: profile.name || "",
            professionalTitle: profile.professional_title || "",
            yearsExperience: profile.years_experience?.toString() || "",
            city: profile.city || "",
            country: profile.country || "",
            bio: profile.bio || "",
            specialties: Array.isArray(profile.specialties) ? profile.specialties : [],
            instagram: profile.instagram || "",
            website: profile.website || "",
            acceptingClients: profile.availability || false,
            profileImage: profile.profile_image || "",
            portfolioImages: Array.isArray(profile.portfolio_images) ? profile.portfolio_images : [],
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
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
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

      console.log("Saving profile for userId:", userId);

      // Update profile data in profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: formData.name || null,
          professional_title: formData.professionalTitle || null,
          years_experience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
          city: formData.city || null,
          country: formData.country || null,
          bio: formData.bio || null,
          specialties: formData.specialties.length > 0 ? formData.specialties : null,
          instagram: formData.instagram || null,
          website: formData.website || null,
          availability: formData.acceptingClients,
          profile_image: formData.profileImage || null,
          portfolio_images: formData.portfolioImages.length > 0 ? formData.portfolioImages : null,
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Profile update error:", updateError);
      } else {
        console.log("Profile saved successfully");
        
        // Reload profile data from database
        const { data: updatedProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (!fetchError && updatedProfile) {
          console.log("Profile reloaded:", updatedProfile);
          
          // Update form data with reloaded data
          setFormData({
            name: updatedProfile.name || "",
            professionalTitle: updatedProfile.professional_title || "",
            yearsExperience: updatedProfile.years_experience?.toString() || "",
            city: updatedProfile.city || "",
            country: updatedProfile.country || "",
            bio: updatedProfile.bio || "",
            specialties: Array.isArray(updatedProfile.specialties) ? updatedProfile.specialties : [],
            instagram: updatedProfile.instagram || "",
            website: updatedProfile.website || "",
            acceptingClients: updatedProfile.availability || false,
            profileImage: updatedProfile.profile_image || "",
            portfolioImages: Array.isArray(updatedProfile.portfolio_images) ? updatedProfile.portfolio_images : [],
          });
        }
        
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setUploadingProfile(true);
    try {
      // Get and refresh the session to ensure we have a valid access token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        alert('Session error. Please sign in again.');
        return;
      }
      
      if (!session?.access_token) {
        console.error('No access token found in session:', session);
        alert('Please sign in again to upload images.');
        return;
      }

      console.log('Uploading with access token (first 20 chars):', session.access_token.substring(0, 20) + '...');

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5b46b93c/upload-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        console.error('Upload error - Status:', response.status, 'Error:', result.error);
        alert(`Upload failed: ${result.error || `Server returned ${response.status}`}`);
        return;
      }

      if (result.url) {
        console.log('Profile image uploaded successfully:', result.url);
        setFormData((prev) => ({ ...prev, profileImage: result.url }));
      }
    } catch (err) {
      console.error('Unexpected error during profile image upload:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingProfile(false);
      // Reset input
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = '';
      }
    }
  };

  const handlePortfolioImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingPortfolio(true);
    try {
      // Get access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No access token found');
        alert('Please sign in again to upload images.');
        return;
      }

      const uploadedUrls: string[] = [];

      // Upload each file
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          console.warn(`Skipping ${file.name}: Invalid file type`);
          continue;
        }

        // Validate file size (5MB max)
        if (file.size > 5242880) {
          console.warn(`Skipping ${file.name}: File too large`);
          continue;
        }

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Upload to server
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-5b46b93c/upload-image`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: formData,
          }
        );

        const result = await response.json();

        if (response.ok && result.url) {
          uploadedUrls.push(result.url);
        } else {
          console.error(`Failed to upload ${file.name}:`, result.error);
        }
      }

      if (uploadedUrls.length > 0) {
        console.log(`${uploadedUrls.length} portfolio images uploaded successfully`);
        setFormData((prev) => ({
          ...prev,
          portfolioImages: [...prev.portfolioImages, ...uploadedUrls],
        }));
      }
    } catch (err) {
      console.error('Unexpected error during portfolio images upload:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingPortfolio(false);
      // Reset input
      if (portfolioImagesInputRef.current) {
        portfolioImagesInputRef.current.value = '';
      }
    }
  };

  const handleRemoveProfileImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: "" }));
  };

  const handleRemovePortfolioImage = (url: string) => {
    setFormData((prev) => ({ ...prev, portfolioImages: prev.portfolioImages.filter((img) => img !== url) }));
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
            <div className="relative h-24 w-24 border border-white/10 bg-neutral-950 flex items-center justify-center group">
              {formData.profileImage ? (
                <>
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={handleRemoveProfileImage}
                    className="absolute -top-2 -right-2 bg-red-900 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <Upload size={20} className="text-neutral-600" />
              )}
            </div>
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleProfileImageUpload}
              className="hidden"
            />
            <button
              onClick={() => profileImageInputRef.current?.click()}
              disabled={uploadingProfile}
              className="border border-white/10 bg-black px-6 py-3 text-[8px] font-medium tracking-[0.4em] text-neutral-500 uppercase transition-all hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              {uploadingProfile ? "Uploading..." : "Change Image"}
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
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Not yet provided"
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                Professional Title
              </label>
              <input
                type="text"
                value={formData.professionalTitle}
                onChange={(e) => handleInputChange("professionalTitle", e.target.value)}
                placeholder="Not yet provided"
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Not yet provided"
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Not yet provided"
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
              Years of Experience
            </label>
            <input
              type="number"
              value={formData.yearsExperience}
              onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
              placeholder="Not yet provided"
              className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              placeholder="Not yet provided"
              className="w-full border border-white/10 bg-transparent p-4 text-white text-sm outline-none transition-colors focus:border-white/30 resize-none placeholder:text-neutral-700"
            />
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-16 space-y-8">
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Specialties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSpecialties.map((specialty) => (
              <label
                key={specialty}
                className="flex items-center gap-3 border border-white/10 bg-black p-5 cursor-pointer transition-all hover:border-white/20"
              >
                <input
                  type="checkbox"
                  checked={formData.specialties.includes(specialty)}
                  onChange={() => handleSpecialtyToggle(specialty)}
                  className="h-4 w-4 cursor-pointer border-white/10 bg-transparent accent-[#4a1a1a]"
                />
                <span className="text-[8px] font-medium tracking-[0.3em] text-white uppercase">
                  {specialty}
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.portfolioImages.map((url, index) => (
              <div key={index} className="relative aspect-square border border-white/10 bg-neutral-950 group">
                <img
                  src={url}
                  alt={`Portfolio ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => handleRemovePortfolioImage(url)}
                  className="absolute -top-2 -right-2 bg-red-900 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            <input
              ref={portfolioImagesInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handlePortfolioImagesUpload}
              className="hidden"
            />
            <button
              onClick={() => portfolioImagesInputRef.current?.click()}
              disabled={uploadingPortfolio}
              className="flex aspect-square items-center justify-center border border-dashed border-white/10 bg-neutral-950 transition-all hover:border-white/30 disabled:opacity-50"
            >
              {uploadingPortfolio ? (
                <span className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase">Uploading...</span>
              ) : (
                <Upload size={24} className="text-neutral-600" />
              )}
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-16 space-y-8">
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Social Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                placeholder="Not yet provided"
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="Not yet provided"
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
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
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};