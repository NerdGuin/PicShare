require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const cors = require("cors");

const bancoDeDados = require("./mongodb");

/* =======================
   INIT
======================= */

const CLIENT_URL = process.env.CLIENT_URL || "";

const isProduction =
  CLIENT_URL.startsWith("https://") && !CLIENT_URL.includes("localhost");

bancoDeDados.conectar();

const app = express();
app.set("trust proxy", 1);

/* =======================
   MIDDLEWARES
======================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://picsharebr.vercel.app"],
    credentials: true,
  })
);

app.use(
  session({
    name: "discord.sid",
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* =======================
   PASSPORT - DISCORD
======================= */

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await bancoDeDados.usersDB.getUser(profile.id);

        if (!user) {
          user = await bancoDeDados.usersDB.createUser(profile);
        } else {
          user = await bancoDeDados.usersDB.updateUser(profile);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await bancoDeDados.usersDB.getUser(id);
    done(null, user || false);
  } catch (err) {
    done(err, null);
  }
});

function checkOrigin(req, res, next) {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  if (isProduction) {
    if (!origin.startsWith(CLIENT_URL) && !referer.startsWith(CLIENT_URL)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
  }

  next();
}

/* =======================
   ROTAS
======================= */

app.get("/auth/discord", passport.authenticate("discord"));

app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

app.get("/me", checkOrigin, (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: req.user,
  });
});

app.post("/logout", checkOrigin, (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("discord.sid");
      res.json({ success: true });
    });
  });
});

app.get("/gallery", checkOrigin, async (req, res) => {
  try {
    const { sort = "recent", limit = 10 } = req.query;

    const gallery = await bancoDeDados.galleryDB.getImages({
      sort,
      limit: Number(limit),
    });

    res.json({
      success: true,
      gallery,
    });
  } catch (err) {
    console.error("GET /gallery error:", err);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar galeria",
    });
  }
});

const multer = require("multer");

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post(
  "/gallery/upload",
  checkOrigin,
  upload.single("image"),
  async (req, res) => {
    try {
      // if (!req.isAuthenticated()) {
      //   return res.status(401).json({ success: false });
      // }

      if (!req.file) {
        return res.status(400).json({ success: false });
      }

      await bancoDeDados.galleryDB.createImage({
        userId: 0,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  }
);

app.delete("/gallery/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: "User not logged in" });
  }

  try {
    const result = await bancoDeDados.galleryDB.deleteImage({ id, userId });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =======================
   SERVER
======================= */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
