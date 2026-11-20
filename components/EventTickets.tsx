"use client";

import { useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  DEFAULT_TICKET_EVENT,
  loadTicketEvent,
} from "@/lib/ticketStorage";

export default function ProfilePage() {
  const [email, setEmail] = useState(DEFAULT_TICKET_EVENT.email);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEmail(loadTicketEvent()?.email ?? DEFAULT_TICKET_EVENT.email);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          Home <span className="mx-1">/</span>{" "}
          <span className="text-gray-800">My Profile</span>
        </div>

        {/* Info Boxes */}
        <div className="mb-8 space-y-3 rounded-lg bg-gray-50 p-5 text-sm text-gray-700">
          <p>
            • Please fill in the correct information in order to secure your
            rights of shopping.
          </p>
          <p>
            • Your data will be used when tickets/merchandise are delivered to
            your address or picked up at the venue. Please enter your member
            name, mobile phone number, and recipient’s address correctly.
          </p>
        </div>

        {/* My Account Card */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="bg-gray-100 px-5 py-3 font-medium text-gray-800">
            My Account
          </div>

          <div className="space-y-6 p-5">
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="text-gray-900">{email}</p>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="flex items-center gap-4">
                <span className="text-gray-900 tracking-widest">••••••••</span>
                <button className="rounded bg-[#0055A5] px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition">
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
