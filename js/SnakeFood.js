function SnakeFood(world) {
    var m_x = 0;
    var m_y = 0;

    var m_world = world;


    this.get_position = function() { return { x: m_x,  y: m_y }; };
    this.set_position = function(x, y) {
        m_x = x;
        m_y = y;
    };


    this.render = function(ctx) {
        var pos = m_world.get_tile_position(m_x, m_y);
        var tile_size = m_world.get_tile_size();

        ctx.fillStyle = "red";
        ctx.fillRect(pos.x, pos.y, tile_size, tile_size);
    };
}