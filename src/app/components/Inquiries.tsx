import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogOverlay, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowRight, X } from "lucide-react";

export const Inquiries = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Close dialog after submission
    setIsOpen(false);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-neutral-950 border border-white/10 text-white max-w-2xl p-0 overflow-y-auto max-h-[90vh] [&>button]:hidden">
        {/* Custom Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-8 z-10 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} strokeWidth={1} />
        </button>

        <div className="p-12 md:p-16 space-y-12">
          {/* Header */}
          <div className="space-y-6 border-b border-white/5 pb-12">
            <DialogTitle className="font-serif text-4xl md:text-5xl font-light tracking-tighter">
              Concierge Inquiries
            </DialogTitle>
            <DialogDescription className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase leading-relaxed">
              Share your requirements with our concierge team. We curate introductions and respond within 48 hours.
            </DialogDescription>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Name Field */}
            <div className="space-y-4">
              <Label 
                htmlFor="name" 
                className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-medium"
              >
                How shall we address you?
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-transparent border-b border-white/10 rounded-none px-0 py-3 text-white placeholder:text-neutral-700 focus:border-red-900 transition-colors text-sm tracking-wider"
                placeholder="Your name"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-4">
              <Label 
                htmlFor="email" 
                className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-medium"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-transparent border-b border-white/10 rounded-none px-0 py-3 text-white placeholder:text-neutral-700 focus:border-red-900 transition-colors text-sm tracking-wider"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Subject Dropdown */}
            <div className="space-y-4">
              <Label 
                htmlFor="subject" 
                className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-medium"
              >
                Type of Request
              </Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => setFormData({ ...formData, subject: value })}
              >
                <SelectTrigger 
                  id="subject"
                  className="bg-transparent border-b border-white/10 rounded-none px-0 py-3 text-white focus:border-red-900 transition-colors text-sm tracking-wider"
                >
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-950 border border-white/10 text-white">
                  <SelectItem value="personal-styling" className="text-sm tracking-wider hover:bg-red-900/20 focus:bg-red-900/20">
                    Personal Styling
                  </SelectItem>
                  <SelectItem value="wardrobe-consultation" className="text-sm tracking-wider hover:bg-red-900/20 focus:bg-red-900/20">
                    Wardrobe Consultation
                  </SelectItem>
                  <SelectItem value="event-styling" className="text-sm tracking-wider hover:bg-red-900/20 focus:bg-red-900/20">
                    Event Styling
                  </SelectItem>
                  <SelectItem value="general-inquiry" className="text-sm tracking-wider hover:bg-red-900/20 focus:bg-red-900/20">
                    General Inquiry
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message Field */}
            <div className="space-y-4">
              <Label 
                htmlFor="message" 
                className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-medium"
              >
                Tell us your story
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-transparent border border-white/10 px-4 py-4 text-white placeholder:text-neutral-700 focus:border-red-900 transition-colors text-sm tracking-wider min-h-[150px] resize-none"
                placeholder="Describe your requirements, preferences, and timeline."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="group flex items-center gap-3 text-[10px] font-medium tracking-[0.6em] text-white uppercase hover:text-red-900 transition-all"
              >
                Submit Request
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};