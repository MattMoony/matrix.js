const matrix = {
    shuffle: (a) => {
        a = a.split('');
        for (let i = 0; i < a.length; i++) {
            let t = Math.floor(Math.random()*a.length);
            [a[i],a[t]]=[a[t],a[i]];
        }
        return a.join('');
    },

    gen_new: (can, n) => {
        let chars = 'abcdefghijklmnopqrstuvwxyz0123456789#$%^&*()!;/{}[]';
        let rain = [];

        for (let i = 0; i < n; i++) {
            rain.push(new matrix.DropStream(chars, Math.random()*(can.width-15), Math.random()*750-700));
        }
        return rain;
    },

    DropStream: class {
        constructor(chars, x, y) {
            this.chars = matrix.shuffle(chars);
            this.x = x;
            this.y = y;
            this.cheight = 15;
            this.c = [72, 255, 111];
            this.alpha_fac = 1 / this.chars.length;
            this.trail = 1;
            this.trail_fac = 0.3 / this.trail.length;
        }
    
        draw(can, ctx) {
            ctx.font = 'bold 1.05em Consolas';
            for (let i = 0; i < this.chars.length; i++) {
                for(let j = Math.max(i-this.trail, 0); j < i; j++) {
                    ctx.fillStyle = `rgba(${this.c[0]}, ${this.c[1]}, ${this.c[2]}, ${0+i*this.alpha_fac})`;    
                    ctx.fillText(this.chars[j], this.x, this.y - this.cheight*i);
                }
                ctx.fillStyle = `rgba(${this.c[0]}, ${this.c[1]}, ${this.c[2]}, ${(1-this.y/can.height)-i*this.alpha_fac})`;
                ctx.fillText(this.chars[i], this.x, this.y - this.cheight*i);
            }
        }
    },

    playOn: (can) => {
        let ctx = can.getContext('2d'),
            ds_amount = Math.floor(window.innerWidth*0.03),
            rain = matrix.gen_new(can, ds_amount),
            count = 0;

        window.setInterval(() => {
            ctx.clearRect(0, 0, can.width, can.height);

            rain.forEach(ds => {
                ds.draw(can, ctx);
                ds.y += ds.cheight;
            });

            count++;
            if (count % 40 == 0) {
                count = 0;
                ds_amount = Math.floor(window.innerWidth*0.03);
                rain = [...rain, ...matrix.gen_new(can, ds_amount)].slice(-ds_amount*4);
            }
        }, 80);
    },
}