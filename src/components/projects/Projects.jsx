import "./projects.css";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";
// import ProjectSet from "./ProjectSet";
// import data from "../../db.json";

function Projects () {
  const openLink = (url) => {
    window.open(url);
  };
  return (
    <div className="projects-projects" id="projects">
      <div class="text-divider-project"></div>
      <h1 className="projects-heading">My Projects</h1>
      <div className="projects-container">
        {/* {data.projects.map((elm) => {
          return <ProjectSet key={elm.id} {...elm} />;
        })} */}

        <div className="project-card">
          <div className="project-card-container">
            <div className="project-img">
              <img src={process.env.PUBLIC_URL + "./Images/geeky.png"} alt="" />
            </div>
            <div className="project-card-text">
              <h1 className="project-title">Geeky Cart</h1>
              <p className="project-description">Geeky Cart is a retailer of technology products, services and solutions.  We work every day to bring you the best technology possible with the goal of making life simpler, easier and better for everyone who uses technology.</p>
              <div className="project-tech-stack">
                <div key={Date.now() + Math.random()}
                  className="project-skills-card">
                  <img
                    src="https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg"
                    alt=""
                    className="project-skills-card-img"
                  />
                  <p className="project-skills-card-name">HTML</p>
                </div>
                <div className="project-skills-card" key={Date.now() + Math.random()}>
                  <img
                    src="https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg"
                    alt=""
                    className="project-skills-card-img"
                  />
                  <p className="project-skills-card-name">CSS</p>
                </div>
                <div className="project-skills-card" key={Date.now() + Math.random()}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
                    alt=""
                    className="project-skills-card-img"
                  />
                  <p className="project-skills-card-name">JavaScript</p>
                </div>
              </div>
              <div className="project-card-btn">
                <div
                  onClick={() => openLink(``)}
                  className="project-github-link"
                >
                  GitHub <FaGithub />
                </div>
                <div
                  onClick={() => openLink(`https://geekycart.netlify.app/`)}
                  className="project-deployed-link"
                >
                  Deploy <HiExternalLink />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
