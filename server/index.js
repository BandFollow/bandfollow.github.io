import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
// Serve static files from project root so http://localhost:3000/playlist-importer.html works
app.use(express.static(path.join(__dirname, "..")));

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const SPOTIFY_KEY_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function spotifyKeyToString(key, mode) {
  if (key == null || key < 0 || key > 11) return "C";
  const name = SPOTIFY_KEY_NAMES[key];
  return mode === 1 ? name + "m" : name;
}

function parsePlaylistUrl(url) {
  const u = (url || "").trim();
  const spotifyMatch = u.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)|open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) return { type: "spotify", id: (spotifyMatch[1] || spotifyMatch[2]) };
  const ytMatch = u.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };
  return null;
}

async function getSpotifyToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error("Spotify auth failed: " + err);
  }
  const data = await res.json();
  return data.access_token;
}

async function fetchSpotifyPlaylistTracks(playlistId, token) {
  const tracks = [];
  let offset = 0;
  const limit = 50;
  while (true) {
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    if (!res.ok) throw new Error("Spotify playlist failed: " + (await res.text()));
    const data = await res.json();
    const items = data.items || [];
    for (const item of items) {
      const t = item.track;
      if (!t || !t.id) continue;
      tracks.push({
        id: t.id,
        name: (t.name || "").trim(),
        artist: (t.artists && t.artists[0] && t.artists[0].name) ? t.artists[0].name.trim() : "",
      });
    }
    if (!data.next) break;
    offset += limit;
  }
  return tracks;
}

async function fetchSpotifyAudioFeatures(trackIds, token) {
  const map = {};
  for (let i = 0; i < trackIds.length; i += 100) {
    const chunk = trackIds.slice(i, i + 100);
    const ids = chunk.join(",");
    const res = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${encodeURIComponent(ids)}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    if (!res.ok) throw new Error("Spotify audio features failed: " + (await res.text()));
    const data = await res.json();
    const list = data.audio_features || [];
    list.forEach((af) => {
      if (af && af.id) {
        map[af.id] = {
          bpm: af.tempo != null ? Math.round(af.tempo) : 120,
          key: spotifyKeyToString(af.key, af.mode),
        };
      }
    });
  }
  return map;
}

async function importSpotify(playlistId) {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env");
  }
  const token = await getSpotifyToken();
  const tracks = await fetchSpotifyPlaylistTracks(playlistId, token);
  if (tracks.length === 0) return [];
  const features = await fetchSpotifyAudioFeatures(tracks.map((t) => t.id), token);
  return tracks.map((t) => ({
    name: t.name,
    artist: t.artist,
    bpm: (features[t.id] && features[t.id].bpm) || 120,
    key: (features[t.id] && features[t.id].key) || "C",
  }));
}

async function fetchYouTubePlaylistItems(playlistId) {
  const items = [];
  let pageToken = "";
  do {
    const url =
      "https://www.googleapis.com/youtube/v3/playlistItems?" +
      "part=snippet&maxResults=50&playlistId=" +
      encodeURIComponent(playlistId) +
      (pageToken ? "&pageToken=" + encodeURIComponent(pageToken) : "") +
      "&key=" +
      encodeURIComponent(YOUTUBE_API_KEY);
    const res = await fetch(url);
    if (!res.ok) throw new Error("YouTube API failed: " + (await res.text()));
    const data = await res.json();
    const list = data.items || [];
    for (const item of list) {
      const title = (item.snippet && item.snippet.title) || "";
      if (title) items.push({ name: title, artist: "" });
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return items;
}

async function importYouTube(playlistId) {
  if (!YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY must be set in .env");
  const items = await fetchYouTubePlaylistItems(playlistId);
  if (items.length === 0) return [];
  return items.map((t) => ({
    name: t.name,
    artist: t.artist || "",
    bpm: 120,
    key: "C",
  }));
}

app.post("/api/import-playlist", async (req, res) => {
  try {
    const { playlistUrl } = req.body || {};
    const parsed = parsePlaylistUrl(playlistUrl);
    if (!parsed) {
      return res.status(400).json({
        error: "Invalid playlist URL. Use a YouTube or Spotify playlist link.",
      });
    }
    let tracks;
    if (parsed.type === "spotify") {
      tracks = await importSpotify(parsed.id);
    } else {
      tracks = await importYouTube(parsed.id);
    }
    res.json({ tracks, source: parsed.type });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Failed to import playlist",
    });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Playlist importer API running on http://localhost:" + port);
});
