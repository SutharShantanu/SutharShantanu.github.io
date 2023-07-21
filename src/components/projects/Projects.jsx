import "./projects.css";
import { FaGithub } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";
// import ProjectSet from "./ProjectSet";
// import data from "../../db.json";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

function Projects() {
    const openLink = (url) => {
        window.open(url);
    };
    return (
        <div className="projects-projects" id="projects">
            <div class="text-divider-project"></div>
            <h1
                data-aos-mirror="true"
                data-aos="fade-bottom"
                data-aos-duration="3000"
                className="projects-heading">
                My Projects
            </h1>
            <div className="projects-container">
                <div className="project-card">
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-right"
                        data-aos-duration="3000"
                        className="project-card-container">
                        <div className="project-img">
                            <img
                                src="https://github.com/SutharShantanu/Todo/assets/110021464/4cd0ff9e-5f9f-4cf6-ab8a-e25c307db047"
                                alt=""
                            />
                        </div>
                        <div className="project-card-text">
                            <h1 className="project-title">Todo's</h1>
                            <p className="project-description">
                                Todo's is a project management tool that helps
                                you stay organized by creating and managing
                                tasks. It allows you to prioritize and track
                                your progress, ensuring you stay productive and
                                efficient.
                            </p>
                            <div className="project-tech-stack">
                                <div
                                    key={Date.now() + Math.random()}
                                    className="project-skills-card">
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        HTML
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        CSS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        JavaScript
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        React Js
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://lh5.googleusercontent.com/fIY8_nCkUbVDqzQA_RNU_H7u6X3hKQB9hm89AoK_6R4s3nGcUqLiK5UEJaNBlOksqVI=w2400"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Redux
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://img.icons8.com/color/256/chakra-ui.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Chakra UI
                                    </p>
                                </div>
                            </div>
                            <div className="project-card-btn">
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://github.com/SutharShantanu/Todo`
                                        )
                                    }
                                    className="project-github-link">
                                    GitHub <FaGithub />
                                </div>
                                <div
                                    onClick={() =>
                                        openLink(`https://opentodos.vercel.app`)
                                    }
                                    className="project-deployed-link">
                                    Deploy <HiExternalLink />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="project-card">
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-right"
                        data-aos-duration="3000"
                        className="project-card-container">
                        <div className="project-img">
                            <img
                                src="https://github.com/SutharShantanu/OpenWeather/assets/110021464/3e84e827-adc6-49f1-b0f8-8daab194094a"
                                alt=""
                            />
                        </div>
                        <div className="project-card-text">
                            <h1 className="project-title">OpenWeather</h1>
                            <p className="project-description">
                                OpenWeather is a project that provides weather
                                data and services to developers and businesses.
                                It offers a comprehensive set of APIs and tools
                                for accessing real-time and historical weather
                                data for locations worldwide.
                            </p>
                            <div className="project-tech-stack">
                                <div
                                    key={Date.now() + Math.random()}
                                    className="project-skills-card">
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        HTML
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        CSS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        JavaScript
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        React Js
                                    </p>
                                </div>

                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://img.icons8.com/color/256/chakra-ui.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Chakra UI
                                    </p>
                                </div>

                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5968/5968322.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Node JS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Express JS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        MongoDB
                                    </p>
                                </div>
                            </div>
                            <div className="project-card-btn">
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://github.com/SutharShantanu/OpenWeather`
                                        )
                                    }
                                    className="project-github-link">
                                    GitHub <FaGithub />
                                </div>
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://openweathers.vercel.app`
                                        )
                                    }
                                    className="project-deployed-link">
                                    Deploy <HiExternalLink />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="project-card">
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-right"
                        data-aos-duration="3000"
                        className="project-card-container">
                        <div className="project-img">
                            <img
                                src="https://user-images.githubusercontent.com/110021464/229436194-106bfbb6-5200-4bf6-830e-99c9c6fe0a86.png"
                                alt=""
                            />
                        </div>
                        <div className="project-card-text">
                            <h1 className="project-title">GadgetGalaxy</h1>
                            <p className="project-description">
                                GadgetGalaxy is a clone of an Indian online
                                store that specializes in selling a wide range
                                of designer mobile phone cases, laptop sleeves,
                                and other tech accessories
                            </p>
                            <div className="project-tech-stack">
                                <div
                                    key={Date.now() + Math.random()}
                                    className="project-skills-card">
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        HTML
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        CSS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        JavaScript
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        React Js
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://lh5.googleusercontent.com/fIY8_nCkUbVDqzQA_RNU_H7u6X3hKQB9hm89AoK_6R4s3nGcUqLiK5UEJaNBlOksqVI=w2400"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Redux
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://img.icons8.com/color/256/chakra-ui.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Chakra UI
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Mantine UI
                                    </p>
                                </div>

                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5968/5968322.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Node JS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Express JS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        MongoDB
                                    </p>
                                </div>
                            </div>
                            <div className="project-card-btn">
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://github.com/uzairansari11/native-order-609`
                                        )
                                    }
                                    className="project-github-link">
                                    GitHub <FaGithub />
                                </div>
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://gadgetgalaxy.netlify.app/`
                                        )
                                    }
                                    className="project-deployed-link">
                                    Deploy <HiExternalLink />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="project-card">
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-right"
                        data-aos-duration="3000"
                        className="project-card-container">
                        <div className="project-img">
                            <img
                                src="https://user-images.githubusercontent.com/110021464/222483483-7eb2c6ac-b8d7-447d-89e6-19ed1845c597.png"
                                alt=""
                            />
                        </div>
                        <div className="project-card-text">
                            <h1 className="project-title">Aerowear</h1>
                            <p className="project-description">
                                Aerowear is known for its trendy and affordable
                                clothing, with a focus on casual wear such as
                                t-shirts, hoodies, and jeans. The brand also
                                offers a range of accessories such as bags.
                            </p>
                            <div className="project-tech-stack">
                                <div
                                    key={Date.now() + Math.random()}
                                    className="project-skills-card">
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        HTML
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        CSS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        JavaScript
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        React Js
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://lh5.googleusercontent.com/fIY8_nCkUbVDqzQA_RNU_H7u6X3hKQB9hm89AoK_6R4s3nGcUqLiK5UEJaNBlOksqVI=w2400"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Redux
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://img.icons8.com/color/256/chakra-ui.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Chakra UI
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://mui.com/static/logo.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Material UI
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/136/136525.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        JSON
                                    </p>
                                </div>
                            </div>
                            <div className="project-card-btn">
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://github.com/suhail3535/thinkable-slope-4107`
                                        )
                                    }
                                    className="project-github-link">
                                    GitHub <FaGithub />
                                </div>
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://thinkable-slope.vercel.app/`
                                        )
                                    }
                                    className="project-deployed-link">
                                    Deploy <HiExternalLink />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="project-card">
                    <div
                        data-aos-mirror="true"
                        data-aos="fade-right"
                        data-aos-duration="3000"
                        className="project-card-container">
                        <div className="project-img">
                            <img
                                src="https://user-images.githubusercontent.com/110021464/230127759-7e3d92ec-b777-4fc4-b787-fdc25bde0fa1.png"
                                alt=""
                            />
                        </div>
                        <div className="project-card-text">
                            <h1 className="project-title">Paperfury</h1>
                            <p className="project-description">
                                Papperfury is a clone of paperfry which is an
                                Indian online furniture and home decor retailer.
                                The company offers a wide range of products
                                including furniture, home decor, lighting,
                                kitchen and dining, and other home essentials.
                            </p>
                            <div className="project-tech-stack">
                                <div
                                    key={Date.now() + Math.random()}
                                    className="project-skills-card">
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        HTML
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        CSS
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        JavaScript
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://camo.githubusercontent.com/48d099290b4cb2d7937bcd96e8497cf1845b54a810a6432c70cf944b60b40c77/68747470733a2f2f7261776769742e636f6d2f676f72616e67616a69632f72656163742d69636f6e732f6d61737465722f72656163742d69636f6e732e737667"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        React Icons
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://avatars.githubusercontent.com/u/2918581?s=200&v=4"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Bootstrap
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://img.icons8.com/color/256/chakra-ui.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Chakra UI
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://mui.com/static/logo.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        Material UI
                                    </p>
                                </div>
                                <div
                                    className="project-skills-card"
                                    key={Date.now() + Math.random()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/136/136525.png"
                                        alt=""
                                        className="project-skills-card-img"
                                    />
                                    <p className="project-skills-card-name">
                                        JSON
                                    </p>
                                </div>
                            </div>
                            <div className="project-card-btn">
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://github.com/SutharShantanu/-available-blood-5696`
                                        )
                                    }
                                    className="project-github-link">
                                    GitHub <FaGithub />
                                </div>
                                <div
                                    onClick={() =>
                                        openLink(
                                            `https://paperfury.netlify.app/`
                                        )
                                    }
                                    className="project-deployed-link">
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
