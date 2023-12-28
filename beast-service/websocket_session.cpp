#include "websocket_session.hpp"
#include "json.hpp"
#include <iostream>
#include <unordered_map>

websocket_session::
websocket_session(
    tcp::socket&& socket,
    boost::shared_ptr<shared_state> const& state)
    : ws_(std::move(socket))
    , state_(state)
{
}

websocket_session::
~websocket_session()
{
    // Remove this session from the list of active sessions
    state_->leave(this);
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

        // Check if the JSON message contains a "method" key
        if (json_msg.contains("method"))
        {
            std::string method = json_msg["method"];

            if (method == "create_product")
            {
                // Handle create_product method (add a product to the unordered_map)
                // Implement this logic later
                std::string response_msg = "Create Product method is not implemented yet.";
                state_->send(response_msg);
                std::cout << "Sent response for create_product method." << std::endl;
            }
            else if (method == "get_product")
            {
                // Handle get_product method (get a product using associated ID)
                if (json_msg.contains("product_id"))
                {
                    std::string product_id = json_msg["product_id"];
                    
                    // Define product data
                    std::unordered_map<std::string, std::string> product_data = {
                        {"1", "{\"product_id\": 1, \"name\": \"Product One\", \"description\": \"Description of Product One\"}"},
                        {"2", "{\"product_id\": 2, \"name\": \"Product Two\", \"description\": \"Description of Product Two\"}"}
                    };

                    // Check if the product ID exists in the map
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