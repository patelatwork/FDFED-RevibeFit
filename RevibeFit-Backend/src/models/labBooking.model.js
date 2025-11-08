import mongoose from "mongoose";

const labBookingSchema = new mongoose.Schema(
  {
    fitnessEnthusiastId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Fitness enthusiast ID is required"],
    },
    labPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Lab partner ID is required"],
    },
    selectedTests: [
      {
        testId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "LabTest",
          required: true,
        },
        testName: String,
        price: Number,
      },
    ],
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      // Examples: "9:00 AM - 10:00 AM", "2:00 PM - 3:00 PM"
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be positive"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
    // Contact info at time of booking
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
    },
    expectedReportDeliveryTime: {
      type: String,
      trim: true,
      // Expected format: "2 hours", "1 day", "3-5 days", etc.
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
labBookingSchema.index({ fitnessEnthusiastId: 1, status: 1 });
labBookingSchema.index({ labPartnerId: 1, bookingDate: 1 });
labBookingSchema.index({ status: 1 });

export const LabBooking = mongoose.model("LabBooking", labBookingSchema);
