// --- WebGL Neural Network Scene ---
        let scene, camera, renderer, group, points, lines;
        const particleCount = 200;

        function initWebGL() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            camera.position.z = 450;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            document.body.appendChild(renderer.domElement);

            group = new THREE.Group();
            scene.add(group);

            const pos = new Float32Array(particleCount * 3);
            for(let i=0; i<particleCount*3; i++) pos[i] = (Math.random() - 0.5) * 1000;
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({ color: 0x00aaff, size: 2.5, transparent: true, opacity: 0.8 });
            points = new THREE.Points(geo, mat);
            group.add(points);

            const lGeo = new THREE.BufferGeometry();
            const lMat = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.15 });
            lines = new THREE.LineSegments(lGeo, lMat);
            group.add(lines);

            let mX = 0, mY = 0;
            window.addEventListener('mousemove', (e) => {
                mX = (e.clientX - window.innerWidth / 2) * 0.1;
                mY = (e.clientY - window.innerHeight / 2) * 0.1;
            });

            const animate = () => {
                requestAnimationFrame(animate);
                group.rotation.y += 0.0006;
                group.rotation.x += 0.0002;
                camera.position.x += (mX - camera.position.x) * 0.05;
                camera.position.y += (-mY - camera.position.y) * 0.05;
                camera.lookAt(scene.position);

                const posArr = points.geometry.attributes.position.array;
                const lPos = [];
                for(let i=0; i<particleCount; i++) {
                    for(let j=i+1; j<particleCount; j++) {
                        const d = Math.sqrt(
                            Math.pow(posArr[i*3] - posArr[j*3], 2) +
                            Math.pow(posArr[i*3+1] - posArr[j*3+1], 2) +
                            Math.pow(posArr[i*3+2] - posArr[j*3+2], 2)
                        );
                        if(d < 120) {
                            lPos.push(posArr[i*3], posArr[i*3+1], posArr[i*3+2]);
                            lPos.push(posArr[j*3], posArr[j*3+1], posArr[j*3+2]);
                        }
                    }
                }
                lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(lPos, 3));
                renderer.render(scene, camera);
            };
            animate();
        }

        // --- History / Chronicle Logic ---
        const historyData = [
            { year: "2029", title: "Project: Genesis Mapping", desc: "世界初、非侵襲的量子スキャンにより生体脳の完全なシナプス結合パターンをデータ化することに成功。" },
            { year: "2034", title: "Neural Sync Alpha", desc: "抽出された意識データと生体脳のリアルタイム同期を確立。被験者は二つの視点を同時に体験することとなった。" },
            { year: "2041", title: "Identity Freedom Act", desc: "デジタル存在の法的権利が認められる。NODE LABは世界唯一の公認意識保管機関として選出された。" },
            { year: "2048", title: "The Sovereign Network", desc: "物理サーバーを必要としない、量子もつれを利用した分散型レジャー上の意識保持システムが稼働。" },
            { year: "2055", title: "Infinite Loop", desc: "肉体の寿命を迎えた後、意識がネットワーク上で完全に再起動。人類は初めて「死」をデータの再配置へと変えた。" }
        ];

        const track = document.getElementById('history-track');
        const mainLine = document.getElementById('main-timeline-line');
        let scrollX = 0;
        let isDragging = false;
        let startX = 0;
        let activeIndex = -1;
        const nodeSpacing = 450;

        function setupHistory() {
            track.innerHTML = '';
            const centerOffset = window.innerWidth / 2;
            const totalWidth = (historyData.length + 1) * nodeSpacing + window.innerWidth;
            track.style.width = totalWidth + 'px';
            mainLine.style.width = totalWidth + 'px';

            historyData.forEach((data, i) => {
                const x = (i + 1) * nodeSpacing + (centerOffset - nodeSpacing);
                const wrapper = document.createElement('div');
                wrapper.className = 'history-node-wrapper';
                wrapper.style.left = `${x - 150}px`;
                wrapper.style.top = `0`;
                wrapper.style.height = `100%`;
                
                const isEven = i % 2 === 0;
                
                wrapper.innerHTML = `
                    <div class="node-vertical-line ${isEven ? 'up' : 'down'}"></div>
                    <div class="flex flex-col items-center justify-center h-full">
                        <div class="history-node" onclick="snapTo(${i})"></div>
                        <div class="absolute font-orbitron text-blue-500 font-bold tracking-[0.2em] ${isEven ? '-top-10' : '-bottom-10'}">
                            ${data.year}
                        </div>
                    </div>
                `;
                track.appendChild(wrapper);
            });
        }

        function snapTo(index) {
            const centerOffset = window.innerWidth / 2;
            const targetPos = (index + 1) * nodeSpacing + (centerOffset - nodeSpacing);
            scrollX = -(targetPos - centerOffset);
            
            // Limit scroll
            const maxScroll = 0;
            const minScroll = -(track.offsetWidth - window.innerWidth);
            scrollX = Math.max(minScroll, Math.min(maxScroll, scrollX));

            track.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
            mainLine.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
            track.style.transform = `translateX(${scrollX}px)`;
            mainLine.style.transform = `translateX(${scrollX}px) translateY(-50%)`;
            updateHistory(index);
        }

        function updateHistory(forcedIdx) {
            const centerOffset = window.innerWidth / 2;
            let idx = forcedIdx;
            if (idx === undefined) {
                let minD = Infinity;
                historyData.forEach((_, i) => {
                    const nodeX = (i + 1) * nodeSpacing + (centerOffset - nodeSpacing);
                    const d = Math.abs(nodeX - (-scrollX + centerOffset));
                    if(d < minD) { minD = d; idx = i; }
                });
            }
            const safeIdx = Math.max(0, Math.min(historyData.length - 1, idx));
            document.querySelectorAll('.history-node').forEach((n, i) => {
                n.classList.toggle('active', i === safeIdx);
            });

            if(safeIdx !== activeIndex) {
                activeIndex = safeIdx;
                const d = historyData[activeIndex];
                const detail = document.getElementById('history-detail');
                detail.style.opacity = 0;
                detail.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    document.getElementById('hist-year').innerText = d.year;
                    document.getElementById('hist-title').innerText = d.title;
                    document.getElementById('hist-desc').innerText = d.desc;
                    detail.style.opacity = 1;
                    detail.style.transform = 'translateY(0)';
                }, 300);
            }
        }

        // --- Viewport Events ---
        const hViewport = document.getElementById('history-viewport');
        hViewport.addEventListener('mousedown', (e) => { 
            isDragging = true; 
            startX = e.pageX - scrollX; 
            track.style.transition = 'none'; 
            mainLine.style.transition = 'none';
        });
        window.addEventListener('mouseup', () => { 
            if(!isDragging) return; 
            isDragging = false; 
            snapTo(activeIndex); 
        });
        window.addEventListener('mousemove', (e) => { 
            if(!isDragging) return; 
            scrollX = e.pageX - startX; 
            
            const maxScroll = 100;
            const minScroll = -(track.offsetWidth - window.innerWidth + 100);
            scrollX = Math.max(minScroll, Math.min(maxScroll, scrollX));

            track.style.transform = `translateX(${scrollX}px)`; 
            mainLine.style.transform = `translateX(${scrollX}px) translateY(-50%)`;
            updateHistory();
        });
        hViewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            scrollX -= e.deltaY * 2.0;
            
            const maxScroll = 100;
            const minScroll = -(track.offsetWidth - window.innerWidth + 100);
            scrollX = Math.max(minScroll, Math.min(maxScroll, scrollX));

            track.style.transition = 'none';
            mainLine.style.transition = 'none';
            track.style.transform = `translateX(${scrollX}px)`;
            mainLine.style.transform = `translateX(${scrollX}px) translateY(-50%)`;
            updateHistory();
            
            clearTimeout(window.snapTimeout);
            window.snapTimeout = setTimeout(() => snapTo(activeIndex), 150);
        }, { passive: false });

        // --- Tab Switching ---
        function switchTab(name) {
            const currentTab = document.querySelector('.tab-content.active');
            if(currentTab && currentTab.id === 'tab-'+name) return;

            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.getElementById('nav-'+name).classList.add('active');

            if(currentTab) {
                currentTab.style.opacity = 0;
                currentTab.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    currentTab.classList.remove('active');
                    showNewTab(name);
                }, 400);
            } else {
                showNewTab(name);
            }
        }

        function showNewTab(name) {
            const newTab = document.getElementById('tab-'+name);
            newTab.classList.add('active');
            setTimeout(() => {
                newTab.style.opacity = 1;
                newTab.style.transform = 'translateY(0)';
                if(name === 'history') {
                    setupHistory();
                    snapTo(0);
                }
                handleReveal();
            }, 50);
            document.getElementById('main-viewport').scrollTop = 0;
        }

        function handleReveal() {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 50) el.classList.add('visible');
            });
        }
        document.getElementById('main-viewport').addEventListener('scroll', handleReveal);

        // --- Init ---
        window.onload = () => {
            let p = 0;
            const int = setInterval(() => {
                p += Math.random() * 8;
                if(p > 100) p = 100;
                document.getElementById('progress-bar').style.width = p + '%';
                document.getElementById('loader-perc').innerText = `SYNCING TIMELINE: ${Math.floor(p)}%`;
                if(p >= 100) {
                    clearInterval(int);
                    document.getElementById('loader').style.opacity = 0;
                    setTimeout(() => {
                        document.getElementById('loader').style.display = 'none';
                        switchTab('home');
                    }, 1200);
                }
            }, 40);
            initWebGL();
        };

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if(document.getElementById('tab-history').classList.contains('active')) setupHistory();
        });
