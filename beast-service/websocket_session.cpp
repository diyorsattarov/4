#include "websocket_session.hpp"
#include <iostream>

// Constructor
websocket_session::websocket_session(tcp::socket&& socket, boost::shared_ptr<shared_state> const& state)
    : ws_(std::move(socket)), state_(state) {
    initialize_product_data();
}

// Destructor
websocket_session::~websocket_session() {
    state_->leave(this);
}

// Initialize product data
void websocket_session::initialize_product_data() {
    for (int i = 1; i <= 25; ++i) {
        std::string id = std::to_string(i);
        std::string product_json = "{\"product_id\": " + id + ", \"name\": \"Product " + id + "\", \"description\": \"Description of Product " + id + "\"}";
        product_data[id] = product_json;
    }

    // Update the total number of products
    totalProducts = product_data.size();
}

// Handle failure
void websocket_session::fail(beast::error_code ec, char const* what) {
    if (ec == net::error::operation_aborted || ec == websocket::error::closed)
        return;
    std::cerr << what << ": " << ec.message() << "\n";
}

// Handle accept
void websocket_session::on_accept(beast::error_code ec) {
    if (ec)
        return fail(ec, "accept");
    state_->join(this);
    ws_.async_read(buffer_, beast::bind_front_handler(&websocket_session::on_read, shared_from_this()));
}

// Read operation
void websocket_session::on_read(beast::error_code ec, std::size_t bytes_transferred) {
    std::cout << "Read operation started. Bytes transferred: " << bytes_transferred << std::endl;
    if (ec) {
        std::cerr << "Read error: " << ec.message() << std::endl;
        return fail(ec, "read");
    }
    std::string received_msg = beast::buffers_to_string(buffer_.data());
    std::cout << "Received message: " << received_msg << std::endl;
    try {
        nlohmann::json json_msg = nlohmann::json::parse(received_msg);
        if (json_msg.contains("method")) {
            std::string method = json_msg["method"];
            if (method == "get_all_products") {
                handle_get_all_products(json_msg);
            } else if (method == "get_product") {
                handle_get_product(json_msg);
            } else {
                std::string error_msg = "ERROR: Invalid method";
                state_->send(error_msg);
                std::cout << "Sent error response for invalid method." << std::endl;
            }
        } else {
            std::string error_msg = "ERROR: Missing 'method' parameter";
            state_->send(error_msg);
            std::cout << "Sent error response for missing 'method' parameter." << std::endl;
        }
    } catch (const nlohmann::json::exception& ex) {
        std::cerr << "JSON parsing error: " << ex.what() << std::endl;
        std::string error_msg = "ERROR: Invalid JSON format";
        state_->send(error_msg);
        std::cout << "Sent error response for invalid JSON format." << std::endl;
    }
    buffer_.consume(buffer_.size());
    ws_.async_read(buffer_, beast::bind_front_handler(&websocket_session::on_read, shared_from_this()));
    std::cout << "Read operation completed." << std::endl;
}

// Send operation
void websocket_session::send(boost::shared_ptr<std::string const> const& ss) {
    net::post(ws_.get_executor(), beast::bind_front_handler(&websocket_session::on_send, shared_from_this(), ss));
}

// On send
void websocket_session::on_send(boost::shared_ptr<std::string const> const& ss) {
    queue_.push_back(ss);
    if (queue_.size() > 1)
        return;
    ws_.async_write(net::buffer(*queue_.front()), beast::bind_front_handler(&websocket_session::on_write, shared_from_this()));
}

// On write
void websocket_session::on_write(beast::error_code ec, std::size_t) {
    if (ec)
        return fail(ec, "write");
    queue_.erase(queue_.begin());
    if (!queue_.empty())
        ws_.async_write(net::buffer(*queue_.front()), beast::bind_front_handler(&websocket_session::on_write, shared_from_this()));
}

// Handle get_all_products method
void websocket_session::handle_get_all_products(const nlohmann::json& json_msg) {
    // Extract pagination parameters from json_msg
    int page = json_msg.value("page", 1); // Default to page 1 if not specified
    int limit = json_msg.value("limit", 10); // Default to 10 items per page if not specified

    // Calculate the starting index and the ending index for the requested page
    int start_index = (page - 1) * limit;
    int end_index = start_index + limit;

    // Create a JSON array to hold the products for the requested page
    nlohmann::json products_json = nlohmann::json::array();

    // Add products to the JSON array based on the calculated indices
    for (int i = start_index; i < end_index && i < product_data.size(); ++i) {
        std::string id = std::to_string(i + 1); // +1 because product IDs start from 1
        if (product_data.find(id) != product_data.end()) {
            products_json.push_back(nlohmann::json::parse(product_data[id]));
        }
    }

    nlohmann::json response_json = {
        {"products", products_json},
        {"totalProducts", totalProducts}
    };

    state_->send(response_json.dump());
    std::cout << "Sent response with all products." << std::endl;
}


// Handle get_product method
void websocket_session::handle_get_product(const nlohmann::json& json_msg) {
    if (json_msg.contains("product_id")) {
        std::string product_id = json_msg["product_id"];
        if (product_data.find(product_id) != product_data.end()) {
            state_->send(product_data[product_id]);
            std::cout << "Sent response for get_product method with product ID " << product_id << std::endl;
        } else {
            std::string error_msg = "ERROR: Product not found";
            state_->send(error_msg);
            std::cout << "Sent error response for invalid product ID." << std::endl;
        }
    } else {
        std::string error_msg = "ERROR: Missing 'product_id' parameter";
        state_->send(error_msg);
        std::cout << "Sent error response for missing 'product_id' parameter." << std::endl;
    }
}
