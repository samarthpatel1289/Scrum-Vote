import React from 'react'

import { Helmet } from 'react-helmet'

import './home.css'

const Home = (props) => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Victorious Acceptable Salamander</title>
        <meta property="og:title" content="Victorious Acceptable Salamander" />
      </Helmet>
      <div className="home-container1">
        <div className="home-container2">
          <ul className="home-ul list">
            <li className="list-item">
              <span>Text</span>
            </li>
            <li className="list-item">
              <span>Text</span>
            </li>
            <li className="list-item">
              <span>Text</span>
            </li>
            <li className="list-item">
              <span>Text</span>
            </li>
          </ul>
          <span className="home-text4">Copy Link</span>
        </div>
        <div className="home-container3">
          <div className="home-container4"></div>
          <div className="home-container5">
            <form className="home-form">
              <input
                type="text"
                placeholder="placeholder"
                className="home-textinput input"
              />
              <button className="home-button button">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
