import "./skills.css";
import TechStack from "./TechStack";
import data from "../../db.json";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

function Skills() {
    return (
        <div className="skills-main" id="skills">
            <div class="text-divider-skill"></div>
            <div className="skillsWrapper">
                <div>
                    <h1
                        data-aos-mirror="true"
                        data-aos="fade-left"
                        data-aos-duration="3000"
                        className="skills-heading">
                        Languages & Frameworks
                    </h1>
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-up-right"
                        data-aos-duration="3000"
                        className="skillsTechnologiesDiv">
                        {data.language_framework.map((elm) => (
                            <TechStack key={elm.id} {...elm} />
                        ))}
                    </div>
                </div>
                <div>
                    <h1
                        data-aos-mirror="true"
                        data-aos="fade-right"
                        data-aos-duration="3000"
                        className="skills-heading">
                        Tools
                    </h1>
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-up-left"
                        data-aos-duration="3000"
                        className="skillsToolsDiv">
                        {data.tools.map((elm) => (
                            <TechStack key={elm.id} {...elm} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Skills;
