"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, CircleUserRound, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DEFAULT_TICKET_EVENT, loadTicketEvent } from "@/lib/ticketStorage";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountName, setAccountName] = useState(
    DEFAULT_TICKET_EVENT.accountName,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAccountName(
        loadTicketEvent()?.accountName ?? DEFAULT_TICKET_EVENT.accountName,
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#023fd6] text-white">
      <div className="mb-3 px-4 py-3 gap-5 flex items-center justify-start bg-black">
        <div className="flex gap-1 items-center">
          <Image
            src="/singapore.svg"
            alt="Singapore"
            width={18}
            height={20}
            className="h-4 w-[18px] rounded-full object-cover"
          />
          SG
        </div>
        <div className="flex gap-1 items-center">
          <MessageSquare width={18} height={18} /> EN
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Menu" className="text-2xl">
              ☰
            </button>
            <Link
              href="/"
              className="text-xl font-medium italic tracking-tight sm:text-2xl"
            >
              Ticketmaster
            </Link>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-label="Open account menu"
              aria-expanded={isOpen}
            >
              <CircleUserRound className="h-6 w-6" />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-12 z-50 w-56 rounded-md bg-white text-gray-700 shadow-xl ring-1 ring-black/5">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {accountName}
                  </p>
                </div>
                <nav aria-label="Account" className="py-1">
                  {[
                    ["My Profile", "/"],
                    ["My Tickets", "/tickets"],
                    ["Receive Transfer", "/create-ticket"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-gray-100">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50"
                  >
                    Sign Out
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <label className="sr-only" htmlFor="event-search">
          Search events
        </label>
        <input
          id="event-search"
          type="search"
          placeholder="Search by Event"
          className="w-full rounded-md border border-white bg-transparent px-4 py-2.5 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
    </header>
  );
}
