import React from 'react';
import Hero from "../components/mvpblocks/gradient-hero";
import Features from "../components/mvpblocks/feature-2";
import TestimonialsCarousel from "../components/mvpblocks/testimonials-carousel";
import FAQ from "../components/mvpblocks/faq-3";
import Sparkles from "../components/mvpblocks/sparkles-logo";

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <TestimonialsCarousel />
            <FAQ />
            <Sparkles />
        </>
    );
};

export default Home;
