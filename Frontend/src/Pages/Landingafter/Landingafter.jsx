import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Navbarafter from "../../Components/Navbarafter";
import "./../Landing/Landing.css";
import one from "../../assets/one.jpg";
import two from "../../assets/2.jpg";
import three from "../../assets/3.jpg";
import four from "../../assets/4.jpg";
import five from "../../assets/5.jpg";
import six from "../../assets/6.jpg";

function Landing() {
    const navItems = [
        { label: 'Home', href: '/landing', active: true },
        { label: 'About', href: '/aboutusafter' },
        { label: 'Blog', href: '/blogafter' },
        { label: 'Track Your Periods', href: '/period' },
        { label: 'Diet Tracking', href: '/diet' },
        { label: 'Recipe Suggestions', href: '/recipe' },
        { label: 'Consultation', href: '/consultation' },
        { label: 'My Profile', href: '/dashboard' }
    ];

    const [data, setData] = useState([
        {
            place: "Menstrual Health",
            title: "DOS &",
            title2: "DON'TS",
            description:
                "<strong>Dos:</strong><ul><li>Stay hydrated and drink plenty of water.</li><li>Maintain a balanced diet rich in iron and vitamins.</li><li>Exercise regularly to alleviate cramps and improve mood.</li><li>Track your menstrual cycle for better health management.</li></ul><strong>Don'ts:</strong><ul><li>Don't skip meals or restrict calories.</li><li>Avoid excessive caffeine and sugar.</li><li>Don't ignore severe pain; consult a healthcare provider.</li><li>Refrain from using harsh soaps or douches.</li></ul>",
            image: one,
        },
        {
            place: "Menstrual Health",
            title: "INTERESTING",
            title2: "FACTS",
            description:
                "<strong>Interesting Facts:</strong><ul><li>Menstrual cycles can vary from 21 to 35 days.</li><li>The average period lasts between 3 to 7 days.</li><li>Hormonal changes during menstruation can affect mood and energy levels.</li><li>Tracking your cycle can help identify health issues early.</li></ul>",
            image: two,
        },
        {
            place: "Menstrual Health",
            title: "MYTHS &",
            title2: "REALITIES",
            description:
                "<strong>Myths:</strong><ul><li>Periods should always be regular. <em>(Reality: Menstrual cycles can vary due to stress, diet, and other factors.)</em></li><li>It's unhealthy to exercise during menstruation. <em>(Reality: Light exercise can actually relieve cramps and improve mood.)</em></li><li>You shouldn't swim during your period. <em>(Reality: With the right hygiene products, swimming is safe and even beneficial!)</em></li></ul><strong>Realities:</strong><ul><li>Menstrual hygiene products should be changed every 4-6 hours to prevent infections.</li><li>It's normal to feel bloated or tired due to hormonal shifts.</li></ul>",
            image: three,
        },
        {
            place: "Menstrual Health",
            title: "SELF-CARE",
            title2: "TIPS",
            description:
                "<strong>Self-Care Tips:</strong><ul><li>Use heat pads or warm baths to ease cramps.</li><li>Practice relaxation techniques like deep breathing or yoga.</li><li>Opt for comfortable clothing and avoid tight waistbands.</li><li>Get plenty of sleep, as rest is essential for managing menstrual symptoms.</li></ul><strong>Mental Wellness:</strong><ul><li>Engage in gentle activities that make you feel happy and relaxed.</li><li>Stay connected with friends and talk openly about your experience.</li><li>Focus on positive affirmations to counter negative mood swings.</li></ul>",
            image: four,
        },
        {
            place: "Menstrual Health",
            title: "NUTRITIONAL",
            title2: "GUIDE",
            description:
                "<strong>Best Foods:</strong><ul><li>Iron-rich foods like spinach, beans, and red meat to replenish blood loss and Foods high in magnesium (such as nuts and seeds) to reduce bloating.</li><li>Ginger tea for nausea and to alleviate period pain.</li></ul><strong>Foods to Avoid:</strong><ul><li>Salty foods that increase bloating.</li><li>Processed sugars that can cause energy spikes and crashes.</li><li>Fatty foods that can worsen cramps.</li></ul>",
            image: five,
        },
        {
            place: "Menstrual Health",
            title: "SIGNALS",
            title2: "TO WATCH",
            description:
                "<strong>Key Signals:</strong><ul><li>Heavy bleeding lasting more than 7 days: <em>This may indicate an underlying issue.</em></li><li>Intense pain that disrupts daily activities: <em>Seek medical advice, as it could signal conditions like endometriosis.</em></li><li>Missed periods without pregnancy: <em>This could be a sign of hormonal imbalance or stress.</em></li><li>Unusual symptoms like dizziness or fainting: <em>Contact a healthcare provider for evaluation.</em></li></ul>",
            image: six,
        },
    ]);

    const contentAreaRef = useRef(null);
    const detailsEvenRef = useRef(null);
    const detailsOddRef = useRef(null);
    const slideNumbersRef = useRef(null);
    const paginationRef = useRef(null);
    const bodyRef = useRef(document.body);

    useEffect(() => {
        const _ = (id) => document.getElementById(id);
        const cards = data
            .map(
                (i, index) => `
      <div class="card" id="card${index}" style="background-image: url(${i.image})">
        <div class="card-content" id="card-content-${index}">
          <div class="content-start"></div>
          <div class="content-place">${i.place}</div>
          <div class="content-title-1">${i.title}</div>
          <div class="content-title-2">${i.title2}</div>
        </div>
      </div>
    `
            )
            .join("");
        _("demo").innerHTML = cards;

        const slideNumbers = data
            .map((_, index) => `<div class="item" id="slide-item-${index}">${index + 1}</div>`)
            .join("");
        _("slide-numbers").innerHTML = slideNumbers;

        const set = gsap.set;
        function getCard(index) {
            return `#card${index}`;
        }
        function getCardContent(index) {
            return `#card-content-${index}`;
        }
        function getSliderItem(index) {
            return `#slide-item-${index}`;
        }
        function animate(target, duration, properties) {
            return new Promise((resolve) => {
                gsap.to(target, {
                    ...properties,
                    duration: duration,
                    onComplete: resolve,
                });
            });
        }
        let order = [0, 1, 2, 3, 4, 5];
        let detailsEven = true;
        let offsetTop = 200;
        let offsetLeft = 700;
        let cardWidth = 200;
        let cardHeight = 300;
        let gap = 40;
        let numberSize = 50;
        const ease = "sine.inOut";
        function init() {
            const [active, ...rest] = order;
            const detailsActive = detailsEven ? "#details-even" : "#details-odd";
            const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
            const { innerHeight: height, innerWidth: width } = window;
            offsetTop = height - 430;
            offsetLeft = width - 830;
            gsap.set("#pagination", {
                top: offsetTop + 330,
                left: offsetLeft,
                y: 200,
                opacity: 0,
                zIndex: 60,
            });
            gsap.set("nav", {
                y: 0,
                opacity: 1,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000
            });
            gsap.set(getCard(active), {
                x: 0,
                y: 0,
                width: "100%",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                zIndex: 99,
            });
            bodyRef.current.style.overflow = "hidden";
            gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
            gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
            gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
            gsap.set(`${detailsInactive} .text`, { y: 100 });
            gsap.set(`${detailsInactive} .title-1`, { y: 100 });
            gsap.set(`${detailsInactive} .title-2`, { y: 100 });
            gsap.set(`${detailsInactive} .desc`, { y: 50 });
            gsap.set(`${detailsInactive} .cta`, { y: 60 });
            gsap.set(".progress-sub-foreground", {
                width: 500 * (1 / order.length) * (active + 1),
            });

            rest.forEach((i, index) => {
                gsap.set(getCard(i), {
                    x: offsetLeft + 400 + index * (cardWidth + gap),
                    y: offsetTop,
                    width: cardWidth,
                    height: cardHeight,
                    zIndex: 30,
                    borderRadius: 10,
                });
                gsap.set(getCardContent(i), {
                    x: offsetLeft + 400 + index * (cardWidth + gap),
                    zIndex: 40,
                    y: offsetTop + cardHeight - 100,
                });
                gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
            });
            gsap.set(".indicator", { x: -window.innerWidth });
            const startDelay = 0.6;
            gsap.to(".cover", {
                x: width + 400,
                delay: 0.5,
                ease,
                onComplete: () => {
                    setTimeout(() => {
                        loop();
                    }, 500);
                },
            });
            rest.forEach((i, index) => {
                gsap.to(getCard(i), {
                    x: offsetLeft + index * (cardWidth + gap),
                    zIndex: 30,
                    ease,
                    delay: startDelay,
                });
                gsap.to(getCardContent(i), {
                    x: offsetLeft + index * (cardWidth + gap),
                    zIndex: 40,
                    ease,
                    delay: startDelay,
                });
            });
            gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
            gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
        }
        let clicks = 0;
        function step() {
            return new Promise((resolve) => {
                order.push(order.shift());
                detailsEven = !detailsEven;
                const detailsActive = detailsEven ? "#details-even" : "#details-odd";
                const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
                document.querySelector(`${detailsActive} .place-box .text`).textContent =
                    data[order[0]].place;
                document.querySelector(`${detailsActive} .title-1`).textContent =
                    data[order[0]].title;
                document.querySelector(`${detailsActive} .title-2`).textContent =
                    data[order[0]].title2;
                document.querySelector(`${detailsActive} .desc`).innerHTML =
                    data[order[0]].description;
                gsap.set(detailsActive, {
                    zIndex: 22,
                });
                gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
                gsap.to(`${detailsActive} .text`, {
                    y: 0,
                    delay: 0.1,
                    duration: 0.7,
                    ease,
                });
                gsap.to(`${detailsActive} .title-1`, {
                    y: 0,
                    delay: 0.15,
                    duration: 0.7,
                    ease,
                });
                gsap.to(`${detailsActive} .title-2`, {
                    y: 0,
                    delay: 0.15,
                    duration: 0.7,
                    ease,
                });
                gsap.to(`${detailsActive} .desc`, {
                    y: 0,
                    delay: 0.3,
                    duration: 0.4,
                    ease,
                });
                gsap.to(`${detailsActive} .cta`, {
                    y: 0,
                    delay: 0.35,
                    duration: 0.4,
                    onComplete: resolve,
                    ease,
                });
                gsap.set(detailsInactive, { zIndex: 12 });
                const [active, ...rest] = order;
                const prv = rest[rest.length - 1];
                gsap.set(getCard(prv), { zIndex: 10 });
                gsap.set(getCard(active), { zIndex: 20 });
                gsap.to(getCard(prv), { scale: 1.5, ease });
                gsap.to(getCardContent(active), {
                    y: offsetTop + cardHeight - 10,
                    opacity: 0,
                    duration: 0.3,
                    ease,
                });
                gsap.to(getSliderItem(active), { x: 0, ease });
                gsap.to(getSliderItem(prv), { x: -numberSize, ease });
                gsap.to(".progress-sub-foreground", {
                    width: 500 * (1 / order.length) * (active + 1),
                    ease,
                });
                gsap.to(getCard(active), {
                    x: 0,
                    y: 0,
                    ease,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    borderRadius: 0,
                    onComplete: () => {
                        const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
                        gsap.set(getCard(prv), {
                            x: xNew,
                            y: offsetTop,
                            width: cardWidth,
                            height: cardHeight,
                            zIndex: 30,
                            borderRadius: 10,
                            scale: 1,
                        });
                        gsap.set(getCardContent(prv), {
                            x: xNew,
                            y: offsetTop + cardHeight - 100,
                            opacity: 1,
                            zIndex: 40,
                        });
                        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });
                        gsap.set(detailsInactive, { opacity: 0 });
                        gsap.set(`${detailsInactive} .text`, { y: 100 });
                        gsap.set(`${detailsInactive} .title-1`, { y: 100 });
                        gsap.set(`${detailsInactive} .title-2`, { y: 100 });
                        gsap.set(`${detailsInactive} .desc`, { y: 50 });
                        gsap.set(`${detailsInactive} .cta`, { y: 60 });
                        clicks -= 1;
                        if (clicks > 0) {
                            step();
                        }
                        bodyRef.current.style.overflow = "auto";
                    },
                });
                rest.forEach((i, index) => {
                    if (i !== prv) {
                        const xNew = offsetLeft + index * (cardWidth + gap);
                        gsap.set(getCard(i), { zIndex: 30 });
                        gsap.to(getCard(i), {
                            x: xNew,
                            y: offsetTop,
                            width: cardWidth,
                            height: cardHeight,
                            ease,
                            delay: 0.1 * (index + 1),
                        });
                        gsap.to(getCardContent(i), {
                            x: xNew,
                            y: offsetTop + cardHeight - 100,
                            opacity: 1,
                            zIndex: 40,
                            ease,
                            delay: 0.1 * (index + 1),
                        });
                        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
                    }
                });
                gsap.set("nav", {
                    y: 0,
                    opacity: 1,
                    zIndex: 1000
                });
            });
        }
        async function loop() {
            await animate(".indicator", 2, { x: 0 });
            await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
            set(".indicator", { x: -window.innerWidth });
            await step();
            loop();
        }
        async function loadImage(src) {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        }
        async function loadImages() {
            const promises = data.map(({ image }) => loadImage(image));
            return Promise.all(promises);
        }
        async function start() {
            try {
                await loadImages();
                init();
            } catch (error) {
                console.error("One or more images failed to load", error);
            }
        }
        document.querySelector(".arrow-left").addEventListener("click", () => {
            clicks = 1;
            step();
        });

        document.querySelector(".arrow-right").addEventListener("click", () => {
            clicks = 1;
            order.push(order.shift());
            step();
        });
        document.getElementById("getstarted").addEventListener("click", () => {
            window.location.href = "/login";
        });
        document.getElementById("getstarted1").addEventListener("click", () => {
            window.location.href = "/login";
        });
        start();
    }, [data]);

    return (
        <div>
            <Navbarafter navItems={navItems} />
            <div id="demo" className="content-area"></div>
            <div className="details" id="details-even">
                <div className="place-box">
                    <div className="text">Menstrual Health</div>
                </div>
                <div className="title-box-1">
                    <div className="title-1">DOS & DON'TS</div>
                </div>
                <div className="title-box-2">
                    <div className="title-2">MENSTRUAL HEALTH</div>
                </div>
                <div className="desc">
                    <strong>Dos:</strong>
                    <ul>
                        <li>Stay hydrated and drink plenty of water.</li>
                        <li>Maintain a balanced diet rich in iron and vitamins.</li>
                        <li>Exercise regularly to alleviate cramps and improve mood.</li>
                        <li>Track your menstrual cycle for better health management.</li>
                    </ul>
                    <strong>Don'ts:</strong>
                    <ul>
                        <li>Don't skip meals or restrict calories.</li>
                        <li>Avoid excessive caffeine and sugar.</li>
                        <li>Don't ignore severe pain; consult a healthcare provider.</li>
                        <li>Refrain from using harsh soaps or douches.</li>
                    </ul>
                </div>
                <div className="ctax">
                    <button className="bookmark">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <button className="discover" id="getstarted" onClick={() => window.location.href = "/login"}>
                        Get Started!
                    </button>
                </div>
            </div>
            <div className="details" id="details-odd">
                <div className="place-box">
                    <div className="text">Menstrual Health</div>
                </div>
                <div className="title-box-1">
                    <div className="title-1">DOS & DON'TS</div>
                </div>
                <div className="title-box-2">
                    <div className="title-2">MENSTRUAL HEALTH</div>
                </div>
                <div className="desc">
                    <strong>Interesting Facts:</strong>
                    <ul>
                        <li>Menstrual cycles can vary from 21 to 35 days.</li>
                        <li>The average period lasts between 3 to 7 days.</li>
                        <li>Hormonal changes during menstruation can affect mood and energy levels.</li>
                        <li>Tracking your cycle can help identify health issues early.</li>
                    </ul>
                </div>
                <div className="ctax">
                    <button className="discover" id="getstarted1" onClick={() => window.location.href = "/login"}>
                        Get Started!
                    </button>
                </div>
            </div>
            <div className="pagination" id="pagination">
                <div className="arrow arrow-left">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </div>
                <div className="arrow arrow-right">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </div>
                <div className="progress-sub-container">
                    <div className="progress-sub-background">
                        <div className="progress-sub-foreground"></div>
                    </div>
                </div>
                <div className="slide-numbers" id="slide-numbers"></div>
            </div>
        </div>
    );
}

export default Landing;