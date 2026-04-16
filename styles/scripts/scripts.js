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
        const isOpen = burger.classList.toggle('active');

        menu.classList.toggle('active');
        overlay.classList.toggle('active');

        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    });

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;

    menu.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
        startTime = Date.now();

        menu.classList.add('dragging');
    });

    menu.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        currentX = e.touches[0].clientX;
        let delta = currentX - startX;

        if (delta > 0) {
            // 🔥 resistance
            let resistance = delta * 0.6;

            menu.style.transform = `translateX(${resistance}px)`;

            // 🔥 overlay fade
            let progress = Math.min(delta / 300, 1);
            overlay.style.opacity = 1 - progress;
        }
    });

    menu.addEventListener('touchend', () => {
        if (!isDragging) return;

        isDragging = false;
        menu.classList.remove('dragging');

        let delta = currentX - startX;
        let time = Date.now() - startTime;

        // защита от деления на 0
        let velocity = time > 0 ? delta / time : 0;

        // 🔥 решение закрывать или нет
        if (delta > 100 || velocity > 0.5) {
            closeMenu();

            setTimeout(() => {
                menu.style.transform = '';
                overlay.style.opacity = '';
            }, 300);

        } else {
            // возврат назад
            menu.style.transition = 'transform 0.5s cubic-bezier(0.22, 1.2, 0.36, 1)';
            menu.style.transform = '';
            overlay.style.opacity = '';
        }
    });

    /* клик вне меню */
    overlay.addEventListener('click', closeMenu);
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

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




    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();

                dropdownItems.forEach(i => {
                    if (i !== item) i.classList.remove('open');
                });

                item.classList.toggle('open');
            });
        });

        document.addEventListener('click', () => {
            dropdownItems.forEach(i => i.classList.remove('open'));
        });
    }
    document.querySelectorAll('.mobile-menu__label').forEach(label => {
        label.addEventListener('touchstart', (e) => {
            e.stopPropagation(); // 🔥 ключ

            const parent = label.parentElement;

            parent.classList.toggle('active');
        });
    });

    // ======================
    // YANDEX MAP (STABLE)
    // ======================

    let map;
    let currentRoute;

    ymaps.ready(init);

    function init() {

        map = new ymaps.Map("map", {
            center: [55.75, 37.61], // Москва
            zoom: 5,
            controls: []
        });

        const routes = document.querySelectorAll('.route');

        // 🔥 обработка кликов
        routes.forEach(item => {
            item.addEventListener('click', () => {

                routes.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                buildRoute(item.dataset.route);
            });
        });

        // 🔥 первый маршрут при загрузке
        const first = document.querySelector('.route.active') || routes[0];

        if (first) {
            buildRoute(first.dataset.route);
        }
    }

    // ======================
    // BUILD ROUTE
    // ======================

    function buildRoute(routeString) {

        if (!routeString || !map) return;

        if (currentRoute) {
            map.geoObjects.remove(currentRoute);
        }

        const points = routeString.split(',').map(p => p.trim());

        ymaps.route(points, {
            mapStateAutoApply: true
        }).then(route => {

            currentRoute = route;

            const paths = route.getPaths();

            paths.options.set({
                strokeColor: '#c89b3c',
                strokeWidth: 4,
                opacity: 0.9
            });

            // hover
            paths.events.add('mouseenter', () => {
                paths.options.set({ strokeWidth: 6, opacity: 1 });
            });

            paths.events.add('mouseleave', () => {
                paths.options.set({ strokeWidth: 4, opacity: 0.9 });
            });

            map.geoObjects.add(route);

            // ======================
            // 🔥 SAFE DELIVERY BLOCK
            // ======================

            // расстояние ВСЕГДА
            const distance = route.getHumanLength();

            // по умолчанию — старое время
            let deliveryTime = route.getHumanTime();

            const rawDistance = route.getLength();
            const km = rawDistance / 1000;

            // берём строку типа "1 д 8 ч"
            const humanTime = route.getHumanTime();

            // парсим дни
            let baseDays = 0;

            const dayMatch = humanTime.match(/(\d+)\s*д/);
            const hourMatch = humanTime.match(/(\d+)\s*ч/);

            if (dayMatch) baseDays += parseInt(dayMatch[1]);
            if (hourMatch) baseDays += Math.ceil(parseInt(hourMatch[1]) / 24);

            // если вдруг вообще нет — fallback
            if (baseDays === 0) {
                baseDays = Math.ceil(km / 700);
            }

            // логистика
            let minAdd = 0;
            let maxAdd = 1;

            if (km > 1500 && km <= 4000) {
                minAdd = 1;
                maxAdd = 2;
            } else if (km > 4000) {
                minAdd = 2;
                maxAdd = 3;
            }

            const minDays = baseDays + minAdd;
            const maxDays = baseDays + maxAdd;

            deliveryTime = `${minDays}–${maxDays} дн.`;


            // вставка
            const activeCard = document.querySelector('.route.active');

            if (activeCard) {
                const meta = activeCard.querySelector('.meta');

                if (meta) {
                    meta.innerHTML = `
          <span>${distance}</span>
          <span style="margin-left:8px;">Доставка ≈ ${deliveryTime}</span>
        `;
                }
            }

        }).catch(err => {
            console.log('ROUTE ERROR:', err);
        });
    }
});