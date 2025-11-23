"use client";

import { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Home() {
  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // State for typing effect
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // State for cursor
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  // State for reviews
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState("");

  // Typing Effect Logic
  useEffect(() => {
    const words = ["Experiences", "Websites", "Applications"];
    const i = loopNum % words.length;
    const fullText = words[i];

    const handleTyping = () => {
      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 100 : 200);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  // Scroll Progress Logic
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Custom Cursor Logic
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;

        setTimeout(() => {
          if (followerRef.current) {
            followerRef.current.style.left = `${e.clientX}px`;
            followerRef.current.style.top = `${e.clientY}px`;
          }
        }, 50);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // Intersection Observer for Fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // EmailJS Init
  useEffect(() => {
    emailjs.init("MPz0VK-Yy_17MvWDG");
  }, []);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("Sending review...");

    // Save to Database
    try {
      const formData = new FormData(form.current!);
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          rating,
          message: formData.get("message"),
        }),
      });
    } catch (error) {
      console.error("Error saving review:", error);
    }

    // Send Email
    if (form.current) {
      emailjs
        .sendForm(
          "service_ffc0yoh",
          "template_kkjjowk",
          form.current,
          "MPz0VK-Yy_17MvWDG"
        )
        .then(
          () => {
            setFormStatus("Thank you for your review!");
            form.current?.reset();
            setRating(0);
          },
          (error) => {
            console.log(error.text);
            setFormStatus("Something went wrong! Check console.");
          }
        );
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Message sent!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  return (
    <main>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={followerRef}></div>
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress * 100}%` }}
      ></div>

      <nav className="navbar">
        <div className="logo">Adeen.</div>
        <div
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>
              About
            </a>
          </li>
          <li>
            <a href="#projects" onClick={() => setIsMenuOpen(false)}>
              Projects
            </a>
          </li>
          <li>
            <a href="#reviews" onClick={() => setIsMenuOpen(false)}>
              Reviews
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <h1 className="fade-in">
            Building Digital <span className="typing-text">{text}</span>
            <span className="cursor-blink">|</span>
          </h1>
          <p className="fade-in delay-1">
            I craft visually stunning and performant websites.
          </p>
          <a href="#projects" className="btn fade-in delay-2">
            View Work
          </a>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title fade-in">About Me</h2>
          <div className="about-content fade-in">
            <p>
              I am a passionate developer with a keen eye for design. I
              specialize in building modern web applications that not only work
              perfectly but look amazing.
            </p>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <h2 className="section-title fade-in">Selected Work</h2>
          <div className="project-grid">
            <ProjectCard
              title="E-Commerce Platform"
              desc="A modern shopping experience built with Next.js."
            />
            <ProjectCard
              title="Finance Dashboard"
              desc="Real-time data visualization for fintech."
              delay="delay-1"
            />
            <ProjectCard
              title="Social App"
              desc="Connecting people with shared interests."
              delay="delay-2"
            />
          </div>
        </div>
      </section>

      <section id="reviews" className="section">
        <div className="container">
          <h2 className="section-title fade-in">Leave a Review</h2>
          <div className="review-container fade-in">
            <form ref={form} onSubmit={sendEmail} className="review-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`star ${(hoverRating || rating) >= star ? "active" : ""
                        }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </i>
                  ))}
                </div>
                <input type="hidden" name="rating" value={rating} />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Review"
                  rows={4}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn">
                Submit Review
              </button>
              <p
                id="form-message"
                style={{
                  color: formStatus.includes("wrong")
                    ? "red"
                    : "var(--accent-color)",
                }}
              >
                {formStatus}
              </p>
            </form>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title fade-in">Get in Touch</h2>
          <form className="contact-form fade-in" onSubmit={handleContactSubmit}>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message" rows={5} required></textarea>
            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <footer>
        <p>&copy; 2024 Adeen. All rights reserved.</p>
      </footer>
    </main>
  );
}

function ProjectCard({
  title,
  desc,
  delay = "",
}: {
  title: string;
  desc: string;
  delay?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <div
      className={`project-card fade-in ${delay}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-image"></div>
      <div className="card-info">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}
