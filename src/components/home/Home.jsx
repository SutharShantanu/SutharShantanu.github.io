import "./home.css";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";


function Home () {
  const openLink = (url) => {
    window.open(url);
  };
  return (
    <div className="home-main" id="home">
      <div className="homeWrapper">
        <div className="homeLeft">
          <div id="user-detail-name">Hello, I'm Shantanu</div>
          <div>
            A skilled
            <strong id="user-detail-intro">Full Stack Web Developer 💻</strong>
          </div>
          <a
            href="https://drive.google.com/uc?id=173kc0AW6miCrWOsqeYN3ad348otgyA13&export=download"
            id="resume-link-2"
          >
            <div
              onClick={() =>
                openLink(
                  "https://drive.google.com/file/d/173kc0AW6miCrWOsqeYN3ad348otgyA13/view?usp=share_link"
                )
              }
              className="home-resume"
              id="resume-button-2"
            >
              Resume <HiDownload />
            </div>
          </a>
        </div>

        <div className="homeright">
          <img
            className="home-img"
            src={process.env.PUBLIC_URL + "./Images/IMG_7729_2-modified.png"}
            alt="profile"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
