import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComplaint extends Document {
  userName: string;
  userEmail: string;
  category: string;
  subject: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema<IComplaint> = new Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Infrastructure",
        "Billing & Finance",
        "Technical Issue",
        "Customer Support",
        "Harassment / Safety",
        "Other",
      ],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [150, "Subject cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-registering model during dev hot reloading
const Complaint: Model<IComplaint> =
  mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);

export default Complaint;
