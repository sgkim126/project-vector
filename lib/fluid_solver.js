//
// Javascript rip-off of the Navier-Stokes-Solver by Jos Stam: http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf

'use strict';

function FluidSolver() {
    this.N = 14;
    this.SIZE = (this.N + 2) * (this.N + 2);
    this.accuracy = 6;

    this.u = [];
    this.v = [];
    this.u_prev = [];
    this.v_prev = [];
    this.dense = [];
    this.dense_prev = [];
    this.tmp = [];

    for (var i = 0; i < this.SIZE; i++) {

        this.u[i] = 0;
        this.v[i] = 0;
        this.u_prev[i] = 0;
        this.v_prev[i] = 0;
        this.dense[i] = 0;
        this.dense_prev[i] = 0;

    }

}
FluidSolver.prototype = {
    getDx: function(x, y) {
        return this.u[this.INDEX(x + 1, y + 1)];
    },
    getDy: function(x, y) {
        return this.v[this.INDEX(x + 1, y + 1)];
    },
    lerp: function(v1, v2, i) {
        return v2 * i + v1 * (1 - i);
    },
    applyForce: function(x, y, vx, vy) {
        var cellX0 = Math.floor(x) + 1;
        var cellY0 = Math.floor(y) + 1;
        var cellX1 = Math.floor(x) + 2;
        var cellY1 = Math.floor(y) + 2;
        var fracX = (x + 1) - cellX0;
        var fracY = (y + 1) - cellY0;
        var dx0 = this.u[this.INDEX(cellX0, cellY0)];
        var dy0 = this.v[this.INDEX(cellX0, cellY0)];
        var dx1 = this.u[this.INDEX(cellX1, cellY0)];
        var dy1 = this.v[this.INDEX(cellX1, cellY0)];
        var dx2 = this.u[this.INDEX(cellX0, cellY1)];
        var dy2 = this.v[this.INDEX(cellX0, cellY1)];
        var dx3 = this.u[this.INDEX(cellX1, cellY1)];
        var dy3 = this.v[this.INDEX(cellX1, cellY1)];
        var fx0 = (vx !== 0) ? this.lerp(vx, dx0, 0.85) : dx0;
        var fy0 = (vy !== 0) ? this.lerp(vy, dy0, 0.85) : dy0;
        var fx1 = (vx !== 0) ? this.lerp(vx, dx1, 0.85) : dx1;
        var fy1 = (vy !== 0) ? this.lerp(vy, dy1, 0.85) : dy1;
        var fx2 = (vx !== 0) ? this.lerp(vx, dx2, 0.85) : dx2;
        var fy2 = (vy !== 0) ? this.lerp(vy, dy2, 0.85) : dy2;
        var fx3 = (vx !== 0) ? this.lerp(vx, dx1, 0.85) : dx3;
        var fy3 = (vy !== 0) ? this.lerp(vy, dy1, 0.85) : dy3;
        this.u[this.INDEX(cellX0, cellY0)] = fx0 * (1 - fracX);
        this.v[this.INDEX(cellX0, cellY0)] = fy0 * (1 - fracY);
        this.u[this.INDEX(cellX1, cellY0)] = fx1 * fracX;
        this.v[this.INDEX(cellX1, cellY0)] = fy1 * (1 - fracY);
        this.u[this.INDEX(cellX0, cellY1)] = fx2 * fracX;
        this.v[this.INDEX(cellX0, cellY1)] = fy2 * (1 - fracY);
        this.u[this.INDEX(cellX1, cellY1)] = fx3 * fracX;
        this.v[this.INDEX(cellX1, cellY1)] = fy3 * fracY;
    },
    applyForceIntegerPosition: function(cellX, cellY, vx, vy) {
        cellX = Math.floor(cellX + 1);
        cellY = Math.floor(cellY + 1);
        var dx = this.u[this.INDEX(cellX, cellY)];
        var dy = this.v[this.INDEX(cellX, cellY)];
        this.u[this.INDEX(cellX, cellY)] = (vx !== 0) ? this.lerp(vx, dx, 0.85) : dx;
        this.v[this.INDEX(cellX, cellY)] = (vy !== 0) ? this.lerp(vy, dy, 0.85) : dy;
    },
    applyRadialForce: function(x, y, v) {
        for (var gy = y - 3; gy < y + 2; gy++) {
            for (var gx = x - 3; gx < x + 2; gx++) {
                var vx = gx - x;
                var vy = gy - y;
                var d = Math.sqrt(vx * vx + vy * vy);
                if (d > 0.1) {
                    vx /= d; vy /= d;
                    vx /= d; vy /= d;
                    this.applyForce(x, y, vx * v, vy * v);
                }
            }
        }
    },
    tick: function(dt, visc, diff) {
        this.vel_step(this.u, this.v, this.u_prev, this.v_prev, visc, dt);
        //this.dens_step(this.dense, this.dense_prev, this.u, this.v, diff, dt);
    },
    INDEX: function(i, j) {
        return i + (this.N + 2) * j;
    },
    COPY: function (a, b) {
        for (var i = 0; i< b.length; i++) {
            a[i] = b[i];
        }
    },
    SWAP: function(x0, x) {
        this.COPY(this.tmp, x0);
        this.COPY(x0, x);
        this.COPY(x, this.tmp);
        //this.tmp = x0.slice();
        //x0 = x.slice();
        //x = this.tmp.slice();
    },
    add_source: function(x, s, dt) {
        var size = (this.N + 2) * (this.N + 2);
        for (var i = 0; i < size; i++)
            x[i] += dt * s[i];
    },
    diffuse: function(b, x, x0, diff, dt) {
        var i, j, k;
        var a = dt * diff * this.N * this.N;
        for (k = 0; k < this.accuracy; k++) {
            for (i = 1; i <= this.N; i++) {
                for (j = 1; j <= this.N; j++) {
                    x[this.INDEX(i, j)] = (x0[this.INDEX(i, j)] + a * (x[this.INDEX(i - 1, j)] + x[this.INDEX(i + 1, j)] + x[this.INDEX(i, j - 1)] + x[this.INDEX(i, j + 1)])) / (1 + 4 * a);
                }
            }
            this.set_bnd(b ,x);
        }
    },
    advect: function(b, d, d0, u, v, dt) {
        var i, j, i0, j0, i1, j1;
        var x, y, s0, t0, s1, t1, dt0;
        dt0 = dt * this.N;
        for (i = 1; i <= this.N; i++) {
            for (j = 1; j <= this.N; j++) {
                x = i - dt0 * u[this.INDEX(i, j)];
                y = j - dt0 * v[this.INDEX(i, j)];
                if (x < 0.5) x = 0.5;
                if (x > this.N + 0.5)x = this.N + 0.5;
                i0 = Math.floor(x);
                i1 = i0 + 1;
                if (y < 0.5) y = 0.5;
                if (y > this.N + 0.5) y = this.N + 0.5;
                j0 = Math.floor(y);
                j1 = j0 + 1;
                s1 = x - i0;
                s0 = 1 - s1;
                t1 = y - j0;
                t0 = 1 - t1;
                d[this.INDEX(i, j)] = s0 * (t0 * d0[this.INDEX(i0, j0)] + t1 * d0[this.INDEX(i0, j1)]) + s1 * (t0 * d0[this.INDEX(i1, j0)] + t1 * d0[this.INDEX(i1, j1)]);
            }
        }
        this.set_bnd(b, d);
    },
    set_bnd: function(b, x) {
        var i;
        for (i = 1; i <= this.N; i++) {
            x[this.INDEX(0, i)] = (b == 1) ? -x[this.INDEX(1, i)] : x[this.INDEX(1, i)];
            x[this.INDEX(this.N + 1, i)] = b == 1 ? -x[this.INDEX(this.N, i)] : x[this.INDEX(this.N, i)];
            x[this.INDEX(i, 0)] = b == 2 ? -x[this.INDEX(i, 1)] : x[this.INDEX(i, 1)];
            x[this.INDEX(i, this.N + 1)] = b == 2 ? -x[this.INDEX(i, this.N)] : x[this.INDEX(i, this.N)];
        }
        x[this.INDEX(0, 0)] = 0.5 * (x[this.INDEX(1, 0)] + x[this.INDEX(0, 1)]);
        x[this.INDEX(0, this.N + 1)] = 0.5 * (x[this.INDEX(1, this.N + 1)] + x[this.INDEX(0, this.N)]);
        x[this.INDEX(this.N + 1, 0)] = 0.5 * (x[this.INDEX(this.N, 0)] + x[this.INDEX(this.N + 1, 1)]);
        x[this.INDEX(this.N + 1, this.N + 1)] = 0.5 * (x[this.INDEX(this.N, this.N + 1)] + x[this.INDEX(this.N + 1, this.N)]);
    },
    dens_step: function(x, x0, u, v, diff, dt) {
        this.add_source(x, x0, dt);
        this.SWAP(x0, x);
        this.diffuse(0, x, x0, diff, dt);
        this.SWAP(x0, x);
        this.advect(0, x, x0, u, v, dt);
    },
    vel_step: function(u, v, u0, v0, visc, dt) {
        this.add_source(u, u0, dt);
        this.add_source(v, v0, dt);
        this.SWAP(u0, u);
        this.diffuse(1, u, u0, visc, dt);
        this.SWAP(v0, v);
        this.diffuse(2, v, v0, visc, dt);
        this.project(u, v, u0, v0);
        this.SWAP(u0, u);
        this.SWAP(v0, v);
        this.advect(1, u, u0, u0, v0, dt);
        this.advect(2, v, v0, u0, v0, dt);
        this.project(u, v, u0, v0);
    },
    project: function(u, v, p, div) {
        var i, j, k;
        var h;
        h = 1.0 / this.N;
        for (i = 1; i <= this.N; i++) {
            for (j = 1; j <= this.N; j++) {
                div[this.INDEX(i, j)] = -0.5 * h * (u[this.INDEX(i + 1, j)] - u[this.INDEX(i - 1, j)] + v[this.INDEX(i, j + 1)] - v[this.INDEX(i, j - 1)]);
                p[this.INDEX(i, j)] = 0;
            }
        }
        this.set_bnd(0, div);
        this.set_bnd(0, p);
        for (k = 0; k < this.accuracy; k++) {
            for (i = 1; i <= this.N; i++) {
                for (j = 1; j <= this.N; j++) {
                    p[this.INDEX(i, j)] = (div[this.INDEX(i, j)] + p[this.INDEX(i - 1, j)] + p[this.INDEX(i + 1, j)] + p[this.INDEX(i, j - 1)] + p[this.INDEX(i, j + 1)]) / 4;
                }
            }
            this.set_bnd(0, p);
        }
        for (i = 1; i <= this.N; i++) {
            for (j = 1; j <= this.N; j++) {
                u[this.INDEX(i, j)] -= 0.5 * (p[this.INDEX(i + 1, j)] - p[this.INDEX(i - 1, j)]) / h;
                v[this.INDEX(i, j)] -= 0.5 * (p[this.INDEX(i, j + 1)] - p[this.INDEX(i, j - 1)]) / h;
            }
        }
        this.set_bnd(1, u);
        this.set_bnd(2, v);
    }
};

