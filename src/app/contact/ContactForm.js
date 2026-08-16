"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { submitContactMessage } from "@/lib/contact";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMessage(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Could not send message. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your Name"
          className="px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
        />
        <input
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          type="email"
          placeholder="Your Email"
          className="px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
        />
      </div>
      <textarea
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        placeholder="How can we help?"
        rows={5}
        className="w-full px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink resize-none"
      />
      <button type="submit" disabled={submitting} className="btn-accent disabled:opacity-50">
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
