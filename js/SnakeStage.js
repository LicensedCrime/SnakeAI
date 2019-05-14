include("EventManager");
include("SnakeAI");

function rand(min, max) { return (max - min) * Math.random() + min; }

function SnakeStage() {
    var m_world;
    var m_snake;
    var m_food;

    var m_ai;

    var m_delay = 100;
    var m_next_time = new Date().getTime() + m_delay;
    var m_current_time = new Date().getTime();

    var m_events = new EventManager();

    this.initialize = function(world, snake, food) {
        m_world = world;
        m_snake = snake;
        m_food = food;

        m_snake.on_die = this.on_snake_die;
        
        m_ai = new SnakeAI(m_world, m_snake, m_food);
        m_ai.learn(); // train flag

        // m_events.on_press_up = m_snake.on_move_up;
        // m_events.on_press_down = m_snake.on_move_down;
        // m_events.on_press_left = m_snake.on_move_left;
        // m_events.on_press_right = m_snake.on_move_right;

        m_events.on_press_ctrl_right = m_ai.on_save;

        m_events.bind();
    };

    this.on_snake_die = function() {
        // m_snake.set_position(5, 5);
        // m_food.set_position(7, 7);

        m_snake.set_position( Math.floor(rand(0, m_world.get_num_cols()-1)) , Math.floor(rand(0, m_world.get_num_rows()-1)) );
        m_food.set_position( Math.floor(rand(0, m_world.get_num_cols()-1)) , Math.floor(rand(0, m_world.get_num_rows()-1)) );
    };


    this.custom_run = function(iterations) {
        var iter = iterations;
        while(iter--) {
            this.run_tick();
        }

        this.run();
        console.log("=== end ===");
    };

    this.run = function() {
        window.requestAnimationFrame(this.run.bind(this));

        if( !this.delay_time_passed() ) { return; }
        this.reset_delay_time();

        this.run_tick();
        this.on_change();
    };


    this.run_tick = function() {
        m_ai.process();
        m_snake.move();

        if(m_snake.collides_with(m_food) || m_snake.self_collision()) {
            var x = parseInt( Math.random() * m_world.get_num_cols() );
            var y = parseInt( Math.random() * m_world.get_num_rows() );
            m_food.set_position(x, y);
            m_snake.grow();

            // m_delay *= 0.8;
        }

        var snake_pos = m_snake.get_position();
        var snake_x = snake_pos.x;
        var snake_y = snake_pos.y;

        var world_cols = m_world.get_num_cols();
        var world_rows = m_world.get_num_rows();
        if( snake_x < 0 || snake_x >= world_cols || snake_y < 0 || snake_y >= world_rows ) {
            m_snake.die();
        }
    };

    this.on_change = function() { console.log("stage changed"); };

    this.get_time = function() { return new Date().getTime(); };

    this.reset_delay_time = function() {
        m_current_time = m_next_time;
        m_next_time = m_next_time + m_delay;
    };


    this.delay_time_passed = function() {
        // 1000 % 0    = 0
        // 0 % 1000    = NaN
        // 1000 % 1000 = 0
        // 1000 % 1001 = 1000
        m_current_time = this.get_time();

        var delta = m_next_time % m_current_time;
        return delta == m_next_time;
    };
}