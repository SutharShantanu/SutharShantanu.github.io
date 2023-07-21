import "./about.css";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

function About() {
    const openLink = (url) => {
        window.open(url);
    };

    return (
        <div className="about section" id="about">
            <div class="text-divider-about"></div>
            <h1
                data-aos-mirror="true"
                data-aos="fade-down"
                data-aos-duration="3000"
                className="aboutH1">
                About me
            </h1>
            <div className="aboutWrapper">
                <div className="aboutWrapperDiv">
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-up"
                        data-aos-duration="3000"
                        className="aboutMe"
                        id="user-detail-intro">
                        <span className="about_name" id="user-detail-name">
                            I am Shantanu
                            <br />
                            Full-Stack Web Developer
                            <br />
                            Lives in Hanumangarh, Rajasthan
                            <br />
                        </span>
                        <hr style={{ margin: "20px auto" }} />A passionate
                        aspiring Full Stack Developer skilled in MERN stack,
                        molded and shaped by Masai School's numerous training.
                        Actively ready to join the great living team of a good
                        start-up to adapt me in any situation and the
                        environment with ease and perform the best.
                    </div>
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-up"
                        data-aos-duration="3000"
                        className="about-socialLink">
                        <img
                            onClick={() =>
                                openLink("https://github.com/SutharShantanu")
                            }
                            src={process.env.PUBLIC_URL + "./Images/github.png"}
                            alt="About"
                        />
                        <img
                            onClick={() =>
                                openLink("https://www.linkedin.com/in/")
                            }
                            src={
                                process.env.PUBLIC_URL + "./Images/linkedin.png"
                            }
                            alt="About"
                        />
                    </div>
                </div>
                <div className="aboutWrapperImg">
                    <img
                        data-aos-mirror="true"
                        data-aos="fade-up"
                        data-aos-duration="3000"
                        src={process.env.PUBLIC_URL + "./Images/Right_Side.gif"}
                        alt="About"
                    />
                </div>
            </div>
        </div>
    );
}

export default About;
