#include "Networking/WebsocketHelper.hpp"
#include "Logging.hpp"
#include "json.hpp"

using namespace SocialSaber::Networking;
using json = nlohmann::json;

WebsocketManager::WebsocketManager() {
	// Debugging purposes TODO: CHANGE THIS!!!
	std::string uri = "ws://192.168.1.94:7070";

	// Configure logging and error handling
	ws.clear_access_channels(websocketpp::log::alevel::none);
	ws.set_error_channels(websocketpp::log::elevel::none);

	INFO("Initialized websocket channels.")

	try {
		ws.init_asio();
		INFO("Initialized Asio.")
		#ifndef NO_TLS
				ws.set_tls_init_handler(bind(&on_tls_init));
		#endif
		INFO("Set TLS Init Handler.")
		ws.set_fail_handler(
			bind(&WebsocketManager::on_ws_fail, this, std::placeholders::_1));
		INFO("Set Fail Handler.")
		ws.set_message_handler(bind(&WebsocketManager::on_ws_message, this,
									std::placeholders::_1,
									std::placeholders::_2));
		INFO("Set Message Handler.")
		ws.set_open_handler(
			bind(&WebsocketManager::on_ws_open, this, std::placeholders::_1));
		ws.set_close_handler(bind(&WebsocketManager::on_ws_fail, this,
								  std::placeholders::_1));
		INFO("Set Open Handler.")
		websocketpp::lib::error_code ec;

		INFO("Opening connection...")
		con = ws.get_connection(uri, ec);
		if (ec) {
			throw nullptr;
		}

		ws.connect(con);
		ws.run();
		INFO("Websocket is running!")
	} catch (std::exception error) {
		INFO("Failed to connect to websocket server: {}", error.what())
	}
}

void WebsocketManager::on_ws_open(websocketpp::connection_hdl hdl) {
	INFO("Websocket Opened!");
}

void WebsocketManager::on_ws_message(websocketpp::connection_hdl hdl,
									 message_ptr msg) {
	std::string payload = msg->get_payload();
	INFO("Recieved message: {}", payload);

	// Safely parse the JSON payload - it may not be valid!
	json j;
	try {
		j = json::parse(payload);
	} catch (json::parse_error &error) {
		INFO("Failed to parse JSON: {}", error.what())
		return;
	}

	if(!j.contains("id")) {
		INFO("Payload does not contain an ID!")
		return;
	}

	std::string id = j["id"];

	if(id == "connection-acknowledge") {
		ws.send(hdl, msg->get_payload(), msg->get_opcode());
		INFO("Replied with connection acknowledge.");
		isRunning = true;
	}
}

void WebsocketManager::on_ws_fail(websocketpp::connection_hdl hdl) {
	INFO("A failure occured: {}", hdl.expired() ? "Expired" : con->get_ec().message());
	isRunning = false;
}

void WebsocketManager::send(const std::string &msg) {
	ws.send(con, msg, websocketpp::frame::opcode::text);
}


