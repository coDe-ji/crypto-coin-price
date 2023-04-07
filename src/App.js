import React, { useState, useEffect, useCallback } from "react"
import dropdown from "../src/images/down-arrow.svg"
import refresh from "../src/images/refresh.svg"
import "../src/index.css"

function App() {
  /**
   * Initialize the state variables to be used.
   */
  const [currency, setCurrency] = useState("gbp")
  const [coinPrice, setCoinPrice] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [coinValue, setCoinValue] = useState("")
  const [gbp, setGbp] = useState("")
  const [usd, setUsd] = useState("")

  /**
   * Fetch the price information of a given crypto currency using the usecallback hook.
   */
  const fetchPrice = useCallback(
    async (cryptoName) => {
      try {
        let coinValue
        let symbol = currency === "gbp" ? "£" : "$"

        // Check the value of cryptoName and set the coinValue variable accordingly to either "eth-ethereum" or "btc-bitcoin".
        if (cryptoName === "ETHEREUM - ETH") {
          coinValue = "eth-ethereum"
        } else if (cryptoName === "BITCOIN - BTC") {
          coinValue = "btc-bitcoin"
        }

        // Call the Coinpaprika API with the coinValue and currency parameters to get the price information for the cryptocurrency.
        const response = await fetch(
          `https://api.coinpaprika.com/v1/tickers/${coinValue}?quotes=GBP,USD`
        )
        const info = await response.json()

        // Update the state variables using the corresponding setter functions
        setUsd("$" + info.quotes["usd".toUpperCase()].price.toFixed(2))
        setGbp("£" + info.quotes["gbp".toUpperCase()].price.toFixed(2))
        setCoinPrice(
          symbol + info.quotes[currency.toUpperCase()].price.toFixed(2)
        )
        setCoinValue(cryptoName)
        setIsOpen(false)

        handleColor(symbol)
        //Save the crypto coin and currency to the local storage.
        localStorage.setItem("CryptoCoin", cryptoName)
        localStorage.setItem("currency", currency)
      } catch (error) {
        console.error("Error fetching price:", error)
      }
    },
    [currency]
  )

  /**
   * UseEffect hook to fetch and update the component state of the coin and currency type in the local storage.
   * handle color function is called with the currency value to update the background color of the currency that is selected
   * fetch price is called with the current coin value to get the latest price of the coin and update the state.
   */
  useEffect(() => {
    const storedCoin = localStorage.getItem("CryptoCoin")
    const storedCurrency = localStorage.getItem("currency")

    if (storedCoin && storedCurrency) {
      setCoinValue(storedCoin)
      setCurrency(storedCurrency)
    }

    handleColor(storedCurrency)
    fetchPrice(coinValue)
  }, [coinValue, currency, fetchPrice])

  /**
   * Update the crypto coin price by passing the current coin as an argument to the fetch price function
   */
  const handleRefresh = async () => {
    await fetchPrice(coinValue)
  }

  /**
   *Check the value of the current currency and apply styling to reflect the users choice when they toggle currencys
   */
  const handleColor = (currency) => {
    let gbpButton = document.getElementById("gbp")
    let usdButton = document.getElementById("usd")
    if (currency === "usd") {
      usdButton.style.backgroundColor = "#585890"
      usdButton.style.color = "white"
      gbpButton.style.backgroundColor = "transparent"
    } else if (currency === "gbp") {
      gbpButton.style.backgroundColor = "#585890"
      gbpButton.style.color = "white"
      usdButton.style.backgroundColor = "transparent"
    }
  }

  /**
   * Handles the toggle between crypto currency options
   */
  const handleCurrencyChange = (newCurrency) => {
    //Check the value of the argument passed to the function and set the price of the coin accordingly.
    if (newCurrency === "gbp") {
      setCoinPrice(gbp)
    } else if (newCurrency === "usd") {
      setCoinPrice(usd)
    }

    //Update the currency stored in the local storage.
    setCurrency(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  // This toggles the list option when the dropdown button is clicked
  const handleDropDownClick = () => {
    //Set the isOpen variable to true to display the list of crypto currencies available
    setIsOpen(true)
    if (isOpen) {
      setIsOpen(false)
    }
    //Update the color of the current currency
    handleColor(currency)
  }

  /**
   * Funtion component that renders the dropdown container giving the user options of crypto currency to select from
   */
  function Dropdown() {
    return (
      <div>
        <div id="selectCrytoCoinBox">
          {/* div that displays the selected crypto currency option */}
          <div>
            <input
              className="coinNameContainer background"
              type="text"
              value={coinValue}
              id="coinName"
              onChange={(e) => setCoinValue(e.target.value)}
            />
          </div>
          {/* dropdown button */}
          <div id="dropdownContainer" className="background">
            <img
              id="dropdownButton"
              src={dropdown}
              alt="Crpto coin Dropdown list"
              onClick={handleDropDownClick}
            />
          </div>
          {/* Div containing the dropdown list of crypto currency options */}
        </div>
        {isOpen && (
          <div id="dropdownList" className="background">
            <p
              className="coinOption"
              onClick={() => fetchPrice("ETHEREUM - ETH")}
            >
              ETHEREUM - ETH
            </p>
            <p
              className="coinOption"
              onClick={() => fetchPrice("BITCOIN - BTC")}
            >
              BITCOIN - BTC
            </p>
          </div>
        )}
      </div>
    )
  }

  /**
   * Function Component that renders the information about the selected crypto currency.
   */
  function CoinInfo() {
    return (
      <div id="coininfoContainer">
        {/* Div containing the Information on the crypto Coin.(Name, price, refresh button) */}
        <div id="cryptoCoinCard">
          <div>
            <img
              id="refreshButton"
              src={refresh}
              alt="Refresh button"
              onClick={handleRefresh}
            />
          </div>
          <div id="coinNameDisplayContainer">
            <input
              className="coinNameContainer background"
              type="text"
              value={coinValue}
              id="coinNameDisplay"
              onChange={(e) => setCoinValue(e.target.value)}
            />
          </div>
          <p id="coinPrice">{coinPrice}</p>
        </div>

        {/* Div containing the GBP and USD currency buttons.  */}
        <div id="toggleCurrency">
          <div>
            <button
              id="gbp"
              className="toggleGBP toggleCoin"
              type="button"
              onClick={() => handleCurrencyChange("gbp")}
            >
              GBP
            </button>
          </div>
          <div>
            <button
              id="usd"
              className="toggleUSD toggleCoin"
              type="button"
              onClick={() => handleCurrencyChange("usd")}
            >
              USD
            </button>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render the Dropdown and CoinInfo components within a component div.
   */
  return (
    <div className="App">
      <div id="widgetContainer">
        <Dropdown />
        <CoinInfo />
      </div>
    </div>
  )
}

export default App
