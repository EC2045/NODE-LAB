function showTab(id) {
            const sections = document.querySelectorAll('.tab-section');
            const navLinks = document.querySelectorAll('.nav-link');

            sections.forEach(s => {
                s.style.opacity = '0';
                s.style.transform = 'translateY(10px)';
                setTimeout(() => s.classList.remove('active'), 200);
            });

            navLinks.forEach(n => n.classList.remove('active'));

            setTimeout(() => {
                const target = document.getElementById(id);
                target.classList.add('active');
                document.getElementById('btn-' + id).classList.add('active');

                setTimeout(() => {
                    target.style.opacity = '1';
                    target.style.transform = 'translateY(0)';

                    const texts = target.querySelectorAll('.reveal-text');
                    texts.forEach((t, i) => {
                        setTimeout(() => t.classList.add('visible'), i * 80);
                    });
                }, 100);
            }, 300);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function handleReveal() {
            const activeSection = document.querySelector('.tab-section.active');
            if (!activeSection) return;
            const reveals = activeSection.querySelectorAll('.reveal-text');
            reveals.forEach(r => {
                const rect = r.getBoundingClientRect();
                if (rect.top < window.innerHeight - 50) r.classList.add('visible');
            });
        }

        window.addEventListener('scroll', handleReveal);

        document.addEventListener('DOMContentLoaded', () => {
            let progress = 0;
            const progressFill = document.getElementById('progress');
            const loader = document.getElementById('loader');

            const loading = setInterval(() => {
                progress += Math.floor(Math.random() * 20) + 5;
                if (progress > 100) progress = 100;
                progressFill.style.width = progress + '%';

                if (progress === 100) {
                    clearInterval(loading);
                    setTimeout(() => {
                        loader.style.opacity = '0';
                        setTimeout(() => {
                            loader.style.display = 'none';
                            showTab('home');
                        }, 800);
                    }, 400);
                }
            }, 80);
        });
