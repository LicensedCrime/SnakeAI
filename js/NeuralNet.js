include("Matrix");

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
function dsigmoid(x) { return x * (1 - x); }

function NeuralNet(num_input, num_hidden, num_output) {
    var min_val = -1;
    var max_val = 1;

    var m_learning_rate = 0.01;

    var m_bias_hidden = new Matrix(num_hidden, 1);
    var m_bias_output = new Matrix(num_output, 1);

    var m_hidden_matrix = new Matrix(num_hidden, num_input);
    var m_output_matrix = new Matrix(num_output, num_hidden);

    var m_last_error = [];

    m_bias_hidden.randomize(min_val, max_val);
    m_bias_output.randomize(min_val, max_val);

    m_hidden_matrix.randomize(min_val, max_val);
    m_output_matrix.randomize(min_val, max_val);

    this.activate = function(x) { return sigmoid(x); };
    this.derivative = function(x) { return dsigmoid(x); };

    // default will be sigmoid if not set
    this.set_activator = function(activate, derivative) {
        this.activate = activate;
        this.derivative = derivative;
    };

    this.guess = function(inputs) {
        var input = Matrix.from_array(inputs);

        var hidden_layer = m_hidden_matrix.dot(input);
        hidden_layer = hidden_layer.add(m_bias_hidden);
        hidden_layer = hidden_layer.map(sigmoid);

        var output_layer = m_output_matrix.dot(hidden_layer);
        output_layer = output_layer.add(m_bias_output);
        output_layer = output_layer.map(sigmoid);

        return output_layer.to_array();
    };

    this.train = function(inputs, data) {
        // calculate error by using our example data
        var input = Matrix.from_array(inputs);
        var target = Matrix.from_array(data);

        var hidden_layer = m_hidden_matrix.dot(input);
        hidden_layer = hidden_layer.add(m_bias_hidden);
        hidden_layer = hidden_layer.map(this.activate);

        var output_layer = m_output_matrix.dot(hidden_layer);
        output_layer = output_layer.add(m_bias_output);
        output_layer = output_layer.map(this.activate);

        var output_error = target.substract(output_layer);
        m_last_error = output_error;
        
        // backpropagation
        var hidden_error = m_output_matrix.transpose().dot(output_error);

        var output_delta = output_layer.map(this.derivative);
        output_delta = output_delta.multiply(output_error);
        output_delta = output_delta.multiply(m_learning_rate);
        output_delta = output_delta.dot(hidden_layer.transpose());

        var hidden_delta = hidden_layer.map(this.derivative);
        hidden_delta = hidden_delta.multiply(hidden_error);
        hidden_delta = hidden_delta.multiply(m_learning_rate);
        hidden_delta = hidden_delta.dot(input.transpose());
        
        m_output_matrix = m_output_matrix.add(output_delta);
        m_hidden_matrix = m_hidden_matrix.add(hidden_delta);
    };

    this.get_error = function() { return m_last_error.to_array(); };

    this.save = function() {
        var json_data = {
            bias_hidden: m_bias_hidden,
            bias_output: m_bias_output,
            hidden: m_hidden_matrix.to_array(),
            output: m_output_matrix.to_array()
        };

        console.log( JSON.stringify(json_data) );
    };

    this.load = function(data) {
        var raw = JSON.parse(data);

        m_bias_hidden = raw.bias_hidden;
        m_bias_output = raw.bias_output;
        m_hidden_matrix = raw.hidden;
        m_output_matrix = raw.output;
    };
}