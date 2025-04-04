"use client";

import React from "react";
import { useApiContext } from "@/contexts/ApiContext";


export const ShowcaseSection = () => {
  const { fetchedData } = useApiContext();

  const { title, description, images } = fetchedData.homePage.sections.header;

  return (
    <section className="showcase">
      <div className="container">
        <h1 className="home-page text-5xl title mb-5">{title}</h1>
        <h3 className="description mb-10">{description}</h3>

        <div className="cover">
          <img className="max-w-[300px]" src={images[0].url} alt="" />
        </div>
      </div>
    </section>
  );
};

export const AboutSection = () => {
  const { fetchedData } = useApiContext();

  const { title, description, images } = fetchedData.homePage.sections.about;
  return (
    <section className="about bg-neutral-50">
      <div className="container">
        <h1 className="home-page text-5xl title mb-5">{title}</h1>
        <h3 className="description mb-10">
          {description}
        </h3>

        <div className="cover">
          <img className="max-w-[300px]" src={images[0].url} alt="" />
        </div>
      </div>
    </section>
  );
};

export const ServicesSection = () => {
  const { fetchedData } = useApiContext();

  const { title, description, images } = fetchedData.homePage.sections.services;
  return (
    <section className="services ">
      <div className="container">
        <h1 className="home-page text-3xl title mb-5">{title}</h1>
        <h3 className="description mb-10">{description}</h3>

        <div className="flex gap-10 flex-wrap">

          <img className="max-w-[300px]" src={images[0].url} alt="" />
          <img className="max-w-[300px]" src={images[1].url} alt="" />
          <img className="max-w-[300px]" src={images[2].url} alt="" />
        </div>
      </div>
    </section>
  );
};

export const ContactSection = () => {
  const { fetchedData } = useApiContext();

  const { title, description} = fetchedData.homePage.sections.contact;
  return (
    <section className="contact">
      <div className="container">
        <h1 className="home-page text-3xl title mb-5">{title}</h1>
        <h3 className="description mb-10">{description}</h3>

        <div className="max-w-[500px]">
          <input type="text" placeholder="Name" className="block border mb-5 px-3 py-2 w-full" />
          <input type="text" placeholder="Email" className="block border mb-5 px-3 py-2 w-full" />
          <button>Send</button>
        </div>
      </div>
    </section>
  );
};

export default function Content() {
  const { fetchedData } = useApiContext();

  const { isLoading } = fetchedData;
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <main className="home-page">
          <header>
            <nav className="bg-success text-white p-5 flex gap-10">
              <div className="logo">logo</div>
              <ul className="flex items-center gap-5  ml-auto">
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Contact</a>
              </ul>
            </nav>
          </header>
          <ShowcaseSection />
          <AboutSection />
          <ServicesSection />
          <ContactSection />
          <footer className="bg-black text-white">
            <nav className=" p-5 flex gap-10">
              <div className="logo">logo</div>
              <ul className="">
                <a href="#" className="block mb-2">
                  Home
                </a>
                <a href="#" className="block mb-2">
                  About
                </a>
                <a href="#" className="block mb-2">
                  Services
                </a>
                <a href="#" className="block mb-2">
                  Contact
                </a>
              </ul>
            </nav>
          </footer>
        </main>
      )}
    </>
  );
}

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};
