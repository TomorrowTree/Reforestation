import { useMoralis } from "react-moralis"

const Menu = () => {
  const { logout, isAuthenticating, isAuthenticated } = useMoralis()
  return (
    <div className="btnCont">
      <nav id="navbar" className="navigation" role="navigation">
        <input id="toggle" type="checkbox" />
        <label className="hamburger" htmlFor="toggle">
          <div className="top"></div>
          <div className="middle"></div>
          <div className="bottom"></div>
        </label>

        <nav className="menu">
          <a className="link" href="https:\\tomorrowtree.org">
            {" "}
            Home{" "}
          </a>
          <a className="link" href="https://tomorrowtree.org/about">
            {" "}
            About{" "}
          </a>
          <a className="link" href="https://tomorrowtree.org/hero/join">
            {" "}
            Join the Hero Community{" "}
          </a>
          <a className="link" href="https://tomorrowtree.org/privacy-policy">
            {" "}
            Privacy Policy{" "}
          </a>
          <a className="link" href="https://tomorrowtree.org/terms-conditions">
            {" "}
            Terms and Conditions{" "}
          </a>
          {isAuthenticated && (
            <button onClick={() => logout()} disabled={isAuthenticating}>
              Logout
            </button>
          )}
        </nav>
      </nav>
    </div>
  )
}
export default Menu
