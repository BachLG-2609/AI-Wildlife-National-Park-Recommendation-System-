import { User, toPublicUser } from "../models/userModel.js";
import { scoreParksForPreferences } from "../data/recommend.js";

export async function getProfile(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(toPublicUser(user));
}

export async function updateProfile(req, res) {
  const { name, email } = req.body;
  const updated = await User.updateById(req.userId, {
    ...(name && { name }),
    ...(email && { email: email.toLowerCase() }),
  });
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json(toPublicUser(updated));
}

export async function updatePreferences(req, res) {
  const { interests, season, climate, safariType } = req.body;
  const updated = await User.updateById(req.userId, {
    preferences: {
      ...(interests !== undefined && { interests }),
      ...(season !== undefined && { season }),
      ...(climate !== undefined && { climate }),
      ...(safariType !== undefined && { safariType }),
    },
  });
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json(toPublicUser(updated));
}

export async function getRecommendations(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const results = scoreParksForPreferences(user.preferences);
  res.json({
    preferences: user.preferences,
    recommendations: results.map(({ park, reasons }) => ({
      id: park.id,
      name: park.name,
      province: park.province,
      reasons,
    })),
  });
}