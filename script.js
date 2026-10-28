 (function () {
        var cv = document.getElementById("c");
        if (!window.THREE) {
          cv.style.display = "none";
          return;
        }
        var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        var renderer = new THREE.WebGLRenderer({
          canvas: cv,
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        var scene = new THREE.Scene();
        var cam = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        var dl = new THREE.DirectionalLight(0xffffff, 0.9);
        dl.position.set(4, 6, 5);
        scene.add(dl);

        var BLUE = 0x2b45ff,
          YEL = 0xf2d45c,
          WHT = 0xf4f6ff,
          INK = 0x17204a;
        function mesh(g, c) {
          return new THREE.Mesh(
            g,
            new THREE.MeshStandardMaterial({
              color: c,
              flatShading: true,
              roughness: 0.55,
              metalness: 0.05,
            }),
          );
        }
        var objs = [],
          SP = 14;
        function add(o, i) {
          o.userData.i = i;
          scene.add(o);
          objs.push(o);
          o.position.z = -SP * i;
        }

        add(mesh(new THREE.TorusKnotGeometry(1.2, 0.4, 120, 16), BLUE), 0);
        add(mesh(new THREE.IcosahedronGeometry(1.7, 0), YEL), 1);

        var g2 = new THREE.Group();
        [1.9, 1.3, 0.7].forEach(function (r, k) {
          var t = mesh(
            new THREE.TorusGeometry(r, 0.12, 8, 40),
            [BLUE, INK, YEL][k],
          );
          t.rotation.x = k;
          g2.add(t);
        });
        g2.add(mesh(new THREE.OctahedronGeometry(0.45), WHT));
        add(g2, 2);

        var g3 = new THREE.Group();
        for (var k = 0; k < 4; k++) {
          var b = mesh(
            new THREE.BoxGeometry(2 - k * 0.35, 0.45, 2 - k * 0.35),
            [BLUE, WHT, YEL, INK][k],
          );
          b.position.y = k * 0.55 - 0.8;
          b.rotation.y = k * 0.5;
          g3.add(b);
        }
        add(g3, 3);

        var g4 = new THREE.Group();
        g4.add(mesh(new THREE.SphereGeometry(0.8, 12, 8), YEL));
        for (var k = 0; k < 8; k++) {
          var s = mesh(new THREE.ConeGeometry(0.18, 0.9, 6), BLUE);
          var a = (k / 8) * Math.PI * 2;
          s.position.set(Math.cos(a) * 1.4, Math.sin(a) * 1.4, 0);
          s.rotation.z = a - Math.PI / 2;
          g4.add(s);
        }
        add(g4, 4);

        var g5 = new THREE.Group();
        g5.add(mesh(new THREE.SphereGeometry(1.2, 14, 10), WHT));
        var ring = mesh(new THREE.TorusGeometry(1.9, 0.08, 8, 60), BLUE);
        ring.rotation.x = 1.2;
        g5.add(ring);
        add(g5, 5);

        add(mesh(new THREE.TetrahedronGeometry(1.9), INK), 6);
        add(mesh(new THREE.DodecahedronGeometry(1.6), BLUE), 7);

        var N = objs.length,
          sx = 0,
          sy = 0,
          tz = 0,
          mx = 0,
          my = 0;
        var sides = [1, 1, -1, 1, -1, 1, -1, 1];

        function size() {
          var w = innerWidth,
            h = innerHeight,
            narrow = w <= 800;
          renderer.setSize(w, h, false);
          cam.aspect = w / h;
          cam.updateProjectionMatrix();
          objs.forEach(function (o) {
            o.position.x = narrow
              ? 0
              : sides[o.userData.i] * Math.min(3.2, 1.2 + (w / h) * 1.4);
            o.position.y = narrow ? 1.3 : 0;
            o.scale.setScalar(narrow ? 0.8 : 1);
          });
        }
        addEventListener("resize", size);
        size();
        addEventListener("pointermove", function (e) {
          mx = e.clientX / innerWidth - 0.5;
          my = e.clientY / innerHeight - 0.5;
        });

        var last = 0;
        function frame(t) {
          var s = Math.min(N - 1, Math.max(0, scrollY / innerHeight));
          tz += (6 - SP * s - tz) * (reduce ? 1 : 0.08);
          cam.position.z = tz;
          sx += (mx - sx) * 0.05;
          sy += (my - sy) * 0.05;
          cam.position.x = sx * 1.2;
          cam.position.y = -sy * 0.8;
          cam.lookAt(cam.position.x * 0.3, 0, tz - 10);
          if (!reduce) {
            var d = (t - last) / 1000;
            objs.forEach(function (o) {
              o.rotation.y += d * 0.35;
              o.rotation.x += d * 0.12;
            });
          }
          last = t;
          renderer.render(scene, cam);
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      })();
    