// --- WebGL 背景アニメーション ---
        let scene, camera, renderer, pts;
        function initWebGL() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            const geo = new THREE.BufferGeometry();
            const pos = [];
            for(let i=0; i<400; i++) pos.push((Math.random()-0.5)*15, (Math.random()-0.5)*15, (Math.random()-0.5)*15);
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x00aaff, size: 0.02, transparent: true, opacity: 0.2 }));
            scene.add(pts);

            function anim() {
                requestAnimationFrame(anim);
                pts.rotation.y += 0.0003;
                renderer.render(scene, camera);
            }
            anim();
        }

        // --- アニメーション監視 ---
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // --- タブ切り替えロジック ---
        function switchTab(name) {
            const tabs = document.querySelectorAll('.tab-content');
            const navs = document.querySelectorAll('.nav-item');
            
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.display = 'none';
                t.style.opacity = '0';
            });
            navs.forEach(n => n.classList.remove('active'));

            const target = document.getElementById('tab-' + name);
            const nav = document.getElementById('nav-' + name);
            
            if (target) {
                target.style.display = 'flex';
                void target.offsetWidth;
                target.classList.add('active');
                target.style.opacity = '1';
                target.scrollTo(0, 0);
                
                const reveals = target.querySelectorAll('.reveal');
                reveals.forEach((r, i) => {
                    setTimeout(() => r.classList.add('visible'), i * 80);
                    observer.observe(r);
                });

                if (name === 'history') {
                    const cards = target.querySelectorAll('.history-card');
                    cards.forEach(card => observer.observe(card));
                }
            }
            if (nav) nav.classList.add('active');
        }

        // --- 初期化 ---
        window.onload = () => {
            initWebGL();
            let p = 0;
            const loaderInt = setInterval(() => {
                p += 5;
                document.getElementById('progress-bar').style.width = p + '%';
                document.getElementById('loader-perc').innerText = `システム起動中: ${p}%`;
                if (p >= 100) {
                    clearInterval(loaderInt);
                    document.getElementById('loader').style.opacity = '0';
                    setTimeout(() => {
                        document.getElementById('loader').style.display = 'none';
                        switchTab('home');
                    }, 1000);
                }
            }, 30);
        };

        window.addEventListener('resize', () => {
            if (renderer) renderer.setSize(window.innerWidth, window.innerHeight);
            if (camera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            }
        });
