import About from "./about";
import Contact from "./contact";
import Experience from "./experience";
import Github from "./github";
import Hero from "./home";
import Projects from "./projects";
import Skills from "./skills";

export default function Home() {
    return (
        <div className="scroll-smooth">
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Github />
            <Projects />
            <Contact />
        </div>
    );
}
