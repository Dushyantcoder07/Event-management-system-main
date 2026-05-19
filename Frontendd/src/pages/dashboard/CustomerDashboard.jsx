"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import CountdownTimer from "../../components/CountdownTimer";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import ConfirmationModal from "../../components/ui/confirmation-modal";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CustomerDashboard() {
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Upcoming Tickets");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [availableEvents, setAvailableEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);

  const [searchParams] = useSearchParams();

  // ✅ FIX: separate refs per ticket (important for html2canvas)
  const ticketRefs = useRef({});

  const mountedRef = useRef(true);

  // =========================
  // Fetch Events
  // =========================
  const fetchAvailableEvents = useCallback(async () => {
    const tags = searchParams.get("tags");

    try {
      setLoading(true);

      let url = `${API_BASE_URL}/api/events?status=approved`;
      if (tags) url += `&tags=${tags}`;

      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();

        const upcoming = (data.events || []).filter(
          (evt) => new Date(evt.date) >= new Date()
        );

        setAvailableEvents(upcoming);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // =========================
  // Fetch Registrations
  // =========================
  const fetchRegistrations = useCallback(async () => {
    try {
      if (mountedRef.current) setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/registrations/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok && mountedRef.current) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // =========================
  // useEffect
  // =========================
  useEffect(() => {
    (async () => {
      if (activeTab === "Browse Events") {
        await fetchAvailableEvents();
      } else {
        await fetchRegistrations();
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [activeTab, fetchAvailableEvents, fetchRegistrations]);

  // =========================
  // Register
  // =========================
  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/registrations/${eventId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Registered");
        setActiveTab("Upcoming Tickets");
        fetchRegistrations();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // =========================
  // Cancel Registration
  // =========================
  const handleCancelRegistration = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/registrations/${selectedRegistrationId}/cancel`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to cancel");

      setRegistrations((prev) =>
        prev.map((r) =>
          r._id === selectedRegistrationId
            ? { ...r, status: "cancelled" }
            : r
        )
      );

      setSelectedRegistrationId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // =========================
  // Download Ticket (FIXED)
  // =========================
  const handleDownloadTicket = async () => {
    try {
      if (!selectedTicket) return;

      const el = ticketRefs.current[selectedTicket._id];
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);

      let pdfHeight = (imgProps.height * (pdfWidth - 20)) / imgProps.width;

      pdf.text("EventOne Ticket", 15, 15);

      pdf.addImage(imgData, "PNG", 10, 25, pdfWidth - 20, pdfHeight);

      const safe =
        selectedTicket.event?.title
          ?.replace(/\s+/g, "-")
          ?.replace(/[^a-zA-Z0-9-_]/g, "")
          ?.toUpperCase();

      const fileName = `ticket-${safe || "EVENT"}-${selectedTicket._id
        .slice(-6)
        .toUpperCase()}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Filters
  // =========================
  const upcomingEvents = registrations.filter(
    (reg) =>
      reg.event &&
      reg.status !== "cancelled" &&
      new Date(reg.event.date) >= new Date()
  );

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // =========================
  // JSX
  // =========================
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-4 relative">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back,{" "}
              <span className="text-rose-500">
                {user?.name || "User"}
              </span>
            </h1>
          </div>

          <span className="text-xs px-4 py-1 rounded-full border border-rose-500/30">
            Customer Dashboard
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-8">
          {["Upcoming Tickets", "Past Events", "Browse Events"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm ${
                  activeTab === tab
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Content */}
        {activeTab === "Upcoming Tickets" && (
          <div className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-20">
                <Ticket className="mx-auto w-12 h-12" />
                <h3 className="mt-4 text-xl font-semibold">
                  No upcoming tickets
                </h3>

                <Button asChild className="mt-6">
                  <Link to="/#events">Browse Events</Link>
                </Button>
              </div>
            ) : (
              upcomingEvents.map((reg) => (
                <div
                  key={reg._id}
                  className="border rounded-xl p-4 bg-card"
                >
                  {/* ✅ FIX: ref per ticket */}
                  <div
                    ref={(el) =>
                      (ticketRefs.current[reg._id] = el)
                    }
                    className="flex gap-4"
                  >
                    <div className="w-40 h-28 bg-gray-200 rounded" />

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {reg.event?.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {reg.event?.description}
                      </p>

                      <div className="text-xs mt-2">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        {new Date(
                          reg.event?.date
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        setSelectedTicket(reg);
                        handleDownloadTicket();
                      }}
                    >
                      Download
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRegistrationId(reg._id);
                        setIsModalOpen(true);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCancelRegistration}
          title="Cancel registration"
          description="Are you sure?"
        />
      </div>
    </div>
  );
}