import "./App.css"

function App() {
  return (
    <div className="App">
      <p>Enter a URL below to get it shortened.</p>
      <div>
        <input className="App-input" type="text" />
        <button className="App-button" onClick={shortenURL}>
          Shorten
        </button>
      </div>
      <div className="App-output"></div>
    </div>
  )
}

export async function shortenURL() {
  const input = document.querySelector(".App-input")
  const output = document.querySelector(".App-output")

  if (!input.value) {
    output.innerHTML = "<p>No URL entered.<p>"
  } else {
    let url = !input.value.startsWith("http")
      ? `http://${input.value}`
      : input.value

    let linkRequest = {
      destination: url,
      domain: { fullName: "rebrand.ly" },
    }

    let requestHeaders = {
      "Content-Type": "application/json",
      apikey: "4976b32c61ca4aacb50ae4c560d8a04b",
    }

    try {
      const result = await fetch("https://api.rebrandly.com/v1/links", {
        method: "POST",
        mode: "cors",
        headers: requestHeaders,
        body: JSON.stringify(linkRequest),
      })

      const data = await result.json()

      if (data.errors?.length > 0) {
        output.innerHTML = `<p>${data.errors[0].message}.</p>`
      } else {
        output.innerHTML = `<a
          href="${data.destination}"
          target="_blank"
          rel="noopener noreferrer"
        >${data.shortUrl}
        </a>`
      }
    } catch (error) {
      output.innerHTML = `<p>${error}.</p>`
    }
  }
}

export default App
