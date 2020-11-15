import { render, screen } from "@testing-library/react"
import App, { shortenURL } from "./App"

describe("App", () => {
  test("are all elements in the DOM", () => {
    render(<App />)
    const label = screen.getByText(/enter a url below to get it shortened./i)
    const input = document.querySelector(".App-input")
    const button = document.querySelector(".App-button")
    const output = document.querySelector(".App-output")

    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()
    expect(output).toBeInTheDocument()
  })
})

describe("shortenURL", () => {
  beforeEach(() => render(<App />))

  test("is error displayed when no URL is entered", () => {
    shortenURL()
    const error = screen.getByText(/no url entered./i)
    expect(error).toBeInTheDocument()
  })

  test("is error displayed when URL is invalid", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ errors: [{ message: "Url is not valid" }] }),
      })
    )

    const input = document.querySelector(".App-input")
    input.value = "invalid url"

    await shortenURL()

    const error = screen.getByText(/url is not valid./i)
    expect(error).toBeInTheDocument()
  })

  test("is shortened URL generated and displayed", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ destination: url, shortUrl: "rebrand.ly/5qhub" }),
      })
    )

    const url = "mockurl.com"
    const input = document.querySelector(".App-input")
    input.value = url

    await shortenURL()

    const link = screen.getByText(/rebrand.ly\/5qhub/i)
    expect(link).toBeInTheDocument()
    expect(link.href.startsWith("http")).toBe(true)
    expect(link.href).toContain(url)
  })
})
