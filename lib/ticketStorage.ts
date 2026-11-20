export interface TicketDetails {
  id: number;
  section: string;
  type: string;
  priceType: string;
  row: string;
  seat: string;
  price: string;
  bookingFee: string;
}

export interface TicketEvent {
  accountName: string;
  email: string;
  eventName: string;
  dateTime: string;
  orderDateTime: string;
  venue: string;
  orderNumber: string;
  heroImage: string;
  ticketImage: string;
  tickets: TicketDetails[];
}

export const DEFAULT_TICKET_EVENT: TicketEvent = {
  accountName: "My account",
  email: "yirulim029@gmail.com",
  eventName: "EXO PLANET #6 - EXO Horizon in SINGAPORE",
  dateTime: "26 Jul 2026 (Sun.) 06:00 pm",
  orderDateTime: "21-04-2026 12:04am",
  venue: "Singapore Indoor Stadium",
  orderNumber: "18492255",
  heroImage: "",
  ticketImage: "",
  tickets: [
    {
      id: 1,
      section: "231",
      type: "VIP SEATED",
      priceType: "Live Nation Presale",
      row: "2",
      seat: "5",
      price: "388.00",
      bookingFee: "10.00",
    },
    {
      id: 2,
      section: "231",
      type: "VIP SEATED",
      priceType: "Live Nation Presale",
      row: "2",
      seat: "6",
      price: "388.00",
      bookingFee: "10.00",
    },
    {
      id: 3,
      section: "231",
      type: "VIP SEATED",
      priceType: "Live Nation Presale",
      row: "2",
      seat: "7",
      price: "388.00",
      bookingFee: "10.00",
    },
  ],
};

export const TICKET_EVENT_STORAGE_KEY = "my-tix-us:event";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textOr(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function amountOr(value: unknown, fallback: string): string {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return String(value);
  }
  if (typeof value === "string" && value.trim() !== "") {
    const amount = Number(value);
    if (Number.isFinite(amount) && amount >= 0) return value;
  }
  return fallback;
}

export function loadTicketEvent(): TicketEvent | null {
  if (typeof window === "undefined") return null;

  const saved = window.localStorage.getItem(TICKET_EVENT_STORAGE_KEY);
  if (!saved) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) return null;

  const savedTickets = Array.isArray(parsed.tickets) ? parsed.tickets : [];
  const tickets = savedTickets.flatMap((item, index) => {
    if (!isRecord(item)) return [];
    const fallback = DEFAULT_TICKET_EVENT.tickets[index] ??
      DEFAULT_TICKET_EVENT.tickets[DEFAULT_TICKET_EVENT.tickets.length - 1];
    return [{
      id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : index + 1,
      section: textOr(item.section, fallback.section),
      type: textOr(item.type, fallback.type),
      priceType: textOr(item.priceType, fallback.priceType),
      row: textOr(item.row, fallback.row),
      seat: textOr(item.seat, fallback.seat),
      price: amountOr(item.price, fallback.price),
      bookingFee: amountOr(item.bookingFee, fallback.bookingFee),
    }];
  });

  return {
    accountName: textOr(parsed.accountName, DEFAULT_TICKET_EVENT.accountName),
    email: textOr(parsed.email, DEFAULT_TICKET_EVENT.email),
    eventName: textOr(parsed.eventName, DEFAULT_TICKET_EVENT.eventName),
    dateTime: textOr(parsed.dateTime, DEFAULT_TICKET_EVENT.dateTime),
    orderDateTime: textOr(parsed.orderDateTime, DEFAULT_TICKET_EVENT.orderDateTime),
    venue: textOr(parsed.venue, DEFAULT_TICKET_EVENT.venue),
    orderNumber: textOr(parsed.orderNumber, DEFAULT_TICKET_EVENT.orderNumber),
    heroImage: textOr(parsed.heroImage, ""),
    ticketImage: textOr(parsed.ticketImage, ""),
    tickets: tickets.length > 0 ? tickets : DEFAULT_TICKET_EVENT.tickets,
  };
}

export function saveTicketEvent(event: TicketEvent) {
  window.localStorage.setItem(TICKET_EVENT_STORAGE_KEY, JSON.stringify(event));
}

export function getTicketSubtotal(ticket: TicketDetails): number {
  return (Number(ticket.price) || 0) + (Number(ticket.bookingFee) || 0);
}

export function getEventTotal(event: TicketEvent): number {
  return event.tickets.reduce(
    (total, ticket) => total + getTicketSubtotal(ticket),
    0,
  );
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
