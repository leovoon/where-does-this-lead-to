/* eslint-disable @next/next/no-img-element */
import Head from "next/head"
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [imgUrl, setImgUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const isValidHttpUrl = (string) => {
    let url

    try {
      url = new URL(string)
    } catch (_) {
      return false
    }

    return url.protocol === "http:" || url.protocol === "https:"
  }
  const captureUrl = async (event) => {
    event.preventDefault()

    if (!isValidHttpUrl(event.target.url.value)) {
      alert("Please enter a valid URL")
    } else {
      const res = await fetch("/api/image.png", {
        body: JSON.stringify({
          url: event.target.url.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      setLoading(true)

      if (res.status === 500) {
        alert("Error taking screenshot.")
        setLoading(false)
      } else {
        const blob = await res.blob()
        const objectURL = URL.createObjectURL(blob)
        setImgUrl(objectURL)
        setLoading(false)
      }
    }
  }

  return (
    <div className="wrapper">
      <Head>
        <title>What does this lead to?</title>
        <meta name="description" content="URL capture" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>What does this link lead to?</h1>

      <form onSubmit={captureUrl}>
        <input
          className="input"
          id="url"
          name="url"
          type="text"
          autoComplete="url"
          required
        />
        <button className="button" type="submit">
          Get screenshot
        </button>
      </form>
      <div className="img-container">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <img
            className="img"
            alt="capture result"
            src={
              imgUrl ||
              "https://user-images.githubusercontent.com/20684618/31289519-9ebdbe1a-aae6-11e7-8f82-bf794fdd9d1a.png"
            }
          />
        )}
      </div>

      <footer>
        <a
          href="https://github.com/leovoon/where-does-this-lead-to"
          target="_blank"
          rel="noopener noreferrer"
        >
          Build with Next.js by leovoon. <br />
          <p>
            Powered by{" "}
            <span>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </p>
        </a>
      </footer>
    </div>
  )
}
