import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Sneaker Supply for order support, sizing help or general questions.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-x">
        <div className="max-w-xl mb-16">
          <p className="section-label">Get In Touch</p>
          <h1 className="font-display uppercase text-5xl sm:text-6xl leading-[0.95] mb-4">
            We&apos;d Love To Hear From You
          </h1>
          <p className="text-ink/60">
            Questions about sizing, an order, or just want to say hi? Drop us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <FiMapPin className="text-accent mt-1 shrink-0" />
              <div>
                <p className="font-display uppercase text-sm mb-1">Location</p>
                <p className="text-ink/60 text-sm">Karachi, Pakistan</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiPhone className="text-accent mt-1 shrink-0" />
              <div>
                <p className="font-display uppercase text-sm mb-1">Phone / WhatsApp</p>
                <p className="text-ink/60 text-sm">+92 300 0000000</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiMail className="text-accent mt-1 shrink-0" />
              <div>
                <p className="font-display uppercase text-sm mb-1">Email</p>
                <p className="text-ink/60 text-sm">hello@sneakersupply.pk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
