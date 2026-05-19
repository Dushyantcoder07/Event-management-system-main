import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, default: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    posterUrl: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    tags: [{ type: String }],
    averageRating: { type: Number, default: 0 },

    // Event price fields (temporary optional)
    price: { type: Number, default: 0 },
    isFree: {type:Boolean, default:true}
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
export default Event;


