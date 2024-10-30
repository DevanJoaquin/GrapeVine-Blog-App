import { useEffect, useState } from "react"
import Nav from "./Nav"
import Article from "./Article"
import ArticleEntry from "./ArticleEntry"
import ArticleEdit from "./ArticleEdit"
import { SignIn, SignOut } from "./Auth"
import { useAuthentication } from "../services/authService"
import { fetchArticles, createArticle } from "../services/articleService"
import { db } from "../firebaseConfig"
import { doc, updateDoc, Timestamp } from "firebase/firestore"
import "./App.css"

export default function App() {
  const [articles, setArticles] = useState([])
  const [article, setArticle] = useState(null)
  const [writing, setWriting] = useState(false)
  const [editing, setEditing] = useState(false)
  const user = useAuthentication()

  // This is a trivial app, so just fetch all the articles only when
  // a user logs in. A real app would do pagination. Note that
  // "fetchArticles" is what gets the articles from the service and
  // then "setArticles" writes them into the React state.
  useEffect(() => {
    if (user) {
      fetchArticles().then(setArticles)
    }
  }, [user])

  // Update the "database" *then* update the internal React state. These
  // two steps are definitely necessary.
  function addArticle({ title, body }) {
    createArticle({ title, body }).then((article) => {
      setArticle(article)
      setArticles([article, ...articles])
      setWriting(false)
    })
  }

  function handleUpdateArticle(updatedArticle) {
    updateArticle(updatedArticle).then((updatedArticle) => {
      setArticles((prevArticles) =>
        prevArticles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a)) // Update the specific article
      )
      setArticle(updatedArticle)
      setEditing(false)
    })
  }

  function updateArticle(updatedArticle) {
    const articleRef = doc(db, "articles", updatedArticle.id)
    return updateDoc(articleRef, {
      title: updatedArticle.title,
      body: updatedArticle.body,
      date: Timestamp.now()
    }).then(() => {
      return {
        ...updatedArticle,
        date: Timestamp.now(),
      }
    })
  }

  return (
    <div className="App">
      <header>
        Blog
        {user && <button onClick={() => setWriting(true)}>New Article</button>}
        {!user ? <SignIn /> : <SignOut />}
      </header>

      {!user ? "" : <Nav articles={articles} setArticle={setArticle} />}

      {!user ? (
        ""
      ) : writing ? (
        <ArticleEntry addArticle={addArticle} />
      ) : editing ? (
        <ArticleEdit article={article} updateArticle={handleUpdateArticle} setEditing={setEditing} />
      ) : (
        <Article article={article} setArticles={setArticles} setArticle={setArticle} setEditing={setEditing}/>
      )}
    </div>
  )
}