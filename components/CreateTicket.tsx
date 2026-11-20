"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  DEFAULT_TICKET_EVENT,
  formatPrice,
  getTicketSubtotal,
  loadTicketEvent,
  saveTicketEvent,
  TicketDetails,
  TicketEvent,
} from "@/lib/ticketStorage";

type EventTextField = "email" | "orderNumber" | "eventName" | "dateTime" | "venue";

const eventFields: { name: EventTextField; label: string; type?: string }[] = [
  { name: "email", label: "Email", type: "email" },
  { name: "orderNumber", label: "Order No." },
  { name: "eventName", label: "Event Name" },
  { name: "dateTime", label: "Date and time" },
  { name: "venue", label: "Location" },
];

export default function CreateTicket() {
  const router = useRouter();
  const [event, setEvent] = useState<TicketEvent>(DEFAULT_TICKET_EVENT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEvent(loadTicketEvent() ?? DEFAULT_TICKET_EVENT);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function updateEvent(field: EventTextField, value: string) {
    setEvent((current) => ({ ...current, [field]: value }));
  }

  function updateTicket(
    id: number,
    field: keyof Omit<TicketDetails, "id">,
    value: string,
  ) {
    setEvent((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket,
      ),
    }));
  }

  function addTicket() {
    setEvent((current) => {
      const template = current.tickets[current.tickets.length - 1];
      const nextId = Math.max(0, ...current.tickets.map((ticket) => ticket.id)) + 1;
      return {
        ...current,
        tickets: [
          ...current.tickets,
          {
            id: nextId,
            section: template?.section ?? "",
            type: template?.type ?? "",
            priceType: template?.priceType ?? "",
            row: template?.row ?? "",
            seat: template ? String(Number(template.seat) + 1 || "") : "",
            price: template?.price ?? "0.00",
            bookingFee: template?.bookingFee ?? "0.00",
          },
        ],
      };
    });
  }

  function save(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();
    setError("");
    setSaving(true);
    try {
      saveTicketEvent(event);
      router.push("/tickets");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? `Unable to save these ticket details: ${saveError.message}`
          : "Unable to save these ticket details in this browser.",
      );
      setSaving(false);
    }
  }

  const total = event.tickets.reduce(
    (sum, ticket) => sum + getTicketSubtotal(ticket),
    0,
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to profile"
            className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm text-gray-500">Receive Transfer</p>
            <h1 className="text-2xl font-bold text-gray-900">Create ticket</h1>
          </div>
        </div>

        <p className="mb-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          Demo ticket details only. These records are stored in this browser and
          are not verified or valid for venue entry.
        </p>

        <form onSubmit={save} className="space-y-7">
          <section className="rounded-lg border border-gray-200">
            <h2 className="border-b border-gray-200 bg-gray-50 px-5 py-3 font-semibold text-gray-900">
              Event information
            </h2>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {eventFields.map(({ name, label, type = "text" }) => (
                <label
                  key={name}
                  className={`block text-sm font-medium text-gray-700 ${
                    name === "eventName" || name === "venue"
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  {label}
                  <input
                    required
                    type={type}
                    value={event[name]}
                    onChange={(change) => updateEvent(name, change.target.value)}
                    className="mt-1.5 h-11 w-full rounded-md border border-gray-300 px-3 text-gray-900 focus:border-[#0055A5] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3">
              <div>
                <h2 className="font-semibold text-gray-900">Tickets</h2>
                <p className="text-sm text-gray-500">
                  Ticket Qty.: {event.tickets.length}
                </p>
              </div>
              <button
                type="button"
                onClick={addTicket}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-[#0055A5] hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                Add ticket
              </button>
            </div>

            <div className="space-y-4 p-5">
              {event.tickets.map((ticket, index) => (
                <fieldset
                  key={ticket.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <legend className="px-2 text-sm font-semibold text-gray-800">
                    Ticket {index + 1}
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(
                      [
                        ["section", "Section"],
                        ["row", "Row"],
                        ["seat", "Seat"],
                        ["type", "Ticket type"],
                        ["priceType", "Price type"],
                      ] as const
                    ).map(([field, label]) => (
                      <label
                        key={field}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {label}
                        <input
                          required
                          value={ticket[field]}
                          onChange={(change) =>
                            updateTicket(
                              ticket.id,
                              field,
                              change.target.value,
                            )
                          }
                          className="mt-1.5 h-11 w-full rounded-md border border-gray-300 px-3 text-gray-900 focus:border-[#0055A5] focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </label>
                    ))}
                    {(
                      [
                        ["price", "Ticket price"],
                        ["bookingFee", "Booking fee"],
                      ] as const
                    ).map(([field, label]) => (
                      <label
                        key={field}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {label} ($)
                        <input
                          required
                          min="0"
                          step="0.01"
                          type="number"
                          value={ticket[field]}
                          onChange={(change) =>
                            updateTicket(
                              ticket.id,
                              field,
                              change.target.value,
                            )
                          }
                          className="mt-1.5 h-11 w-full rounded-md border border-gray-300 px-3 text-gray-900 focus:border-[#0055A5] focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 text-sm">
                    <span className="text-gray-600">
                      Ticket subtotal:{" "}
                      <strong className="text-gray-900">
                        {formatPrice(getTicketSubtotal(ticket))}
                      </strong>
                    </span>
                    {event.tickets.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setEvent((current) => ({
                            ...current,
                            tickets: current.tickets.filter(
                              (item) => item.id !== ticket.id,
                            ),
                          }))
                        }
                        className="flex items-center gap-1 text-sm font-medium text-red-700 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove ticket
                      </button>
                    )}
                  </div>
                </fieldset>
              ))}

              <div className="flex justify-between border-t border-gray-200 pt-4 font-semibold text-gray-900">
                <span>Total ({event.tickets.length} tickets)</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </section>

          {error && (
            <p role="alert" className="text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="h-12 w-full rounded-md bg-[#0055A5] px-5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save ticket details"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
