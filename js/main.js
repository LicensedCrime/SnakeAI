include("SnakeWorld");
include("Snake");
include("SnakeFood");
include("Renderer");
include("SnakeStage");

onload(function() {
    var canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    canvas.style = "background-color: black;";

    document.body.prepend(canvas);

    var ctx = canvas.getContext("2d");

    var world = new SnakeWorld();
    var snake = new Snake(world);
    var food = new SnakeFood(world);
    
    snake.set_position(5, 5);
    food.set_position(7, 7);

    var renderer = new Renderer(canvas, ctx);

    renderer.add_item(world);
    renderer.add_item(snake);
    renderer.add_item(food);

    renderer.render();

    var stage = new SnakeStage();
    stage.initialize(world, snake, food);
    stage.on_change = renderer.render;

    // stage.run();

    stage.custom_run();
});