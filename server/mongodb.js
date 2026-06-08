const { MongoClient, ObjectId } = require("mongodb");
const sanitizeDiscordProfile = require("./discordProfileSanitizer");
require("dotenv").config();

const dbClient = new MongoClient(process.env.DATABASE_URI);

/* =======================
   CONNECTION
======================= */

async function conectar() {
  await dbClient.connect();
  console.log("Successfully connected to the database");
}

/* =======================
   USERS COLLECTION
======================= */

const usersDB = {
  getUser: async function (id) {
    return await dbClient.db("user").collection("users").findOne({ id });
  },

  createUser: async function (profile) {
    const exists = await this.getUser(profile.id);
    if (exists) return exists;

    const user = {
      id: profile.id,
      username: profile.username,
      email: profile.email || null,

      discord: sanitizeDiscordProfile(profile),

      createdAt: new Date(),
    };

    await dbClient.db("user").collection("users").insertOne(user);
    return user;
  },

  updateUser: async function (profile) {
    await dbClient
      .db("user")
      .collection("users")
      .updateOne(
        { id: profile.id },
        {
          $set: {
            username: profile.username,
            email: profile.email || null,

            discord: sanitizeDiscordProfile(profile),

            updatedAt: new Date(),
          },
        },
      );

    return await this.getUser(profile.id);
  },
};

/* =======================
   GALLERY COLLECTION
======================= */

const galleryDB = {
  getImages: async function ({ sort = "recent", limit = 10 }) {
    const collection = dbClient.db("gallery").collection("galleries");

    let sortQuery = { createdAt: -1 };

    if (sort === "likes") {
      sortQuery = { likesCount: -1 };
    }

    const images = await collection
      .aggregate([
        {
          $addFields: {
            likesCount: { $size: { $ifNull: ["$likes", []] } },
          },
        },
        { $sort: sortQuery },
        { $limit: limit },
      ])
      .toArray();

    return images.map((img) => ({
      _id: img._id.toString(),
      userId: img.userId,
      likes: img.likes?.length || 0,
      image: `data:${img.mimeType};base64,${img.image.toString("base64")}`,
      category: img.category ? img.category.toString() : "Photos",
      createdAt: img.createdAt,
    }));
  },

  createImage: async function ({ userId, buffer, mimeType }) {
    const image = {
      userId,
      image: buffer,
      mimeType,
      likes: [],
      createdAt: new Date(),
    };

    await dbClient.db("gallery").collection("galleries").insertOne(image);

    return image;
  },

  deleteImage: async function ({ id, userId }) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const collection = dbClient.db("gallery").collection("galleries");

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: userId,
    });

    if (result.deletedCount === 0) {
      throw new Error("Image not found or user not authorized");
    }

    return { success: true };
  },
};

module.exports = {
  conectar,
  usersDB,
  galleryDB,
};
