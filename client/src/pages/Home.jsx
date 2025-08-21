import { React, useEffect } from "react";
import Navbar from "../components/NavBar";
import { useLocation, Link } from "react-router-dom";
import "../css/scroll.css"

export default function Home() {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash])

    return (
        <div id="home" className="min-h-screen bg-[#FFF8E1] text-gray-900 flex flex-col">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow mt-6 max-w-5xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <section className="bg-white rounded-lg shadow-lg p-6 sm:p-10 text-center">
                    <h1 className="text-xl sm:text-4xl font-extrabold text-[#ECAA00] mb-4">
                        Discover All Campus Events at Your Fingertips
                    </h1>
                    <p className="text-base sm:text-lg mb-8 text-gray-800">
                        Explore, add, and navigate upcoming events around campus with our
                        interactive map.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-[#ECAA00] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#CFA500] transition"
                    >
                        Explore the Map
                    </Link>
                </section>

                {/* Features Section */}
                <section className="mt-16 grid gap-8 sm:grid-cols-3">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#ECAA00] mb-2">
                            Interactive Map
                        </h3>
                        <p>Easily locate events by building or area on campus.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#ECAA00] mb-2">
                            Easy To Add Events
                        </h3>
                        <p>
                            Quickly post your event by submitting it through the CSULB <a target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" href="https://csulb.campuslabs.com/engage/events">Events & Orgs</a> page.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#ECAA00] mb-2">
                            Event Details
                        </h3>
                        <p>Click on any event for times, descriptions, and RSVP info.</p>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className=" mt-20 bg-white rounded-lg shadow-lg p-6 sm:p-10">
                    <h2 className="text-xl sm:text-3xl font-extrabold text-[#ECAA00] mb-6 text-center">
                        About CSULB Events
                    </h2>
                    <p className="max-w-3xl mx-auto text-center text-gray-800 text-base sm:text-lg leading-relaxed">
                        CSULBEvents is designed to help students, faculty, and visitors stay
                        connected with all the exciting activities happening around campus.
                        Our interactive map allows you to easily find events based on location,
                        date, and category, making it simple to discover and participate in
                        campus life. Whether you're looking for academic seminars, social
                        gatherings, or special performances, CSULBEvents brings the campus
                        community together in one convenient place.
                    </p>
                </section>

                <section id="contact" className="flex justify-center flex-col mt-20 bg-white rounded-lg shadow-lg p-6 sm:p-10">
                    <h2 className="text-xl sm:text-3xl font-extrabold text-[#ECAA00] mb-6 text-center">
                        Contact Me
                    </h2>
                    <div className="mb-6 text-center space-y-2">
                        <div className="w-full bg-gray-100 p-4 rounded-md text-gray-700">
                            <p className="text-sm sm:text-base">
                                Feel free to reach out via LinkedIn or email. 
                                I'm happy to connect and discuss projects, collaborations, 
                                or any questions you may have. (p.s this is a personal project, 
                                not affiliated with CSULB). <br/><br/>If you found any bugs, please contact me as well with info about the issue, this helps me to improve on the website.
                            </p>
                        </div>
                        <p className="text-sm sm:text-base">
                            LinkedIn:{" "}
                            <a
                                href="https://www.linkedin.com/in/maorbarzilay"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Maor Barzilay
                            </a>
                        </p>
                        <p className="text-sm sm:text-base">
                            Email:{" "}
                            <a target="_blank"
                                rel="noopener noreferrer"
                                href="mailto:maorbarzilay8@gmail.com"
                                className="text-blue-600 hover:underline"
                            >
                                maorbarzilay8@gmail.com
                            </a>
                        </p>
                        <p className="text-sm sm:text-base">
                            GitHub:{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://github.com/mawerb"
                                className="text-blue-600 hover:underline"
                            >
                                mawerb
                            </a>
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            {/*
        <p>
          &copy; 2025 CSULBEvents |{" "}
          <a href="#" className="underline hover:text-[#0088A9]">
            About
          </a>{" "}
          |{" "}
          <a href="#" className="underline hover:text-[#0088A9]">
            Contact
          </a>{" "}
          |{" "}
          <a href="#" className="underline hover:text-[#0088A9]">
            Privacy Policy
          </a>
        </p>
      </footer> */}
        </div>
    );
}