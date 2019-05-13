function Matrix(rows, cols) {
    var m_rows = rows | 0;
    var m_cols = cols | 0;

    var m_grid = [];
    for(var y = 0; y != m_rows; y++) {
        m_grid.push([]);

        for(var x = 0; x != m_cols; x++) {
            m_grid[y][x] = 0;
        }
    }


    this.get_rows = function() { return m_rows; };
    this.get_cols = function() { return m_cols; };

    this.get = function(y, x) { return m_grid[y][x]; };
    this.get_grid = function() { return m_grid; };


    this.from_array = function(a) {
        var result = new Matrix(m_rows, m_cols);
        var grid = result.get_grid();

        for(var i = 0; i != a.length; i++) {
            grid[i][0] = a[i];
        }

        return result;
    };


    this.to_array = function() {
        var arr = [];

        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m_cols; x++) {
                arr.push(this.get(y, x));
            }
        }

        return arr;
    };


    this.randomize = function(min, max) {
        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m_cols; x++) {
                m_grid[y][x] = (max - min) * Math.random() + min;
            }
        }
    };

    this.dot = function(m) {
        var result = new Matrix(m_rows, m.get_cols());
        var grid = result.get_grid();

        if(m_cols != m.get_rows()) {
            console.log(m.to_array(), this.to_array());
            throw "fail dot()";
        }

        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m.get_cols(); x++) {
                var sum = 0;

                for(var z = 0; z != m_cols; z++) {
                    sum += this.get(y, z) * m.get(z, x);
                }

                grid[y][x] = sum;
            }
        }

        return result;
    };


    this.substract = function(m) {
        var result = new Matrix(m_rows, m_cols);
        var grid = result.get_grid();

        if(typeof m == "number") {
            for(var y = 0; y != m_rows; y++) {
                for(var x = 0; x != m_cols; x++) {
                    grid[y][x] = this.get(y, x) - m;
                }
            }

            return result;
        }

        
        if(m_cols != m.get_cols() && m_rows != m.get_rows()) {
            throw "fail substract";
        }

        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m_cols; x++) {
                grid[y][x] = this.get(y, x) - m.get(y, x);
            }
        }

        return result;
    };


    this.multiply = function(m) {
        var result = new Matrix(m_rows, m_cols);
        var grid = result.get_grid();

        if(typeof m == "number") {
            for(var y = 0; y != m_rows; y++) {
                for(var x = 0; x != m_cols; x++) {
                    grid[y][x] = this.get(y, x) * m;
                }
            }

            return result;
        }

        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m_cols; x++) {
                grid[y][x] = this.get(y, x) * m.get(y, x);
            }
        }

        return result;
    };


    this.transpose = function() {
        var result = new Matrix(m_cols, m_rows);
        var grid = result.get_grid();

        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m_cols; x++) {
                grid[x][y] = this.get(y, x);
            }
        }

        return result;
    };


    this.add = function(m) {
        var result = new Matrix(m_rows, m_cols);
        var grid = result.get_grid();

        if(typeof m == "number") {
            for(var y = 0; y != m_rows; y++) {
                for(var x = 0; x != m_cols; x++) {
                    grid[y][x] = this.get(y, x) + m;
                }
            }

            return result;
        }

        if(m_cols != m.get_cols() && m_rows != m.get_rows()) {
            throw "fail add()";
        }

        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m_cols; x++) {
                grid[y][x] = this.get(y, x) + m.get(y, x);
            }
        }

        return result;
    };

    this.map = function(callback) {
        var result = new Matrix(m_rows, m_cols);
        var grid = result.get_grid();

        for(var y = 0; y != m_rows; y++) {
            for(var x = 0; x != m_cols; x++) {
                grid[y][x] = callback(m_grid[y][x]);
            }
        }

        return result;
    };
}

Matrix.from_array = function(a) {
    var result = new Matrix(a.length, 1);
    var grid = result.get_grid();

    for(var i = 0; i != a.length; i++) {
        grid[i][0] = a[i];
    }

    return result;
};