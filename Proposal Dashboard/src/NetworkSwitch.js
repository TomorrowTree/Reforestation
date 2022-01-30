import React, { useState } from "react"
import { useChain } from "react-moralis"
import Moralis from "moralis"
import "./App.css"

const chains = [
  {
    id: "0xa869",
    label: "Avalanche Fuji Testnet",
  },
  {
    id: "0xa86a",
    label: "Avalanche",
  },
  {
    id: "0x1",
    label: "Ethereum",
  },
  {
    id: "0x38",
    label: "Binance SC",
  },
]

const NetworkSwitch = () => {
  const { switchNetwork, chain } = useChain()
  const [showList, setShowList] = useState(false)

  const onNetworkSwitch = async (id) => {
    await Moralis.enableWeb3()
    switchNetwork(id)
    setShowList(false)
  }

  const toggleShowListHandler = () => {
    setShowList(!showList)
  }

  return (
    <div className="ethereumCont">
      <button className="ethereumBtn" onClick={toggleShowListHandler}>
        {chain.name}
      </button>
      {showList && (
        <ul>
          {chains.map((item) => {
            return (
              <button
                className="ethereumBtn2"
                key={item.id}
                onClick={() => {
                  onNetworkSwitch(item.id)
                }}
              >
                {item.label}
              </button>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default NetworkSwitch
