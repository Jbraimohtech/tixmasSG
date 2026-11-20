"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  DEFAULT_TICKET_EVENT,
  formatPrice,
  getTicketSubtotal,
  loadTicketEvent,
  TicketEvent,
} from "@/lib/ticketStorage";

export default function TicketView() {
  const [event, setEvent] = useState<TicketEvent>(DEFAULT_TICKET_EVENT);
  const [currentTicket, setCurrentTicket] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEvent(loadTicketEvent() ?? DEFAULT_TICKET_EVENT);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const ticket = event.tickets[currentTicket] ?? event.tickets[0];

  if (!ticket) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          <p>No ticket details are available.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Link
          href="/tickets"
          className="mb-6 inline-flex text-sm font-medium text-[#0055A5] hover:underline"
        >
          ← Back to my tickets
        </Link>

        <p className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          Demo ticket details only. This record is not verified or valid for
          venue entry.
        </p>

        <article className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-[#0055A5] px-5 py-6 text-white">
            <p className="text-sm text-white/80">
              Ticket {currentTicket + 1} of {event.tickets.length}
            </p>
            <h1 className="mt-1 text-xl font-bold">{event.eventName}</h1>
            <p className="mt-2 text-sm text-white/90">
              {event.dateTime} · {event.venue}
            </p>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                ["Section", ticket.section],
                ["Row", ticket.row],
                ["Seat", ticket.seat],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-5">
              <p className="font-semibold text-gray-900">{ticket.type}</p>
              <p className="mt-1 text-sm text-gray-600">{ticket.priceType}</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex justify-between">
                  <span>Ticket price</span>
                  <span>{formatPrice(Number(ticket.price) || 0)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Booking fee</span>
                  <span>{formatPrice(Number(ticket.bookingFee) || 0)}</span>
                </p>
                <p className="flex justify-between border-t pt-2 font-semibold">
                  <span>Ticket subtotal</span>
                  <span>{formatPrice(getTicketSubtotal(ticket))}</span>
                </p>
              </div>
            </div>

            {event.tickets.length > 1 && (
              <div className="flex items-center justify-between border-t pt-5">
                <button
                  type="button"
                  disabled={currentTicket === 0}
                  onClick={() => setCurrentTicket((index) => index - 1)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  {currentTicket + 1} of {event.tickets.length}
                </span>
                <button
                  type="button"
                  disabled={currentTicket === event.tickets.length - 1}
                  onClick={() => setCurrentTicket((index) => index + 1)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
