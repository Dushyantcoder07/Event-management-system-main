"use client";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
const defaultTestimonials = [
  {
    text: "Eventone revolutionized how we organize our tech conferences. The ticketing and scheduling features are flawless.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D4D03AQEAy6a-_JjNsA/profile-displayphoto-shrink_200_200/B4DZeMFLFjGgAg-/0/1750401857954?e=1767830400&v=beta&t=cbfAn8Dwtw61jTRGdOUqJ3ccUdOvvPTGNmXv-RPe7YE",
    name: "Gurjot Singh",
    username: "@gurjot_singh",
    role: "Event Organizer",
  },
  {
    text: "Finally an event platform that doesn't feel clunky. Eventone is sleek, fast, and our attendees loved the check-in process.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D5603AQE87KyOtsDTOA/profile-displayphoto-shrink_200_200/B56ZZJzooaH0Ac-/0/1744994995178?e=1767830400&v=beta&t=ohsn9TVm4Rqjd6wBRC_Fju6dbli7cjHEhnBeHvR_dBk",
    name: "Amanpreet Kaur",
    username: "@amanpreet_kaur",
    role: "Community Manager",
  },
  {
    text: "We managed 500+ attendees with zero hiccups. Eventone's dashboard gave us real-time insights that saved the day.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D5603AQEujuCOBChvzg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1726612370449?e=1767830400&v=beta&t=hT8d78EaEsfMy7fcLSqwae7s8eGfrlD7Ai138AWLOh0",
    name: "Simar Preet Singh",
    username: "@simar_preet_singh",
    role: "Conference Director",
  },
  {
    text: "Setting up our annual summit took minutes instead of days. Eventone handles everything from registration to post-event feedback.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D4E03AQEVsn2bajk1sw/profile-displayphoto-scale_200_200/B4EZlx7LLZKoAY-/0/1758552962331?e=1767830400&v=beta&t=fN6wqGrwwehwUizroEvwW9TuINV8P9wiHoNXz-SB2KU",
    name: "Tracy (Cui Wang) Wang",
    username: "@tracy_wang",
    role: "Meetup Host",
  },
  {
    text: "The best investment for our community meetups. Eventone makes it incredibly easy to manage RSVPs and communicate with members.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D4D03AQFg23agDGqOSQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1714443215504?e=1767830400&v=beta&t=1QIXvAm_A-c_pX0QOJx-0B4YZDkZuRfWKnMTLGmuH-g",
    name: "Vedant Gaidhanne",
    username: "@vedant_gaidhanne",
    role: "Event Planner",
  },
  {
    text: "Design is important to us, and Eventone looks beautiful out of the box. It matches our brand perfectly.",
    imageSrc: "https://media.licdn.com/dms/image/v2/D5603AQHRc9HyVl41QA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727866807803?e=1767830400&v=beta&t=2WQrCIKOupXZvVCb5fSPtWHeRCaLrMTF073OhZsCxBk",
    name: "Suraj Mani",
    username: "@suraj_mani",
    role: "Marketing Lead",
  },
];
export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
  title = "What our users say",
  subtitle = "From intimate meetups to global conferences, Eventone powers the world's most successful events.",
  autoplaySpeed = 3000,
  className,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplaySpeed);
    return () => {
      clearInterval(autoplay);
    };
  }, [emblaApi, autoplaySpeed]);
  const allTestimonials = [...testimonials, ...testimonials];
  return (
    <section
      className={cn("relative overflow-hidden py-16 md:py-24", className)}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_60%)]" />
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative mb-12 text-center md:mb-16">
          <h1 className="mb-4 text-3xl font-bold text-black md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <motion.p
            className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}>
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Testimonials carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="flex justify-center px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-border from-secondary/20 to-card relative h-full w-fit rounded-2xl border bg-gradient-to-b p-6 shadow-md backdrop-blur-sm">
                  {/* Enhanced decorative gradients */}
                  <div className="from-primary/15 to-card absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b blur-md" />
                  <div className="from-primary/10 absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-gradient-to-t to-transparent opacity-70 blur-xl" />

                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-primary mb-4">
                    <div className="relative">
                      <Quote className="h-10 w-10 -rotate-180" />
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-foreground/90 relative mb-6 text-base leading-relaxed">
                    <span className="relative">{testimonial.text}</span>
                  </motion.p>

                  {/* Enhanced user info with animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="border-border/40 mt-auto flex items-center gap-3 border-t pt-2">
                    <Avatar className="border-border ring-primary/10 ring-offset-background h-10 w-10 border ring-2 ring-offset-1">
                      <AvatarImage
                        src={testimonial.imageSrc}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="text-foreground font-medium whitespace-nowrap">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <p className="text-primary/80 text-sm whitespace-nowrap">
                          {testimonial.username}
                        </p>
                        {testimonial.role && (
                          <>
                            <span className="text-muted-foreground flex-shrink-0">
                              •
                            </span>
                            <p className="text-muted-foreground text-sm whitespace-nowrap">
                              {testimonial.role}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}