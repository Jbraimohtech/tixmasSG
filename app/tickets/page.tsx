"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Printer,
} from "lucide-react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  DEFAULT_TICKET_EVENT,
  formatPrice,
  getEventTotal,
  getTicketSubtotal,
  loadTicketEvent,
  TicketEvent,
} from "@/lib/ticketStorage";

export default function MyTicketsPage() {
  const [event, setEvent] = useState<TicketEvent>(DEFAULT_TICKET_EVENT);
  const [activeTab, setActiveTab] = useState<"purchased" | "received">(
    "purchased",
  );
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEvent(loadTicketEvent() ?? DEFAULT_TICKET_EVENT);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <div className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-800">
            Home
          </Link>{" "}
          <span className="mx-1">/</span>{" "}
          <span className="text-gray-800">My Tickets</span>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-wide text-gray-900">
            MY TICKETS
            <span className="mt-1 block h-1 w-12 bg-black" />
          </h1>
          <Link
            href="/create-ticket"
            className="rounded-md bg-transparent px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Edit details
          </Link>
        </div>

        <div className="mb-6 flex" role="tablist" aria-label="Ticket type">
          {(["purchased", "received"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`border px-6 py-2.5 text-sm font-medium capitalize ${
                tab === "purchased" ? "rounded-l-md" : "rounded-r-md border-l-0"
              } ${
                activeTab === tab
                  ? "border-[#0055A5] bg-[#0055A5] text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <p className="mb-6 rounded-lg bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          Demo ticket details only. Records saved here are not verified or valid
          for venue entry.
        </p>

        {activeTab === "received" ? (
          <div className="rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-600">
            No received ticket transfers to show.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-black px-4 py-3 text-sm font-medium text-white">
              <span>Order No.: {event.orderNumber}</span>
              <span className="text-white/80">{event.email}</span>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="mb-1 text-xs text-gray-500">
                  Purchase information
                </p>
                <p className="font-semibold text-gray-900">{event.eventName}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" /> Ticket record
                  </span>
                  <span className="flex items-center gap-1">
                    <Printer className="h-4 w-4" /> Digital
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs text-gray-500">Status</p>
                <p className="text-sm font-medium text-green-700">
                  Demo details saved
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails((visible) => !visible)}
                aria-expanded={showDetails}
                className="flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {showDetails ? "Hide details" : "View details"}
                {showDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showDetails && (
                <div className="space-y-6 border-t pt-5">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {event.eventName}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.dateTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.venue}
                      </p>
                    </div>
                  </div>

                  {event.tickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className="space-y-3 border-t pt-5 text-sm"
                    >
                      <p className="font-semibold text-gray-900">
                        Ticket {index + 1}
                      </p>
                      <div>
                        <p className="text-xs text-gray-500">Seat info</p>
                        <p className="font-medium">{ticket.section}</p>
                        <p>
                          Row {ticket.row} · Seat {ticket.seat}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ticket info</p>
                        <p className="font-medium">{ticket.type}</p>
                        <p className="text-gray-700">
                          {ticket.priceType}{" "}
                          {formatPrice(Number(ticket.price) || 0)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p>
                          Booking fee:{" "}
                          <span className="font-medium">
                            {formatPrice(Number(ticket.bookingFee) || 0)}
                          </span>
                        </p>
                        <p>
                          Subtotal:{" "}
                          <span className="font-medium">
                            {formatPrice(getTicketSubtotal(ticket))}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-3 border-t pt-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ticket Qty.</span>
                      <span className="font-medium">
                        {event.tickets.length} ticket(s)
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span className="text-red-700">
                        {formatPrice(getEventTotal(event))}
                      </span>
                    </div>
                    <Link
                      href="/ticket-view"
                      className="inline-flex rounded-md bg-[#0055A5] px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                    >
                      View ticket details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
