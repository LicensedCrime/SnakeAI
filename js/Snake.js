function Snake(world) {
    var m_world = world;

    var UP   = 0;
    var RIGHT = 1;
    var DOWN  = 2;
    var LEFT  = 3;

    var m_direction = UP;
    var m_last_direction = m_direction;

    var m_body = [];
    var m_initial_length = 3;

    var is_growing = false;

    this.get_x = function() { return m_body[0].x; };
    this.get_y = function() { return m_body[0].y; };

    this.get_direction = function() { return m_direction; };

    this.set_position = function(pos_x, pos_y) {

        if(pos_x < m_world.get_num_cols() - m_initial_length) {
            for(var i = 0; i != m_initial_length; i++) {
                m_body.push({ x: pos_x + i, y: pos_y });
            }

            m_direction = LEFT;
            m_last_direction = m_direction;
            return;
        }

        if(pos_y < m_world.get_num_rows() - m_initial_length) {
            for(var i = 0; i != m_initial_length; i++) {
                m_body.push({ x: pos_x, y: pos_y + i });
            }

            m_direction = UP;
            m_last_direction = m_direction;
            return;
        }

        for(var i = 0; i != m_initial_length; i++) {
            m_body.push({ x: pos_x - i, y: pos_y });
        }

        m_direction = RIGHT;
        m_last_direction = m_direction;
    };

    this.on_die = function() { console.log("x_x"); };

    this.die = function() {
        m_body = [];
        
        this.on_die();
    };

    this.grow = function() {
        is_growing = true;
    };

    this.move = function() {
        m_last_direction = m_direction;

        if(!is_growing) {
            this.update_body_parts();
        } else {
            is_growing = false;
            m_body.unshift({
                x: m_body[0].x,
                y: m_body[0].y
            });
        }

        switch(m_direction) {

            case UP:
                this.move_up();
                break;

            case RIGHT:
                this.move_right();
                break;

            case DOWN:
                this.move_down();
                break;

            case LEFT:
                this.move_left();
                break;
        }
    };

    this.update_body_parts = function() {
        for(var i = m_body.length-1; i != 0; i--) {
            m_body[i].x = m_body[i-1].x;
            m_body[i].y = m_body[i-1].y;
        }
    };

    this.move_up = function() { m_body[0].y -= 1; };
    this.move_right = function() { m_body[0].x += 1; };
    this.move_down = function() { m_body[0].y += 1; };
    this.move_left = function() { m_body[0].x -= 1; };


    this.render = function(ctx) {
        var pos;
        var tile_size;

        var part;
        for(var i in m_body) {
            part = m_body[i];

            pos = m_world.get_tile_position(part.x, part.y);
            tile_size = m_world.get_tile_size();

            ctx.fillStyle = "cyan";
            ctx.fillRect(pos.x, pos.y, tile_size, tile_size);
        }
    };


    this.collides_with = function(food) {
        var pos = m_body[0];
        var food_pos = food.get_position();
        return pos.x == food_pos.x && pos.y == food_pos.y;
    };

    this.self_collision = function() {
        return this.collides_body(this.get_x(), this.get_y());
    };

    this.collides_body = function(x, y) {
        for(var i in m_body) {
            if(m_body[i].x == x && m_body.y == y) {
                return true;
            }
        }

        return false;
    };


    this.on_move_up = function() {
        if(m_last_direction == DOWN) { return; }

        m_direction = UP;
    };

    this.on_move_down = function() {
        if(m_last_direction == UP) { return; }

        m_direction = DOWN;
    };

    this.on_move_left = function() {
        if(m_last_direction == RIGHT) { return; }

        m_direction = LEFT;
    };

    this.on_move_right = function() {
        if(m_last_direction == LEFT) { return; }

        m_direction = RIGHT;
    };

}