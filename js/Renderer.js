function Renderer(canvas, ctx) {
    var m_canvas = canvas;
    var m_ctx = ctx;

    var m_items = [];

    this.add_item = function(item) { m_items.push(item); };

    this.render = function() {
        m_ctx.clearRect(0, 0, m_canvas.width, m_canvas.height);

        var item;
        for(var i in m_items) {
            item = m_items[i];

            item.render(m_ctx);
        }
    };
}