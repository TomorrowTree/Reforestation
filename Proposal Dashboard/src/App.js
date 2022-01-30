import React, { useState } from "react"
import { useMoralis } from "react-moralis"
import Form from "./Form"
import Googlemap from "./Googlemap"
import NetworkSwitch from "./NetworkSwitch"
import Menu from "./Menu"
import Card from "./Card"
import "./App.css"
import logo from "./design/TT logo TT Green.png"
import imageMoralisGreen from "./design/Powered-by-Moralis-Badge-Green.png"
import imageAvalanche from "./design/PoweredbyAvalanche_BlackWhite.png"
import backgroundImg from "./design/backg sky(1).png"
import footerImg from "./design/backg trees.png"

const App = () => {
  const { authenticate, isAuthenticated, user } = useMoralis()

  const [polygonArea, setPolygonArea] = useState()
  const [mapImage, setMapImage] = useState()

  const polygonAreaHandler = (area) => {
    setPolygonArea(area)
  }

  const mapImageHandler = (image) => {
    setMapImage(image)
  }

  if (!isAuthenticated) {
    return (
      <div className="authBody">
        <div className="header">
          <img src={logo} alt="" />
          <img src={backgroundImg} alt="" />
          <Menu />
        </div>
        <div className="authContainer">
          <button className="authenticateBtn" onClick={() => authenticate()}>
            Authenticate
          </button>
        </div>
        <div className="imgContainer">
          <a href="https:\\www.moralis.io">
            <img src={imageMoralisGreen} alt="Powered by Moralis" />
          </a>
          <a href="https://www.avax.network/">
            <img src={imageAvalanche} alt="Powered by Avalanche" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="header">
        <img src={logo} alt="" />
        <img src={backgroundImg} alt="" />
      </div>
      <Menu />
      <div className="formContainer">
        <NetworkSwitch />
        <Card>
          <Googlemap
            setArea={polygonAreaHandler}
            setMapImage={mapImageHandler}
          />
          <Form
            polygonArea={polygonArea}
            userType={user.get("type")}
            mapImage={mapImage}
          />
        </Card>
      </div>
      <div className="footer">
        <img src={footerImg} alt="" />
      </div>
      <div className="imgContainer">
        <a href="https:\\www.moralis.io">
          <img src={imageMoralisGreen} alt="Powered by Moralis" />
        </a>
        <a href="https://www.avax.network/">
          <img src={imageAvalanche} alt="Powered by Avalanche" />
        </a>
      </div>
    </div>
  )
}

export default App
