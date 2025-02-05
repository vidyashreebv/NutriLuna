import React from 'react'

function Landing() {
  return (
    <div>
        <nav>
        <div className="logo">
          <img src="/path/to/logo.png" alt="logo" />
          <span>Logo</span>
        </div>
        <div className="nav-options">
          <a href="#" className="nav-item">Home</a>
          <a href="#" className="nav-item">About</a>
          <a href="#" className="nav-item">Contact</a>
        </div>
      </nav>

      <div className="card">
        <div className="card-content">
          <h1 className="content-title-1">Title 1</h1>
          <h2 className="content-title-2">Title 2</h2>
          <div className="content-place">Place</div>
          <div className="content-start"></div>
        </div>

        <div className="details">
          <div className="place-box">
            <div className="text">Some Place</div>
          </div>
          <h1 className="title-1">Details Title</h1>
          <h2 className="title-2">Subtitle</h2>
          <div className="desc">Description content...</div>
          <div className="cta">
            <button className="bookmark">+</button>
            <button className="discover">Discover</button>
          </div>
        </div>
      </div>

      <div className="indicator"></div>

      <div className="pagination">
        <div className="arrow">←</div>
        <div className="progress-sub-container">
          <div className="progress-sub-background">
            <div className="progress-sub-foreground"></div>
          </div>
        </div>
        <div className="arrow">→</div>
      </div>

      <div className="cover"></div>
    </div>
    
  )
}

export default Landing