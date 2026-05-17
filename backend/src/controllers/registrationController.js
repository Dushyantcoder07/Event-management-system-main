<<<<<<< HEAD
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { generateQRCodeDataUrl } from '../utils/qrcode.js';
import { sendEmail } from '../utils/email.js';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
=======
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import { generateQRCodeDataUrl } from "../utils/qrcode.js";
import { sendEmail } from "../utils/email.js";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";
>>>>>>> aa4b200a01b0638f945a797777911483cff9e986

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.status !== 'approved') {
      return res.status(400).json({ message: 'Event not available' });
    }


    // Check existing registration
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: event._id,
    });

    // Already active
    if (
      existingRegistration &&
      ['registered', 'waitlisted', 'attended'].includes(existingRegistration.status)
    ) {
      return res.status(400).json({ message: 'Already registered or waitlisted' });
    }

    // Count confirmed registrations only
    const registeredCount = await Registration.countDocuments({
      event: event._id,
      status: 'registered',
    });

    const isFull = registeredCount >= event.capacity;

    let qrCodeDataUrl = null;

    // QR only for confirmed users
    if (!isFull) {
      const payload = JSON.stringify({
        userId: req.user.id,
        eventId: event._id,
        at: Date.now(),
      });
      qrCodeDataUrl = await generateQRCodeDataUrl(payload);
    }

    let registration;

    // Reuse cancelled registration
    if (existingRegistration && existingRegistration.status === 'cancelled') {
      existingRegistration.status = isFull ? 'waitlisted' : 'registered';
      existingRegistration.qrCodeDataUrl = qrCodeDataUrl;
      registration = await existingRegistration.save();
    } else {
      registration = await Registration.create({
        user: req.user.id,
        event: event._id,
        qrCodeDataUrl,
        status: isFull ? 'waitlisted' : 'registered',
      });
    }

    // Send email
    try {
      await sendEmail({
        to: req.user.email,
        subject: isFull ? `Waitlisted: ${event.title}` : `Registered: ${event.title}`,
        html: isFull
          ? `<p>${event.title} is full.</p><p>You have been added to the waitlist.</p>`
          : `<p>You are registered for ${event.title}.</p>`,
      });
    } catch (_) {}

    res.status(201).json({
      registration,
      message: isFull ? 'Added to waitlist' : 'Successfully registered',
    });
<<<<<<< HEAD
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// fetching registrations with waiting position
export const myRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user.id }).populate('event');
=======

    
    const payload = JSON.stringify({ userId: req.user.id, eventId: event._id, at: Date.now() });
    const qrCodeDataUrl = await generateQRCodeDataUrl(payload);
    
    // Current implementation includes : 
    // Checks for an existing cancelled registration
    // Reactivating the existing registration instead of inserting a new record
    // Capacity validation on event registration
    // Keeps the audit trail intact while avoiding unique index conflicts

    // Check active registration
    const activeRegistrations = await Registration.countDocuments({
      event: req.params.id,
      status: { $ne: "cancelled" },
    });

    // Capacity validation
    if (activeRegistrations>=event.capacity && event.capacity>0){
      return res.status(400).json({
        message:"Event is fully booked"
      })
    }

    // To reinitiate the existing registered event
    const existingRegistration = await Registration.findOne({user:req.user.id,event:req.params.id});

    if (existingRegistration){
      if (existingRegistration.status==="cancelled"){
          existingRegistration.status = 'registered';
      }

      await existingRegistration.save();
      try {
        await sendEmail({ to: req.user.email, subject: `Registered: ${event.title}`, html: `<p>You are registered for ${event.title}.</p>` });
      } catch (_) { }

      return res.status(201).json({
        registration:existingRegistration,
      })
    }

    else{
      const reg = await Registration.create({ user: req.user.id, event: event._id, qrCodeDataUrl });
      try {
        await sendEmail({ to: req.user.email, subject: `Registered: ${event.title}`, html: `<p>You are registered for ${event.title}.</p>` });
      } catch (_) { }

      res.status(201).json({ registration: reg });
    }

    

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// fetching registrations with waiting position
export const myRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user.id }).populate("event");
>>>>>>> aa4b200a01b0638f945a797777911483cff9e986

    const registrationsWithPosition = await Promise.all(
      regs.map(async (reg) => {
        let waitlistPosition = null;

<<<<<<< HEAD
        if (reg.status === 'waitlisted') {
          const peopleAhead = await Registration.countDocuments({
            event: reg.event._id,
            status: 'waitlisted',
=======
        if (reg.status === "waitlisted") {
          const peopleAhead = await Registration.countDocuments({
            event: reg.event._id,
            status: "waitlisted",
>>>>>>> aa4b200a01b0638f945a797777911483cff9e986
            createdAt: { $lt: reg.createdAt },
          });
          waitlistPosition = peopleAhead + 1;
        }

        return { ...reg.toObject(), waitlistPosition };
      }),
    );

    res.json({ registrations: registrationsWithPosition });
  } catch (err) {
<<<<<<< HEAD
    console.error('ERROR:', err);
=======
    console.error("ERROR:", err);
>>>>>>> aa4b200a01b0638f945a797777911483cff9e986
    res.status(500).json({ message: err.message });
  }
};

export const participantsForEvent = async (req, res) => {
  try {
<<<<<<< HEAD
    const regs = await Registration.find({ event: req.params.id }).populate('user', 'name email');
    res.json({ participants: regs });
  } catch (err) {
    console.error('ERROR:', err);
=======
    const regs = await Registration.find({ event: req.params.id }).populate("user", "name email");
    res.json({ participants: regs });
  } catch (err) {
    console.error("ERROR:", err);
>>>>>>> aa4b200a01b0638f945a797777911483cff9e986
    res.status(500).json({ message: err.message });
  }
};

<<<<<<< HEAD
// Secure check-in handler
export const checkInParticipant = async (req, res) => {
  try {
    // Auth context validation
    if (!req.user) {
      console.warn('[AUTH] Check-in attempt without auth context');
      return res.status(401).json({ message: 'Unauthorized: user not authenticated' });
    }
    if (!req.user.id || !req.user.role) {
      console.warn('[AUTH] Check-in attempt with invalid user context', { user: req.user });
      return res.status(401).json({ message: 'Unauthorized: invalid user context' });
    }

    // Request validation
    if (!req.body || !req.body.userId) {
      return res.status(400).json({ message: 'Bad Request: userId is required' });
    }

    // Validate status value (defensive)
    const validStatuses = ['attended', 'cancelled', 'no-show'];
    const status = (req.body.status || 'attended').toString().trim().toLowerCase();
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: must be one of ${validStatuses.join(', ')}` });
    }

    // Load event and verify ownership for non-admin organizers
    const event = await Event.findById(req.params.id).select('organizer');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Data integrity check
    if (!event.organizer) {
      console.error(`[ALERT] Event ${req.params.id} has missing organizer — investigate database integrity`);
      return res.status(500).json({ message: 'Server error: event data corrupted' });
    }

    // Admin bypass: admins may check in for any event
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      console.warn(`[SECURITY] Unauthorized check-in attempt by organizer ${req.user.id} for event ${req.params.id}`);
      return res.status(403).json({ message: 'Forbidden: you are not the organizer of this event' });
    }

    // Perform atomic update
=======
export const checkInParticipant = async (req, res) => {
  try {
    const status = req.body.status || "attended";

>>>>>>> aa4b200a01b0638f945a797777911483cff9e986
    const reg = await Registration.findOneAndUpdate(
      { user: req.body.userId, event: req.params.id },
      { status, checkedInAt: status === 'attended' ? new Date() : undefined },
      { new: true },
    );

    if (!reg) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Promote waitlisted user when someone cancels
    if (status === 'cancelled') {
      await promoteFromWaitlist(req.params.id);
    }

    res.json({ registration: reg });
  } catch (err) {
<<<<<<< HEAD
    console.error(`[ERROR] Check-in failed for event ${req.params.id}:`, err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const exportParticipantsCsv = async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.id }).populate('user', 'name email');
    const rows = regs.map((r) => ({
      name: r.user?.name || '',
      email: r.user?.email || '',
      status: r.status,
      registeredAt: r.createdAt,
    }));
    const filePath = path.join(process.cwd(), `participants-${req.params.id}.csv`);
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'status', title: 'Status' },
        { id: 'registeredAt', title: 'Registered At' },
      ],
    });
    await csvWriter.writeRecords(rows);
    res.download(filePath);
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
=======
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
    
>>>>>>> aa4b200a01b0638f945a797777911483cff9e986
  }
};

export const checkRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user.id,
<<<<<<< HEAD
      event: req.params.id,
      status: { $ne: 'cancelled' },
    });

    res.json({
      isRegistered: registration?.status === 'registered',
      isWaitlisted: registration?.status === 'waitlisted',
      registration,
=======
      event: req.params.id
    });

    res.status(200).json({
      registered: !!registration,
      isRegistered: !!registration,
      registration
>>>>>>> aa4b200a01b0638f945a797777911483cff9e986
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

<<<<<<< HEAD
=======
export const myRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user.id
    }).populate('event');

    res.status(200).json({ registrations });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

>>>>>>> aa4b200a01b0638f945a797777911483cff9e986
// promoting from waitlist to registered
export const promoteFromWaitlist = async (eventId) => {
  const nextRegistration = await Registration.findOne({
    event: eventId,
    status: 'waitlisted',
  })
    .sort({ createdAt: 1 })
    .populate('user')
    .populate('event');

  if (!nextRegistration) return;

  const payload = JSON.stringify({
    userId: nextRegistration.user._id,
    eventId: nextRegistration.event._id,
    at: Date.now(),
  });

  const qrCodeDataUrl = await generateQRCodeDataUrl(payload);

  nextRegistration.status = 'registered';
  nextRegistration.qrCodeDataUrl = qrCodeDataUrl;
  await nextRegistration.save();


  try {
    await sendEmail({
      to: nextRegistration.user.email,
      subject: `Spot Confirmed: ${nextRegistration.event.title}`,
      html: `
        <p>You have been promoted from the waitlist.</p>
        <p>Your registration for ${nextRegistration.event.title} is now confirmed.</p>
      `,
    });
  } catch (_) {}
};
<<<<<<< HEAD
=======

    for (const registration of registrations) {
      const row = [
        registration.user?.name || '',
        registration.user?.email || '',
        registration.status || '',
        registration.createdAt
          ? new Date(
            registration.createdAt
          ).toISOString()
          : ''
      ];

      res.write(row.map(esc).join(',') + '\n');
    }

    res.end();
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};


>>>>>>> aa4b200a01b0638f945a797777911483cff9e986

export const cancelRegistration = async (req, res) => {
  // Only the customer who owns the registration can cancel it
  // Cannot cancel if event.date is in the past
  // Sets registration.status = 'cancelled'; does not delete the document (for audit trail)
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findById(id).populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Owner check
    if (registration.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Already cancelled
    if (registration.status === 'cancelled') {
      return res.status(400).json({ message: 'Already cancelled' });
    }

    // Past event check
    const eventDate = new Date(registration.event.date);
    if (eventDate < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past events' });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.status(200).json({
      message: 'Registration cancelled successfully',
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
<<<<<<< HEAD
=======



>>>>>>> aa4b200a01b0638f945a797777911483cff9e986
