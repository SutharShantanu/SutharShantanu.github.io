import About from "./about";
import Contact from "./contact";
import Experience from "./experience";
import Github from "./github";
import Homepage from "./homepage";
import Projects from "./projects";
import Skills from "./skills";

export default function Home() {
    return (
        <div className="scroll-smooth">
            <Homepage />
            <About />
            <Experience />
            <Skills />
            <Github />
            {/*<Projects />
            <Contact />*/}
        </div>
    );
}
