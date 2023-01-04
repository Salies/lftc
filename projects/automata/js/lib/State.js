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
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Se for o atual, preenche o fundo de azul, e o texto de
        ctx.fillStyle = "#fef08a";
        if(this.current) ctx.fillStyle = "#93c5fd";
        
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.label, this.x, this.y);

        if(this.start) this.drawStart(ctx);

        if(this.accept) this.drawAccept(ctx);

        ctx.restore();
    }

    drawStart(ctx) {
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        /*ctx.moveTo(this.x - this.radius - 25, this.y);
        ctx.lineTo(this.x - this.radius, this.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(this.x - this.radius - 10, this.y - 5);
        ctx.lineTo(this.x - this.radius - 10, this.y + 5);
        ctx.lineTo(this.x - this.radius, this.y);*/
        // Draw a triangle pointing to the left of the state
        // Draw all three lines at once
        ctx.moveTo(this.x - this.radius - 20, this.y - this.radius);
        ctx.lineTo(this.x - this.radius - 20, this.y + this.radius);
        ctx.lineTo(this.x - this.radius - 2, this.y);
        ctx.lineTo(this.x - this.radius - 20, this.y - this.radius);

        ctx.stroke();
        ctx.restore();
    }

    drawAccept(ctx) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 3, 0, 2 * Math.PI);
        ctx.stroke();
    }
}