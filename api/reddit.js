// api/reddit.js

const username = "Notadayover"; // Change to your Reddit username
const limit = 20; // Number of posts to fetch

export default async function handler(req, res) {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://www.reddit.com/user/${username}/submitted/.json?limit=${limit}`
    )}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Proxy fetch failed: ${response.status}`);
    }

    const wrapped = await response.json();
    const data = JSON.parse(wrapped.contents);

    const posts = data.data.children.map(item => ({
      title: item.data.title,
      url: "https://reddit.com" + item.data.permalink,
      subreddit: item.data.subreddit,
      created_utc: item.data.created_utc,
      thumbnail:
        item.data.thumbnail && item.data.thumbnail.startsWith("http")
          ? item.data.thumbnail
          : null,
    }));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    res.status(500).json({ error: "Failed to fetch Reddit posts", details: error.message });
  }
}
