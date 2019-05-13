function SnakeWorld() {
    var m_tile_size = 15;
    var m_padding = 10;
    var m_gap_size = 1;

    var m_offset_x = 20;
    var m_offset_y = 20;

    var m_cols = 20;
    var m_rows = 20;

    var m_width = m_cols * m_tile_size + m_cols * m_gap_size + 2 * m_padding;
    var m_height = m_rows * m_tile_size + m_rows * m_gap_size + 2 * m_padding;

    this.get_tile_size = function() { return m_tile_size; };

    this.get_num_cols = function() { return m_cols; };
    this.get_num_rows = function() { return m_rows; };

    this.render = function(ctx) {
        ctx.fillStyle = "orange";
        ctx.fillRect(m_offset_x, m_offset_y, m_width, m_height);
    
        ctx.fillStyle = "white";
        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m_cols; x++) {
                ctx.fillRect(
                    m_offset_x + m_padding + x * m_tile_size + x * m_gap_size,
                    m_offset_y + m_padding + y * m_tile_size + y * m_gap_size,
                    m_tile_size, m_tile_size
                );
            }
        }
    };

    this.get_tile_position = function(x, y) {
        return {
            x: m_offset_x + m_padding + x * m_tile_size + x * m_gap_size,
            y: m_offset_y + m_padding + y * m_tile_size + y * m_gap_size
        };
    };
}