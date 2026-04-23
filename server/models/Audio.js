const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    storedName:   { type: String, required: true },
    mimeType:     { type: String, required: true },
    sizeBytes:    { type: Number, required: true },
    filePath:     { type: String, required: true },
    webhookResult: { type: mongoose.Schema.Types.Mixed, default: null },
    status: {
      type: String,
      enum: ['pending', 'processing', 'done', 'error'],
      default: 'pending',
    },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Audio', audioSchema);
