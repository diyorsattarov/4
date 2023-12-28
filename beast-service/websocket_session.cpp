#include "websocket_session.hpp"
#include "json.hpp"
#include <iostream>

websocket_session::websocket_session(
    tcp::socket&& socket,
    boost::shared_ptr<shared_state> const& state)
    : ws_(std::move(socket))
    , state_(state)
{
    initialize_product_data();
}

websocket_session::
~websocket_session()
{
    // Remove this session from the list of active sessions
    state_->leave(this);
}

void websocket_session::initialize_product_data()
{
    // Populate the product_data map
    product_data = {
        {"1", "{\"product_id\": 1, \"name\": \"Product One\", \"description\": \"Description of Product One\"}"},
        {"2", "{\"product_id\": 2, \"name\": \"Product Two\", \"description\": \"Description of Product Two\"}"},
        {"3", "{\"product_id\": 3, \"name\": \"Product Three\", \"description\": \"Description of Product Three\"}"},
        {"4", "{\"product_id\": 4, \"name\": \"Product Four\", \"description\": \"Description of Product Four\"}"},
        {"5", "{\"product_id\": 5, \"name\": \"Product Five\", \"description\": \"Description of Product Five\"}"},
        {"6", "{\"product_id\": 6, \"name\": \"Product Six\", \"description\": \"Description of Product Six\"}"},
        {"7", "{\"product_id\": 7, \"name\": \"Product Seven\", \"description\": \"Description of Product Seven\"}"},
        {"8", "{\"product_id\": 8, \"name\": \"Product Eight\", \"description\": \"Description of Product Eight\"}"},
        {"9", "{\"product_id\": 9, \"name\": \"Product Nine\", \"description\": \"Description of Product Nine\"}"},
        {"10", "{\"product_id\": 10, \"name\": \"Product Ten\", \"description\": \"Description of Product Ten\"}"}
    };
}

void
websocket_session::
fail(beast::error_code ec, char const* what)
{
    // Don't report these
    if( ec == net::error::operation_aborted ||
        ec == websocket::error::closed)
        return;

    std::cerr << what << ": " << ec.message() << "\n";
}

void
websocket_session::
on_accept(beast::error_code ec)
{
    // Handle the error, if any
    if(ec)
        return fail(ec, "accept");

    // Add this session to the list of active sessions
    state_->join(this);

    // Read a message
    ws_.async_read(
        buffer_,
        beast::bind_front_handler(
            &websocket_session::on_read,
            shared_from_this()));
}

void websocket_session::on_read(beast::error_code ec, std::size_t bytes_transferred)
{
    // Log the start of the read operation
    std::cout << "Read operation started. Bytes transferred: " << bytes_transferred << std::endl;

    // Handle the error, if any
    if (ec)
    {
        std::cerr << "Read error: " << ec.message() << std::endl;
        return fail(ec, "read");
    }

    // Log the received message
    std::string received_msg = beast::buffers_to_string(buffer_.data());
    std::cout << "Received message: " << received_msg << std::endl;

    // Parse the received JSON message
    try
    {
        nlohmann::json json_msg = nlohmann::json::parse(received_msg);
        
        if (json_msg.contains("method"))
        {
            std::string method = json_msg["method"];

            if (method == "get_all_products")
            {
                // Convert the entire unordered_map to a JSON array and send
                nlohmann::json products_json = nlohmann::json::array();
                for (const auto& pair : product_data) {
                    products_json.push_back(nlohmann::json::parse(pair.second));
                }
                state_->send(products_json.dump());
                std::cout << "Sent response with all products." << std::endl;
            }
            else if (method == "get_product")
            {
                if (json_msg.contains("product_id"))
                {
                    std::string product_id = json_msg["product_id"];

                    if (product_data.find(product_id) != product_data.end())
                    {
                        state_->send(product_data[product_id]);
                        std::cout << "Sent response for get_product method with product ID " << product_id << std::endl;
                    }
                    else
                    {
                        std::string error_msg = "ERROR: Product not found";
                        state_->send(error_msg);
                        std::cout << "Sent error response for invalid product ID." << std::endl;
                    }
                }
                else
                {
                    std::string error_msg = "ERROR: Missing 'product_id' parameter";
                    state_->send(error_msg);
                    std::cout << "Sent error response for missing 'product_id' parameter." << std::endl;
                }
            }
            else
            {
                std::string error_msg = "ERROR: Invalid method";
                state_->send(error_msg);
                std::cout << "Sent error response for invalid method." << std::endl;
            }
        }
        else
        {
            std::string error_msg = "ERROR: Missing 'method' parameter";
            state_->send(error_msg);
            std::cout << "Sent error response for missing 'method' parameter." << std::endl;
        }
    }
    catch (const nlohmann::json::exception& ex)
    {
        std::cerr << "JSON parsing error: " << ex.what() << std::endl;
        std::string error_msg = "ERROR: Invalid JSON format";
        state_->send(error_msg);
        std::cout << "Sent error response for invalid JSON format." << std::endl;
    }

    // Clear the buffer and prepare for the next read operation
    buffer_.consume(buffer_.size());
    ws_.async_read(
        buffer_,
        beast::bind_front_handler(
            &websocket_session::on_read,
            shared_from_this()));

    // Log the end of the read operation
    std::cout << "Read operation completed." << std::endl;
}




void
websocket_session::
send(boost::shared_ptr<std::string const> const& ss)
{
    // Post our work to the strand, this ensures
    // that the members of `this` will not be
    // accessed concurrently.

    net::post(
        ws_.get_executor(),
        beast::bind_front_handler(
            &websocket_session::on_send,
            shared_from_this(),
            ss));
}

void
websocket_session::
on_send(boost::shared_ptr<std::string const> const& ss)
{
    // Always add to queue
    queue_.push_back(ss);

    // Are we already writing?
    if(queue_.size() > 1)
        return;

    // We are not currently writing, so send this immediately
    ws_.async_write(
        net::buffer(*queue_.front()),
        beast::bind_front_handler(
            &websocket_session::on_write,
            shared_from_this()));
}

void
websocket_session::
on_write(beast::error_code ec, std::size_t)
{
    // Handle the error, if any
    if(ec)
        return fail(ec, "write");

    // Remove the string from the queue
    queue_.erase(queue_.begin());

    // Send the next message if any
    if(! queue_.empty())
        ws_.async_write(
            net::buffer(*queue_.front()),
            beast::bind_front_handler(
                &websocket_session::on_write,
                shared_from_this()));
}