// api/reddit.js

export default async function handler(req, res) {
  const username = "Notadayover"; // 🔹 Replace with your Reddit username
  const limit = 20; // number of posts to fetch

  try {
    const response = await fetch(
      `https://www.reddit.com/user/${username}/submitted/.json?limit=${limit}`,
      { headers: { "User-Agent": "reddit-feed-script" } }
    );

    const data = await response.json();

    const posts = data.data.children.map(item => ({
      title: item.data.title,
      url: "https://reddit.com" + item.data.permalink,
      subreddit: item.data.subreddit,
      tags: item.data.link_flair_text || "General",
      created_utc: item.data.created_utc,
      thumbnail:
        item.data.thumbnail && item.data.thumbnail.startsWith("http")
          ? item.data.thumbnail
          : null
    }));

    // ✅ Allow Blogger to fetch
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Reddit posts", details: error.message });
  }
}
