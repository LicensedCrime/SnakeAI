include("NeuralNet");
include("snake_data");

function SnakeAI(world, snake, food) {
    // # Inputs
    // (u,d,l,r,ur,ul,dr,dl)
    // 1. snake body (8)
    // 2. food (8)
    // 3. wall (8)
    // 

    var m_world = world;
    var m_snake = snake;
    var m_food = food;

    var m_brain = new NeuralNet(24, 16, 4);
    if(typeof snake_data != "undefined") {
        m_brain.load(snake_data);
    }

    var m_learn = false;

    // one does not simply make js be able to have public constants...
    var UP   = 0;
    var RIGHT = 1;
    var DOWN  = 2;
    var LEFT  = 3;

    this.learn = function() { m_learn = true; };

    this.process = function() {
        var inputs = this.fetch_inputs();

        if(true == m_learn) {
            // unsupervized learning
            var train_data = this.observe();
            m_brain.train(inputs, train_data);
            
            //console.log("error", m_brain.get_error());
        }

        var guess = m_brain.guess(inputs);

        // final answer
        var movement = 0;
        var best_guess = 0;
        for(var i = 0; i != guess.length; i++) {
            if(guess[i] > best_guess) {
                movement = i;
                best_guess = guess[i];
            }
        }

        switch(movement) {
            case UP:
                m_snake.on_move_up();
                break;
            case RIGHT:
                m_snake.on_move_right();
                break;
            case DOWN:
                m_snake.on_move_down();
                break;
            case LEFT:
                m_snake.on_move_left();
                break;
        }
    };


    this.fetch_inputs = function() {
        var inputs = new Array(24);

        var data = [];
        data.push( this.fetch_data(0, 1) );
        data.push( this.fetch_data(1, 0) );
        data.push( this.fetch_data(-1, 0) );
        data.push( this.fetch_data(1, 0) );

        data.push( this.fetch_data(1, 1) );
        data.push( this.fetch_data(-1, 1) );
        data.push( this.fetch_data(1, -1) );
        data.push( this.fetch_data(-1, -1) );

        var temp;
        for(var i = 0; i != data.length; i++) {
            temp = data[i];

            inputs[0 + 3*i] = temp[0];
            inputs[1 + 3*i] = temp[1];
            inputs[2 + 3*i] = temp[2];
        }

        return inputs;
    };


    this.fetch_data = function(iterX, iterY) {
        var snake_pos = m_snake.get_position();
        var x = snake_pos.x;
        var y = snake_pos.y;

        var wX = m_world.get_num_cols()-1;
        var wY = m_world.get_num_rows()-1;

        var distance = 1;
        var found_food = false;
        var found_body = false;

        var data = [0, 1, 1];
        var food_pos = m_food.get_position();
        while(x < wX && y < wY && x >= 0 && y >= 0) {
            if(!found_food && food_pos.x == x && food_pos.y == y) {
                data[0] = 1;
                found_food = true;
            }

            if(!found_body && m_snake.collides_body(x, y)) {
                data[1] = 1 / distance;
                found_body = true;
            }

            distance++;
            x += iterX;
            y += iterY;
        }

        data[2] = 1 / distance;

        return data;
    };


    this.observe = function() {
        var direction = m_snake.get_direction();
        var result;

        var snake_pos = m_snake.get_position();
        var x = snake_pos.x;
        var y = snake_pos.y;

        var wX = m_world.get_num_cols();
        var wY = m_world.get_num_rows();

        var food_position = m_food.get_position();
        var fX = food_position.x;
        var fY = food_position.y;

        if(direction == UP || direction == DOWN) {
            result = this.direction_to_array(direction);

            // move towards food
            if(x > fX) {
                result = this.direction_to_array(LEFT);
            } 

            if(x < fX){
                result = this.direction_to_array(RIGHT);
            }

            var new_dir = this.direction_from_array(result);
            if(new_dir == UP && fY > y || new_dir == DOWN && fY < y) {
                result = this.direction_to_array( (Math.round(Math.random()) ? LEFT : RIGHT) );
            }
        }

        if(direction == LEFT || direction == RIGHT) {
            result = this.direction_to_array(direction);

            // move towards food
            if(y > fY) {
                result = this.direction_to_array(DOWN);
            } 
            
            if(y < fY) {
                result = this.direction_to_array(UP);
            }

            var new_dir = this.direction_from_array(result);
            if(new_dir == LEFT && fX > x || new_dir == RIGHT && fX < x) {
                result = this.direction_to_array( (Math.round(Math.random()) ? UP : DOWN) );
            }
        }

        // console.log(
        //     result[0] ? "up" : result[1] ? "right" : result[2] ? "down" : result[3] ? "left" : "undefined"
        // );
        return result;
    };


    this.direction_to_array = function(direction) {
        
        // [UP, RIGHT, DOWN, LEFT]
        switch(direction) {
            case UP:
                return [1, 0, 0, 0];
            case DOWN:
                return [0, 0, 1, 0];
            case LEFT:
                return [0, 0, 0, 1];
            case RIGHT:
                return [0, 1, 0, 0];
        }

        return [1, 0, 0, 0];
    };


    this.direction_from_array = function(arr) {
        if(arr[UP]) { return UP; };
        if(arr[RIGHT]) { return RIGHT; };
        if(arr[DOWN]) { return DOWN; };
        if(arr[LEFT]) { return LEFT; };

        return UP;
    };


    this.on_save = function() {
        m_brain.save();
    };
}
