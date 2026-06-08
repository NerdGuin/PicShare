function sanitizeDiscordProfile(profile) {
  return {
    id: profile.id,
    username: profile.username,
    global_name: profile.global_name || null,
    discriminator: profile.discriminator || null,

    avatar: profile.avatar || null,
    banner: profile.banner || null,
    accent_color: profile.accent_color || null,

    email: profile.email || null,
    verified: profile.verified || false,
    locale: profile.locale || null,

    flags: profile.flags || null,
    public_flags: profile.public_flags || null,
    premium_type: profile.premium_type || 0,

    mfa_enabled: profile.mfa_enabled || false,
    provider: profile.provider || "discord",
  };
}

module.exports = sanitizeDiscordProfile;
