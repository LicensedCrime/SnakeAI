function EventManager() {

    this.on_press_up = function() {};
    this.on_press_down = function() {};
    this.on_press_left = function() {};
    this.on_press_right = function() {};

    this.unbind = function() { document.onkeydown = null; };
    this.bind = function() { document.onkeydown = this.keydown_events.bind(this); };

    this.keydown_events = function(e) {

        switch(e.code) {
            case "KeyW":
            case "ArrowUp":
                this.on_press_up();
                break;
            case "KeyS":
            case "ArrowDown":
                this.on_press_down();
                break;
            case "KeyA":
            case "ArrowLeft":
                this.on_press_left();
                break;
            case "KeyD":
            case "ArrowRight":
                this.on_press_right();
                break;

            case "ControlRight":
                this.on_press_ctrl_right();
                break;
        }
    };
}