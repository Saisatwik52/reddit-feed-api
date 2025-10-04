const username = "Notadayover";
const limit = 20;

export default async function handler(req, res) {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://www.reddit.com/user/${username}/submitted/.json?limit=${limit}`
    )}`;

    const response = await fetch(proxyUrl);
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

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Reddit posts", details: error.message });
  }
}
