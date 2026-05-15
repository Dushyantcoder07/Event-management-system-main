export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.status !== 'approved') {
      return res.status(400).json({
        message: 'Event not available'
      });
    }

    // Prevent duplicate registration
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: event._id
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: 'Already registered for this event'
      });
    }

    // Capacity check
    const registrationCount = await Registration.countDocuments({
      event: event._id
    });

    if (registrationCount >= event.capacity) {
      return res.status(409).json({
        message: 'Event capacity reached'
      });
    }

    const payload = JSON.stringify({
      userId: req.user.id,
      eventId: event._id,
      at: Date.now()
    });

    const qrCodeDataUrl = await generateQRCodeDataUrl(payload);

    const reg = await Registration.create({
      user: req.user.id,
      event: event._id,
      qrCodeDataUrl
    });

    try {
      await sendEmail({
        to: req.user.email,
        subject: `Registered: ${event.title}`,
        html: `<p>You are registered for ${event.title}.</p>`
      });
    } catch (_) {}

    res.status(201).json({
      registration: reg
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
export const checkInParticipant = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        message: 'Registration not found'
      });
    }

    registration.checkedIn = true;
    await registration.save();

    res.status(200).json({
      message: 'Participant checked in successfully',
      registration
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
export const checkRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user.id,
      event: req.params.id
    });

    res.status(200).json({
      registered: !!registration,
      registration
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
export const exportParticipantsCsv = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.id
    }).populate('user', 'name email');

    res.status(200).json({
      participants: registrations
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
export const myRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user.id
    }).populate('event');

    res.status(200).json({
      registrations
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
export const participantsForEvent = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.id
    }).populate('user', 'name email');

    res.status(200).json({
      participants: registrations
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
