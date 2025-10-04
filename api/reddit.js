export default async function handler(req, res) {
  const username = "Satwik_1";
  const limit = 20;

  try {
    const response = await fetch(
      `https://www.reddit.com/user/Satwik_1/submitted/.json?limit=20`,
      { headers: { 'User-Agent': 'reddit-feed-script' } }
    );
    const data = await response.json();

    const posts = data.data.children.map((item) => ({
      title: item.data.title,
      url: "https://reddit.com" + item.data.permalink,
      subreddit: item.data.subreddit,
      created_utc: item.data.created_utc,
      thumbnail: item.data.thumbnail && item.data.thumbnail.startsWith("http") 
        ? item.data.thumbnail 
        : null
    }));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Reddit posts", details: error.message });
  }
}
