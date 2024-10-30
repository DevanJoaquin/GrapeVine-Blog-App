import { deleteArticle } from "../services/articleService";

export default function Article({ article, setArticles, setArticle, setEditing }) {

  const formatDate = article && article.date ? new Date(article.date.seconds * 1000) : null;
  const displayTime = formatDate ? `${formatDate.toLocaleDateString()} ${formatDate.toLocaleTimeString()}` : '';

  const handleDelete = async () => {
    if (article) {
      const confirmDelete = window.confirm("Are you sure you would like to delete this article? This cannot be undone.");
      if (confirmDelete){
        await deleteArticle(article.id)
        setArticles((prevArticles) => prevArticles.filter(a => a.id !== article.id));
        setArticle(null);
      }
    }
  }

  return (
    <article>
      {!article ? (
        <p>No article selected</p>
      ) : (
        <section>
          <h2>{article.title}</h2>
          <p className="date">{`Posted: ${displayTime}`}</p>
          <p className="body">{article.body}</p>
          <button onClick={handleDelete}>Delete Article</button>
          <button onClick={() => setEditing(true)}>Edit Article</button>
        </section>
      )}
    </article>
  )
}
