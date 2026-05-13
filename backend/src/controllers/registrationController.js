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
