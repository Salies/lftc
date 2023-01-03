class Transition {
    constructor(fromState, toState, symbols, x = null, y = null) {
        this.fromState = fromState;
        this.toState = toState;
        this.symbols = symbols;
        this.current = false;

        if (x != null && y != null) {
            this.x = x;
            this.y = y;
            return;
        }

        if (fromState != toState) {
            this.x = (fromState.x + toState.x) / 2;
            this.y = (fromState.y + toState.y) / 2;
            return;
        }

        this.x = fromState.x;
        this.y = fromState.y - fromState.radius - 30;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.save();

        //Symbols/Control Point
        const textHeight = 12;
        const textLength = 10 * this.symbols.length;
        const xCoord = this.x - (textLength / 2);
        const yCoord = this.y + (textHeight / 2);
        ctx.fillText(this.symbols, xCoord, yCoord);

        if (!this.current) {
            this.drawTransition(ctx);
            return;
        }

        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
        this.drawTransition(ctx);
        ctx.restore();
    }

    drawTransition(ctx) {
        if (this.fromState != this.toState) {
            this.drawTransitionDiff(ctx);
            return;
        }

        this.drawTransitionSame(ctx);
    }

    drawTransitionDiff(ctx) {
        const fromPoint = this.getStatePoint(this.fromState.x, this.fromState.y, this.fromState.radius, this.x, this.y);
        const toPoint = this.getStatePoint(this.toState.x, this.toState.y, this.toState.radius, this.x, this.y);

        ctx.beginPath();
        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.quadraticCurveTo(this.x, this.y, toPoint.x, toPoint.y);
        ctx.stroke();

        let arrowAngle = Math.atan((toPoint.y - this.toState.y) / (toPoint.x - this.toState.x)) + (Math.PI / 2);
        if (toPoint.x >= this.toState.x) {
            arrowAngle += Math.PI;
        }

        ctx.save();
        ctx.beginPath();
        ctx.translate(toPoint.x, toPoint.y);
        ctx.rotate(arrowAngle);
        ctx.lineTo(5, 10);
        ctx.lineTo(-5, 10);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();
    }

    drawTransitionSame(ctx) {
        const arcPoint = this.getStatePoint(this.fromState.x, this.fromState.y, this.fromState.radius, this.x, this.y);
        let arrowAngle = Math.atan((arcPoint.y - this.toState.y) / (arcPoint.x - this.toState.x)) + (Math.PI / 2);

        if (arcPoint.x >= this.toState.x)
            arrowAngle += Math.PI;

        ctx.save();
        ctx.beginPath();
        ctx.translate(arcPoint.x, arcPoint.y);
        ctx.rotate(arrowAngle + (10 * (Math.PI / 180)));
        ctx.arc(0, 0, this.fromState.radius, 0, 200 * (Math.PI / 180));
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(this.fromState.x, this.fromState.y);

        ctx.beginPath();
        let r = this.fromState.radius;
        ctx.rotate(arrowAngle + (-40 * (Math.PI / 180)));
        ctx.moveTo(0, r);
        ctx.lineTo(5, 10 + r);
        ctx.lineTo(-5, 10 + r);
        ctx.lineTo(0, r);
        ctx.fill();
        ctx.restore();
    }

    //Gets the point on the edge of a state that is closest
    //to a specified point outside of the state.
    getStatePoint(stateX, stateY, radius, outsideX, outsideY) {
        const A = new Point(outsideX, outsideY);
        const B = new Point(stateX, stateY);

        const opposite = A.y - B.y;
        const adjacent = A.x - B.x;

        const theta = Math.atan(opposite / adjacent);

        const P = new Point(Math.cos(theta) * radius, Math.sin(theta) * radius)

        if (adjacent < 0) {
            P.x *= -1;
            P.y *= -1;
        }

        P.x += B.x;
        P.y += B.y;

        return P;
    }
}
