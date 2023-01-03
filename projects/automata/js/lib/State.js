class State {
    constructor(x, y, radius, accept, label) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.accept = accept;
        this.label = label;
        this.start = false;
        this.current = false;
    }

    move(x,y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.save();

        if(this.current) {
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillText(this.label, this.x - 7, this.y + 6);

        if(this.start) this.drawStart(ctx);

        if(this.accept) this.drawAccept(ctx);

        ctx.restore();
    }

    drawStart(ctx) {
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.x - this.radius - 25, this.y);
        ctx.lineTo(this.x - this.radius, this.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(this.x - this.radius - 10, this.y - 5);
        ctx.lineTo(this.x - this.radius - 10, this.y + 5);
        ctx.lineTo(this.x - this.radius, this.y);
        ctx.fill();
        ctx.restore();
    }

    drawAccept(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 3, 0, 2 * Math.PI);
        ctx.stroke();
    }
}