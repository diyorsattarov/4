#ifndef BOOST_BEAST_EXAMPLE_WEBSOCKET_CHAT_MULTI_WEBSOCKET_SESSION_HPP
#define BOOST_BEAST_EXAMPLE_WEBSOCKET_CHAT_MULTI_WEBSOCKET_SESSION_HPP
#include "json.hpp"
#include "net.hpp"
#include "beast.hpp"
#include "shared_state.hpp"
#include <unordered_map>
#include <cstdlib>
#include <memory>
#include <string>
#include <vector>
#include <random>
#include <chrono>

struct UserInfo {
    std::string password;
    std::string cookie; // or session token
    std::chrono::time_point<std::chrono::system_clock> token_expiry;
};

// Forward declaration
class shared_state;

/** Represents an active WebSocket connection to the server
*/
class websocket_session : public boost::enable_shared_from_this<websocket_session>
{
    beast::flat_buffer buffer_;
    websocket::stream<beast::tcp_stream> ws_;
    boost::shared_ptr<shared_state> state_;
    std::vector<boost::shared_ptr<std::string const>> queue_;

    void fail(beast::error_code ec, char const* what);
    void on_accept(beast::error_code ec);
    void on_read(beast::error_code ec, std::size_t bytes_transferred);
    void on_write(beast::error_code ec, std::size_t bytes_transferred);
    void initialize_product_data();
    void initialize_user_data();
public:
    websocket_session(
        tcp::socket&& socket,
        boost::shared_ptr<shared_state> const& state);

    ~websocket_session();

    template<class Body, class Allocator>
    void
    run(http::request<Body, http::basic_fields<Allocator>> req);

    // Send a message
    void
    send(boost::shared_ptr<std::string const> const& ss);

private:
    std::unordered_map<std::string, std::string> product_data;
    std::unordered_map<std::string, UserInfo> user_data;
    std::unordered_map<std::string, UserInfo> user_sessions;
    std::size_t totalProducts;
    void
    on_send(boost::shared_ptr<std::string const> const& ss);
    void
    handle_get_product(const nlohmann::json& json_msg);
    void
    handle_get_all_products(const nlohmann::json& json_msg);
    void 
    handle_login(const nlohmann::json& json_msg);
    void
    handle_validate_cookie(const nlohmann::json& json_msg);
};

template<class Body, class Allocator>
void
websocket_session::
run(http::request<Body, http::basic_fields<Allocator>> req)
{
    // Set suggested timeout settings for the websocket
    ws_.set_option(
        websocket::stream_base::timeout::suggested(
            beast::role_type::server));

    // Set a decorator to change the Server of the handshake
    ws_.set_option(websocket::stream_base::decorator(
        [](websocket::response_type& res)
        {
            res.set(http::field::server,
                std::string(BOOST_BEAST_VERSION_STRING) +
                    " websocket-chat-multi");
        }));

    // Accept the websocket handshake
    ws_.async_accept(
        req,
        beast::bind_front_handler(
            &websocket_session::on_accept,
            shared_from_this()));
}

#endif