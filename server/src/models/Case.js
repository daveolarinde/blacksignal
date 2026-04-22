import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recoveryType: { type: String, required: true },
    fullName: String,
    email: String,
    phone: String,
    walletType: String,
    cryptoType: String,
    estimatedValue: String,
    issueDescription: String,
    partialInfo: String,
    proofDocumentUrl: String,
    status: { type: String, enum: ['submitted', 'reviewing', 'in-progress', 'resolved'], default: 'submitted' }
  },
  { timestamps: true }
);

export default mongoose.model('Case', caseSchema);
