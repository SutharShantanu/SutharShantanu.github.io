import "./home.css";
import { FaCloudDownloadAlt } from "react-icons/fa";

function Home() {
  const openLink = (url) => {
    window.open(url);
  };
  return (
    <div className="home-main" id="home">
      <div className="homeWrapper">
        <div className="homeLeft">
          <div id="user-detail-name">Hello, I'm Shantanu</div>
          <div>
            A skilled{" "}
            <strong id="user-detail-intro">Full Stack Web Developer 💻</strong>
          </div>
          <a
            href=""
            id="resume-link-2"
          >
            <div
              onClick={() =>
                openLink(
                  ""
                )
              }
              className="home-resume"
              id="resume-button-2"
            >
              Resume <FaCloudDownloadAlt />
            </div>
          </a>
        </div>

        <div className="homeright">
          <img
            className="home-img"
            src={""}
            alt="profile"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
