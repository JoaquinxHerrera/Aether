import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowDownRight,
  ArrowUpRight,
  MoveUpRight,
  Zap,
  Cpu,
  Activity,
  Gauge,
} from "lucide-react"
import OrbitScene from "./OrbitScene"

gsap.registerPlugin(ScrollTrigger)

function App() {
  const pageRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      /* =====================================================
         HERO
         ===================================================== */

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      })

      heroTimeline
        .from(".hero-label", {
          y: 30,
          opacity: 0,
          duration: 0.8,
        })
        .from(
          ".hero-title-line",
          {
            yPercent: 110,
            opacity: 0,
            duration: 1.2,
            stagger: 0.12,
          },
          "-=0.45"
        )
        .from(
          ".hero-description",
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ".hero-explore",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )

      gsap.to(".hero-glow-primary", {
        y: -180,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })

      gsap.to(".hero-glow-secondary", {
        y: -100,
        x: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      })

      /* =====================================================
         CUSTOM CURSOR
         ===================================================== */

      const cursorDot =
        document.querySelector<HTMLElement>(".cursor-dot")

      const cursorRing =
        document.querySelector<HTMLElement>(".cursor-ring")

      const cursorText =
        document.querySelector<HTMLElement>(".cursor-text")

      const canUseMouse =
        window.matchMedia("(hover: hover) and (pointer: fine)")
          .matches

      if (canUseMouse && cursorDot && cursorRing) {
        document.body.style.cursor = "none"

        const dotX = gsap.quickTo(cursorDot, "x", {
          duration: 0.08,
          ease: "power3.out",
        })

        const dotY = gsap.quickTo(cursorDot, "y", {
          duration: 0.08,
          ease: "power3.out",
        })

        const ringX = gsap.quickTo(cursorRing, "x", {
          duration: 0.45,
          ease: "power3.out",
        })

        const ringY = gsap.quickTo(cursorRing, "y", {
          duration: 0.45,
          ease: "power3.out",
        })

        const handleMouseMove = (event: MouseEvent) => {
          dotX(event.clientX)
          dotY(event.clientY)
          ringX(event.clientX)
          ringY(event.clientY)
        }

        window.addEventListener("mousemove", handleMouseMove)

        const interactiveElements =
          gsap.utils.toArray<HTMLElement>("[data-cursor]")

        interactiveElements.forEach((element) => {
          const type = element.dataset.cursor

          const enter = () => {
            if (type === "view") {
              gsap.to(cursorRing, {
                width: 78,
                height: 78,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.45)",
                duration: 0.35,
                ease: "power3.out",
              })

              if (cursorText) {
                gsap.to(cursorText, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.25,
                })
              }
            } else {
              gsap.to(cursorRing, {
                width: 58,
                height: 58,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: "rgba(103,232,249,0.6)",
                duration: 0.3,
                ease: "power3.out",
              })
            }

            gsap.to(cursorDot, {
              scale: 0.5,
              duration: 0.25,
            })
          }

          const leave = () => {
            gsap.to(cursorRing, {
              width: 34,
              height: 34,
              backgroundColor: "rgba(255,255,255,0)",
              borderColor: "rgba(255,255,255,0.35)",
              duration: 0.3,
              ease: "power3.out",
            })

            gsap.to(cursorDot, {
              scale: 1,
              duration: 0.25,
            })

            if (cursorText) {
              gsap.to(cursorText, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
              })
            }
          }

          element.addEventListener("mouseenter", enter)
          element.addEventListener("mouseleave", leave)
        })

        /* =================================================
           CURSOR TRAIL GLOW
           ================================================= */

        const cursorGlow =
          document.querySelector<HTMLElement>(".cursor-glow")

        if (cursorGlow) {
          const glowX = gsap.quickTo(cursorGlow, "x", {
            duration: 0.7,
            ease: "power3.out",
          })

          const glowY = gsap.quickTo(cursorGlow, "y", {
            duration: 0.7,
            ease: "power3.out",
          })

          const handleGlow = (event: MouseEvent) => {
            glowX(event.clientX)
            glowY(event.clientY)
          }

          window.addEventListener("mousemove", handleGlow)
        }
      }

      /* =====================================================
         SMART NAVBAR
         ===================================================== */

      const header = document.querySelector(".site-header")

      if (header) {
        let lastScroll = window.scrollY

        ScrollTrigger.create({
          start: 0,
          end: "max",

          onUpdate: (self) => {
            const currentScroll = self.scroll()
            const scrollingDown = currentScroll > lastScroll
            const hasScrolled = currentScroll > 40

            gsap.to(header, {
              backgroundColor: hasScrolled
                ? "rgba(8, 9, 10, 0.72)"
                : "rgba(8, 9, 10, 0)",

              backdropFilter: hasScrolled
                ? "blur(18px)"
                : "blur(0px)",

              borderBottomColor: hasScrolled
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,255,255,0)",

              duration: 0.35,
              overwrite: true,
            })

            if (currentScroll < 80) {
              gsap.to(header, {
                yPercent: 0,
                duration: 0.45,
                ease: "power3.out",
                overwrite: true,
              })
            } else if (scrollingDown) {
              gsap.to(header, {
                yPercent: -110,
                duration: 0.45,
                ease: "power3.out",
                overwrite: true,
              })
            } else {
              gsap.to(header, {
                yPercent: 0,
                duration: 0.45,
                ease: "power3.out",
                overwrite: true,
              })
            }

            lastScroll = currentScroll
          },
        })
      }

      /* =====================================================
         MAGNETIC INTERACTIONS
         ===================================================== */

      const magneticElements =
        gsap.utils.toArray<HTMLElement>("[data-magnetic]")

      magneticElements.forEach((element) => {
        const strength =
          Number(element.dataset.magneticStrength) || 0.18

        const handleMove = (event: MouseEvent) => {
          if (
            !window.matchMedia("(hover: hover) and (pointer: fine)")
              .matches
          ) {
            return
          }

          const rect = element.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2

          const deltaX = (event.clientX - centerX) * strength
          const deltaY = (event.clientY - centerY) * strength

          gsap.to(element, {
            x: deltaX,
            y: deltaY,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
          })
        }

        const handleLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            overwrite: true,
          })
        }

        element.addEventListener("mousemove", handleMove)
        element.addEventListener("mouseleave", handleLeave)
      })

      /* =====================================================
         ACTIVE NAVIGATION
         ===================================================== */

      const navLinks =
        gsap.utils.toArray<HTMLElement>(".site-nav-link")

      const sections = [
        {
          id: "manifesto",
          element: document.querySelector("#manifesto"),
        },
        {
          id: "technology",
          element: document.querySelector("#technology"),
        },
        {
          id: "experience",
          element: document.querySelector("#experience"),
        },
      ]

      const setActiveSection = (activeId: string) => {
        navLinks.forEach((link) => {
          const isActive = link.dataset.section === activeId
          const indicator = link.querySelector(".nav-indicator")

          gsap.to(link, {
            color: isActive
              ? "#ffffff"
              : "rgba(255,255,255,0.45)",
            duration: 0.3,
            overwrite: true,
          })

          if (indicator) {
            gsap.to(indicator, {
              width: isActive ? "100%" : "0%",
              duration: 0.3,
              ease: "power2.out",
              overwrite: true,
            })
          }
        })
      }

      sections.forEach(({ id, element }) => {
        if (!element) return

        ScrollTrigger.create({
          trigger: element,
          start: "top 45%",
          end: "bottom 45%",

          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        })
      })

      /* =====================================================
         MOBILE MENU
         ===================================================== */

      const mobileButton = document.querySelector(
        ".mobile-menu-button"
      )

      const mobileMenu = document.querySelector(".mobile-menu")

      const mobileLinks =
        gsap.utils.toArray<HTMLElement>(".mobile-menu-link")

      const menuLabel = document.querySelector(".mobile-menu-label")
      const topLine = document.querySelector(".menu-line-top")
      const bottomLine = document.querySelector(".menu-line-bottom")

      if (mobileButton && mobileMenu && topLine && bottomLine) {
        let menuOpen = false

        const menuTimeline = gsap.timeline({
          paused: true,
        })

        menuTimeline
          .set(mobileMenu, {
            pointerEvents: "auto",
          })
          .to(mobileMenu, {
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
          })
          .fromTo(
            menuLabel,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.2"
          )
          .fromTo(
            mobileLinks,
            {
              y: 60,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: 0.08,
              ease: "power4.out",
            },
            "-=0.3"
          )

        const openMenu = () => {
          menuOpen = true

          mobileButton.setAttribute("aria-expanded", "true")
          menuTimeline.play()

          gsap.to(topLine, {
            y: 4,
            rotate: 45,
            duration: 0.3,
            ease: "power3.out",
          })

          gsap.to(bottomLine, {
            y: -3,
            rotate: -45,
            duration: 0.3,
            ease: "power3.out",
          })
        }

        const closeMenu = () => {
          menuOpen = false

          mobileButton.setAttribute("aria-expanded", "false")
          menuTimeline.reverse()

          gsap.to(topLine, {
            y: 0,
            rotate: 0,
            duration: 0.3,
            ease: "power3.out",
          })

          gsap.to(bottomLine, {
            y: 0,
            rotate: 0,
            duration: 0.3,
            ease: "power3.out",
          })

          gsap.delayedCall(0.45, () => {
            if (!menuOpen) {
              gsap.set(mobileMenu, {
                pointerEvents: "none",
              })
            }
          })
        }

        mobileButton.addEventListener("click", () => {
          if (menuOpen) {
            closeMenu()
          } else {
            openMenu()
          }
        })

        mobileLinks.forEach((link) => {
          link.addEventListener("click", closeMenu)
        })
      }

      /* =====================================================
         MANIFESTO
         ===================================================== */

      gsap.from(".manifesto-label", {
        y: 30,
        opacity: 0,
        duration: 0.8,

        scrollTrigger: {
          trigger: "#manifesto",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      gsap.from(".manifesto-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,

        scrollTrigger: {
          trigger: "#manifesto",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })

      gsap.from(".manifesto-description", {
        y: 40,
        opacity: 0,
        duration: 0.9,

        scrollTrigger: {
          trigger: "#manifesto",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })

      /* =====================================================
         HORIZONTAL EXPERIENCE
         ===================================================== */

      const section = document.querySelector(".horizontal-section")
      const track = document.querySelector(".horizontal-track")

      if (section && track) {
        const getAmount = () =>
          track.scrollWidth - window.innerWidth

        const horizontalTween = gsap.to(track, {
          x: () => -getAmount(),
          ease: "none",

          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getAmount()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        /* =================================================
           INTRO
           ================================================= */

        gsap.from(".showcase-intro-content", {
          x: 120,
          opacity: 0,
          duration: 1.2,

          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        })

        /* =================================================
           PRODUCT
           ================================================= */

        gsap.from(".product-visual", {
          scale: 0.7,
          opacity: 0,
          rotate: -8,
          duration: 1.5,
          ease: "power3.out",

          scrollTrigger: {
            trigger: ".product-visual",
            containerAnimation: horizontalTween,
            start: "left 80%",
            toggleActions: "play none none reverse",
          },
        })

        /* =================================================
           ORBIT SYSTEM SCROLL RESPONSE
           ================================================= */

        gsap.to(".orbit-system", {
          x: 70,
          scale: 1.08,
          ease: "none",

          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getAmount()}`,
            scrub: 1,
          },
        })

        /* =================================================
           ORBIT MOUSE PARALLAX
           ================================================= */

        const orbitInteraction = document.querySelector(
          ".orbit-interaction"
        )

        if (
          orbitInteraction &&
          window.matchMedia("(hover: hover) and (pointer: fine)")
            .matches
        ) {
          const orbitX = gsap.quickTo(orbitInteraction, "x", {
            duration: 0.8,
            ease: "power3.out",
          })

          const orbitY = gsap.quickTo(orbitInteraction, "y", {
            duration: 0.8,
            ease: "power3.out",
          })

          const orbitRotateX = gsap.quickTo(
            orbitInteraction,
            "rotationX",
            {
              duration: 0.9,
              ease: "power3.out",
            }
          )

          const orbitRotateY = gsap.quickTo(
            orbitInteraction,
            "rotationY",
            {
              duration: 0.9,
              ease: "power3.out",
            }
          )

          const handleOrbitMouse = (event: MouseEvent) => {
            const rect = orbitInteraction.getBoundingClientRect()

            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const normalizedX =
              (event.clientX - centerX) / window.innerWidth

            const normalizedY =
              (event.clientY - centerY) / window.innerHeight

            orbitX(normalizedX * 35)
            orbitY(normalizedY * 22)
            orbitRotateY(normalizedX * 8)
            orbitRotateX(-normalizedY * 6)
          }

          const resetOrbit = () => {
            orbitX(0)
            orbitY(0)
            orbitRotateX(0)
            orbitRotateY(0)
          }

          window.addEventListener("mousemove", handleOrbitMouse)
          orbitInteraction.addEventListener("mouseleave", resetOrbit)
        }

        /* =================================================
           PRODUCT GLOW
           ================================================= */

        gsap.to(".product-main-glow", {
          scale: 1.7,
          opacity: 0.9,
          ease: "none",

          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getAmount()}`,
            scrub: 1,
          },
        })

        /* =================================================
           SYSTEM
           ================================================= */

        gsap.from(".system-heading", {
          x: 120,
          opacity: 0,
          duration: 1,

          scrollTrigger: {
            trigger: ".system-panel",
            containerAnimation: horizontalTween,
            start: "left 70%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(".system-node", {
          scale: 0.7,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,

          scrollTrigger: {
            trigger: ".system-diagram",
            containerAnimation: horizontalTween,
            start: "left 75%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(".system-line", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          stagger: 0.15,

          scrollTrigger: {
            trigger: ".system-diagram",
            containerAnimation: horizontalTween,
            start: "left 75%",
            toggleActions: "play none none reverse",
          },
        })

        /* =================================================
           SYSTEM NODE HOVER
           ================================================= */

        const systemNodes =
          gsap.utils.toArray<HTMLElement>(".system-node")

        systemNodes.forEach((node) => {
          const handleEnter = () => {
            gsap.to(node, {
              y: "-=6",
              scale: 1.05,
              duration: 0.35,
              ease: "power3.out",
            })

            gsap.to(node.querySelector("svg"), {
              scale: 1.18,
              rotate: 8,
              duration: 0.35,
              ease: "power3.out",
            })
          }

          const handleLeave = () => {
            gsap.to(node, {
              y: "+=6",
              scale: 1,
              duration: 0.5,
              ease: "elastic.out(1, 0.5)",
            })

            gsap.to(node.querySelector("svg"), {
              scale: 1,
              rotate: 0,
              duration: 0.4,
              ease: "power3.out",
            })
          }

          node.addEventListener("mouseenter", handleEnter)
          node.addEventListener("mouseleave", handleLeave)
        })

        /* =================================================
           PERFORMANCE
           ================================================= */

        gsap.from(".performance-heading", {
          y: 80,
          opacity: 0,
          duration: 1,

          scrollTrigger: {
            trigger: ".performance-panel",
            containerAnimation: horizontalTween,
            start: "left 70%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(".metric-card", {
          y: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,

          scrollTrigger: {
            trigger: ".performance-grid",
            containerAnimation: horizontalTween,
            start: "left 75%",
            toggleActions: "play none none reverse",
          },
        })

        /* =================================================
           METRIC CARD TILT
           ================================================= */

        const metricCards =
          gsap.utils.toArray<HTMLElement>(".metric-card")

        metricCards.forEach((card) => {
          const handleMove = (event: MouseEvent) => {
            const rect = card.getBoundingClientRect()

            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            const rotateY = (x / rect.width - 0.5) * 8
            const rotateX = (y / rect.height - 0.5) * -8

            gsap.to(card, {
              rotateX,
              rotateY,
              y: -5,
              transformPerspective: 900,
              duration: 0.35,
              ease: "power3.out",
              overwrite: true,
            })
          }

          const handleLeave = () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              y: 0,
              duration: 0.7,
              ease: "elastic.out(1, 0.45)",
              overwrite: true,
            })
          }

          card.addEventListener("mousemove", handleMove)
          card.addEventListener("mouseleave", handleLeave)
        })

        /* =================================================
           SPECS
           ================================================= */

        gsap.from(".spec-label", {
          y: 30,
          opacity: 0,
          duration: 0.7,

          scrollTrigger: {
            trigger: ".spec-panel",
            containerAnimation: horizontalTween,
            start: "left 75%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(".spec-title", {
          x: 100,
          opacity: 0,
          duration: 1,

          scrollTrigger: {
            trigger: ".spec-panel",
            containerAnimation: horizontalTween,
            start: "left 70%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(".spec-row", {
          x: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,

          scrollTrigger: {
            trigger: ".spec-list",
            containerAnimation: horizontalTween,
            start: "left 70%",
            toggleActions: "play none none reverse",
          },
        })

        ScrollTrigger.refresh()
      }

      /* =====================================================
         TECHNOLOGY
         ===================================================== */

      gsap.from(".technology-label", {
        y: 30,
        opacity: 0,
        duration: 0.8,

        scrollTrigger: {
          trigger: "#technology",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      gsap.from(".technology-heading", {
        y: 70,
        opacity: 0,
        duration: 1,

        scrollTrigger: {
          trigger: "#technology",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })

      gsap.from(".technology-item", {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,

        scrollTrigger: {
          trigger: ".technology-list",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })

      /* =====================================================
         TECHNOLOGY HOVER
         ===================================================== */

      const technologyItems =
        gsap.utils.toArray<HTMLElement>(".technology-item")

      technologyItems.forEach((item) => {
        const handleEnter = () => {
          gsap.to(item, {
            paddingLeft: 18,
            duration: 0.35,
            ease: "power3.out",
          })

          gsap.to(item.querySelector("h3"), {
            x: 8,
            duration: 0.35,
            ease: "power3.out",
          })
        }

        const handleLeave = () => {
          gsap.to(item, {
            paddingLeft: 0,
            duration: 0.5,
            ease: "power3.out",
          })

          gsap.to(item.querySelector("h3"), {
            x: 0,
            duration: 0.45,
            ease: "power3.out",
          })
        }

        item.addEventListener("mouseenter", handleEnter)
        item.addEventListener("mouseleave", handleLeave)
      })

      /* =====================================================
         FUTURE
         ===================================================== */

      gsap.from(".future-label", {
        y: 30,
        opacity: 0,
        duration: 0.8,

        scrollTrigger: {
          trigger: ".future-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      gsap.from(".future-title", {
        y: 130,
        opacity: 0,
        duration: 1.3,

        scrollTrigger: {
          trigger: ".future-section",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })

      gsap.to(".future-background", {
        scale: 1.3,
        rotate: 8,
        ease: "none",

        scrollTrigger: {
          trigger: ".future-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      })

      /* =====================================================
         CONTACT
         ===================================================== */

      gsap.from(".contact-content", {
        y: 80,
        opacity: 0,
        duration: 1,

        scrollTrigger: {
          trigger: "#contact",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })
    }, pageRef)

    return () => {
      context.revert()
      document.body.style.cursor = ""
    }
  }, [])

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#08090a] text-white"
    >
      {/* =====================================================
          CUSTOM CURSOR
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
        <div className="cursor-glow absolute left-0 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="cursor-dot absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

        <div className="cursor-ring absolute left-0 top-0 flex h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35">
          <span className="cursor-text scale-75 text-[8px] uppercase tracking-[0.15em] opacity-0">
            View
          </span>
        </div>
      </div>

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <header className="site-header fixed left-0 top-0 z-50 w-full border-b border-transparent">
        <div className="site-header-inner relative mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 lg:px-10">
          <a
            href="#"
            data-magnetic
            data-magnetic-strength="0.18"
            data-cursor="hover"
            className="site-logo relative z-50 text-sm font-semibold tracking-[0.25em]"
          >
            AETHER
          </a>

          {/* DESKTOP NAV */}

          <nav className="site-nav hidden items-center gap-8 text-xs uppercase tracking-[0.18em] md:flex">
            <a
              href="#manifesto"
              data-section="manifesto"
              data-cursor="hover"
              className="site-nav-link relative text-white/45 transition-colors duration-300 hover:text-white"
            >
              Manifesto
              <span className="nav-indicator absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-cyan-300" />
            </a>

            <a
              href="#technology"
              data-section="technology"
              data-cursor="hover"
              className="site-nav-link relative text-white/45 transition-colors duration-300 hover:text-white"
            >
              Technology
              <span className="nav-indicator absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-violet-400" />
            </a>

            <a
              href="#experience"
              data-section="experience"
              data-cursor="hover"
              className="site-nav-link relative text-white/45 transition-colors duration-300 hover:text-white"
            >
              Experience
              <span className="nav-indicator absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-cyan-300" />
            </a>
          </nav>

          {/* DESKTOP CONTACT */}

          <a
            href="#contact"
            data-magnetic
            data-magnetic-strength="0.22"
            data-cursor="view"
            className="site-contact group hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:border-white hover:bg-white hover:text-black md:flex"
          >
            Contact
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 transition-transform duration-300 group-hover:scale-150" />
          </a>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
            data-cursor="hover"
            className="mobile-menu-button relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className="menu-line menu-line-top h-px w-6 bg-white" />
            <span className="menu-line menu-line-bottom h-px w-6 bg-white" />
          </button>
        </div>

        {/* MOBILE MENU */}

        <div className="mobile-menu pointer-events-none fixed inset-0 z-40 flex min-h-screen flex-col justify-between bg-[#08090a] px-6 pb-10 pt-32 opacity-0 md:hidden">
          <div>
            <p className="mobile-menu-label text-[10px] uppercase tracking-[0.25em] text-white/30">
              Navigation
            </p>

            <nav className="mt-10 flex flex-col">
              <a
                href="#manifesto"
                className="mobile-menu-link border-b border-white/10 py-5 text-4xl font-medium tracking-[-0.04em]"
              >
                <span className="flex items-center justify-between">
                  Manifesto
                  <span className="text-sm text-white/25">01</span>
                </span>
              </a>

              <a
                href="#experience"
                className="mobile-menu-link border-b border-white/10 py-5 text-4xl font-medium tracking-[-0.04em]"
              >
                <span className="flex items-center justify-between">
                  Experience
                  <span className="text-sm text-white/25">02</span>
                </span>
              </a>

              <a
                href="#technology"
                className="mobile-menu-link border-b border-white/10 py-5 text-4xl font-medium tracking-[-0.04em]"
              >
                <span className="flex items-center justify-between">
                  Technology
                  <span className="text-sm text-white/25">03</span>
                </span>
              </a>

              <a
                href="#contact"
                className="mobile-menu-link border-b border-white/10 py-5 text-4xl font-medium tracking-[-0.04em]"
              >
                <span className="flex items-center justify-between">
                  Contact
                  <span className="text-sm text-white/25">04</span>
                </span>
              </a>
            </nav>
          </div>

          <div className="flex items-end justify-between text-[10px] uppercase tracking-[0.2em] text-white/25">
            <span>Aether / 2026</span>
            <span>Buenos Aires</span>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="hero relative flex min-h-screen items-end">
        <div className="absolute inset-0">
          <div className="hero-glow-primary absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

          <div className="hero-glow-secondary absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-16 pt-40 lg:px-10 lg:pb-20">
          <div className="hero-label mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/40">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Next generation mobility
          </div>

          <div className="flex flex-col justify-between gap-16 lg:flex-row lg:items-end">
            <div className="max-w-6xl">
              <h1 className="text-[clamp(4.5rem,11vw,11rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                <span className="hero-title-line block overflow-hidden">
                  <span className="block">ENGINEERED</span>
                </span>

                <span className="hero-title-line block overflow-hidden">
                  <span className="block">BEYOND</span>
                </span>

                <span className="hero-title-line block overflow-hidden">
                  <span className="block">
                    LIMITS<span className="text-violet-500">.</span>
                  </span>
                </span>
              </h1>
            </div>

            <div className="max-w-sm pb-2 lg:pb-4">
              <p className="hero-description text-base leading-7 text-white/50">
                Aether creates machines for a world where performance,
                intelligence and design move as one.
              </p>

              <a
                href="#manifesto"
                data-magnetic
                data-magnetic-strength="0.12"
                data-cursor="hover"
                className="hero-explore mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.18em]"
              >
                Explore
                <ArrowDownRight size={16} />
              </a>
            </div>
          </div>

          <div className="mt-20 flex items-end justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.2em] text-white/30">
            <span>Buenos Aires / 2026</span>
            <span>01 — 05</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          MANIFESTO
          ===================================================== */}

      <section id="manifesto" className="border-t border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 py-32 lg:px-10 lg:py-48">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="manifesto-label lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                01 / Manifesto
              </p>
            </div>

            <div className="lg:col-span-8">
              <p className="manifesto-text text-4xl font-light leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                We don't build for the present.
                <span className="text-white/25">
                  {" "}
                  We build what comes next.
                </span>
              </p>

              <p className="manifesto-description mt-12 max-w-xl text-sm leading-7 text-white/40">
                Every decision starts with a simple question:
                what could this become if there were no limits?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HORIZONTAL EXPERIENCE
          ===================================================== */}

      <section
        id="experience"
        className="horizontal-section relative h-screen overflow-hidden border-t border-white/10"
      >
        <div className="horizontal-track flex h-full w-max">
          {/* PANEL 01 */}

          <div className="showcase-intro-content flex h-full w-screen shrink-0 items-center px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="mb-8 text-xs uppercase tracking-[0.25em] text-white/30">
                  02 / Experience
                </p>

                <h2 className="text-6xl font-medium leading-[0.88] tracking-[-0.06em] sm:text-8xl lg:text-[9rem]">
                  THE
                  <br />
                  AETHER
                  <br />
                  ONE<span className="text-violet-500">.</span>
                </h2>
              </div>

              <div className="flex items-end lg:col-span-4 lg:col-start-9">
                <div>
                  <p className="max-w-sm text-sm leading-7 text-white/40">
                    A machine designed as a complete system.
                    Every component works together to create
                    one continuous experience.
                  </p>

                  <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30">
                    <span className="h-px w-12 bg-white/20" />
                    Scroll to explore
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 02 — THREE.JS ORBITAL SYSTEM */}

          <div className="flex h-full w-screen shrink-0 items-center justify-center px-6 lg:px-10">
            <div className="product-visual relative h-[76vh] w-full max-w-[1350px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#101114]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />

              <div className="product-main-glow pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.24),transparent_35%)]" />

              <div className="absolute left-8 top-8 z-20">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                  Aether One / Prototype A1
                </p>
              </div>

              <div className="absolute right-8 top-8 z-20 text-right">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                  Autonomous architecture
                </p>

                <p className="mt-2 text-xs text-cyan-300">
                  ACTIVE
                </p>
              </div>

              {/* 3D ORBIT SCENE */}

              <div className="orbit-interaction absolute left-1/2 top-1/2 h-[570px] w-[970px] -translate-x-1/2 -translate-y-1/2 [perspective:1000px] sm:h-[620px] sm:w-[1050px]">
                <div className="orbit-system absolute left-1/2 top-1/2 h-[500px] w-[850px] -translate-x-1/2 -translate-y-1/2 sm:h-[570px] sm:w-[970px]">
                  <OrbitScene />
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-8 left-8 z-20">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Core system
                </p>

                <p className="mt-2 text-sm">
                  Adaptive intelligence
                </p>
              </div>

              <div className="pointer-events-none absolute bottom-8 right-8 z-20 text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  System
                </p>

                <p className="mt-2 text-sm">
                  001 / 001
                </p>
              </div>
            </div>
          </div>

          {/* PANEL 03 */}

          <div className="system-panel flex h-full w-screen shrink-0 items-center px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-[1500px] gap-16 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  03 / System
                </p>

                <h3 className="system-heading mt-7 text-5xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-7xl">
                  ONE
                  <br />
                  SYSTEM.
                  <br />
                  FOUR
                  <br />
                  LAYERS.
                </h3>

                <p className="mt-10 max-w-sm text-sm leading-7 text-white/35">
                  The Aether architecture is built as a network
                  rather than a collection of isolated components.
                </p>
              </div>

              <div className="system-diagram relative flex min-h-[500px] items-center justify-center lg:col-span-8">
                <div className="system-line absolute left-[20%] top-1/2 h-px w-[60%] bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

                <div className="system-line absolute left-1/2 top-[20%] h-[60%] w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />

                <div className="system-node absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-400/30 bg-violet-400/10 shadow-[0_0_80px_rgba(139,92,246,0.25)]">
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                      Core
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      AETHER
                    </p>
                  </div>
                </div>

                <div className="system-node absolute left-[10%] top-1/2 -translate-y-1/2">
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Zap size={20} className="text-cyan-300" />

                    <span className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/40">
                      Energy
                    </span>
                  </div>
                </div>

                <div className="system-node absolute right-[10%] top-1/2 -translate-y-1/2">
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Activity size={20} className="text-violet-300" />

                    <span className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/40">
                      Motion
                    </span>
                  </div>
                </div>

                <div className="system-node absolute left-1/2 top-[8%] -translate-x-1/2">
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Cpu size={20} className="text-white/70" />

                    <span className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/40">
                      Control
                    </span>
                  </div>
                </div>

                <div className="system-node absolute bottom-[8%] left-1/2 -translate-x-1/2">
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Gauge size={20} className="text-cyan-300" />

                    <span className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/40">
                      Response
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 04 */}

          <div className="performance-panel flex h-full w-screen shrink-0 items-center px-6 lg:px-10">
            <div className="mx-auto w-full max-w-[1500px]">
              <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                    04 / Performance
                  </p>

                  <h3 className="performance-heading mt-7 max-w-3xl text-5xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-7xl">
                    PERFORMANCE
                    <br />
                    WITHOUT
                    <br />
                    COMPROMISE.
                  </h3>
                </div>

                <p className="max-w-xs text-sm leading-7 text-white/35">
                  Every layer is measured. Every response is intentional.
                </p>
              </div>

              <div className="performance-grid grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    value: "98%",
                    label: "Efficiency",
                    description: "System utilization",
                    color: "text-cyan-300",
                  },
                  {
                    value: "0.04",
                    label: "Response",
                    description: "Milliseconds",
                    color: "text-violet-300",
                  },
                  {
                    value: "4.8",
                    label: "Output",
                    description: "kW adaptive power",
                    color: "text-white",
                  },
                  {
                    value: "24/7",
                    label: "Autonomy",
                    description: "Continuous operation",
                    color: "text-cyan-300",
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    data-cursor="hover"
                    className="metric-card group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition-colors hover:bg-white/[0.05]"
                  >
                    <p
                      className={`text-5xl font-medium tracking-[-0.06em] ${metric.color}`}
                    >
                      {metric.value}
                    </p>

                    <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/50">
                      {metric.label}
                    </p>

                    <p className="mt-2 text-sm text-white/25">
                      {metric.description}
                    </p>

                    <div className="mt-8 h-px w-full bg-white/10">
                      <div className="h-px w-2/3 bg-gradient-to-r from-violet-400 to-cyan-300 transition-all duration-700 group-hover:w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PANEL 05 */}

          <div className="spec-panel flex h-full w-screen shrink-0 items-center px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-[1500px] gap-16 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="spec-label text-xs uppercase tracking-[0.25em] text-white/30">
                  05 / Specifications
                </p>
              </div>

              <div className="lg:col-span-5">
                <h3 className="spec-title text-5xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-7xl">
                  DESIGNED
                  <br />
                  AROUND
                  <br />
                  THE
                  <br />
                  EXPERIENCE<span className="text-violet-500">.</span>
                </h3>
              </div>

              <div className="lg:col-span-4">
                <div className="spec-list space-y-6 border-t border-white/10 pt-6">
                  {[
                    ["Architecture", "Adaptive"],
                    ["Response", "0.04 ms"],
                    ["Generation", "A1"],
                    ["System", "Autonomous"],
                    ["Interface", "Neural"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="spec-row flex justify-between border-b border-white/10 pb-6 text-sm"
                    >
                      <span className="text-white/30">{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TECHNOLOGY
          ===================================================== */}

      <section id="technology" className="border-t border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 py-32 lg:px-10 lg:py-44">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="technology-label text-xs uppercase tracking-[0.25em] text-white/30">
                03 / Technology
              </p>

              <h2 className="technology-heading mt-6 max-w-md text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
                Built around three principles.
              </h2>
            </div>

            <div className="lg:col-span-8">
              <div className="technology-list divide-y divide-white/10 border-y border-white/10">
                {[
                  {
                    number: "01",
                    title: "Performance",
                    text: "Every system is engineered to respond faster, move further and waste less.",
                  },
                  {
                    number: "02",
                    title: "Intelligence",
                    text: "Technology should disappear into the experience and anticipate what comes next.",
                  },
                  {
                    number: "03",
                    title: "Precision",
                    text: "Nothing is accidental. Every interaction, surface and component has a purpose.",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    data-cursor="hover"
                    className="technology-item group grid gap-6 py-10 md:grid-cols-[100px_1fr_1fr] md:items-start"
                  >
                    <span className="text-xs text-white/25">
                      {item.number}
                    </span>

                    <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-violet-400 sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="max-w-sm text-sm leading-6 text-white/40">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FUTURE
          ===================================================== */}

      <section className="future-section relative overflow-hidden border-t border-white/10">
        <div className="future-background absolute inset-[-20%] bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/10" />

        <div className="relative mx-auto max-w-[1600px] px-6 py-40 lg:px-10 lg:py-56">
          <div className="flex flex-col items-start justify-between gap-16 md:flex-row md:items-end">
            <div>
              <p className="future-label text-xs uppercase tracking-[0.25em] text-white/30">
                04 / The future
              </p>

              <h2 className="future-title mt-8 max-w-5xl text-5xl font-medium leading-[0.9] tracking-[-0.06em] sm:text-7xl lg:text-9xl">
                NOTHING
                <br />
                STAYS
                <br />
                STILL<span className="text-cyan-400">.</span>
              </h2>
            </div>

            <ArrowUpRight
              size={48}
              strokeWidth={1}
              className="text-white/30"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
          ===================================================== */}

      <section id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 py-32 lg:px-10 lg:py-44">
          <div className="contact-content flex flex-col justify-between gap-16 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                05 / Contact
              </p>

              <h2 className="mt-6 text-5xl font-medium tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                READY FOR
                <br />
                WHAT'S NEXT?
              </h2>
            </div>

            <a
              href="mailto:hello@aether.example"
              data-magnetic
              data-magnetic-strength="0.16"
              data-cursor="view"
              className="group inline-flex items-center gap-4 border-b border-white/20 pb-3 text-sm uppercase tracking-[0.2em] transition-colors hover:border-white"
            >
              Start a conversation

              <MoveUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </div>

          <div className="mt-32 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/30 sm:flex-row">
            <span>Aether — Experimental Concept</span>
            <span>Buenos Aires / 2026</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App