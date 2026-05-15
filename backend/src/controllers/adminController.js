import { Event, User } from '../models/index.js';

export const approveEvent = async (req, res) => {
  try {
    const [count] = await Event.update({ status: 'approved' }, { where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ message: 'Not found' });
    const event = await Event.findByPk(req.params.id);
    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectEvent = async (req, res) => {
  try {
    const { rejectionReason } = req.body || {};
    const updateData = { status: 'rejected' };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    const [count] = await Event.update(updateData, { where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ message: 'Not found' });
    const event = await Event.findByPk(req.params.id);
    res.json({ message: 'Event rejected', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listPendingEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'organizer', attributes: ['name', 'email'] }],
    });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const [count] = await User.update({ isBlocked: true }, { where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ message: 'Not found' });
    const user = await User.findByPk(req.params.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const [count] = await User.update({ isBlocked: false }, { where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ message: 'Not found' });
    const user = await User.findByPk(req.params.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const [count] = await User.update({ role }, { where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ message: 'User not found' });
    const user = await User.findByPk(req.params.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
