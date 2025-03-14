import { Metadata } from "next";
import ContactPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Contact Us | LuminaTech LED",
  description: "Get in touch with LuminaTech LED for all your LED lighting needs. Request a consultation, quote, or learn more about our services.",
};

export default function ContactPage() {
  return <ContactPageClient />;
} 