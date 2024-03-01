#pragma once

#define NO_TLS

#include <boost/asio/ssl.hpp>
#include <websocketpp/client.hpp>

#ifdef NO_TLS
#include <websocketpp/config/asio_no_tls_client.hpp>
#else
#include <websocketpp/config/asio_client.hpp>
#endif

namespace SocialSaber::Networking {

static bool isRunning = false;

#ifdef NO_TLS
typedef websocketpp::client<websocketpp::config::asio_client> client;
#else
typedef websocketpp::client<websocketpp::config::asio_tls_client> client;

static context_ptr on_tls_init() {
	// establishes a SSL connection
	context_ptr ctx = std::make_shared<boost::asio::ssl::context>(
		boost::asio::ssl::context::sslv23);

	try {
		ctx->set_options(boost::asio::ssl::context::default_workarounds |
						 boost::asio::ssl::context::no_sslv2 |
						 boost::asio::ssl::context::no_sslv3 |
						 boost::asio::ssl::context::single_dh_use);
	} catch (std::exception &e) {
		std::cout << "Error in context pointer: " << e.what() << std::endl;
	}
	return ctx;
}

#endif
typedef client::message_ptr message_ptr;
typedef std::shared_ptr<boost::asio::ssl::context> context_ptr;

class WebsocketManager {
   public:
	WebsocketManager();

	void send(const std::string &msg);
   private:
	client ws;
	client::connection_ptr con;
	void on_ws_message(websocketpp::connection_hdl hdl, message_ptr msg);
	void on_ws_fail(websocketpp::connection_hdl hdl);
	void on_ws_open(websocketpp::connection_hdl hdl);
};

static WebsocketManager instance;
}  // namespace SocialSaber::Networking