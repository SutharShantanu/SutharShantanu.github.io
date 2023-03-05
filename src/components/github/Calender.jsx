import React from "react";
import GitHubCalendar from "react-github-calendar";
import ReactTooltip from "react-tooltip";
import "./calender.css";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

function Calender() {
  const selectLast12Months = (contributions) => {
    const today = new Date();
    const startTimestamp = new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      1
    ).getTime();
    const endTimestamp =
      new Date(today.getFullYear(), today.getMonth() + 1, 1).getTime() - 1;

    return contributions.filter((day) => {
      const contributionTimestamp = new Date(day.date).getTime();

      return (
        contributionTimestamp >= startTimestamp &&
        contributionTimestamp <= endTimestamp
      );
    });
  };

  return (
      <div className="github-main">
          <div class="text-divider-git"></div>
          <h1
              className="github-heading"
              data-aos-mirror="true"
              data-aos="fade-bottom"
              data-aos-duration="3000">
              GitHub
          </h1>
          <div
              data-aos-mirror="true"
              data-aos="fade-up"
              data-aos-duration="3000"
              className="github-calender">
              <GitHubCalendar
                  className="github-calendar-class"
                  transformData={selectLast12Months}
                  username="SutharShantanu"
                  color={"#f66066"}
                  blockSize={20}
                  fontSize={23}
                  showColorLegend
                  hideTotalCount
                  style={{ padding: "10px 20px" }}>
                  <ReactTooltip delayShow={20} html />
              </GitHubCalendar>
          </div>
          <div
              className="github-stats"
              data-aos-mirror="true"
              data-aos="fade-up"
              data-aos-duration="3000">
              <div id="wide_left">
                  <img
                      src="https://github-readme-streak-stats.herokuapp.com?user=SutharShantanu&theme=sea&hide_border=true&border_radius=10&date_format=j%20M%5B%20Y%5D&background=8f3e41"
                      alt="Shantanu Stats"
                      id="github-streak-stats"
                  />
              </div>
              <div id="mid">
                  <img
                      src="https://github-readme-stats.vercel.app/api/top-langs/?username=SutharShantanu&title_color=ffffff&text_color=ffffff&icon_color=ffffff&bg_color=8f3e41&border_radius=10&border_color=1a1a1a"
                      alt="Shantanu Language"
                      id="github-top-langs"
                  />
              </div>
              <div id="wide_right">
                  <img
                      src="https://github-readme-stats.vercel.app/api?username=SutharShantanu&show_icons=true&title_color=ffffff&text_color=ffffff&icon_color=ffffff&bg_color=8f3e41&border_radius=10&border_color=1a1a1a"
                      // src="https://github-readme-stats.vercel.app/api?username=sutharshantanu&count_private=true&show_icons=true&theme=tokyonight"
                      alt="Shantanu Stats"
                      id="github-stats-card"
                  />
              </div>
          </div>
      </div>
  );
}

export default Calender;
