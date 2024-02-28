#include "main.hpp"
#include <websocketpp/config/asio_client.hpp>
#include <websocketpp/client.hpp>
#include <boost/asio/ssl.hpp>
#include <iostream>

typedef websocketpp::client<websocketpp::config::asio_tls_client> client;
typedef client::message_ptr message_ptr;

void on_message(client* c, websocketpp::connection_hdl hdl, message_ptr msg) {
    getLogger().info("Recieved websocket response: %s", msg->get_payload().c_str());
}

void on_open(client* c, websocketpp::connection_hdl hdl) {
    std::string msg = "Hello, WebSocket!";
    c->send(hdl, msg, websocketpp::frame::opcode::text);
}

static ModInfo modInfo; // Stores the ID and version of our mod, and is sent to the modloader upon startup

// Loads the config from disk using our modInfo, then returns it for use
// other config tools such as config-utils don't use this config, so it can be removed if those are in use
Configuration& getConfig() {
    static Configuration config(modInfo);
    return config;
}

// Returns a logger, useful for printing debug messages
Logger& getLogger() {
    static Logger* logger = new Logger(modInfo);
    return *logger;
}

// Called at the early stages of game loading
extern "C" void setup(ModInfo& info) {
    info.id = MOD_ID;
    info.version = VERSION;
    modInfo = info;
	
    getConfig().Load();
    getLogger().info("Completed setup!");
}

void listen(char* data, int length)
{
    getLogger().info("testing:%s\n",data);
}

typedef std::shared_ptr<boost::asio::ssl::context> context_ptr;

static context_ptr on_tls_init() {
    // establishes a SSL connection
    context_ptr ctx = std::make_shared<boost::asio::ssl::context>(boost::asio::ssl::context::sslv23);

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

// Called later on in the game loading - a good time to install function hooks
extern "C" void load() {
    il2cpp_functions::Init();

    getLogger().info("Installing hooks...");
    // Install our hooks (none defined yet)
    getLogger().info("Installed all hooks!");

    client c;
    std::string uri = "wss://echo.websocket.org/";

    // Configure logging and error handling
    c.clear_access_channels(websocketpp::log::alevel::none);
    c.set_error_channels(websocketpp::log::elevel::none);

    try {
        getLogger().info("Initing Asio");
        c.init_asio();
        c.set_tls_init_handler(bind(&on_tls_init));
        getLogger().info("Inited Asio");
        c.set_fail_handler([] (websocketpp::connection_hdl hdl) {
            getLogger().info("Failed... %s", hdl.expired() ? "true" : "false");
        });
        c.set_message_handler(bind(&on_message, &c, std::placeholders::_1, std::placeholders::_2));
        c.set_open_handler(bind(&on_open, &c, std::placeholders::_1));
        getLogger().info("Binded handlers... Connecting now.");
        websocketpp::lib::error_code ec;
        client::connection_ptr con = c.get_connection(uri, ec);
        if (ec) {
            getLogger().error("Could not connect: %s", ec.message().c_str());
            throw nullptr;
        }

        getLogger().info("Connecting...");

        c.connect(con);
        getLogger().info("Running!");
        c.run();
    } catch (...) {
        getLogger().error("Failed to connect...");
    }
}