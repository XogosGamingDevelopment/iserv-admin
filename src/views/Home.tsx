import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [activelink, setActiveLink] = useState("kt_app_root");
  /*useEffect(() =>{
		let dates = getSevenDayRange(2, '2025-03-08');
		console.log('dates', dates);
	}, [])*/

  const scrollToDiv = (element_id: string) => {
    const element = document.getElementById(element_id);
    //console.log('scroll to element', element);
    if (!element) return;
    window.scroll({
      top: element.offsetTop - 2,
      behavior: "smooth",
    });
    setActiveLink(element_id);
  };

  /*const getSevenDayRange = (day: number, date: string) => {
		const dates = [];
		const inputDate = new Date(date);

		// Calculate how many days before and after based on the input `day`
		const beforeDays = day - 1;  // Number of days before the reference date
		const afterDays = 7 - day;   // Number of days after the reference date

		// Set the reference date as the input date adjusted for the "day" position
		const referenceDate = new Date(inputDate);
		referenceDate.setDate(inputDate.getDate() - beforeDays);  // Adjust to middle of the 7-day range

		// Generate the 7-day range from the reference date
		for (let i = -beforeDays; i <= afterDays; i++) {
			const dayInRange = new Date(referenceDate);
			dayInRange.setDate(referenceDate.getDate() + i);
			dates.push(dayInRange.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
		}

		return dates;
	}*/
  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="mb-0" id="home">
        <div
          className="bgi-no-repeat bgi-size-contain bgi-position-x-center bgi-position-y-bottom landing-dark-bg"
          style={{
            backgroundImage: `url(/assets/media/svg/illustrations/landing.svg)`,
          }}
        >
          <div
            className="landing-header"
            data-kt-sticky="true"
            data-kt-sticky-name="landing-header"
            data-kt-sticky-offset="{default: '200px', lg: '300px'}"
          >
            <div className="container">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center flex-equal">
                  <button
                    className="btn btn-icon btn-active-color-primary me-3 d-flex d-lg-none"
                    id="kt_landing_menu_toggle"
                  >
                    <i className="ki-outline ki-abstract-14 fs-2hx"></i>
                  </button>
                  <Link to="/">
                    <img
                      alt="Logo"
                      src="/assets/media/logos/landing.svg"
                      className="logo-default h-25px h-lg-30px"
                    />
                    <img
                      alt="Logo"
                      src="/assets/media/logos/landing-dark.svg"
                      className="logo-sticky h-20px h-lg-25px"
                    />
                  </Link>
                </div>
                <div className="d-lg-block" id="kt_header_nav_wrapper">
                  <div
                    className="d-lg-block p-5 p-lg-0"
                    data-kt-drawer="true"
                    data-kt-drawer-name="landing-menu"
                    data-kt-drawer-activate="{default: true, lg: false}"
                    data-kt-drawer-overlay="true"
                    data-kt-drawer-width="200px"
                    data-kt-drawer-direction="start"
                    data-kt-drawer-toggle="#kt_landing_menu_toggle"
                    data-kt-swapper="true"
                    data-kt-swapper-mode="prepend"
                    data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav_wrapper'}"
                  >
                    <div
                      className="menu menu-column flex-nowrap menu-rounded menu-lg-row menu-title-gray-600 menu-state-title-primary nav nav-flush fs-5 fw-semibold"
                      id="kt_landing_menu"
                    >
                      <div className="menu-item">
                        <span
                          className={`menu-link nav-link ${
                            activelink === "kt_app_root" ? "active" : ""
                          } py-3 px-4 px-xxl-6`}
                          onClick={() => scrollToDiv("kt_app_root")}
                        >
                          Home
                        </span>
                      </div>
                      <div className="menu-item">
                        <span
                          className={`menu-link nav-link ${
                            activelink === "how-it-works" ? "active" : ""
                          } py-3 px-4 px-xxl-6`}
                          onClick={() => scrollToDiv("how-it-works")}
                        >
                          How it Works
                        </span>
                      </div>
                      <div className="menu-item">
                        <span
                          className={`menu-link nav-link ${
                            activelink === "achievements" ? "active" : ""
                          } py-3 px-4 px-xxl-6`}
                          onClick={() => scrollToDiv("achievements")}
                        >
                          Achievements
                        </span>
                      </div>
                      <div className="menu-item">
                        <span
                          className={`menu-link nav-link ${
                            activelink === "team" ? "active" : ""
                          } py-3 px-4 px-xxl-6`}
                          onClick={() => scrollToDiv("team")}
                        >
                          Team
                        </span>
                      </div>
                      <div className="menu-item">
                        <span
                          className={`menu-link nav-link ${
                            activelink === "portfolio" ? "active" : ""
                          } py-3 px-4 px-xxl-6`}
                          onClick={() => scrollToDiv("portfolio")}
                        >
                          Portfolio
                        </span>
                      </div>
                      <div className="menu-item">
                        <span
                          className={`menu-link nav-link ${
                            activelink === "pricing" ? "active" : ""
                          } py-3 px-4 px-xxl-6`}
                          onClick={() => scrollToDiv("pricing")}
                        >
                          Pricing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-equal text-end ms-1">
                  <Link to="/login" className="btn btn-success">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column flex-center w-100 min-h-350px min-h-lg-500px px-9">
            <div className="text-center mb-5 mb-lg-10 py-10 py-lg-20">
              <h1 className="text-white lh-base fw-bold fs-2x fs-lg-3x mb-15">
                Build An Outstanding Solutions
                <br />
                with
                <span
                  style={{
                    background:
                      "linear-gradient(to right, #12CE5D 0%, #FFD80C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  <span id="kt_landing_hero_text">The Best Theme Ever</span>
                </span>
              </h1>
              <Link to="/" className="btn btn-primary">
                Try iServ
              </Link>
            </div>
            <div className="d-flex flex-center flex-wrap position-relative px-5">
              <div
                className="d-flex flex-center m-3 m-md-6"
                data-bs-toggle="tooltip"
                title="Fujifilm"
              >
                <img
                  src="/assets/media/svg/brand-logos/fujifilm.svg"
                  className="mh-30px mh-lg-40px"
                  alt=""
                />
              </div>
              <div
                className="d-flex flex-center m-3 m-md-6"
                data-bs-toggle="tooltip"
                title="Vodafone"
              >
                <img
                  src="/assets/media/svg/brand-logos/vodafone.svg"
                  className="mh-30px mh-lg-40px"
                  alt=""
                />
              </div>
              <div
                className="d-flex flex-center m-3 m-md-6"
                data-bs-toggle="tooltip"
                title="KPMG International"
              >
                <img
                  src="/assets/media/svg/brand-logos/kpmg.svg"
                  className="mh-30px mh-lg-40px"
                  alt=""
                />
              </div>
              <div
                className="d-flex flex-center m-3 m-md-6"
                data-bs-toggle="tooltip"
                title="Nasa"
              >
                <img
                  src="/assets/media/svg/brand-logos/nasa.svg"
                  className="mh-30px mh-lg-40px"
                  alt=""
                />
              </div>
              <div
                className="d-flex flex-center m-3 m-md-6"
                data-bs-toggle="tooltip"
                title="Aspnetzero"
              >
                <img
                  src="/assets/media/svg/brand-logos/aspnetzero.svg"
                  className="mh-30px mh-lg-40px"
                  alt=""
                />
              </div>
              <div
                className="d-flex flex-center m-3 m-md-6"
                data-bs-toggle="tooltip"
                title="AON - Empower Results"
              >
                <img
                  src="/assets/media/svg/brand-logos/aon.svg"
                  className="mh-30px mh-lg-40px"
                  alt=""
                />
              </div>
              <div
                className="d-flex flex-center m-3 m-md-6"
                data-bs-toggle="tooltip"
                title="Hewlett-Packard"
              >
                <img
                  src="/assets/media/svg/brand-logos/hp-3.svg"
                  className="mh-30px mh-lg-40px"
                  alt=""
                />
              </div>
              <div
                className="d-flex flex-center m-3 m-md-6"
                data-bs-toggle="tooltip"
                title="Truman"
              >
                <img
                  src="/assets/media/svg/brand-logos/truman.svg"
                  className="mh-30px mh-lg-40px"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="landing-curve landing-dark-color mb-10 mb-lg-20">
          <svg
            viewBox="15 12 1470 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 11C3.93573 11.3356 7.85984 11.6689 11.7725 12H1488.16C1492.1 11.6689 1496.04 11.3356 1500 11V12H1488.16C913.668 60.3476 586.282 60.6117 11.7725 12H0V11Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <div className="mb-n10 mb-lg-n20 z-index-2">
        <div className="container">
          <div className="text-center mb-17">
            <h3
              className="fs-2hx text-gray-900 mb-5"
              id="how-it-works"
              data-kt-scroll-offset="{default: 100, lg: 150}"
            >
              How it Works
            </h3>
            <div className="fs-5 text-muted fw-bold">
              Save thousands to millions of bucks by using single tool
              <br />
              for different amazing and great useful admin
            </div>
          </div>
          <div className="row w-100 gy-10 mb-md-20">
            <div className="col-md-4 px-5">
              <div className="text-center mb-10 mb-md-0">
                <img
                  src="/assets/media/illustrations/sketchy-1/2.png"
                  className="mh-125px mb-9"
                  alt=""
                />
                <div className="d-flex flex-center mb-5">
                  <span className="badge badge-circle badge-light-success fw-bold p-5 me-3 fs-3">
                    1
                  </span>
                  <div className="fs-5 fs-lg-3 fw-bold text-gray-900">
                    Jane Miller
                  </div>
                </div>
                <div className="fw-semibold fs-6 fs-lg-4 text-muted">
                  Save thousands to millions of bucks
                  <br />
                  by using single tool for different
                  <br />
                  amazing and great
                </div>
              </div>
            </div>
            <div className="col-md-4 px-5">
              <div className="text-center mb-10 mb-md-0">
                <img
                  src="/assets/media/illustrations/sketchy-1/8.png"
                  className="mh-125px mb-9"
                  alt=""
                />
                <div className="d-flex flex-center mb-5">
                  <span className="badge badge-circle badge-light-success fw-bold p-5 me-3 fs-3">
                    2
                  </span>
                  <div className="fs-5 fs-lg-3 fw-bold text-gray-900">
                    Setup Your App
                  </div>
                </div>
                <div className="fw-semibold fs-6 fs-lg-4 text-muted">
                  Save thousands to millions of bucks
                  <br />
                  by using single tool for different
                  <br />
                  amazing and great
                </div>
              </div>
            </div>
            <div className="col-md-4 px-5">
              <div className="text-center mb-10 mb-md-0">
                <img
                  src="/assets/media/illustrations/sketchy-1/12.png"
                  className="mh-125px mb-9"
                  alt=""
                />
                <div className="d-flex flex-center mb-5">
                  <span className="badge badge-circle badge-light-success fw-bold p-5 me-3 fs-3">
                    3
                  </span>
                  <div className="fs-5 fs-lg-3 fw-bold text-gray-900">
                    Enjoy Nautica App
                  </div>
                </div>
                <div className="fw-semibold fs-6 fs-lg-4 text-muted">
                  Save thousands to millions of bucks
                  <br />
                  by using single tool for different
                  <br />
                  amazing and great
                </div>
              </div>
            </div>
          </div>
          <div className="tns tns-default">
            <div
              data-tns="true"
              data-tns-loop="true"
              data-tns-swipe-angle="false"
              data-tns-speed="2000"
              data-tns-autoplay="true"
              data-tns-autoplay-timeout="18000"
              data-tns-controls="true"
              data-tns-nav="false"
              data-tns-items="1"
              data-tns-center="false"
              data-tns-dots="false"
              data-tns-prev-button="#kt_team_slider_prev1"
              data-tns-next-button="#kt_team_slider_next1"
            >
              <div className="text-center px-5 pt-5 pt-lg-10 px-lg-10">
                <img
                  src="/assets/media/preview/demos/demo1/light-ltr.png"
                  className="card-rounded shadow mh-lg-650px mw-100"
                  alt=""
                />
              </div>
              <div className="text-center px-5 pt-5 pt-lg-10 px-lg-10">
                <img
                  src="/assets/media/preview/demos/demo2/light-ltr.png"
                  className="card-rounded shadow mh-lg-650px mw-100"
                  alt=""
                />
              </div>
              <div className="text-center px-5 pt-5 pt-lg-10 px-lg-10">
                <img
                  src="/assets/media/preview/demos/demo4/light-ltr.png"
                  className="card-rounded shadow mh-lg-650px mw-100"
                  alt=""
                />
              </div>
              <div className="text-center px-5 pt-5 pt-lg-10 px-lg-10">
                <img
                  src="/assets/media/preview/demos/demo5/light-ltr.png"
                  className="card-rounded shadow mh-lg-650px mw-100"
                  alt=""
                />
              </div>
            </div>
            <button
              className="btn btn-icon btn-active-color-primary"
              id="kt_team_slider_prev1"
            >
              <i className="ki-outline ki-left fs-2x"></i>
            </button>
            <button
              className="btn btn-icon btn-active-color-primary"
              id="kt_team_slider_next1"
            >
              <i className="ki-outline ki-right fs-2x"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-sm-n10">
        <div className="landing-curve landing-dark-color">
          <svg
            viewBox="15 -1 1470 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 48C4.93573 47.6644 8.85984 47.3311 12.7725 47H1489.16C1493.1 47.3311 1497.04 47.6644 1501 48V47H1489.16C914.668 -1.34764 587.282 -1.61174 12.7725 47H1V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div className="pb-15 pt-18 landing-dark-bg">
          <div className="container">
            <div
              className="text-center mt-15 mb-18"
              id="achievements"
              data-kt-scroll-offset="{default: 100, lg: 150}"
            >
              <h3 className="fs-2hx text-white fw-bold mb-5">
                We Make Things Better
              </h3>
              <div className="fs-5 text-gray-700 fw-bold">
                Save thousands to millions of bucks by using single tool
                <br />
                for different amazing and great useful admin
              </div>
            </div>
            <div className="d-flex flex-center">
              <div className="d-flex flex-wrap flex-center justify-content-lg-between mb-15 mx-auto w-xl-900px">
                <div
                  className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain"
                  style={{
                    backgroundImage: `url('/assets/media/svg/misc/octagon.svg')`,
                  }}
                >
                  <i className="ki-outline ki-element-11 fs-2tx text-white mb-3"></i>
                  <div className="mb-0">
                    <div className="fs-lg-2hx fs-2x fw-bold text-white d-flex flex-center">
                      <div
                        className="min-w-70px"
                        data-kt-countup="true"
                        data-kt-countup-value="700"
                        data-kt-countup-suffix="+"
                      >
                        0
                      </div>
                    </div>
                    <span className="text-gray-600 fw-semibold fs-5 lh-0">
                      Known Companies
                    </span>
                  </div>
                </div>
                <div
                  className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain"
                  style={{
                    backgroundImage: `url('/assets/media/svg/misc/octagon.svg')`,
                  }}
                >
                  <i className="ki-outline ki-chart-pie-4 fs-2tx text-white mb-3"></i>
                  <div className="mb-0">
                    <div className="fs-lg-2hx fs-2x fw-bold text-white d-flex flex-center">
                      <div
                        className="min-w-70px"
                        data-kt-countup="true"
                        data-kt-countup-value="80"
                        data-kt-countup-suffix="K+"
                      >
                        0
                      </div>
                    </div>
                    <span className="text-gray-600 fw-semibold fs-5 lh-0">
                      Statistic Reports
                    </span>
                  </div>
                </div>
                <div
                  className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain"
                  style={{
                    backgroundImage: `url('/assets/media/svg/misc/octagon.svg')`,
                  }}
                >
                  <i className="ki-outline ki-basket fs-2tx text-white mb-3"></i>
                  <div className="mb-0">
                    <div className="fs-lg-2hx fs-2x fw-bold text-white d-flex flex-center">
                      <div
                        className="min-w-70px"
                        data-kt-countup="true"
                        data-kt-countup-value="35"
                        data-kt-countup-suffix="M+"
                      >
                        0
                      </div>
                    </div>
                    <span className="text-gray-600 fw-semibold fs-5 lh-0">
                      Secure Payments
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="fs-2 fw-semibold text-muted text-center mb-3">
              <span className="fs-1 lh-1 text-gray-700">“</span>When you care
              about your topic, you’ll write about it in a
              <br />
              <span className="text-gray-700 me-1">more powerful</span>,
              emotionally expressive way
              <span className="fs-1 lh-1 text-gray-700">“</span>
            </div>
            <div className="fs-2 fw-semibold text-muted text-center">
              <Link to="/" className="link-primary fs-4 fw-bold">
                Marcus Levy,
              </Link>
              <span className="fs-4 fw-bold text-gray-600">KeenThemes CEO</span>
            </div>
          </div>
        </div>
        <div className="landing-curve landing-dark-color">
          <svg
            viewBox="15 12 1470 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 11C3.93573 11.3356 7.85984 11.6689 11.7725 12H1488.16C1492.1 11.6689 1496.04 11.3356 1500 11V12H1488.16C913.668 60.3476 586.282 60.6117 11.7725 12H0V11Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <div className="py-10 py-lg-20">
        <div className="container">
          <div className="text-center mb-12">
            <h3
              className="fs-2hx text-gray-900 mb-5"
              id="team"
              data-kt-scroll-offset="{default: 100, lg: 150}"
            >
              Our Great Team
            </h3>
            <div className="fs-5 text-muted fw-bold">
              It’s no doubt that when a development takes longer to complete,
              additional costs to
              <br />
              integrate and test each extra feature creeps up and haunts most of
              us.
            </div>
          </div>
          <div className="tns tns-default" style={{ direction: "ltr" }}>
            <div
              data-tns="true"
              data-tns-loop="true"
              data-tns-swipe-angle="false"
              data-tns-speed="2000"
              data-tns-autoplay="true"
              data-tns-autoplay-timeout="18000"
              data-tns-controls="true"
              data-tns-nav="false"
              data-tns-items="1"
              data-tns-center="false"
              data-tns-dots="false"
              data-tns-prev-button="#kt_team_slider_prev"
              data-tns-next-button="#kt_team_slider_next"
              data-tns-responsive="{1200: {items: 3}, 992: {items: 2}}"
            >
              <div className="text-center">
                <div
                  className="octagon mx-auto mb-5 d-flex w-200px h-200px bgi-no-repeat bgi-size-contain bgi-position-center"
                  style={{
                    backgroundImage: `url('/assets/media/avatars/300-1.jpg')`,
                  }}
                ></div>
                <div className="mb-0">
                  <Link
                    to="/"
                    className="text-gray-900 fw-bold text-hover-primary fs-3"
                  >
                    Paul Miles
                  </Link>
                  <div className="text-muted fs-6 fw-semibold mt-1">
                    Development Lead
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div
                  className="octagon mx-auto mb-5 d-flex w-200px h-200px bgi-no-repeat bgi-size-contain bgi-position-center"
                  style={{
                    backgroundImage: `url('/assets/media/avatars/300-2.jpg')`,
                  }}
                ></div>
                <div className="mb-0">
                  <Link
                    to="/"
                    className="text-gray-900 fw-bold text-hover-primary fs-3"
                  >
                    Melisa Marcus
                  </Link>
                  <div className="text-muted fs-6 fw-semibold mt-1">
                    Creative Director
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div
                  className="octagon mx-auto mb-5 d-flex w-200px h-200px bgi-no-repeat bgi-size-contain bgi-position-center"
                  style={{
                    backgroundImage: `url('/assets/media/avatars/300-5.jpg')`,
                  }}
                ></div>
                <div className="mb-0">
                  <Link
                    to="/"
                    className="text-gray-900 fw-bold text-hover-primary fs-3"
                  >
                    David Nilson
                  </Link>
                  <div className="text-muted fs-6 fw-semibold mt-1">
                    Python Expert
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div
                  className="octagon mx-auto mb-5 d-flex w-200px h-200px bgi-no-repeat bgi-size-contain bgi-position-center"
                  style={{
                    backgroundImage: `url('/assets/media/avatars/300-20.jpg')`,
                  }}
                ></div>
                <div className="mb-0">
                  <Link
                    to="/"
                    className="text-gray-900 fw-bold text-hover-primary fs-3"
                  >
                    Anne Clarc
                  </Link>
                  <div className="text-muted fs-6 fw-semibold mt-1">
                    Project Manager
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div
                  className="octagon mx-auto mb-5 d-flex w-200px h-200px bgi-no-repeat bgi-size-contain bgi-position-center"
                  style={{
                    backgroundImage: `url('/assets/media/avatars/300-23.jpg')`,
                  }}
                ></div>
                <div className="mb-0">
                  <Link
                    to="/"
                    className="text-gray-900 fw-bold text-hover-primary fs-3"
                  >
                    Ricky Hunt
                  </Link>
                  <div className="text-muted fs-6 fw-semibold mt-1">
                    Art Director
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div
                  className="octagon mx-auto mb-5 d-flex w-200px h-200px bgi-no-repeat bgi-size-contain bgi-position-center"
                  style={{
                    backgroundImage: `url('/assets/media/avatars/300-12.jpg')`,
                  }}
                ></div>
                <div className="mb-0">
                  <Link
                    to="/"
                    className="text-gray-900 fw-bold text-hover-primary fs-3"
                  >
                    Alice Wayde
                  </Link>
                  <div className="text-muted fs-6 fw-semibold mt-1">
                    Marketing Manager
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div
                  className="octagon mx-auto mb-5 d-flex w-200px h-200px bgi-no-repeat bgi-size-contain bgi-position-center"
                  style={{
                    backgroundImage: `url('/assets/media/avatars/300-9.jpg')`,
                  }}
                ></div>
                <div className="mb-0">
                  <Link
                    to="/"
                    className="text-gray-900 fw-bold text-hover-primary fs-3"
                  >
                    Carles Puyol
                  </Link>
                  <div className="text-muted fs-6 fw-semibold mt-1">
                    QA Managers
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btn btn-icon btn-active-color-primary"
              id="kt_team_slider_prev"
            >
              <i className="ki-outline ki-left fs-2x"></i>
            </button>
            <button
              className="btn btn-icon btn-active-color-primary"
              id="kt_team_slider_next"
            >
              <i className="ki-outline ki-right fs-2x"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="mb-lg-n15 position-relative z-index-2">
        <div className="container">
          <div
            className="card"
            style={{
              filter: "drop-shadow(0px 0px 40px rgba(68, 81, 96, 0.08))",
            }}
          >
            <div className="card-body p-lg-20">
              <div className="text-center mb-5 mb-lg-10">
                <h3
                  className="fs-2hx text-gray-900 mb-5"
                  id="portfolio"
                  data-kt-scroll-offset="{default: 100, lg: 250}"
                >
                  Our Projects
                </h3>
              </div>
              <div className="d-flex flex-center mb-5 mb-lg-15">
                <ul className="nav border-transparent flex-center fs-5 fw-bold">
                  <li className="nav-item">
                    <Link
                      className="nav-link text-gray-500 text-active-primary px-3 px-lg-6 active"
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#kt_landing_projects_latest"
                    >
                      Latest
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-gray-500 text-active-primary px-3 px-lg-6"
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#kt_landing_projects_web_design"
                    >
                      Web Design
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-gray-500 text-active-primary px-3 px-lg-6"
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#kt_landing_projects_mobile_apps"
                    >
                      Mobile Apps
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-gray-500 text-active-primary px-3 px-lg-6"
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#kt_landing_projects_development"
                    >
                      Development
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="kt_landing_projects_latest"
                >
                  <div className="row g-10">
                    <div className="col-lg-6">
                      <Link
                        className="d-block card-rounded overlay h-lg-100"
                        data-fslightbox="lightbox-projects"
                        to="/assets/media/stock/600x600/img-23.jpg"
                      >
                        <div
                          className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-lg-100 min-h-250px"
                          style={{
                            backgroundImage: `url('/assets/media/stock/600x600/img-23.jpg')`,
                          }}
                        ></div>
                        <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                          <i className="ki-outline ki-eye fs-3x text-white"></i>
                        </div>
                      </Link>
                    </div>
                    <div className="col-lg-6">
                      <div className="row g-10 mb-10">
                        <div className="col-lg-6">
                          <Link
                            className="d-block card-rounded overlay"
                            data-fslightbox="lightbox-projects"
                            to="/assets/media/stock/600x600/img-22.jpg"
                          >
                            <div
                              className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                              style={{
                                backgroundImage: `url('/assets/media/stock/600x600/img-22.jpg')`,
                              }}
                            ></div>
                            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                              <i className="ki-outline ki-eye fs-3x text-white"></i>
                            </div>
                          </Link>
                        </div>
                        <div className="col-lg-6">
                          <Link
                            className="d-block card-rounded overlay"
                            data-fslightbox="lightbox-projects"
                            to="/assets/media/stock/600x600/img-21.jpg"
                          >
                            <div
                              className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                              style={{
                                backgroundImage: `url('/assets/media/stock/600x600/img-21.jpg')`,
                              }}
                            ></div>
                            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                              <i className="ki-outline ki-eye fs-3x text-white"></i>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <Link
                        className="d-block card-rounded overlay"
                        data-fslightbox="lightbox-projects"
                        to="/assets/media/stock/600x400/img-20.jpg"
                      >
                        <div
                          className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                          style={{
                            backgroundImage: `url('/assets/media/stock/600x600/img-20.jpg')`,
                          }}
                        ></div>
                        <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                          <i className="ki-outline ki-eye fs-3x text-white"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="kt_landing_projects_web_design"
                >
                  <div className="row g-10">
                    <div className="col-lg-6">
                      <Link
                        className="d-block card-rounded overlay h-lg-100"
                        data-fslightbox="lightbox-projects"
                        to="/assets/media/stock/600x600/img-11.jpg"
                      >
                        <div
                          className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-lg-100 min-h-250px"
                          style={{
                            backgroundImage: `url('/assets/media/stock/600x600/img-11.jpg')`,
                          }}
                        ></div>
                        <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                          <i className="ki-outline ki-eye fs-3x text-white"></i>
                        </div>
                      </Link>
                    </div>
                    <div className="col-lg-6">
                      <div className="row g-10 mb-10">
                        <div className="col-lg-6">
                          <Link
                            className="d-block card-rounded overlay"
                            data-fslightbox="lightbox-projects"
                            to="/assets/media/stock/600x600/img-12.jpg"
                          >
                            <div
                              className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                              style={{
                                backgroundImage: `url('/assets/media/stock/600x600/img-12.jpg')`,
                              }}
                            ></div>
                            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                              <i className="ki-outline ki-eye fs-3x text-white"></i>
                            </div>
                          </Link>
                        </div>
                        <div className="col-lg-6">
                          <Link
                            className="d-block card-rounded overlay"
                            data-fslightbox="lightbox-projects"
                            to="/assets/media/stock/600x600/img-21.jpg"
                          >
                            <div
                              className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                              style={{
                                backgroundImage: `url('/assets/media/stock/600x600/img-21.jpg')`,
                              }}
                            ></div>
                            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                              <i className="ki-outline ki-eye fs-3x text-white"></i>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <Link
                        className="d-block card-rounded overlay"
                        data-fslightbox="lightbox-projects"
                        to="/assets/media/stock/600x400/img-20.jpg"
                      >
                        <div
                          className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                          style={{
                            backgroundImage: `url('/assets/media/stock/600x600/img-20.jpg')`,
                          }}
                        ></div>
                        <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                          <i className="ki-outline ki-eye fs-3x text-white"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="kt_landing_projects_mobile_apps"
                >
                  <div className="row g-10">
                    <div className="col-lg-6">
                      <div className="row g-10 mb-10">
                        <div className="col-lg-6">
                          <Link
                            className="d-block card-rounded overlay"
                            data-fslightbox="lightbox-projects"
                            to="/assets/media/stock/600x600/img-16.jpg"
                          >
                            <div
                              className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                              style={{
                                backgroundImage: `url('/assets/media/stock/600x600/img-16.jpg')`,
                              }}
                            ></div>
                            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                              <i className="ki-outline ki-eye fs-3x text-white"></i>
                            </div>
                          </Link>
                        </div>
                        <div className="col-lg-6">
                          <Link
                            className="d-block card-rounded overlay"
                            data-fslightbox="lightbox-projects"
                            to="/assets/media/stock/600x600/img-12.jpg"
                          >
                            <div
                              className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                              style={{
                                backgroundImage: `url('/assets/media/stock/600x600/img-12.jpg')`,
                              }}
                            ></div>
                            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                              <i className="ki-outline ki-eye fs-3x text-white"></i>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <Link
                        className="d-block card-rounded overlay"
                        data-fslightbox="lightbox-projects"
                        to="/assets/media/stock/600x400/img-15.jpg"
                      >
                        <div
                          className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                          style={{
                            backgroundImage: `url('/assets/media/stock/600x600/img-15.jpg')`,
                          }}
                        ></div>
                        <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                          <i className="ki-outline ki-eye fs-3x text-white"></i>
                        </div>
                      </Link>
                    </div>
                    <div className="col-lg-6">
                      <Link
                        className="d-block card-rounded overlay h-lg-100"
                        data-fslightbox="lightbox-projects"
                        to="/assets/media/stock/600x600/img-23.jpg"
                      >
                        <div
                          className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-lg-100 min-h-250px"
                          style={{
                            backgroundImage: `url('/assets/media/stock/600x600/img-23.jpg')`,
                          }}
                        ></div>
                        <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                          <i className="ki-outline ki-eye fs-3x text-white"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="kt_landing_projects_development"
                >
                  <div className="row g-10">
                    <div className="col-lg-6">
                      <Link
                        className="d-block card-rounded overlay h-lg-100"
                        data-fslightbox="lightbox-projects"
                        to="/assets/media/stock/600x600/img-15.jpg"
                      >
                        <div
                          className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-lg-100 min-h-250px"
                          style={{
                            backgroundImage: `url('/assets/media/stock/600x600/img-15.jpg')`,
                          }}
                        ></div>
                        <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                          <i className="ki-outline ki-eye fs-3x text-white"></i>
                        </div>
                      </Link>
                    </div>
                    <div className="col-lg-6">
                      <div className="row g-10 mb-10">
                        <div className="col-lg-6">
                          <Link
                            className="d-block card-rounded overlay"
                            data-fslightbox="lightbox-projects"
                            to="/assets/media/stock/600x600/img-22.jpg"
                          >
                            <div
                              className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                              style={{
                                backgroundImage: `url('/assets/media/stock/600x600/img-22.jpg')`,
                              }}
                            ></div>
                            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                              <i className="ki-outline ki-eye fs-3x text-white"></i>
                            </div>
                          </Link>
                        </div>
                        <div className="col-lg-6">
                          <Link
                            className="d-block card-rounded overlay"
                            data-fslightbox="lightbox-projects"
                            to="/assets/media/stock/600x600/img-21.jpg"
                          >
                            <div
                              className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                              style={{
                                backgroundImage: `url('/assets/media/stock/600x600/img-21.jpg')`,
                              }}
                            ></div>
                            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                              <i className="ki-outline ki-eye fs-3x text-white"></i>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <Link
                        className="d-block card-rounded overlay"
                        data-fslightbox="lightbox-projects"
                        to="/assets/media/stock/600x400/img-14.jpg"
                      >
                        <div
                          className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-250px"
                          style={{
                            backgroundImage: `url('/assets/media/stock/600x600/img-14.jpg')`,
                          }}
                        ></div>
                        <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                          <i className="ki-outline ki-eye fs-3x text-white"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-sm-n20">
        <div className="landing-curve landing-dark-color">
          <svg
            viewBox="15 -1 1470 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 48C4.93573 47.6644 8.85984 47.3311 12.7725 47H1489.16C1493.1 47.3311 1497.04 47.6644 1501 48V47H1489.16C914.668 -1.34764 587.282 -1.61174 12.7725 47H1V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div className="py-20 landing-dark-bg">
          <div className="container">
            <div className="d-flex flex-column container pt-lg-20">
              <div className="mb-13 text-center">
                <h1
                  className="fs-2hx fw-bold text-white mb-5"
                  id="pricing"
                  data-kt-scroll-offset="{default: 100, lg: 150}"
                >
                  Clear Pricing Makes it Easy
                </h1>
                <div className="text-gray-600 fw-semibold fs-5">
                  Save thousands to millions of bucks by using single tool for
                  different
                  <br />
                  amazing and outstanding cool and great useful admin
                </div>
              </div>
              <div className="text-center" id="kt_pricing">
                <div
                  className="nav-group landing-dark-bg d-inline-flex mb-15"
                  data-kt-buttons="true"
                  style={{ border: "1px dashed #2B4666" }}
                >
                  <Link
                    to="#"
                    className="btn btn-color-gray-600 btn-active btn-active-success px-6 py-3 me-2 active"
                    data-kt-plan="month"
                  >
                    Monthly
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-color-gray-600 btn-active btn-active-success px-6 py-3"
                    data-kt-plan="annual"
                  >
                    Annual
                  </Link>
                </div>
                <div className="row g-10">
                  <div className="col-xl-4">
                    <div className="d-flex h-100 align-items-center">
                      <div className="w-100 d-flex flex-column flex-center rounded-3 bg-body py-15 px-10">
                        <div className="mb-7 text-center">
                          <h1 className="text-gray-900 mb-5 fw-boldest">
                            Startup
                          </h1>
                          <div className="text-gray-500 fw-semibold mb-5">
                            Best Settings for Startups
                          </div>
                          <div className="text-center">
                            <span className="mb-2 text-primary">$</span>
                            <span
                              className="fs-3x fw-bold text-primary"
                              data-kt-plan-price-month="99"
                              data-kt-plan-price-annual="999"
                            >
                              99
                            </span>
                            <span
                              className="fs-7 fw-semibold opacity-50"
                              data-kt-plan-price-month="/ Mon"
                              data-kt-plan-price-annual="/ Ann"
                            >
                              / Mon
                            </span>
                          </div>
                        </div>
                        <div className="w-100 mb-10">
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-gray-800 text-start pe-3">
                              Up to 10 Active Users
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-success"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-gray-800 text-start pe-3">
                              Up to 30 Project Integrations
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-success"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-gray-800">
                              Keen Analytics Platform
                            </span>
                            <i className="ki-outline ki-cross-circle fs-1"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-gray-800">
                              Targets Timelines & Files
                            </span>
                            <i className="ki-outline ki-cross-circle fs-1"></i>
                          </div>
                          <div className="d-flex flex-stack">
                            <span className="fw-semibold fs-6 text-gray-800">
                              Unlimited Projects
                            </span>
                            <i className="ki-outline ki-cross-circle fs-1"></i>
                          </div>
                        </div>
                        <Link to="/" className="btn btn-primary">
                          Select
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4">
                    <div className="d-flex h-100 align-items-center">
                      <div className="w-100 d-flex flex-column flex-center rounded-3 bg-primary py-20 px-10">
                        <div className="mb-7 text-center">
                          <h1 className="text-white mb-5 fw-boldest">
                            Business
                          </h1>
                          <div className="text-white opacity-75 fw-semibold mb-5">
                            Best Settings for Business
                          </div>
                          <div className="text-center">
                            <span className="mb-2 text-white">$</span>
                            <span
                              className="fs-3x fw-bold text-white"
                              data-kt-plan-price-month="199"
                              data-kt-plan-price-annual="1999"
                            >
                              199
                            </span>
                            <span
                              className="fs-7 fw-semibold text-white opacity-75"
                              data-kt-plan-price-month="/ Mon"
                              data-kt-plan-price-annual="/ Ann"
                            >
                              / Mon
                            </span>
                          </div>
                        </div>
                        <div className="w-100 mb-10">
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-white opacity-75 text-start pe-3">
                              Up to 10 Active Users
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-white"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-white opacity-75 text-start pe-3">
                              Up to 30 Project Integrations
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-white"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-white opacity-75 text-start pe-3">
                              Keen Analytics Platform
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-white"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-white opacity-75 text-start pe-3">
                              Targets Timelines & Files
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-white"></i>
                          </div>
                          <div className="d-flex flex-stack">
                            <span className="fw-semibold fs-6 text-white opacity-75">
                              Unlimited Projects
                            </span>
                            <i className="ki-outline ki-cross-circle fs-1 text-white"></i>
                          </div>
                        </div>
                        <Link
                          to="#"
                          className="btn btn-color-primary btn-active-light-primary btn-light"
                        >
                          Select
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4">
                    <div className="d-flex h-100 align-items-center">
                      <div className="w-100 d-flex flex-column flex-center rounded-3 bg-body py-15 px-10">
                        <div className="mb-7 text-center">
                          <h1 className="text-gray-900 mb-5 fw-boldest">
                            Enterprise
                          </h1>
                          <div className="text-gray-500 fw-semibold mb-5">
                            Best Settings for Enterprise
                          </div>
                          <div className="text-center">
                            <span className="mb-2 text-primary">$</span>
                            <span
                              className="fs-3x fw-bold text-primary"
                              data-kt-plan-price-month="999"
                              data-kt-plan-price-annual="9999"
                            >
                              999
                            </span>
                            <span
                              className="fs-7 fw-semibold opacity-50"
                              data-kt-plan-price-month="/ Mon"
                              data-kt-plan-price-annual="/ Ann"
                            >
                              / Mon
                            </span>
                          </div>
                        </div>
                        <div className="w-100 mb-10">
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-gray-800 text-start pe-3">
                              Up to 10 Active Users
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-success"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-gray-800 text-start pe-3">
                              Up to 30 Project Integrations
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-success"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-gray-800 text-start pe-3">
                              Keen Analytics Platform
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-success"></i>
                          </div>
                          <div className="d-flex flex-stack mb-5">
                            <span className="fw-semibold fs-6 text-gray-800 text-start pe-3">
                              Targets Timelines & Files
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-success"></i>
                          </div>
                          <div className="d-flex flex-stack">
                            <span className="fw-semibold fs-6 text-gray-800 text-start pe-3">
                              Unlimited Projects
                            </span>
                            <i className="ki-outline ki-check-circle fs-1 text-success"></i>
                          </div>
                        </div>
                        <Link to="#" className="btn btn-primary">
                          Select
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="landing-curve landing-dark-color">
          <svg
            viewBox="15 12 1470 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 11C3.93573 11.3356 7.85984 11.6689 11.7725 12H1488.16C1492.1 11.6689 1496.04 11.3356 1500 11V12H1488.16C913.668 60.3476 586.282 60.6117 11.7725 12H0V11Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <div className="mt-20 mb-n20 position-relative z-index-2">
        <div className="container">
          <div className="text-center mb-17">
            <h3
              className="fs-2hx text-gray-900 mb-5"
              id="clients"
              data-kt-scroll-offset="{default: 125, lg: 150}"
            >
              What Our Clients Say
            </h3>
            <div className="fs-5 text-muted fw-bold">
              Save thousands to millions of bucks by using single tool
              <br />
              for different amazing and great useful admin
            </div>
          </div>
          <div className="row g-lg-10 mb-10 mb-lg-20">
            <div className="col-lg-4">
              <div className="d-flex flex-column justify-content-between h-lg-100 px-10 px-lg-0 pe-lg-10 mb-15 mb-lg-0">
                <div className="mb-7">
                  <div className="rating mb-6">
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                  </div>
                  <div className="fs-2 fw-bold text-gray-900 mb-3">
                    This is by far the cleanest template
                    <br />
                    and the most well structured
                  </div>
                  <div className="text-gray-500 fw-semibold fs-4">
                    The most well thought out design theme I have ever used. The
                    codes are up to tandard. The css styles are very clean. In
                    fact the cleanest and the most up to standard I have ever
                    seen.
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-circle symbol-50px me-5">
                    <img
                      src="/assets/media/avatars/300-1.jpg"
                      className=""
                      alt=""
                    />
                  </div>
                  <div className="flex-grow-1">
                    <Link
                      to="#"
                      className="text-gray-900 fw-bold text-hover-primary fs-6"
                    >
                      Paul Miles
                    </Link>
                    <span className="text-muted d-block fw-bold">
                      Development Lead
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="d-flex flex-column justify-content-between h-lg-100 px-10 px-lg-0 pe-lg-10 mb-15 mb-lg-0">
                <div className="mb-7">
                  <div className="rating mb-6">
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                  </div>
                  <div className="fs-2 fw-bold text-gray-900 mb-3">
                    This is by far the cleanest template
                    <br />
                    and the most well structured
                  </div>
                  <div className="text-gray-500 fw-semibold fs-4">
                    The most well thought out design theme I have ever used. The
                    codes are up to tandard. The css styles are very clean. In
                    fact the cleanest and the most up to standard I have ever
                    seen.
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-circle symbol-50px me-5">
                    <img
                      src="/assets/media/avatars/300-2.jpg"
                      className=""
                      alt=""
                    />
                  </div>
                  <div className="flex-grow-1">
                    <Link
                      to="#"
                      className="text-gray-900 fw-bold text-hover-primary fs-6"
                    >
                      Janya Clebert
                    </Link>
                    <span className="text-muted d-block fw-bold">
                      Development Lead
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="d-flex flex-column justify-content-between h-lg-100 px-10 px-lg-0 pe-lg-10 mb-15 mb-lg-0">
                <div className="mb-7">
                  <div className="rating mb-6">
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                    <div className="rating-label me-2 checked">
                      <i className="ki-outline ki-star fs-5"></i>
                    </div>
                  </div>
                  <div className="fs-2 fw-bold text-gray-900 mb-3">
                    This is by far the cleanest template
                    <br />
                    and the most well structured
                  </div>
                  <div className="text-gray-500 fw-semibold fs-4">
                    The most well thought out design theme I have ever used. The
                    codes are up to tandard. The css styles are very clean. In
                    fact the cleanest and the most up to standard I have ever
                    seen.
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-circle symbol-50px me-5">
                    <img
                      src="/assets/media/avatars/300-16.jpg"
                      className=""
                      alt=""
                    />
                  </div>
                  <div className="flex-grow-1">
                    <Link
                      to="#"
                      className="text-gray-900 fw-bold text-hover-primary fs-6"
                    >
                      Steave Brown
                    </Link>
                    <span className="text-muted d-block fw-bold">
                      Development Lead
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex flex-stack flex-wrap flex-md-nowrap card-rounded shadow p-8 p-lg-12 mb-n5 mb-lg-n13"
            style={{
              background: "linear-gradient(90deg, #20AA3E 0%, #03A588 100%)",
            }}
          >
            <div className="my-2 me-5">
              <div className="fs-1 fs-lg-2qx fw-bold text-white mb-2">
                Start With Metronic Today,
                <span className="fw-normal">Speed Up Development!</span>
              </div>
              <div className="fs-6 fs-lg-5 text-white fw-semibold opacity-75">
                Join over 100,000 Professionals Community to Stay Ahead
              </div>
            </div>
            <Link
              to="/"
              className="btn btn-lg btn-outline border-2 btn-outline-white flex-shrink-0 my-2"
            >
              Purchase on Themeforest
            </Link>
          </div>
        </div>
      </div>
      <div className="mb-0">
        <div className="landing-curve landing-dark-color">
          <svg
            viewBox="15 -1 1470 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 48C4.93573 47.6644 8.85984 47.3311 12.7725 47H1489.16C1493.1 47.3311 1497.04 47.6644 1501 48V47H1489.16C914.668 -1.34764 587.282 -1.61174 12.7725 47H1V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div className="landing-dark-bg pt-20">
          <div className="landing-dark-separator"></div>
          <div className="container">
            <div className="d-flex flex-column flex-md-row flex-stack py-7 py-lg-10">
              <div className="d-flex align-items-center order-2 order-md-1">
                <Link to="/">
                  <img
                    alt="Logo"
                    src="assets/media/logos/landing.svg"
                    className="h-15px h-md-20px"
                  />
                </Link>
                <Link
                  className="mx-5 fs-6 fw-semibold text-gray-600 pt-1"
                  to="/"
                >
                  &copy; 2025 i-Serv Inc.
                </Link>
              </div>
              <ul className="menu menu-gray-600 menu-hover-primary fw-semibold fs-6 fs-md-5 order-1 mb-5 mb-md-0">
                <li className="menu-item">
                  <Link to="/" className="menu-link px-2">
                    About
                  </Link>
                </li>
                <li className="menu-item mx-5">
                  <Link to="/" className="menu-link px-2">
                    Support
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/" className="menu-link px-2">
                    Purchase
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div id="kt_scrolltop" className="scrolltop" data-kt-scrolltop="true">
        <i className="ki-outline ki-arrow-up"></i>
      </div>
    </div>
  );
}

export default Home;
