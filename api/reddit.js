export default async function handler(req, res) {
  const username = "Notadayover";
  const limit = 20;

  try {
    const response = await fetch(
      `https://www.reddit.com/user/${username}/submitted/.json?limit=${limit}`,
      { headers: { "User-Agent": "web:reddit-feed-api:v1.0 (by /u/Notadayover)" } }
    );

    // 🧠 Read the raw response text before parsing
    const text = await response.text();

    // Log what Reddit actually sent
    console.log("🔍 Reddit raw response:", text.slice(0, 500)); // print only first 500 chars

    // Try parsing to JSON (only if it's valid JSON)
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If it's not JSON, respond with the raw HTML for inspection
      return res.status(502).send(text);
    }

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

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Reddit posts", details: error.message });
  }
}
