const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@satoripop\.com$/.test(v);
      },
      message: props => `${props.value} n'est pas une adresse @satoripop.com valide.`
    }
  },
  password: { type: String, required: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true }, // Numéro de téléphone
  bio: { type: String, trim: true }, // Biographie/description
  profileImage: { type: String }, // URL ou chemin vers l'image de profil
  role: { type: String, enum: ['admin', 'collaborateur'], default: 'collaborateur' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
