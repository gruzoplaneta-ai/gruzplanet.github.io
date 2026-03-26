document.addEventListener("DOMContentLoaded", () => {

    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    window.addEventListener('load', () => {
        const hero = document.querySelector('.hero');

        hero.classList.add('loaded');

        // запускаем счетчик ПОСЛЕ появления
        setTimeout(() => {
            counters.forEach(counter => animateCounter(counter));
        }, 600); // синхронизировано с анимацией
    });

    const dropdownItems = document.querySelectorAll('.nav__item, .lang');

    dropdownItems.forEach(item => {
        let timeout;

        item.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            item.classList.add('open');
        });

        item.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                item.classList.remove('open');
            }, 200); // задержка закрытия
        });
    });
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav a");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");

                navLinks.forEach(link => {
                    link.classList.remove("active");

                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, {
        threshold: 0.6
    });

    sections.forEach(section => observer.observe(section));
    const counters = document.querySelectorAll('.hero__stat-value');

    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        let current = 0;

        const duration = 1200;
        const startTime = performance.now();

        const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);

            const value = Math.floor(progress * target);
            if (target === 5) {
                el.textContent = value + ' звезд';
            } else {
                el.textContent = value + (target >= 10 ? '+' : '');
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };
    const stats = document.querySelector('.hero__stats');

    const observerStats = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {

            counters.forEach(counter => animateCounter(counter));

            observerStats.disconnect(); // чтобы не запускалось второй раз
        }
    }, {
        threshold: 0.5 // когда 50% блока видно
    });

    observerStats.observe(stats);



    const btn = document.querySelector('.hero__btn');

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const moveX = (x - rect.width / 2) / 15;
        const moveY = (y - rect.height / 2) / 15;

        btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0, 0)`;
    });



    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-overlay');
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    function closeMenu() {
        burger.classList.remove('active');
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    let startX = 0;

    menu.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    menu.addEventListener('touchmove', (e) => {
        let currentX = e.touches[0].clientX;

        if (currentX - startX > 80) {
            closeMenu();
        }
    });

    /* клик вне меню */
    overlay.addEventListener('click', closeMenu);

    /* клик по пункту */
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    const mobileItems = document.querySelectorAll('.mobile-menu__item');

    mobileItems.forEach(item => {
        const label = item.querySelector('.mobile-menu__label');

        if (!label) return;

        label.addEventListener('click', (e) => {
            e.stopPropagation();

            mobileItems.forEach(i => {
                if (i !== item) {
                    i.classList.remove('open');
                }
            });

            item.classList.toggle('open');
        });
    });


    const menuItems = document.querySelectorAll('.mobile-menu a, .mobile-menu__item');

    menuItems.forEach((item, i) => {
        item.style.transition = `all 0.4s cubic-bezier(0.2,0.8,0.2,1) ${i * 0.05}s`;
    });


});